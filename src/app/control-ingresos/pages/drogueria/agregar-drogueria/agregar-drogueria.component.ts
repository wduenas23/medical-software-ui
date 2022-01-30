import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from "rxjs/operators";
import { MedsoftService } from 'src/app/control-ingresos/service/medsoft.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ProductFactoryPojo } from '../../../interfaces/medicalService.interface';

@Component({
  selector: 'app-agregar-drogueria',
  templateUrl: './agregar-drogueria.component.html',
  styles: [
  ]
})
export class AgregarDrogueriaComponent implements OnInit {



  formularioDrogueria: FormGroup = this.formBuilder.group({
    nombre: [,[Validators.required]],
    descripcion: [,[Validators.required]]
  })

  drogueria: ProductFactoryPojo={
    id: 0,
    name: '',
    description: ''
  }

  edit(){
    if(this.formularioDrogueria.valid) {
      this.drogueria.name=this.formularioDrogueria.controls.nombre.value;
      this.drogueria.description=this.formularioDrogueria.controls.descripcion.value;
      this.medSoftService.editarDrogueria(this.drogueria).subscribe(resp => {
        console.log(resp);
        this.router.navigate(['control-ingresos/droguerias'])   
      },
      error => {
        this.mostrarSnackBar('Error al guardar drogueria');
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

    if(!this.router.url.includes('editar')){
      this.listener();
      return;
    }
    
    this.activatedRoute.params
    .pipe(
      switchMap( ({id}) => this.medSoftService.obtenerDrogueriaPorId(id) )
    )
    .subscribe (drogueria => {
      this.drogueria=drogueria;
      this.formularioDrogueria.controls.nombre.setValue(this.drogueria.name);
      this.formularioDrogueria.controls.descripcion.setValue(this.drogueria.description);
    });
  }

  listener(){
    this.formularioDrogueria.valueChanges.subscribe( form => {
      this.drogueria.name=form.nombre;
      this.drogueria.description=form.descripcion;
    });
  }

}
