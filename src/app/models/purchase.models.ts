export interface AddPurchaseRequest {
    supplierName: string;
    purchaseProducts: PurchaseProductRequest[];
  }
  
  export interface PurchaseProductRequest {
    productId: number;
    quantity: number;
    price: number;
    name?:string;
  }
  
  export interface Purchase {
    id: number;
    supplierName: string;
    purchaseDate: Date;
    totalAmount: number;
  }
  