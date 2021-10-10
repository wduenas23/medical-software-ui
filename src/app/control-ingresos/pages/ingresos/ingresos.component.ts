import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

interface FormOfPayments {
  value: string;
  viewValue: string;
}

interface Totales{
  title: string;
  value: number;
}

interface Servicios {
  id: string;
  description: string;
  cost: number;
}

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
    servicio :      [, [Validators.required] ],
    tipoPago :      [{value: '01', viewValue: 'Efectivo'}, [Validators.required] ],
    descuento:      [0, [Validators.min(0)]],
    fechaServicio:  [ new Date(), [Validators.required] ],
    
  })

  nuevoServicio: FormControl = this.formBuilder.control('',Validators.required);

  servicios: Servicios[] = [
    {id: '01', description: 'Consulta',cost: 35},
    {id: '02', description: 'Limpieza facial',cost: 50},
    {id: '03', description: 'Rinomodelación con Hilos',cost: 800}
  ];

  tiposPago: FormOfPayments[]= [
    {value: '01', viewValue: 'Efectivo'},
    {value: '02', viewValue: 'Tarjeta'},
    {value: '03', viewValue: 'Transferencia'},
  ]
  

  //Para la tabla de servicios
  displayedColumns = ['Detalle', 'Costo','Action'];
  summaryList: Servicios[] = [];

  
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
    this.summaryList.push(this.nuevoServicio.value);
    this.summaryList=this.summaryList.slice();
    this.aplicarDescuento();
    this.aplicarComision(this.formularioIngresos.controls.tipoPago.value)
  }

  removeServicio(servicio: Servicios){
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


  aplicarComision(value: FormOfPayments ){
    const tipoPago=value?value.viewValue:'';
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
    console.log('Formulario de ingresos',this.formularioIngresos.value);
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
  }

  constructor(private formBuilder: FormBuilder,private datepipe:DatePipe) { }
  
  
  ngOnInit(): void {
    this.onChangeTipoPago();
  }

}
