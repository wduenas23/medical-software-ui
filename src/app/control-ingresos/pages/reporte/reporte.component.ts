import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions,ChartType } from 'chart.js';
import {  Label } from 'ng2-charts';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styles: [
  ]
})
export class ReporteComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['MESOTERAPIA REDUCTORA GRASA ABDOMINAL', 'CARBOXITERAPIA CORPORAL / 10 SESIONES', 'MESOTERAPIA REDUCTORA GRASA ABDOMINAL', 'RINOMODELACION PERMANENTE CON HILOS', 'CARBOXITERAPIA (OJERAS, ROSTRO, PAPADA Y CUELLO)', 'PLASMA RICO EN PLAQUETAS FACIAL CON DERMAPEN', 'PLASMA RICO EN PLAQUETAS (CAIDA CABELLO)', 'BOTOX 1 AREA', 'VIGOTE', 'ESPALDA', 'CONSULTA MEDICA', 'HIDRAFACIAL (LIMPIEZA FACIAL PREMIUM)'];
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = false;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40,70,89,100,256,12], label: 'Consultas' }   
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
