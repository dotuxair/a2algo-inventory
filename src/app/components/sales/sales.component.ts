import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AddSaleRequest,
  Sale,
  SaleDetailRequest,
} from '../../models/sale.models';
import { SaleService } from '../../services/sale.service';

@Component({
  standalone: true,
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  imports: [CommonModule, FormsModule],
})
export class SalesComponent implements OnInit {


  addSale: boolean = false;
  products: Product[] = [];
  saleProducts: SaleDetailRequest[] = [];
  sales: Sale[] = [];

  // sale Data e.g customerName , Qty
  customerName: string = '';
  quantity: number = 1;
  selectedProductId: number | null = null;

  constructor(
    private productService: ProductService,
    private saleService: SaleService
  ) {}

  ngOnInit() {
    this.getAllSales();
  }

  getAllProducts() {
    this.productService.getProductsForSalePurchase().subscribe(
      (response: any) => {
        this.products = response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onAddSalesClick() {
    this.getAllProducts();
    this.addSale = !this.addSale;
    if (!this.addSale) {
      this.customerName = '';
      this.quantity = 1;
      this.selectedProductId = null;
      this.saleProducts = [];
    }
  }

  onAddSales() {
    if (!this.selectedProductId) {
      console.log('Please select a product');
      return;
    }
    console.log(this.selectedProductId);

    if (this.quantity <= 0) {
      console.log('Add some quantity');
      return;
    }

    const selectedProduct = this.products.find(
      (p) => p.id == this.selectedProductId
    );

    if (!selectedProduct) {
      console.log('Selected product not found');
      return;
    }

    if (this.quantity > selectedProduct.quantity) {
      console.log('Low Stock');
      return;
    }

    const existingSaleProductIndex = this.saleProducts.findIndex(
      (item) => item.productId === this.selectedProductId
    );

    const subTotal = selectedProduct.price * this.quantity;

    if (existingSaleProductIndex > -1) {
      this.saleProducts[existingSaleProductIndex].quantity += this.quantity;
    } else {
      const newSaleProduct: SaleDetailRequest = {
        productId: this.selectedProductId,
        quantity: this.quantity,
        price: selectedProduct.price,
      };
      this.saleProducts.push(newSaleProduct);
    }

    this.quantity = 1;
    this.selectedProductId = null;
  }

  removeSaleProduct(productId: number) {
    this.saleProducts = this.saleProducts.filter(
      (item) => item.productId !== productId
    );
  }

  onConfirmAddSales() {
    console.log(
      'Confirm Add Sales clicked',
      this.customerName,
      this.saleProducts
    );
    const addSaleRequest: AddSaleRequest = {
      customerName: this.customerName,
      products: this.saleProducts,
    };
    this.saleService.addSale(addSaleRequest).subscribe(
      () => {
        this.addSale = false;
        this.getAllSales();
        this.saleProducts = [];
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getAllSales() {
    this.saleService.viewSales().subscribe(
      (response: any) => {
        this.sales = response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getProductName(productId: number) {
    return this.products.find((item) => item.id == productId)?.name;
  }


  productDetailBySaleId: Product[] = [];
  saleDetailById: SaleDetailDto | undefined;
  viewDetail : boolean = false;

  viewSaleProducts(saleId: number) {
    console.log(saleId);
    this.viewDetail = true;
    var saleDetail = this.sales.find((item) => item.id == saleId);
    if (!this.saleDetailById) {
      this.saleDetailById = {
        customerName: '',
        date: new Date(),
        amount: 0,
      };
    }

    if (saleDetail) {
      this.saleDetailById.customerName = saleDetail.customerName;
      this.saleDetailById.amount = saleDetail.totalAmount;
      this.saleDetailById.date = saleDetail.saleDate;
    }

    this.saleService.getProductsBySaleId(saleId).subscribe(
      (response: any) => {
        this.productDetailBySaleId = response.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onHideDetail() {
    this.viewDetail = false;
    this.getAllSales();
    }


    onGoBack() {
      this.viewDetail = false;
      this.getAllSales();
      }
}

interface SaleDetailDto {
  customerName: string;
  amount: number;
  date: Date;
}
