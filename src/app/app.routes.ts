import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';


export const routes: Routes = [
  {
    path:'',redirectTo:'home',pathMatch:'full'
  },
  {
    path: 'home',
    component:HomeComponent
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

];

