import { Component, OnInit,ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MedsoftService } from '../../service/medsoft.service';
import { IncomeResponse, MedicalServices } from '../../interfaces/medicalService.interface';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styles: [`
    .dailyIncomeTable{
      width: 100%;
    }

    .mat-form-field {
      width: 100%;
    }
    `
  ]
})
export class ReporteComponent implements OnInit {

  ingresosDiarios: IncomeResponse[] = [];
  serviciosOnEdit: MedicalServices[] = [];
  dataSource!: MatTableDataSource<IncomeResponse>;
  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort)  sort!: MatSort;
  displayedColumnsDaily: string[] = ['nombre', 'apellido', 'telefono', 'sub total cliente','total ingreso','tipo de pago', 'Acciones'];



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  mostrarServicios(id: number,templateRef: any){
    this.medService.obtenerIngresoPorId(id).subscribe( resp=> {
      this.serviciosOnEdit=resp.services;
      const dialogRef = this.dialog.open(templateRef,
        {
          width: '450px'
        });
    });
  }

  consultarIngresos(){
    
  }

  constructor( private medService: MedsoftService,private dialog: MatDialog) { 
    
  }

  ngOnInit(): void {
    this.medService.obtenerIngresosDiarios().subscribe(resp => {
      console.log('Respuesta',resp);
      this.ingresosDiarios=resp;
      this.dataSource = new MatTableDataSource(this.ingresosDiarios);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: IncomeResponse, filter: string) => {
        return  data.patient.name.toLocaleLowerCase().includes(filter) || 
                data.patient.lastName.toLocaleLowerCase().includes(filter) ||
                data.patient.phone.toLocaleLowerCase().includes(filter) ||
                data.subTotalClient.toString().includes(filter) || 
                data.txTotal.toString().includes(filter) || 
                data.paymentType.toLocaleLowerCase().includes(filter);
      }
      console.log(resp);
    });
  }

}
