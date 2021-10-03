import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { CvRoutingModule } from './cv-routing.module';



@NgModule({
  declarations: [
    HomeComponent,
    ReporteComponent
  ],
  imports: [
    CommonModule,
    CvRoutingModule
  ]
})
export class ControlVentasModule { }
