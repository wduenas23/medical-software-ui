import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Selectors {
  value: string;
  viewValue: string;
}

interface CategoriaServicios {
  value: string;
  viewValue: string;
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


  
  categorias: CategoriaServicios[] = [
    {value: '01', viewValue: 'Consulta',cost: 35},
    {value: '02', viewValue: 'Limpieza facial',cost: 50},
    {value: '03', viewValue: 'Rinomodelación con Hilos',cost: 800}
  ];

  tiposPago: Selectors[]= [
    {value: '01', viewValue: 'Efectivo'},
    {value: '02', viewValue: 'Tarjeta'},
    {value: '03', viewValue: 'Transferencia'},
  ]
  

  displayedColumns = ['Detalle', 'Costo'];
  transactions: Transaction[] = [];

  updateSummary(){
    this.formularioIngresos.controls.categoria.valueChanges
      .subscribe( value => {
        this.transactions=[{ cost:value.cost, item: value.viewValue }];
        this.formularioIngresos.patchValue({
          precio: value.cost
        })
      });
  }

  aplicarDescuento(){
        const porcentajeDescuento=this.formularioIngresos.controls.descuento.value;
        const precio=this.formularioIngresos.controls.precio.value;
        const descuento=(precio*(porcentajeDescuento/100))*-1;
        const discount: Transaction={
          cost:descuento, 
          item: "Descuento" 
        }
        
        //this.transactions.find(val => val.item  == discount.item).cost=descuento;
        console.log("total descuento",descuento);
        
        this.transactions.push({ cost:descuento, item: "Descuento" });
        this.transactions=this.transactions.slice();
  }

  getTotalCost() {
   return this.transactions.map(t => t.cost).reduce((acc, value) => acc + value, 0);
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
    this.updateSummary();
  }

}
