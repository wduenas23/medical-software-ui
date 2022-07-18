import { LOCALE_ID, NgModule } from '@angular/core';
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
import { DocumentDirective } from './directives/document.directive';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { IngresoPorServicioComponent } from './pages/reporte/chart/ingreso-por-servicio/ingreso-por-servicio.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { ListadoDrogueriaComponent } from './pages/drogueria/listado-drogueria/listado-drogueria.component';
import { AgregarDrogueriaComponent } from './pages/drogueria/agregar-drogueria/agregar-drogueria.component';
import { ReporteVentasComponent } from './pages/reporte/reporte-ventas/reporte-ventas.component';
import { ParametrosGeneralesComponent } from './pages/parametros-generales/parametros-generales.component';
import { EditarParametroComponent } from './pages/parametros-generales/editar-parametro/editar-parametro.component';
import { IntlInputPhoneModule } from 'intl-input-phone';






@NgModule({
  declarations: [
    HomeComponent,
    ReporteComponent,
    IngresosComponent,
    ListadoComponent,
    AgregarComponent,
    VentasComponent,
    AgregarProductoComponent,
    ListadoProductoComponent,
    DocumentDirective,
    IngresoPorServicioComponent,
    ListadoDrogueriaComponent,
    AgregarDrogueriaComponent,
    ReporteVentasComponent,
    ParametrosGeneralesComponent,
    EditarParametroComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    CiRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    ChartsModule,
    FormsModule,
    GoogleChartsModule,
    IntlInputPhoneModule
  ],providers: [
    {provide:LOCALE_ID,useValue: 'es-SV' },
    {provide:MAT_DATE_LOCALE,useValue: 'es-SV' }]
})
export class ControlIngresosModule { }
