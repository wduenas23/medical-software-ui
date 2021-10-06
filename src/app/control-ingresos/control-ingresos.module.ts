import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';

import { HomeComponent } from './pages/home/home.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { CiRoutingModule } from './ci-routing.module';
import { SharedModule } from '../shared/shared.module';
import { IngresosComponent } from './pages/ingresos/ingresos.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';





@NgModule({
  declarations: [
    HomeComponent,
    ReporteComponent,
    IngresosComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    CiRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class ControlIngresosModule { }
