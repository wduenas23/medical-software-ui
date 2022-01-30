import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthorizationDetail } from 'src/app/auth/model/auth.model';
import { AuthService } from 'src/app/auth/pages/login/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
    `
    .container {
      margin: 25px;
      padding: 10px 10px 10px 10px;
    }

    `
  ]
})
export class HomeComponent implements OnInit {


  autorizaciones: AuthorizationDetail[]=[];

  constructor(private authService:AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    

    if(localStorage.getItem('menuOptions')){
      console.log('Se metio al guardado de local storage');
      this.autorizaciones=JSON.parse(localStorage.getItem('menuOptions') || '[]') ;
    //  this.router.navigate(['control-ingresos/ingresos']);
    }else{
      console.log('no esta en el guardado local');
      if(!this.router.url.includes('roleId')){
        this.router.navigate(['']);
      }else{
        this.activatedRoute.queryParams
        .pipe(
          switchMap( ({roleId}) =>  this.authService.autorizacionesPorRole(roleId) )
        )
        .subscribe (resp => {
          console.log(resp);
          this.autorizaciones=resp;
          localStorage.setItem('menuOptions', JSON.stringify(this.autorizaciones));
          //this.router.navigate(['control-ingresos/ingresos']);
        });
      }
      
    }

    

   
  }

  logout(){
    this.autorizaciones=[];
    localStorage.removeItem('menuOptions');
    this.router.navigate(['']);
  }

}
