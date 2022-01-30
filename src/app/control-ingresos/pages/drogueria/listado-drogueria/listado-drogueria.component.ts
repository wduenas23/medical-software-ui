import { Component, OnInit,ViewChild } from '@angular/core';
import { ProductFactoryPojo } from '../../../interfaces/medicalService.interface';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MedsoftService } from 'src/app/control-ingresos/service/medsoft.service';

@Component({
  selector: 'app-listado-drogueria',
  templateUrl: './listado-drogueria.component.html',
  styles: [ `
    table {
      width: 100%
    }

    .mat-form-field {
      font-size: 14px;
      width: 100%;
    }
    `
  ]
})
export class ListadoDrogueriaComponent implements OnInit {


  droguerias: ProductFactoryPojo[]=[];
  dataSource!: MatTableDataSource<ProductFactoryPojo>;
  
  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort)  sort!: MatSort;

  displayedColumns: string[] = ['name', 'description', 'Acciones'];
  disabled= true;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  constructor(private medService: MedsoftService) {
    this.medService.obtenerDroguerias().subscribe(resp => {
      this.droguerias = resp;
      this.dataSource = new MatTableDataSource(resp);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource);
    })
   }

  ngOnInit(): void {
  }

}
