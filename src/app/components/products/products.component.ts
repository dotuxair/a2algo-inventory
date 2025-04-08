import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  standalone: true,
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [FormsModule, ReactiveFormsModule],
})
export class ProductsComponent {
 

  products: Product[] = [];
  productForm!: FormGroup;
  isEditing: boolean = false;
  currentProductId: number | null = null;
  showForm: boolean = false;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.initializeForm();
  }

  initializeForm(): void {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
    });
  }

  getAllProducts(): void {
    this.productService.getAllProducts().subscribe(
      (response: any) => {
        this.products = response.data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  onAddProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    const newProduct: Product = this.productForm.value;
    this.productService.createProduct(newProduct).subscribe(
      () => {
        this.getAllProducts();
        this.productForm.reset();
      },
      (error) => {
        console.error('Error adding product:', error);
      }
    );
  }

  onEditProduct(productId: number): void {
    const productToEdit = this.products.find((p) => p.id === productId);
    if (productToEdit) {
      this.productForm.patchValue(productToEdit);
      this.isEditing = true;
      this.currentProductId = productId;
      this.showForm = true;
    }
  }

  onUpdateProduct(): void {
    if (this.productForm.invalid || this.currentProductId === null) {
      return;
    }

    const updatedProduct: Product = this.productForm.value;
    this.productService
      .updateProduct(this.currentProductId, updatedProduct)
      .subscribe(
        () => {
          this.getAllProducts();
          this.productForm.reset();
          this.isEditing = false;
          this.currentProductId = null;
        },
        (error) => {
          console.error('Error updating product:', error);
        }
      );
  }

  onCancelEdit(): void {
    this.isEditing = false;
    this.currentProductId = null;
    this.productForm.reset();
    this.showForm = false;
  }

  onDeleteProduct(productId: number) {
    this.productService.deleteProduct(productId).subscribe(
      () => {
        this.getAllProducts();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onProductAddClick() {
    if (this.isEditing) {
      this.onCancelEdit();
    } else {
      this.showForm = !this.showForm;
      if (this.showForm) {
        this.productForm.reset();
      }
    }
  }
  
}
