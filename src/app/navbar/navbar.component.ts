import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private AuthService:AuthService,private router:Router){}

  isLogin:boolean=false;
  // logout
  logOut(){
         this.AuthService.signOut()
  }

  //check before navigate
  ngOnInit():void{
     this.AuthService.userData.subscribe(
    {
      next:()=>{
        if(this.AuthService.userData.getValue()!=null)
        {
          this.isLogin=true;
        }
        else
        {
          this.isLogin=false;
          this.router.navigate(['/login']);
        }
      }
    })
  }
}
