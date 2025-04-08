import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { SalesComponent } from './components/sales/sales.component';
import { PurchaseComponent } from './components/purchase/purchase.component';

export const routes: Routes = [
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: 'products', component:ProductsComponent, },
    { path: 'sales', component:SalesComponent },
    { path: 'purchases', component:PurchaseComponent },


];
