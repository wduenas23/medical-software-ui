import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface FormOfPayments {
  value: string;
  viewValue: string;
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
    nombres      : [, [Validators.required, Validators.minLength(3)] ],
    apellidos      : [, [Validators.required, Validators.minLength(3)] ],
    categoria      : [, [Validators.required] ],
    precio      : [ , [Validators.min(0),Validators.required]],
    tipoPago : [, [Validators.min(0),Validators.required]],
    descuento: [, [Validators.min(0),Validators.required]],

  })


  
  categorias: Servicios[] = [
    {id: '01', description: 'Consulta',cost: 35},
    {id: '02', description: 'Limpieza facial',cost: 50},
    {id: '03', description: 'Rinomodelación con Hilos',cost: 800}
  ];

  tiposPago: FormOfPayments[]= [
    {value: '01', viewValue: 'Efectivo'},
    {value: '02', viewValue: 'Tarjeta'},
    {value: '03', viewValue: 'Transferencia'},
  ]
  

  displayedColumns = ['Detalle', 'Costo'];
  summaryList: Servicios[] = [];

  listeningValues(){
    this.formularioIngresos.controls.categoria.valueChanges
      .subscribe( value => {
        this.summaryList=[{ cost:value.cost, description: value.description,id:value.id }];
        this.formularioIngresos.patchValue({
          precio: value.cost
        })
      });

      this.formularioIngresos.controls.tipoPago.valueChanges
      .subscribe( value => {
        const precio=this.formularioIngresos.controls.precio.value;
        const comision=precio*0.7;

        const comisionActual=this.summaryList.find(val => val.description  == "Comision");
        
        const tipoPago=value.viewValue;
        const comisionTarjeta: Servicios={
          cost:comision, 
          description: "Comision",
          id:"06" 
        }
          switch (tipoPago) {
            case "Tarjeta":
              if( this.formularioIngresos.controls.precio.value ){

                console.log('Tipo de pago',value);
                this.summaryList.splice(this.summaryList.indexOf(comisionTarjeta),1);
                this.summaryList.push({ cost:2, description: "Comision",id:"06" });
                this.summaryList=this.summaryList.slice();
              }
              break;
          
            default:
              break;
          }
         
        
        
        
      });
  }

  aplicarDescuento(){


        if(!this.formularioIngresos.controls.precio.value){
          return;
        }
        const porcentajeDescuento=this.formularioIngresos.controls.descuento.value;
        const precio=this.formularioIngresos.controls.precio.value;
        const descuento=(precio*(porcentajeDescuento/100))*-1;
        
       const servicio=this.summaryList.find(val => val.description  == "Descuento");
       if(servicio){
        this.summaryList.splice(this.summaryList.indexOf(servicio),1);
        servicio.cost=descuento;
        this.summaryList.push(servicio);
       }else{
        this.summaryList.push({ cost:descuento, description: "Descuento",id:"05" });
        
       }
       this.summaryList=this.summaryList.slice();
       console.log("este es el valor encontrado",servicio);
       console.log("total descuento",descuento);
        
        
        
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
    this.listeningValues();
  }

}
