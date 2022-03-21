import { Component, OnInit,ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MedsoftService } from '../../../service/medsoft.service';
import { IncomeResponse, IncomeResponseSale, MedicalServices, Producto, ReportRanges } from '../../../interfaces/medicalService.interface';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoPorServicioComponent } from '../chart/ingreso-por-servicio/ingreso-por-servicio.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
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
export class ReporteVentasComponent implements OnInit {

  ingresosDiarios: IncomeResponseSale[] = [];
  incomeEliminar!: IncomeResponseSale;
  productOnEdit: Producto[] = [];
  resumenPorRango: number=0;
  resumenComisionPorRango: number=0;
  dataSource!: MatTableDataSource<IncomeResponseSale>;
  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort)  sort!: MatSort;
  displayedColumnsDaily: string[] = ['id','fecha','nombre', 'apellido', 'telefono', 'tipo de pago','Total Transaccion','descuento', 'sub total cliente','comision','total ingreso','comisionVenta', 'Acciones'];


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

  mostrarProductos(id: number,templateRef: any){
    this.medService.obtenerIngresoVentasPorId(id).subscribe( resp=> {
      console.log('Respuesta de productos',resp);
      this.productOnEdit=resp.products;
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
    this.medService.obtenerIngresosDiariosVentasRange(this.miFormulario.controls.start.value,this.miFormulario.controls.end.value).subscribe(resp => {
      console.log(resp);
      this.ingresosDiarios=resp;
      this.dataSource = new MatTableDataSource(this.ingresosDiarios);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: IncomeResponseSale, filter: string) => {
        return  data.patient.name.toLocaleLowerCase().includes(filter) || 
                data.patient.lastName.toLocaleLowerCase().includes(filter) ||
                data.patient.phone.toLocaleLowerCase().includes(filter) ||
                data.subTotalClient.toString().includes(filter) || 
                data.txTotal.toString().includes(filter) || 
                data.txSubTotal.toString().includes(filter) || 
                data.paymentType.toLocaleLowerCase().includes(filter) ;
                
      }
    });

    this.medService.obtenerIngresosVentasPorRango(this.miFormulario.controls.start.value,this.miFormulario.controls.end.value).subscribe(resp => {
      this.resumenPorRango=resp.rangeSummary;
    });

    this.medService.obtenerComisionVentasPorRango(this.miFormulario.controls.start.value,this.miFormulario.controls.end.value).subscribe(resp => {
      this.resumenComisionPorRango=resp.rangeComission;
    });

    this.child.showPieDiagram(this.miFormulario.controls.start.value,this.miFormulario.controls.end.value,'producto');
  }


  eliminarIngreso(id: number,templateRef: any){
    this.medService.obtenerIngresoVentasPorId(id).subscribe( resp=> {
      this.incomeEliminar=resp;
      const dialogRef = this.dialog.open(templateRef,
        {
          width: '450px'
        });
    });
  }

  confirmarEliminarIngreso(){
    console.log(this.incomeEliminar);
    this.medService.borrarIngreso(this.incomeEliminar.txId).subscribe(resp=>{
      if(resp===true){
        this.consultarIngresos();
        this.dialog.closeAll();
      }else{
        this.mostrarSnackBar('Error al eliminar Registro')  
      }
    },
    error=>{
      this.mostrarSnackBar('Error al eliminar Registro')
    });
  }

  mostrarSnackBar(mensaje: string){

    this.snackBar.open(mensaje,'Aceptar!', {
      duration: 2000,
      verticalPosition: 'top'
    });
  }

  reloadPage() {
    setTimeout(()=>{
      window.location.reload();
    }, 1000);
  }

  constructor( private medService: MedsoftService,
              private dialog: MatDialog,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar
              ) { 
    
  }

  ngOnInit(): void {
  }


}
