import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';

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

  
  comisiones: number=0;
  descuentos: number=0;

  formularioIngresos: FormGroup = this.formBuilder.group({
    nombres      : [, [Validators.required, Validators.minLength(3)] ],
    apellidos      : [, [Validators.required, Validators.minLength(3)] ],
    servicio      : [{value: '01', viewValue: 'Efectivo'}, [Validators.required] ],
    tipoPago : [, [Validators.min(0),Validators.required]],
    descuento: [0, [Validators.min(0)]],
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
  

  displayedColumns = ['Detalle', 'Costo','Action'];
  summaryList: Servicios[] = [];

  displayedColumnsTotals: string[] = ['title', 'value'];
  totales: Totales[]=[
    { title:'Descuentos', value:0},
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
    console.log("Servicio a eliminar de la lista",servicio);
    const index=this.summaryList.indexOf(servicio);
    console.log('index',index);
    this.summaryList.splice(index,1);
    this.summaryList=this.summaryList.slice();
    this.aplicarDescuento();
    this.aplicarComision(this.formularioIngresos.controls.tipoPago.value)

  }


  onChangeTipoPago(){
      this.formularioIngresos.controls.tipoPago.valueChanges
        .subscribe( value => {       
          this.aplicarComision(value);
      });
  }

  aplicarDescuento(){

    if(this.getTotalCost()<=0){
      return;
    }
       
    let descuentoTable=this.totales.find(val => val.title  == "Descuentos");
    descuentoTable!.value=this.calcularDescuento();
    this.totales=this.totales.slice(); 
    this.aplicarComision(this.formularioIngresos.controls.tipoPago.value);
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

    /*const totalServicios=this.getTotalCost();
    const totalComision=this.calcularDescuento();
    const comision=(totalServicios+totalComision)*0.07*-1;*/
    const comision=(this.getTotalCost()+this.calcularDescuento()) *0.07*-1;
    console.log(comision);
    return Math.round((comision+Number.EPSILON)*100)/100;
    

  }

  calcularDescuento(){
    const porcentajeDescuento=this.formularioIngresos.controls.descuento.value;
    return (this.getTotalCost()*(porcentajeDescuento/100))*-1;
  }

  calcularTotalFinal(){
   /* const descuentos=this.calcularDescuento();
    const comisiones=this.calculatComisionPorTarjeta();
    const totalFinal=this.getTotalCost()+comisiones+descuentos;*/
    let totalFinal=this.totales.find(val => val.title  == "Total");
    const comisiones=this.totales.find(val => val.title  == "Comisiones");
    const descuentos=this.totales.find(val => val.title  == "Descuentos");
    totalFinal!.value=this.getTotalCost()+comisiones!.value+descuentos!.value;
    this.totales=this.totales.slice(); 
  }

  getTotalCost() {
   return this.summaryList.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

  guardar(){
    if(this.formularioIngresos.invalid){
      this.formularioIngresos.markAllAsTouched();
      return;
    }
    console.log('Formulario de ingresos',this.formularioIngresos.value);
  }

  constructor(private formBuilder: FormBuilder) { }
  
  
  ngOnInit(): void {
    this.onChangeTipoPago();
  }

}
