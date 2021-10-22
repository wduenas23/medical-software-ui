import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import { FormOfPayment, Income, MedicalServices, Totales } from '../../interfaces/medicalService.interface';
import { MedsoftService } from '../../service/medsoft.service';




/*interface Servicios {
  id: string;
  description: string;
  cost: number;
}*/



export interface Transaction {
  item: string;
  cost: number;
}

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styles: [
    `
    .summary-card {
      width: 90%;
    }

    table {
      width: 90%;
    }

    `
  ]
})
export class IngresosComponent implements OnInit{

  formularioIngresos: FormGroup = this.formBuilder.group({
    nombres  :      [, [Validators.required, Validators.minLength(3)] ],
    apellidos:      [, [Validators.required, Validators.minLength(3)] ],
    telefono:      [, [Validators.required, Validators.minLength(3), Validators.maxLength(9)] ],
    tipoPago :      [{value: '01', viewValue: 'Efectivo'}, [Validators.required] ],
    descuento:      [0, [Validators.min(0)]],
    fechaServicio:  [ new Date(), [Validators.required] ],
    
  })

  nuevoServicio: FormControl = this.formBuilder.control('',Validators.required);
  nuevoServicioMedico: FormControl = this.formBuilder.control('',Validators.required);

  servicios: MedicalServices[] = [];
  nuevoServicioSeleccionado!: MedicalServices;

  tiposPago: FormOfPayment[]= [] ;

  filteredOptions!: MedicalServices[];
  
  income: Income | null=null;
  //Para la tabla de servicios
  displayedColumns = ['Detalle', 'Costo','Action'];
  summaryList: MedicalServices[] = [];



  
  //Para tabla de Totales
  displayedColumnsTotals: string[] = ['title', 'value'];
  totales: Totales[]=[
    { title:'Descuentos', value:0},
    { title:'Sub Total Cliente', value:0},
    { title:'Comisiones', value:0},
    { title:'Total', value:0},
  ]



  agregarServicio(){
    if(this.nuevoServicio.invalid){
      return;
    }
    console.log('Nuevo Servicio: ',this.nuevoServicioSeleccionado)
    this.summaryList.push(this.nuevoServicioSeleccionado);
    this.summaryList=this.summaryList.slice();
    this.aplicarDescuento();
    this.aplicarComision(this.formularioIngresos.controls.tipoPago.value)
  }

  removeServicio(servicio: MedicalServices){
    const index=this.summaryList.indexOf(servicio);
    this.summaryList.splice(index,1);
    this.summaryList=this.summaryList.slice();
    this.aplicarDescuento();
    this.aplicarComision(this.formularioIngresos.controls.tipoPago.value);
    this.calcularTotalCliente();
    this.calcularTotalFinal();

  }


  onChangeTipoPago(){
      this.formularioIngresos.controls.tipoPago.valueChanges
        .subscribe( value => {       
          this.aplicarComision(value);
      });
  }

  aplicarDescuento(){
    
    let descuentoTable=this.totales.find(val => val.title  == "Descuentos");
    descuentoTable!.value=this.calcularDescuento();
    this.totales=this.totales.slice(); 
    this.aplicarComision(this.formularioIngresos.controls.tipoPago.value);
    this.calcularTotalCliente();
    this.calcularTotalFinal();
  }


  aplicarComision(value: FormOfPayment ){
    const tipoPago=value?value.description:'';
    if(tipoPago==='Tarjeta'){
      let comi=this.totales.find(val => val.title  == "Comisiones");
      comi!.value=this.calculatComisionPorTarjeta();
      this.totales=this.totales.slice(); 
    }else{
      let comi=this.totales.find(val => val.title  == "Comisiones");
      comi!.value=0;
      this.totales=this.totales.slice(); 
    }        
    this.calcularTotalFinal();
  }


  calculatComisionPorTarjeta(){
    const comision=(this.getTotalServicios()+this.calcularDescuento()) *0.07*-1;
    return Math.round((comision+Number.EPSILON)*100)/100;
  }

  calcularDescuento(){
    const porcentajeDescuento=this.formularioIngresos.controls.descuento.value;
    return (this.getTotalServicios()*(porcentajeDescuento/100))*-1;
  }

  calcularTotalCliente(){
    let subTotalCliente=this.totales.find(val => val.title  == "Sub Total Cliente");
    const descuentos=this.totales.find(val => val.title  == "Descuentos");
    subTotalCliente!.value=this.getTotalServicios()+descuentos!.value;
    this.totales=this.totales.slice(); 
  }

  calcularTotalFinal(){
    let totalFinal=this.totales.find(val => val.title  == "Total");
    const comisiones=this.totales.find(val => val.title  == "Comisiones");
    const descuentos=this.totales.find(val => val.title  == "Descuentos");
    totalFinal!.value=this.getTotalServicios()+comisiones!.value+descuentos!.value;
    this.totales=this.totales.slice(); 
  }

  getTotalServicios() {
   return this.summaryList.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

  guardar(){
    if(this.formularioIngresos.invalid){
      this.formularioIngresos.markAllAsTouched();
      return;
    }
    //console.log('Formulario de ingresos',this.formularioIngresos.value);
    console.log("Summary List: ",this.summaryList);
    console.log("Totales: ",this.totales);

    this.income={
      nombres: this.formularioIngresos.controls.nombres.value,
      apellidos:this.formularioIngresos.controls.apellidos.value,
      telefono: this.formularioIngresos.controls.telefono.value,
      services: this.summaryList,
      formOfPayment: this.formularioIngresos.controls.tipoPago.value,
      totals: this.totales,
      txDate: this.formularioIngresos.controls.fechaServicio.value,
      discount: this.formularioIngresos.controls.descuento.value
    }

    console.log("Income: "+this.income);
    this.medService.guardarIngreso(this.income).subscribe(resp => {
      console.log("Respuesta Obtenida: ",resp);
      if(resp.code === "200"){
        this.resetAll();
      }

    });;
    
  }

  resetAll(){
    console.log('Reset form');
    this.formularioIngresos.reset();    
    this.nuevoServicio.reset();
    this.summaryList=[];
    this.aplicarDescuento();
    this.aplicarComision(this.formularioIngresos.controls.tipoPago.value);
    this.calcularTotalCliente();
    this.calcularTotalFinal();
    this.income=null;
    
  }


  buscando(){
    console.log('Buscando: ',this.nuevoServicio.value);
    this.filteredOptions = this._filter(this.nuevoServicio.value);
      
  }

  constructor(private formBuilder: FormBuilder,private datepipe:DatePipe,private medService: MedsoftService) { }
  
  
  ngOnInit(): void {
    this.onChangeTipoPago();
    this.medService.obtenerFormasDePago().subscribe(resp =>this.tiposPago=resp);
    this.medService.obtenerServiciosMedicos().subscribe(resp => this.servicios=resp);
    
  }

  private _filter(value: string): MedicalServices[] {
    const filterValue = value.toLowerCase();
    return this.servicios.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  opcionSeleccionada(event: MatAutocompleteSelectedEvent){
      this.nuevoServicioSeleccionado=event.option.value;
      this.nuevoServicio.setValue(this.nuevoServicioSeleccionado.description);
  }

}


