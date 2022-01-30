import { Component, OnInit,ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MedsoftService } from '../../service/medsoft.service';
import { IncomeResponse, MedicalServices, ReportRanges } from '../../interfaces/medicalService.interface';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoPorServicioComponent } from './chart/ingreso-por-servicio/ingreso-por-servicio.component';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styles: [`
    .dailyIncomeTable{
      width: 100%;
    }

    .form-input {
      width: 200px;
    }

    .filter-form {
      width: 100%
    }

    .summary-card-totals {
      width: 100%;
    }

    `
  ]
})
export class ReporteComponent implements OnInit {

  ingresosDiarios: IncomeResponse[] = [];
  serviciosOnEdit: MedicalServices[] = [];
  resumenPorRango: number=0;
  dataSource!: MatTableDataSource<IncomeResponse>;
  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort)  sort!: MatSort;
  displayedColumnsDaily: string[] = ['fecha','nombre', 'apellido', 'telefono', 'tipo de pago', 'sub total cliente','descuento','comision','total ingreso', 'Acciones'];


  miFormulario: FormGroup = this.formBuilder.group({
    start      : [, [Validators.required] ],
    end      : [ , [Validators.required]]
    
  })

  reportDetail!: ReportRanges;

  @ViewChild(IngresoPorServicioComponent,{static: true}) child!: IngresoPorServicioComponent;

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
    
    if(!this.miFormulario.valid){
      return;
    }
    this.reportDetail={
      endDate:this.miFormulario.controls.end.value,
      startDate: this.miFormulario.controls.start.value
    }
    this.medService.obtenerIngresosDiariosRange(this.miFormulario.controls.start.value,this.miFormulario.controls.end.value).subscribe(resp => {
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
                data.paymentType.toLocaleLowerCase().includes(filter) ;
                
      }
    });

    this.medService.obtenerIngresosPorRango(this.miFormulario.controls.start.value,this.miFormulario.controls.end.value).subscribe(resp => {
      this.resumenPorRango=resp.rangeSummary;
    });

    this.child.showPieDiagram(this.miFormulario.controls.start.value,this.miFormulario.controls.end.value);
  }

  constructor( private medService: MedsoftService,
              private dialog: MatDialog,
              private formBuilder: FormBuilder
              ) { 
    
  }

  ngOnInit(): void {
  }

}
