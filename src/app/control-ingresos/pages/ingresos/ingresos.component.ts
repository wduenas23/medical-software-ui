import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormOfPayment, Income, IncomeResponse, MedicalServices, Patient, PaymentDetails, Totales } from '../../interfaces/medicalService.interface';
import { MedsoftService } from '../../service/medsoft.service';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styles: [
    `
    .summary-card {
      width: 90%;
    }

    .summary-card .mat-card-content{
      overflow-y: scroll;
      height: 200px;
    }

    .summary-card-totals {
      width: 20%;
    }

    table {
      width: 90%;
    }


    .dailyIncomeTable{
      width: 100%;
    }

    `
  ]
})
export class IngresosComponent implements OnInit {

  formularioIngresos: FormGroup = this.formBuilder.group({
    nombres: [, [Validators.required, Validators.minLength(3)]],
    apellidos: [, [Validators.required, Validators.minLength(3)]],
    identificacion: [],
    telefono: [, [Validators.required, Validators.minLength(3), Validators.maxLength(9)]],
    tipoPago: [, [Validators.required]],
    descuento: [ [Validators.min(0)]],
    descuentoNumerico: [ [Validators.min(0)]],
    fechaServicio: [new Date(), [Validators.required]],
    efectivo: [,[Validators.min(0)]],
    tarjeta: [, [Validators.min(0)]],

  })


  paciente!: Patient | null;

  nuevoServicio: FormControl = this.formBuilder.control('', );
  nuevoServicioPromo: FormControl = this.formBuilder.control('', );

  servicios: MedicalServices[] = [];
  serviciosOnEdit: MedicalServices[] = [];
  serviciosPromo: MedicalServices[] = [];
  nuevoServicioSeleccionado!: MedicalServices;
  nuevoServicioSeleccionadoPromo!: MedicalServices;
  
  ingresosDiarios: IncomeResponse[] = [];
  dataSource!: MatTableDataSource<IncomeResponse>;

  @ViewChild(MatPaginator)  paginator!: MatPaginator;
  @ViewChild(MatSort)  sort!: MatSort;

  tiposPago: FormOfPayment[] = [];
  

  filteredOptions!: MedicalServices[];
  filteredOptionsPromos!: MedicalServices[];
  resumenDiario: number = 0;
  resumenMensual: number = 0;

  income: Income | null = null;
  incomeResponse: IncomeResponse | null=null;

  //Para la tabla de servicios
  displayedColumns = ['Detalle', 'Costo', 'Action'];
  summaryList: MedicalServices[] = [];

  //Para tabla de Totales
  displayedColumnsTotals: string[] = ['title', 'value'];
  totales: Totales[] = [
    { title: 'Descuentos', value: 0 },
    { title: 'Sub Total Cliente', value: 0 },
    { title: 'Comisiones', value: 0 },
    { title: 'Total', value: 0 },
  ]


  displayedColumnsDaily: string[] = ['dui','nombre', 'apellido', 'telefono','tipo de pago', 'Total Transaccion','descuento','sub total cliente','comision','total ingreso', 'Acciones'];
  editar: boolean=false;
  pagoCombinado: boolean=false;

  agregarServicio() {
    if (this.nuevoServicio.invalid) {
      return;
    }
    console.log('Nuevo Servicio: ', this.nuevoServicioSeleccionado)
    this.summaryList.push(this.nuevoServicioSeleccionado);
    this.summaryList = this.summaryList.slice();
    this.aplicarDescuento();
    this.aplicarComision(this.formularioIngresos.controls.tipoPago.value);
  }

  agregarServicioOnEdit(){
    console.log('Nuevo Servicio: ', this.nuevoServicioSeleccionado)
    this.summaryList.push(this.nuevoServicioSeleccionado);
    this.summaryList = this.summaryList.slice();
    this.aplicarDescuento();
    this.aplicarComision(this.formularioIngresos.controls.tipoPago.value);
  }

  agregarServicioPromo() {
    if (this.nuevoServicioPromo.invalid) {
      return;
    }
    console.log('Nuevo Servicio: ', this.nuevoServicioSeleccionadoPromo)
    this.summaryList.push(this.nuevoServicioSeleccionadoPromo);
    this.summaryList = this.summaryList.slice();
    this.aplicarDescuento();
    this.aplicarComision(this.formularioIngresos.controls.tipoPago.value);
  }




  removeServicio(servicio: MedicalServices) {
    const index = this.summaryList.indexOf(servicio);
    this.summaryList.splice(index, 1);
    this.summaryList = this.summaryList.slice();
    this.aplicarDescuento();
    this.aplicarComision(this.formularioIngresos.controls.tipoPago.value);
    this.calcularTotalCliente();
    this.calcularTotalFinal();

  }


  onChangeTipoPago() {
    this.formularioIngresos.controls.tipoPago.valueChanges
      .subscribe(value => {
        this.aplicarComision(value);
      });
  }

  aplicarDescuento() {

    let descuentoTable = this.totales.find(val => val.title == "Descuentos");
    descuentoTable!.value = this.calcularDescuento();
    this.totales = this.totales.slice();
    this.aplicarComision(this.formularioIngresos.controls.tipoPago.value);
    this.calcularTotalCliente();
    this.calcularTotalFinal();
  }


  aplicarComision(value: FormOfPayment) {
    const tipoPago = value ? value.description : '';
    if (tipoPago === 'Tarjeta') {
      let comi = this.totales.find(val => val.title == "Comisiones");
      comi!.value = this.calculatComisionPorTarjeta(tipoPago);
      this.totales = this.totales.slice();
      this.pagoCombinado=false;
    } else if(tipoPago==='Combinado'){
      this.pagoCombinado=true;
      this.totales = this.totales.slice();
      this.aplicarComisionCombinado();
    }else {
      let comi = this.totales.find(val => val.title == "Comisiones");
      comi!.value = 0;
      this.totales = this.totales.slice();
      this.pagoCombinado=false;
    }
    this.calcularTotalFinal();
  }


  aplicarComisionCombinado(){
    let comi = this.totales.find(val => val.title == "Comisiones");
    comi!.value = this.calculatComisionPorTarjeta("Combinado");
    this.totales = this.totales.slice();
    this.calcularTotalFinal();
  }

  calculatComisionPorTarjeta(tipoPago: string) {
    let comision=0;
    if(tipoPago==='Combinado'){
      comision = this.formularioIngresos.controls.tarjeta.value  * 0.07 * -1;
      let subTotalCliente = this.totales.find(val => val.title == "Sub Total Cliente");
      let totalEfectivo= subTotalCliente!.value - this.formularioIngresos.controls.tarjeta.value;
      console.log('Calulando remanente',totalEfectivo);
      this.formularioIngresos.controls.efectivo.setValue(totalEfectivo);
    }else{
      comision = (this.getTotalServicios() + this.calcularDescuento()) * 0.07 * -1;
    }
    
    return Math.round((comision + Number.EPSILON) * 100) / 100;
  }

  calcularDescuento() {
    const porcentajeDescuento = typeof this.formularioIngresos.controls.descuento.value==='number'?this.formularioIngresos.controls.descuento.value:0;
    const cantidadDescuento = typeof this.formularioIngresos.controls.descuentoNumerico.value==='number'?this.formularioIngresos.controls.descuentoNumerico.value:0;
    if(porcentajeDescuento>0){
      return (this.getTotalServicios() * (porcentajeDescuento / 100)) * -1;
    }else {
      return cantidadDescuento * -1;
    }
    
  }

  calcularTotalCliente() {
    let subTotalCliente = this.totales.find(val => val.title == "Sub Total Cliente");
    const descuentos = this.totales.find(val => val.title == "Descuentos");
    subTotalCliente!.value = this.getTotalServicios() + descuentos!.value;
    this.totales = this.totales.slice();
  }

  calcularTotalFinal() {
    let totalFinal = this.totales.find(val => val.title == "Total");
    const comisiones = this.totales.find(val => val.title == "Comisiones");
    const descuentos = this.totales.find(val => val.title == "Descuentos");
    totalFinal!.value = this.getTotalServicios() + comisiones!.value + descuentos!.value;
    this.totales = this.totales.slice();
  }

  getTotalServicios() {
    return this.summaryList.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

  buscarPaciente(){
    
    let id=this.formularioIngresos.controls.identificacion.value;    
    if(id.length >= 9){
      let identification=  id.includes('-')?id:id.replace(/^(\d{0,8})(\d{0,1})/, '$1-$2');
      console.log('A buscar paciente con id: ',id);
      this.medService.buscarPaciente(identification).subscribe(resp => { 
        if(resp.ok){
          this.paciente=resp.body;   
          this.formularioIngresos.controls.nombres.setValue(this.paciente!.name);
          this.formularioIngresos.controls.apellidos.setValue(this.paciente!.lastName);
          this.formularioIngresos.controls.telefono.setValue(this.paciente!.phone);
          this.formularioIngresos.controls.identificacion.setValue(this.paciente!.identification);   
        }
        
      },
      error => {
        console.log('oops', error)
        this.paciente=null;
        this.formularioIngresos.controls.nombres.setValue('');
          this.formularioIngresos.controls.apellidos.setValue('');
      }
      );
    }
    


  }

  buscarPacientePorTelefono(){
    
    let telefono=this.formularioIngresos.controls.telefono.value;    
    if(telefono.length >= 8){
      console.log('A buscar paciente por telefono');
      this.medService.buscarPacientePorTelefono(telefono).subscribe(resp => { 
        if(resp.ok){
          this.paciente=resp.body;   
          this.formularioIngresos.controls.nombres.setValue(this.paciente!.name);
          this.formularioIngresos.controls.apellidos.setValue(this.paciente!.lastName);
          this.formularioIngresos.controls.telefono.setValue(this.paciente!.phone);
          this.formularioIngresos.controls.identificacion.setValue(this.paciente!.identification);   
        }
        
      },
      error => {
        console.log('oops', error)
        this.paciente=null;
        this.formularioIngresos.controls.nombres.setValue('');
          this.formularioIngresos.controls.apellidos.setValue('');
      }
      );
    }
    


  }

  guardar() {

    console.log('Ift: ',(this.formularioIngresos.invalid) );
    if ( this.summaryList.length<=0 || this.formularioIngresos.invalid) {
      this.formularioIngresos.markAllAsTouched();
      this.mostrarSnackBar('Favor Ingrese valores requeridos o Servicios a ofrecer');
      return;
    }


    if(!this.income){
      
      let identification: string=this.formularioIngresos.controls.identificacion.value==null?'':this.formularioIngresos.controls.identificacion.value;
      console.log('identificacion',identification);
      identification=identification;
      identification=identification.includes('-')?identification:identification.replace(/^(\d{0,8})(\d{0,1})/, '$1-$2');
      console.log('identificacion despues del replace',identification);

      this.income = {
        services: this.summaryList,
        formOfPayment: this.formularioIngresos.controls.tipoPago.value,
        totals: this.totales,
        txDate: this.formularioIngresos.controls.fechaServicio.value,
        discount: typeof this.formularioIngresos.controls.descuento.value ==='number'?this.formularioIngresos.controls.descuento.value:0,
        id: this.editar?this.incomeResponse?.txId:undefined,
        paymentDetails: this.buildPaymentDetail(),
        patient: {
          name: this.formularioIngresos.controls.nombres.value,
          lastName: this.formularioIngresos.controls.apellidos.value,
          phone: this.formularioIngresos.controls.telefono.value,
          address: '',
          birthday: '',
          identification: identification,
          id: this.paciente?this.paciente.id:0
        }
        
      }
    }
    
    console.log('Income a guardar',this.income);
    this.medService.guardarIngreso(this.income).subscribe(resp => {
      console.log("Respuesta Obtenida: ", resp);
      if (resp.code === "200") {
        this.getDailySummary()
        this.mostrarSnackBar('Ingreso guardado exitosamente')
        this.reloadPage();
      }
    },
    error => {
      this.mostrarSnackBar('ERROR AL GUARDAR INGRESO')
    });

  }
  buildPaymentDetail() : PaymentDetails[] {
    let tipoPago:FormOfPayment=this.formularioIngresos.controls.tipoPago.value;
    console.log('TIPO PAGO',tipoPago);
    let paymentDetails: PaymentDetails[]=[];
    if(tipoPago.description==='Combinado'){
      this.tiposPago.forEach(element => {
        if(element.description==='Efectivo'){
          paymentDetails.push({
            amount: this.formularioIngresos.controls.efectivo.value,
            ptId:element.id,
            txId:0,
            description: element.description,
            pdId:0
          });
        }
        if(element.description==='Tarjeta'){
          paymentDetails.push({
            amount: this.formularioIngresos.controls.tarjeta.value,
            ptId:element.id,
            txId:0,
            description: element.description,
            pdId:0
          });
        }
      });
    }else {
      paymentDetails.push({
        amount: this.totales.find(val => val.title == "Total")?.value,
        pdId: 0,
        ptId: tipoPago.id,
        description: tipoPago.description,
        txId:0
      })
    }
    return paymentDetails;
  }


  editarIngeso(id: number){
    console.log(id);
    this.medService.obtenerIngresoPorId(id).subscribe( resp=> {
      console.log(resp)
      this.incomeResponse=resp;
      this.paciente=resp.patient;
      this.editar=true;
      this.formularioIngresos.controls.nombres.setValue(this.paciente.name);
      this.formularioIngresos.controls.apellidos.setValue(this.paciente.lastName);
      this.formularioIngresos.controls.telefono.setValue(this.paciente.phone);
      this.formularioIngresos.controls.identificacion.setValue(this.paciente.identification);
      this.formularioIngresos.controls.descuento.setValue(resp.discount);
      if(resp.discount<=0){
        this.formularioIngresos.controls.descuentoNumerico.setValue(resp.discountTotal*-1);
      }
      
      
      let fp: FormOfPayment= {
        description:resp.paymentType,
        id: resp.paymentId
      }
      this.formularioIngresos.get('tipoPago')?.setValue(fp);
      if(fp.description==='Combinado'){
        resp.paymentDetails.forEach(element => {
          if(element.description==='Efectivo'){
            this.formularioIngresos.controls.efectivo.setValue(element.amount);
          }
          if(element.description==='Tarjeta'){
            this.formularioIngresos.controls.tarjeta.setValue(element.amount);
          }
        });
        
      }
      resp.services.forEach(element => {
        console.log('Elements services',element);
        this.nuevoServicioSeleccionado=element;
        this.agregarServicioOnEdit();
      });
      this.formularioIngresos.markAsTouched();

    })
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


  compareFunction(o1: any, o2: any) {
    if(o1 && o2){
      return (o1.name == o2.name && o1.id == o2.id);
    }
    return false;
   }

  buscando() {
    this.filteredOptions = this._filter(this.nuevoServicio.value);
  }


  buscandoPromo() {
    this.filteredOptionsPromos = this._filterPromo(this.nuevoServicioPromo.value);
  }

  getDailySummary() {
    this.medService.obtenerResumenDiarioYMensual().subscribe(resp => {
      console.log(resp);
      this.resumenDiario = resp.dailySummary;
      this.resumenMensual = resp.monthlySummary;
    });
  }

  private _filter(value: string): MedicalServices[] {
    const filterValue = value.toLowerCase();
    return this.servicios.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  private _filterPromo(value: string): MedicalServices[] {
    const filterValue = value.toLowerCase();
    return this.serviciosPromo.filter(option => option.description.toLowerCase().includes(filterValue));
  }

  opcionSeleccionada(event: MatAutocompleteSelectedEvent) {
    this.nuevoServicioSeleccionado = event.option.value;
    this.nuevoServicio.setValue(this.nuevoServicioSeleccionado.description);
  }

  opcionSeleccionadaPromo(event: MatAutocompleteSelectedEvent) {
    this.nuevoServicioSeleccionadoPromo = event.option.value;
    this.nuevoServicioPromo.setValue(this.nuevoServicioSeleccionadoPromo.description);
  }


  resetAll() {
    /*this.formularioIngresos.reset();
    this.nuevoServicio.reset('');
    this.nuevoServicioPromo.reset('');
    this.formularioIngresos.get('fechaServicio')?.reset(new Date());
    this.formularioIngresos.get('descuento')?.reset(0);
    
    this.summaryList = [];
    this.aplicarDescuento();
    this.calcularTotalCliente();
    this.aplicarComision(this.formularioIngresos.controls.tipoPago.value);
    this.calcularTotalFinal();
    this.income = null;*/
    this.reloadPage();
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


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  constructor(
        private formBuilder: FormBuilder, 
        private datepipe: DatePipe, 
        private medService: MedsoftService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog) { 
    
  }


  ngOnInit(): void {
    this.onChangeTipoPago();
    this.medService.obtenerFormasDePago().subscribe(resp => this.tiposPago = resp);
    this.medService.obtenerServiciosMedicosActivos().subscribe(resp =>  this.servicios = resp);
    this.medService.obtenerServiciosMedicosPromo().subscribe(resp => this.serviciosPromo = resp);
    this.getDailySummary();
    this.medService.obtenerIngresosDiarios().subscribe(resp => {
      console.log('Respuesta',resp);
      this.ingresosDiarios=resp;
      this.dataSource = new MatTableDataSource(resp);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(resp);
    });
  }

 



}