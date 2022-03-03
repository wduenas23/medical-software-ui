import { Component, OnInit } from '@angular/core';
import { Parameter } from 'src/app/control-ingresos/interfaces/medicalService.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from "rxjs/operators";
import { MedsoftService } from '../../../service/medsoft.service';

@Component({
  selector: 'app-editar-parametro',
  templateUrl: './editar-parametro.component.html',
  styles: [
  ]
})
export class EditarParametroComponent implements OnInit {


  parametro: Parameter | null = {
    pmContext:  '',
    pmtId:      '',
    pmtValue:   ''

  }

  formularioParametro: FormGroup = this.formBuilder.group({
    nombre: [,[Validators.required]],
    valor: [,[Validators.required]]
  })


  edit(){
    if(this.formularioParametro.valid) {
      this.parametro!.pmtValue=this.formularioParametro.controls.valor.value;
      this.medSoftService.editarParametro(this.parametro).subscribe(resp => {
        console.log(resp);
        this.router.navigate(['control-ingresos/parametros'])   
      },
      error => {
        this.mostrarSnackBar('Error al guardar Parametro');
      })
    }else{
      this.mostrarSnackBar('Favor ingresar correctamente valores requeridos');
    }
  }

  
  mostrarSnackBar(mensaje: string){

    this.snackBar.open(mensaje,'ok!', {
      duration: 3500
    });
  }

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, 
    private medSoftService: MedsoftService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.activatedRoute.params
    .pipe(
      switchMap( ({id}) => this.medSoftService.obtenerParametroPorId(id) )
    )
    .subscribe (parametro => {
      this.parametro=parametro.body
      this.formularioParametro.controls.nombre.setValue( this.parametro?.pmContext);
      this.formularioParametro.controls.valor.setValue( this.parametro?.pmtValue);
      console.log(this.parametro);
    });
  }

}
