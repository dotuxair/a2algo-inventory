import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PurchaseService } from '../../services/purchase.service';
import {
  AddPurchaseRequest,
  Purchase,
  PurchaseProductRequest,
} from '../../models/purchase.models';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
})
export class PurchaseComponent implements OnInit {

  purchaseForm!: FormGroup;
  purchases: Purchase[] = [];
  products: Product[] = [];
  purchaseItems: PurchaseProductRequest[] = [];
  selectedProductId: number = 0;
  currentQuantity: number = 0;
  currentPricePerItem: number = 0;

  addPurchase: boolean = false;
  viewDetail: boolean = false;

  constructor(
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getAllPurchases();
    this.getAllProducts();
  }

  initializeForm(): void {
    this.purchaseForm = this.fb.group({
      supplierName: ['', [Validators.required]],
      purchaseProducts: [[]],
    });
  }

  getAllProducts(): void {
    this.productService.getProductsForSalePurchase().subscribe(
      (response: any) => {
        this.products = response.data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  addProductToList(): void {
    if (
      this.selectedProductId &&
      this.currentQuantity &&
      this.currentQuantity > 0 &&
      this.currentPricePerItem !== null &&
      this.currentPricePerItem >= 0
    ) {
      const existingItemIndex = this.purchaseItems.findIndex(
        (item) => item.productId === this.selectedProductId
      );

      var productName = this.products.find(
        (item) => item.id == this.selectedProductId
      )?.name;

      console.log(productName);
      if (existingItemIndex > -1) {
        this.purchaseItems[existingItemIndex].quantity! += this.currentQuantity;
      } else {
        const newItem: PurchaseProductRequest = {
          productId: this.selectedProductId,
          quantity: this.currentQuantity,
          price: this.currentPricePerItem,
          name: productName,
        };
        this.purchaseItems.push(newItem);
      }

      this.selectedProductId = 0;
      this.currentQuantity = 0;
      this.currentPricePerItem = 0;
    }
  }

  removeProductFromList(productId: number): void {
    this.purchaseItems = this.purchaseItems.filter(
      (item) => item.productId !== productId
    );
  }

  calculateTotalAmount(): number {
    return this.purchaseItems.reduce(
      (total, item) => total + item.quantity! * item.productId!,
      0
    );
  }

  onCreatePurchase(): void {
    if (this.purchaseForm.valid && this.purchaseItems.length > 0) {
      const purchaseRequest: AddPurchaseRequest = {
        supplierName: this.purchaseForm.value.supplierName,
        purchaseProducts: this.purchaseItems,
      };

      this.purchaseService.addPurchase(purchaseRequest).subscribe(
        () => {
          console.log('Purchase added successfully');
          this.getAllPurchases();
          this.purchaseForm.reset();
          this.purchaseItems = [];
          this.addPurchase = false;
        },
        (error) => {
          console.error('Error adding purchase:', error);
        }
      );
    } else {
      console.error('Form is invalid or no products selected.');
    }
  }

  getAllPurchases(): void {
    this.purchaseService.viewPurchases().subscribe(
      (response: any) => {
        this.purchases = response.data;
      },
      (error) => {
        console.error('Error fetching purchases:', error);
      }
    );
  }

  openAddPurchaseControl() {
    this.addPurchase = !this.addPurchase;
  }

  productDetailByPurchaseId: Product[] = [];
  purchaseDetailsById: PurchaseDetailDto | undefined;

  viewPurchaseProducts(purchaseId: number) {
    this.viewDetail = true;

    var purchaseDetail = this.purchases.find((item) => item.id == purchaseId);

    if (!this.purchaseDetailsById) {
      this.purchaseDetailsById = {
        supplierName: '',
        amount: 0,
        date: new Date(),
      };
    }

    if (purchaseDetail) {
      this.purchaseDetailsById.amount = purchaseDetail.totalAmount;
      this.purchaseDetailsById.date = purchaseDetail.purchaseDate;
      this.purchaseDetailsById.supplierName = purchaseDetail.supplierName;
    }

    this.purchaseService.getProductsByPurchaseId(purchaseId).subscribe(
      (response: any) => {
        this.productDetailByPurchaseId = response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onHideDetail() {
    this.viewDetail = false;
    this.getAllPurchases();
    }
}

interface PurchaseDetailDto {
  supplierName: string;
  amount: number;
  date: Date;
}
