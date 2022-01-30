import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductFactoryPojo, Producto } from 'src/app/control-ingresos/interfaces/medicalService.interface';
import { switchMap } from "rxjs/operators";
import { MedsoftService } from 'src/app/control-ingresos/service/medsoft.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';



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


  formularioProducto: FormGroup = this.formBuilder.group({
    drogueria: ['',[Validators.required]],
    codigoProducto: [,[Validators.required]],
    nombre: [,[Validators.required]],
    descripcion: [,[Validators.required]],
    inventario: [[Validators.required]],
    fechaExpiracion: [new Date(), [Validators.required]],
    costo: [ [Validators.min(0)]],
    precioVenta: [,[Validators.min(0)]],
    precioPromocion: [],
    valid: [true,[Validators.required]]
  })

  categoriaProducto: FormControl = this.formBuilder.control('', Validators.required);
  fechaExpiracion: FormControl = this.formBuilder.control('', Validators.required);

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
    promotionPrice: 0,
    valid: true,
    drogueriaId: 0,
    drogueriaName:'',
    expiDate: new Date()    
  }
  nombreRepetido: boolean= false;
  codigoRepetido: boolean= false;

  
  droguerias: ProductFactoryPojo[]=[];
  filteredOptionsDroguerias!: ProductFactoryPojo[];
  drogueriaNuevo!: ProductFactoryPojo;
  drogueriaNuevoSeleccionado!: ProductFactoryPojo;

  fileAttr = 'Seleccione Imagen del producto';
  @ViewChild('fileInput') fileInput!: ElementRef;

  
  buscandoDrogueria() {
    this.filteredOptionsDroguerias = this._filterDrogueria(this.formularioProducto.controls.drogueria.value);
  }



  private _filterDrogueria(value: string): ProductFactoryPojo[] {
    const filterValue = value.toLowerCase();
    return this.droguerias.filter(option => option.name.toLowerCase().includes(filterValue));
  }


  opcionSeleccionadaDrogueria(event: MatAutocompleteSelectedEvent) {
    this.drogueriaNuevoSeleccionado = event.option.value;
    this.formularioProducto.controls.drogueria.setValue(this.drogueriaNuevoSeleccionado.name);
    this.producto.drogueriaId=this.drogueriaNuevoSeleccionado.id;
  }


  cargarDrogueria(droguerias: ProductFactoryPojo[],idDrogueria: number){
    droguerias.forEach(element => {
      if(element.id === idDrogueria){
        this.formularioProducto.controls.drogueria.setValue(element.name);
      }
    });
  }


  validarNombreProducto(){
    this.medSoftService.validarNombreProducto(this.formularioProducto.controls.nombre.value,this.producto.id).subscribe(response => {
      if(response){
        this.nombreRepetido=true;
        this.formularioProducto.controls.nombre.setValue('');
      }else{
        this.nombreRepetido=false;
      }
      
    })

  }

  validarCodigoProducto(){
    let codigoProducto=this.formularioProducto.controls.codigoProducto.value;
    this.medSoftService.validarCodigoProducto(codigoProducto,this.producto.id).subscribe(response => {
      if(response){
        this.codigoRepetido=true;
        this.formularioProducto.controls.codigoProducto.setValue('');
      }else{
        this.codigoRepetido=false;
      }
      
    })

  }

  edit(){
   
    if(this.formularioProducto.valid) {
      this.producto.expiDate= this.formularioProducto.controls.fechaExpiracion.value;
      console.log('Producto a aguardar o editar: ',this.producto);
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

    this.medSoftService.obtenerDroguerias().subscribe(droguerias => {
      console.log(droguerias);
      this.droguerias=droguerias;
    } );

    if(!this.router.url.includes('editar')){
      this.listener();
      return;
    }

    this.activatedRoute.params
    .pipe(
      switchMap( ({id}) => this.medSoftService.obtenerProductoPorId(id) )
    )
    .subscribe (producto => {
      
      this.producto=producto;
        var date = new Date(JSON.stringify(producto.expiDate));
      console.log('formateado: ',date);
      this.producto.expiDate=date;

      this.formularioProducto.controls.nombre.setValue(this.producto.name);
      this.formularioProducto.controls.codigoProducto.setValue(this.producto.prdCode);
      this.formularioProducto.controls.descripcion.setValue(this.producto.description);
      this.formularioProducto.controls.fechaExpiracion.setValue(date);
      this.formularioProducto.controls.inventario.setValue(this.producto.inventory);
      this.formularioProducto.controls.precioVenta.setValue(this.producto.sellingPrice);
      this.formularioProducto.controls.precioPromocion.setValue(this.producto.promotionPrice);
      this.formularioProducto.controls.costo.setValue(this.producto.cost);
      this.formularioProducto.controls.valid.setValue(this.producto.valid);
      let drogueria: ProductFactoryPojo = {
        id: this.producto.drogueriaId,
        name: this.producto.drogueriaName,
        description: ''
      }
      this.formularioProducto.get('drogueria')?.setValue(drogueria);
      this.drogueriaNuevoSeleccionado = drogueria;
      this.formularioProducto.controls.drogueria.setValue(this.drogueriaNuevoSeleccionado.name);
    });

  }

listener(){
  this.formularioProducto.valueChanges.subscribe( form => {
    console.log('Form',form);
    this.producto.name=form.nombre;
    this.producto.cost= form.costo,
    this.producto.description=form.descripcion;
    this.producto.inventory=form.inventario;
    this.producto.prdCode=form.codigoProducto;
    this.producto.sellingPrice=form.precioVenta;
    this.producto.promotionPrice=form.precioPromocion;
    this.producto.valid= form.valid;
    this.producto.drogueriaName=form.drogueria;
    this.producto.expiDate= form.fechaExpiracion;
  });
}

}