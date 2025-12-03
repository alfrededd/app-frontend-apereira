import { Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { SearchProductsComponent } from './components/searchProducts/searchProducts.component';
import { SearchProductsAddComponent } from './components/searchProductsAdd/searchProductsAdd.component';
import { AddFormComponent } from './components/addForm/addForm.component';

export const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
  },
  {
    path: 'searchProduct',
    component: SearchProductsComponent,
  },
  {
    path: 'searchProductAdd',
    component: SearchProductsAddComponent,
  },
  {
    path: 'addProduct',
    component: AddFormComponent,
  },
  {
    path: 'addProduct/:id',
    component: AddFormComponent
  },
  {
    path: '**',
    redirectTo: '',
  },

];
