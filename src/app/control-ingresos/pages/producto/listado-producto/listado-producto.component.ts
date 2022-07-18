import { Component, OnInit, ViewChild } from '@angular/core';
import { Producto } from 'src/app/control-ingresos/interfaces/medicalService.interface';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MedsoftService } from 'src/app/control-ingresos/service/medsoft.service';


@Component({
  selector: 'app-listado-producto',
  templateUrl: './listado-producto.component.html',
  styles: [
    `
    .listadoProductos {
      width: 100%;
      text-align: center;
    }

    .codigoColores {
      width: 30%;
      text-align: center;
    }

    .codigoColores td{
      width: 10px;
      text-align: center;
    }



    .listadoProductos .mat-header-cell {
      text-align: center;
      font-weight: bold;
    }

    .mat-form-field {
      font-size: 14px;
      width: 100%;
    }
    .red {
      color:black;
      background-color: red;
    }
    .orange {
      color:black;
      background-color: orange;
    }
    .yellow {
      color:black;
      background-color: yellow;
    }
    `
  ]
})
export class ListadoProductoComponent implements OnInit {

  habilitarInventario: boolean=false;
  productos: Producto[]=[];
  dataSource!: MatTableDataSource<Producto>;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort)  sort!: MatSort;

  displayedColumns: string[] = ['prdCode', 'factory','marca','name', 'description','expiryDate','lot','inventory','cost','sellingPrice','valid', 'Acciones'];
  disabled= true;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  validateExpirationDate(producto: Producto): String{
    var currentDate=new Date();
    var expiDate = new Date(JSON.stringify(producto.expiDate));
    var time =expiDate.getTime() - currentDate.getTime(); 
    var days = time / (1000 * 3600 * 24);
    if(days < 60){
      return "red";
    }else if (days >= 60 && days <=90) {
      return "orange";
    }else {
      return "";
    }

  }
  
  constructor(private medService: MedsoftService) { 
    this.medService.obtenerProductos().subscribe(prds=>{
      this.productos = prds;
      this.dataSource = new MatTableDataSource(prds);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource);
    });
  }

  ngOnInit(): void {
    this.medService.obtenerParametroPorId('HABILITAR_INVENTARIO').subscribe(resp => {
      this.habilitarInventario=resp.body?.pmtValue.toUpperCase() ==='SI';
      console.log(this.habilitarInventario);
    })
  }

}
