import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MedicalServices } from 'src/app/control-ingresos/interfaces/medicalService.interface';
import { MedsoftService } from 'src/app/control-ingresos/service/medsoft.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
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
      color:red;
    }
    `
  ]
})
export class ListadoComponent implements OnInit  {

  servicios: MedicalServices[] = [];
  dataSource!: MatTableDataSource<MedicalServices>;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort)  sort!: MatSort;


  displayedColumns: string[] = ['id', 'category','description', 'cost','valid', 'Acciones'];
  disabled= true;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  constructor(private medService: MedsoftService) { 
    this.medService.obtenerServiciosMedicos().subscribe(resp => { 
      this.servicios = resp
      this.dataSource = new MatTableDataSource(resp);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource);
    });
    
    
  }

  ngOnInit() {
    
  }
}
