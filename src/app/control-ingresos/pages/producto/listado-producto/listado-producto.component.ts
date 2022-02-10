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
    table {
      width: 100%
    }

    .mat-form-field {
      font-size: 14px;
      width: 100%;
    }
    .red {
      color:black;
      background-color: yellow;
    }
    `
  ]
})
export class ListadoProductoComponent implements OnInit {

  productos: Producto[]=[];
  dataSource!: MatTableDataSource<Producto>;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort)  sort!: MatSort;

  displayedColumns: string[] = ['prdCode', 'factory','name', 'description','expiryDate','lot','inventory','cost','sellingPrice','promotionPrice','valid', 'Acciones'];
  disabled= true;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
  }

}
