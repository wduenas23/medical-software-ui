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
    cost: 1,
    categoryName: '',
    description: '',
    id: 0,
    inventory: 1,
    name: '',
    prdCode: '',
    sellingPrice: 1,
    valid: true
  }
  nombreRepetido: boolean= false;
  codigoRepetido: boolean= false;

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

  validarNombreProducto(){
    this.medSoftService.validarNombreProducto(this.producto.name).subscribe(response => {
      if(response){
        this.nombreRepetido=true;
        this.producto.name='';
      }else{
        this.nombreRepetido=false;
      }
      
    })

  }

  validarCodigoProducto(){
    this.medSoftService.validarCodigoProducto(this.producto.prdCode).subscribe(response => {
      if(response){
        this.codigoRepetido=true;
        this.producto.prdCode='';
      }else{
        this.codigoRepetido=false;
      }
      
    })

  }

  edit(){
    if(this.producto.inventory>0 && this.producto.cost>0 && this.producto.sellingPrice >0) {
      this.medSoftService.editarProducto(this.producto).subscribe(response => {
        if(response.ok){
          console.log(response);
          console.log(response.body);
          if(this.producto.id === 0){
            this.mostrarSnackBar('Registro Creado Satisfactoriamente');
          }else{
            this.mostrarSnackBar('Registro Actualizado Satisfactoriamente');
          }
          if(response.body!==null){
            this.producto = response.body;
          }     
          this.router.navigate(['control-ingresos/productos'])   
        }
        
      });
    }else{
      this.mostrarSnackBar('Favor ingresar correctamente valores de costo inventario y precio de venta')
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
