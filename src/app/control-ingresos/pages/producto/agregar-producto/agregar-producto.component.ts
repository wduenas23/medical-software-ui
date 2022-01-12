import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CatProductos, ProductFactoryPojo, Producto } from 'src/app/control-ingresos/interfaces/medicalService.interface';
import { switchMap } from "rxjs/operators";
import { MedsoftService } from 'src/app/control-ingresos/service/medsoft.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styles: [

  `
  #uploadFile {
    top: 0px;
    left: 0px;
    width: 100%;    
    z-index: 9;
    opacity: 0;
    height: 100%;
    cursor: pointer;
    position: absolute;
}

.mat-toolbar-single-row button {
    width: 200px;
}
.mat-form-field {
    width: 100%;
}


  `

  ]
})
export class AgregarProductoComponent implements OnInit {


  categoriaProducto: FormControl = this.formBuilder.control('', Validators.required);
  drogueria: FormControl = this.formBuilder.control('', Validators.required);
  fechaExpiracion: FormControl = this.formBuilder.control('', Validators.required);

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
    valid: true,
    drogueriaId: 0,
    drogueriaName:'',
    expiDate: new Date(),
    imageUrl: '',
    file: {} as File
  }
  nombreRepetido: boolean= false;
  codigoRepetido: boolean= false;

  catProductos: CatProductos[]=[];
  filteredOptions!: CatProductos[];
  categoriaProductoNuevo!: CatProductos;
  categoriaProductoNuevoSeleccionado!: CatProductos;

  droguerias: ProductFactoryPojo[]=[];
  filteredOptionsDroguerias!: ProductFactoryPojo[];
  drogueriaNuevo!: ProductFactoryPojo;
  drogueriaNuevoSeleccionado!: ProductFactoryPojo;

  fileAttr = 'Seleccione Imagen del producto';
  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedFile!: ImageSnippet;

  
  buscandoCategoria() {
    this.filteredOptions = this._filterCategoria(this.categoriaProducto.value);
  }

  buscandoDrogueria() {
    this.filteredOptionsDroguerias = this._filterDrogueria(this.drogueria.value);
  }



  private _filterCategoria(value: string): CatProductos[] {
    const filterValue = value.toLowerCase();
    return this.catProductos.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private _filterDrogueria(value: string): ProductFactoryPojo[] {
    const filterValue = value.toLowerCase();
    return this.droguerias.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  
  opcionSeleccionadaCategoria(event: MatAutocompleteSelectedEvent) {
    this.categoriaProductoNuevoSeleccionado = event.option.value;
    this.categoriaProducto.setValue(this.categoriaProductoNuevoSeleccionado.name);
    this.producto.categoryId=this.categoriaProductoNuevoSeleccionado.id;
  }

  opcionSeleccionadaDrogueria(event: MatAutocompleteSelectedEvent) {
    this.drogueriaNuevoSeleccionado = event.option.value;
    this.drogueria.setValue(this.drogueriaNuevoSeleccionado.name);
    this.producto.drogueriaId=this.drogueriaNuevoSeleccionado.id;
  }

  cargarCategoriaProducto(catProducto: CatProductos[],idProductCategory: number){
    catProducto.forEach(element => {
      if(element.id === idProductCategory){
        this.categoriaProducto.setValue(element.name);
      }
    });
  }

  cargarDrogueria(droguerias: ProductFactoryPojo[],idDrogueria: number){
    droguerias.forEach(element => {
      if(element.id === idDrogueria){
        this.drogueria.setValue(element.name);
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
      console.log('Producto a guardar o editar: ',this.producto);
    }else{
      this.mostrarSnackBar('Favor ingresar correctamente valores de costo inventario y precio de venta')
    }
    
  }

  mostrarSnackBar(mensaje: string){

    this.snackBar.open(mensaje,'ok!', {
      duration: 3500
    });
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.producto.file=this.selectedFile.file;
      this.producto.imageUrl=event.target.result;
      console.log('Estructura del archivo',this.selectedFile)
      /*this.imageService.uploadImage(this.selectedFile.file).subscribe(
        (res: any) => {
          console.log(res);
          this.onSuccess();
        },
        (err: any) => {
          console.log(err);
          this.onError();
        })*/
    });

    reader.readAsDataURL(file);
  }

  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, 
    private medSoftService: MedsoftService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private datepipe: DatePipe,) { }

  ngOnInit(): void {

    this.medSoftService.obtenerCategoriaProductos().subscribe(catProductos => this.catProductos=catProductos);
    this.medSoftService.obtenerDroguerias().subscribe(droguerias => {
      console.log(droguerias);
      this.droguerias=droguerias;
    } );
    
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

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';
  constructor(public src: string, public file: File) {}
}