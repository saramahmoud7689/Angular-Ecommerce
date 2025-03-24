import { Routes } from '@angular/router';
// import { HomeComponent } from './pages/home/home.component'; //sara test
import { CartComponent } from './pages/cart/cart.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';

// export const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'cart', component: CartComponent },
//   { path: 'payment', component: PaymentComponent },
//   { path: '**', redirectTo: '' } // Redirect unknown routes to home
//   //   { path: '**', redirectTo: 'cart' }
// ];


export const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  { 
    path: 'cart', 
    component: CartComponent 
  },
  { 
    path: 'payment', 
    component: PaymentComponent 
  }

];

