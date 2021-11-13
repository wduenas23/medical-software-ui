import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CatProductos, Producto } from 'src/app/control-ingresos/interfaces/medicalService.interface';
import { switchMap } from "rxjs/operators";
import { MedsoftService } from 'src/app/control-ingresos/service/medsoft.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styles: [
  ]
})
export class AgregarProductoComponent implements OnInit {


  categoriaProducto: FormControl = this.formBuilder.control('', Validators.required);

  producto: Producto={
    categoryId: 0,
    cost: 0,
    categoryName: '',
    description: '',
    id: 0,
    inventory: 0,
    name: '',
    prdCode: '',
    sellingPrice: 0,
    valid: true
  }

  catProductos: CatProductos[]=[];
  filteredOptions!: CatProductos[];
  categoriaProductoNuevo!: CatProductos;
  categoriaProductoNuevoSeleccionado!: CatProductos;

  buscando() {
    this.filteredOptions = this._filter(this.categoriaProducto.value);
  }

  private _filter(value: string): CatProductos[] {
    const filterValue = value.toLowerCase();
    return this.catProductos.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  
  opcionSeleccionada(event: MatAutocompleteSelectedEvent) {
    this.categoriaProductoNuevoSeleccionado = event.option.value;
    this.categoriaProducto.setValue(this.categoriaProductoNuevoSeleccionado.name);
    this.producto.categoryId=this.categoriaProductoNuevoSeleccionado.id;
  }

  cargarCategoriaProducto(catProducto: CatProductos[],idProductCategory: number){
    catProducto.forEach(element => {
      if(element.id === idProductCategory){
        this.categoriaProducto.setValue(element.name);
      }
    });
  }


  edit(){

  }

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, 
    private medSoftService: MedsoftService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.medSoftService.obtenerCategoriaProductos().subscribe(catProductos => this.catProductos=catProductos);
    
    if(!this.router.url.includes('editar')){
      return;
    }

    this.activatedRoute.params
    .pipe(
      switchMap( ({id}) => this.medSoftService.obtenerProductoPorId(id) )
    )
    .subscribe (producto => {
      this.producto=producto
      this.cargarCategoriaProducto(this.catProductos,producto.categoryId);
    });


  }

}
