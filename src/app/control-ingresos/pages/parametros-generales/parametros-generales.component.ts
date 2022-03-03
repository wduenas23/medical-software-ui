import { Component, OnInit,ViewChild } from '@angular/core';
import { Parameter } from '../../interfaces/medicalService.interface';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MedsoftService } from '../../service/medsoft.service';

@Component({
  selector: 'app-parametros-generales',
  templateUrl: './parametros-generales.component.html',
  styles: [
    `
    .listadoProductos {
      width: 100%;
      text-align: center;
    }

    .listadoProductos .mat-header-cell {
      text-align: center;
      font-weight: bold;
    }

    `
  ]
})
export class ParametrosGeneralesComponent implements OnInit {


  parametros: Parameter[]  | null=[];
  dataSource!: MatTableDataSource<Parameter>;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort)  sort!: MatSort;

  displayedColumns: string[] = ['nombre','valor', 'Acciones'];
  disabled= true;


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  constructor(private medService: MedsoftService) {
    this.medService.obtenerParametros().subscribe(params=>{
      this.parametros = params;
      this.dataSource = new MatTableDataSource(params);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource);
    });
   }

  ngOnInit(): void {

  }

}
