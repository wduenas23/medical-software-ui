import { Component, OnInit } from '@angular/core';

interface Selectors {
  value: string;
  viewValue: string;
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
      width: 100%;
    }

    table {
      width: 100%;
    }


    `
  ]
})
export class IngresosComponent  {

  categorias: Selectors[] = [
    {value: '01', viewValue: 'Consulta'},
    {value: '02', viewValue: 'Limpieza facial'},
    {value: '03', viewValue: 'Rinomodelación con Hilos'}
  ];

  tiposPago: Selectors[]= [
    {value: '01', viewValue: 'Efectivo'},
    {value: '02', viewValue: 'Tarjeta'},
    {value: '03', viewValue: 'Transferencia'},
  ]
  

  displayedColumns = ['Producto o Servicio', 'Costo'];
  transactions: Transaction[] = [
    {item: 'Consulta', cost: 35},
    {item: 'Limpieza facial', cost: 40},
  ];

  getTotalCost() {
    return this.transactions.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

}
