export interface AddSaleRequest {
    customerName: string;
    products: SaleDetailRequest[];
  }
  
  export interface SaleDetailRequest {
    productId: number;
    quantity: number;
    price: number;
  }
  
  export interface Sale {
    id: number;
    customerName: string;
    saleDate: Date;
    totalAmount: number;
  }
  