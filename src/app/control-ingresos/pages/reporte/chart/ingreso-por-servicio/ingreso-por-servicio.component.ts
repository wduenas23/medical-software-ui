import { Component, Input, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { MedsoftService } from 'src/app/control-ingresos/service/medsoft.service';
import { ReportRanges } from '../../../../interfaces/medicalService.interface';

@Component({
  selector: 'app-ingreso-por-servicio',
  templateUrl: './ingreso-por-servicio.component.html',
  styles: [
  ]
})
export class IngresoPorServicioComponent implements OnInit {


  @Input() item!: ReportRanges;
  resumenPorRango: number=0;
  panelOpenState = true;

  title = 'Cantidad por Servicios brindados';
   type = ChartType.PieChart;
   data:[string,number][] =[ ];
   columnNames = ['Servicios', 'Cantidad'];
   options = {   
    is3D: true 
   };
   width = 700;
   height = 300;

  ngOnInit(): void {
    
  }

  showPieDiagram(start: Date,end: Date) {
    this.medService.obtenerConteoServicios(start,end).subscribe(resp =>{
        this.data=[];
        resp.forEach(element => {
          this.data.push(
            [element.serviceName,element.count]
          )
        });
        
      })
    
  }
  
  constructor( private medService: MedsoftService) {}

}
