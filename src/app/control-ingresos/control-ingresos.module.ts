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
import { AgregarComponent } from './pages/servicios-medicos/agregar/agregar.component';
import { VentasComponent } from './pages/ventas/ventas/ventas.component';
import { AgregarProductoComponent } from './pages/producto/agregar-producto/agregar-producto.component';
import { ListadoProductoComponent } from './pages/producto/listado-producto/listado-producto.component';






@NgModule({
  declarations: [
    HomeComponent,
    ReporteComponent,
    IngresosComponent,
    ListadoComponent,
    AgregarComponent,
    VentasComponent,
    AgregarProductoComponent,
    ListadoProductoComponent
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
