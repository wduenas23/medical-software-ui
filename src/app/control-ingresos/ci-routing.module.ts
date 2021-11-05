import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { IngresosComponent } from './pages/ingresos/ingresos.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { AgregarComponent } from './pages/servicios-medicos/agregar/agregar.component';
import { ListadoComponent } from './pages/servicios-medicos/listado/listado.component';
import { ListadoPromocionesComponent } from './pages/servicios-medicos/listado-promociones/listado-promociones.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'ingresos',
        component: IngresosComponent
      },
      {
        path: 'reporte',
        component: ReporteComponent
      },
      {
        path: 'servicios-medicos',
        component: ListadoComponent
      },
      {
        path: 'promociones',
        component: ListadoPromocionesComponent
      },
      {
        path: 'editar/:id',
        component: AgregarComponent
      },
      {
        path: 'agregar',
        component: AgregarComponent
      },
      {
        path: '**',
        redirectTo: 'principal'
      }
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CiRoutingModule { }
