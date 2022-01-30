import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from '../../model/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [

    `
      mat-card {
        max-width: 400px;
        margin: 2em auto;
        text-align: center;
      }

      mat-form-field {
        display: block;
      }
    `

  ]
})
export class LoginComponent implements OnInit {


  public loginValid = true;
  public username = '';
  public password = '';
  
  private user!: User;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private loginService: AuthService
  ) {}

  public ngOnInit(): void {
  }



  public onSubmit(): void {
    this.loginValid = true;
    
    this.user= {
      user: this.username,
      password: this.password,
      userName: '',
      roleId:0
    }

    this.loginService.authenticateUser(this.user).subscribe(user=> {
      console.log(user);
      if(user){
        this._router.navigate(['control-ingresos'],{queryParams: {roleId: user.roleId}});  
      }else{
        this.loginValid= false;
      } 
    }, 
    error => {
      this.loginValid= false;
    });
    
 }

}
