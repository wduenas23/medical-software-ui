import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from "rxjs/operators";
import { MedicalServices, ServiceCategory } from 'src/app/control-ingresos/interfaces/medicalService.interface';
import { MedsoftService } from '../../../service/medsoft.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
  ]
})
export class AgregarComponent implements OnInit {


  categoriaServicio: FormControl = this.formBuilder.control('', Validators.required);
  

  servicioMedico: MedicalServices = {
    category: 1,
    cost: 0,
    description: '',
    categoryName: '',
    id:0
  }

  serviceCategory: ServiceCategory[]=[];
  filteredOptions!: ServiceCategory[];
  categoriaServicioNuevo!: ServiceCategory;
  categoriaServicioNuevoSeleccionado!: ServiceCategory;

  buscando() {
    this.filteredOptions = this._filter(this.categoriaServicio.value);
  }

  private _filter(value: string): ServiceCategory[] {
    const filterValue = value.toLowerCase();
    return this.serviceCategory.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  
  opcionSeleccionada(event: MatAutocompleteSelectedEvent) {
    this.categoriaServicioNuevoSeleccionado = event.option.value;
    this.categoriaServicio.setValue(this.categoriaServicioNuevoSeleccionado.name);
    this.servicioMedico.category=this.categoriaServicioNuevoSeleccionado.id;
  }

  cargarCategoriaServicio(catService: ServiceCategory[],idServiceCategory: number){
    catService.forEach(element => {
      if(element.id === idServiceCategory){
        this.categoriaServicio.setValue(element.name);
      }
    });
  }

  edit(){
    this.medSoftService.editarServicioMedico(this.servicioMedico).subscribe(response => {
      if(response.ok){
        console.log(response);
        console.log(response.body);
        if(this.servicioMedico.id === 0){
          this.mostrarSnackBar('Registro Creado Satisfactoriamente');
        }else{
          this.mostrarSnackBar('Registro Actualizado Satisfactoriamente');
        }
        if(response.body!==null){
          this.servicioMedico = response.body;
        }        
      }
      
    });
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
    
    this.medSoftService.obtenerCategoriasServiciosMedicos().subscribe(catServicios => this.serviceCategory=catServicios);
    
    if(!this.router.url.includes('editar')){
      return;
    }

    this.activatedRoute.params
    .pipe(
      switchMap( ({id}) => this.medSoftService.obtenerServicioPorId(id) )
    )
    .subscribe (servMedico => {
      this.servicioMedico=servMedico
      this.cargarCategoriaServicio(this.serviceCategory,servMedico.category);
    });

    

    
  }

}
