import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { HomeComponent } from './pages/home/home.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { CiRoutingModule } from './ci-routing.module';
import { SharedModule } from '../shared/shared.module';
import { IngresosComponent } from './pages/ingresos/ingresos.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { ListadoComponent } from './pages/servicios-medicos/listado/listado.component';
import { ListadoPromocionesComponent } from './pages/servicios-medicos/listado-promociones/listado-promociones.component';
import { AgregarComponent } from './pages/servicios-medicos/agregar/agregar.component';






@NgModule({
  declarations: [
    HomeComponent,
    ReporteComponent,
    IngresosComponent,
    ListadoComponent,
    ListadoPromocionesComponent,
    AgregarComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    CiRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    ChartsModule,
    FormsModule
  ]
})
export class ControlIngresosModule { }
