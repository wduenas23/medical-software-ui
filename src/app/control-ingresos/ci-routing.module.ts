import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { IngresosComponent } from './pages/ingresos/ingresos.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { AgregarComponent } from './pages/servicios-medicos/agregar/agregar.component';
import { ListadoComponent } from './pages/servicios-medicos/listado/listado.component';
import { VentasComponent } from './pages/ventas/ventas/ventas.component';
import { ListadoProductoComponent } from './pages/producto/listado-producto/listado-producto.component';
import { AgregarProductoComponent } from './pages/producto/agregar-producto/agregar-producto.component';
import { AgregarDrogueriaComponent } from './pages/drogueria/agregar-drogueria/agregar-drogueria.component';
import { ListadoDrogueriaComponent } from './pages/drogueria/listado-drogueria/listado-drogueria.component';
import { ReporteVentasComponent } from './pages/reporte/reporte-ventas/reporte-ventas.component';
import { ParametrosGeneralesComponent } from './pages/parametros-generales/parametros-generales.component';
import { EditarParametroComponent } from './pages/parametros-generales/editar-parametro/editar-parametro.component';


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
        path: 'reporte-ingresos',
        component: ReporteComponent
      },
      {
        path: 'reporte-ventas',
        component: ReporteVentasComponent
      },
      {
        path: 'servicios-medicos',
        component: ListadoComponent
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
        path: 'ventas',
        component: VentasComponent
      },
      
      {
        path: 'productos',
        component: ListadoProductoComponent
      },
      {
        path: 'agregar-productos',
        component: AgregarProductoComponent
      },
      
      {
        path: 'editar-productos/:id',
        component: AgregarProductoComponent
      },
      {
        path: 'droguerias',
        component: ListadoDrogueriaComponent
      },
      {
        path: 'agregar-drogueria',
        component: AgregarDrogueriaComponent
      },
      
      {
        path: 'editar-drogueria/:id',
        component: AgregarDrogueriaComponent
      },
      
      {
        path: 'parametros',
        component: ParametrosGeneralesComponent
      },
      
      {
        path: 'editar-parametro/:id',
        component: EditarParametroComponent
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
