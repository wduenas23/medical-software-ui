import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormOfPayment, Income, Patient, PaymentDetails, Producto, Totales } from 'src/app/control-ingresos/interfaces/medicalService.interface';
import { MedsoftService } from 'src/app/control-ingresos/service/medsoft.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { IncomeSale, IncomeResponseSale } from '../../../interfaces/medicalService.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styles: [
    `
    .summary-card {
      width: 90%;
    }

    .summary-card .mat-card-content{
      overflow-y: scroll;
      height: 300px;
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
export class VentasComponent implements OnInit {


  formularioVentas: FormGroup = this.formBuilder.group({
    cantidad: [0, [Validators.min(0)]],
    tipoPago: [, [Validators.required]],
    descuento: [ [Validators.min(0)]],
    descuentoNumerico: [ [Validators.min(0)]],
    efectivo: [,[Validators.min(0)]],
    tarjeta: [, [Validators.min(0)]],
    identificacion: ['',],
    telefono: ['',],
    nombres: [, [Validators.required, Validators.minLength(3)]],
    apellidos: [, [Validators.required, Validators.minLength(3)]],
    fechaServicio: [new Date(), [Validators.required]],
  })


  tiposPago: FormOfPayment[] = [];
  comisionTarjeta=0;

  nuevoProducto: FormControl = this.formBuilder.control('', Validators.required);
  productos: Producto[] = [];
  nuevoProductoSeleccionado!: Producto;
  filteredOptions!: Producto[];
  mapInventory = new Map();

  displayedColumns = ['Detalle', 'Costo', 'Action'];
  summaryList: Producto[] = [];

  displayedColumnsTotals: string[] = ['title', 'value'];
  totales: Totales[] = [
    { title: 'Descuentos', value: 0 },
    { title: 'Sub Total Cliente', value: 0 },
    { title: 'Comision por Tarjeta', value: 0 },
    { title: 'Total', value: 0 },
  ]

  income: IncomeSale | null = null;
  incomeResponse: IncomeResponseSale | null=null;

  pagoCombinado: boolean=false;
  editar: boolean=false;

  paciente!: Patient | null;




  


  getTotalServicios() {
    return this.summaryList.map(t => t.sellingPrice).reduce((acc, value) => acc + value, 0);
  }

  removeProducto(servicio: Producto) {
    const index = this.summaryList.indexOf(servicio);
    this.summaryList.splice(index, 1);
    this.summaryList = this.summaryList.slice();
    this.aplicarDescuento();
    this.aplicarComision(this.formularioVentas.controls.tipoPago.value);
    this.calcularTotalCliente();
    this.calcularTotalFinal();
  }

  resetAll(){

  }

  buscando() {
    this.filteredOptions = this._filter(this.nuevoProducto.value);
  }

  private _filter(value: string): Producto[] {
    const filterValue = value.toLowerCase();
    return this.productos.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  opcionSeleccionada(event: MatAutocompleteSelectedEvent) {
    this.nuevoProductoSeleccionado = event.option.value;
    this.nuevoProducto.setValue(this.nuevoProductoSeleccionado.name);
  }

  buscarPaciente(){
    
    let id=this.formularioVentas.controls.identificacion.value;    
    if(id.length >= 9){
      let identification=  id.includes('-')?id:id.replace(/^(\d{0,8})(\d{0,1})/, '$1-$2');
      console.log('A buscar paciente con id: ',id);
      this.medService.buscarPaciente(identification).subscribe(resp => { 
        if(resp.ok){
          this.paciente=resp.body;   
          this.formularioVentas.controls.nombres.setValue(this.paciente!.name);
          this.formularioVentas.controls.apellidos.setValue(this.paciente!.lastName);
          this.formularioVentas.controls.identificacion.setValue(this.paciente!.identification);   
          this.formularioVentas.controls.telefono.setValue(this.paciente!.phone);
        }
        
      },
      error => {
        console.log('oops', error)
        this.paciente=null;
        this.formularioVentas.controls.nombres.setValue('');
        this.formularioVentas.controls.apellidos.setValue('');
      }
      );
    }
  }

  buscarPacientePorTelefono(){
    
    let telefono=this.formularioVentas.controls.telefono.value;    
    if(telefono.length >= 8){
      console.log('A buscar paciente por telefono');
      this.medService.buscarPacientePorTelefono(telefono).subscribe(resp => { 
        if(resp.ok){
          this.paciente=resp.body;   
          this.formularioVentas.controls.nombres.setValue(this.paciente!.name);
          this.formularioVentas.controls.apellidos.setValue(this.paciente!.lastName);
          this.formularioVentas.controls.identificacion.setValue(this.paciente!.identification);    
          this.formularioVentas.controls.telefono.setValue(this.paciente!.phone);
        }
        
      },
      error => {
        console.log('oops', error)
        this.paciente=null;
        this.formularioVentas.controls.nombres.setValue('');
        this.formularioVentas.controls.apellidos.setValue('');
      }
      );
    }
    


  }



  guardar(){
    console.log('Touched: ', this.formularioVentas.touched);
    if (this.formularioVentas.invalid || !this.formularioVentas.touched) {
      this.formularioVentas.markAllAsTouched();
      return;
    }

    let identification: string=this.formularioVentas.controls.identificacion.value==null?'':this.formularioVentas.controls.identificacion.value;
    console.log('identificacion',identification);
    identification=identification;
    identification=identification.includes('-')?identification:identification.replace(/^(\d{0,8})(\d{0,1})/, '$1-$2');
    console.log('identificacion despues del replace',identification);

    if(!this.income){
      
      let identification: string=this.formularioVentas.controls.identificacion.value==null?'':this.formularioVentas.controls.identificacion.value;
      console.log('identificacion',identification);
      identification=identification;
      identification=identification.includes('-')?identification:identification.replace(/^(\d{0,8})(\d{0,1})/, '$1-$2');
      console.log('identificacion despues del replace',identification);

      this.income = {
        products: this.summaryList,
        formOfPayment: this.formularioVentas.controls.tipoPago.value,
        totals: this.totales,
        txDate: this.formularioVentas.controls.fechaServicio.value,
        discount: typeof this.formularioVentas.controls.descuento.value ==='number'?this.formularioVentas.controls.descuento.value:0,
        id: this.editar?this.incomeResponse?.txId:undefined,
        paymentDetails: this.buildPaymentDetail(),
        deleteFlag: 0,
        user: localStorage.getItem('loginUser'),
        patient: {
          name: this.formularioVentas.controls.nombres.value,
          lastName: this.formularioVentas.controls.apellidos.value,
          phone: this.formularioVentas.controls.telefono.value,
          address: '',
          birthday: '',
          identification: identification,
          id: this.paciente?this.paciente.id:0
        }
        
      }
    }

    console.log('Income a guardar',this.income);
    this.medService.guardarIngresoVentas(this.income).subscribe(resp => {
      console.log("Respuesta Obtenida: ", resp);
      if (resp.code === "200") {
        this.mostrarSnackBar('Ingreso guardado exitosamente')
        this.reloadPage();
      }
    },
    error => {
      this.mostrarSnackBar('ERROR AL GUARDAR INGRESO')
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

  buildPaymentDetail() : PaymentDetails[] {
    let tipoPago:FormOfPayment=this.formularioVentas.controls.tipoPago.value;
    console.log('TIPO PAGO',tipoPago);
    let paymentDetails: PaymentDetails[]=[];
    if(tipoPago.description==='Combinado'){
      this.tiposPago.forEach(element => {
        if(element.description==='Efectivo'){
          paymentDetails.push({
            amount: this.formularioVentas.controls.efectivo.value,
            ptId:element.id,
            txId:0,
            description: element.description,
            pdId:0
          });
        }
        if(element.description==='Tarjeta'){
          paymentDetails.push({
            amount: this.formularioVentas.controls.tarjeta.value,
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

  aplicarDescuento(){
    let descuentoTable = this.totales.find(val => val.title == "Descuentos");
    descuentoTable!.value = this.calcularDescuento();
    this.totales = this.totales.slice();
    this.aplicarComision(this.formularioVentas.controls.tipoPago.value);
    this.calcularTotalCliente();
    this.calcularTotalFinal();
  }


  calcularDescuento() {

    const porcentajeDescuento = typeof this.formularioVentas.controls.descuento.value==='number'?this.formularioVentas.controls.descuento.value:0;
    const cantidadDescuento = typeof this.formularioVentas.controls.descuentoNumerico.value==='number'?this.formularioVentas.controls.descuentoNumerico.value:0;
    if(porcentajeDescuento>0){
      return (this.getTotalServicios() * (porcentajeDescuento / 100)) * -1;
    }else {
      return cantidadDescuento * -1;
    }
  }

  aplicarComision(value: FormOfPayment) {
    const tipoPago = value ? value.description : '';
    if (tipoPago === 'Tarjeta') {
      let comi = this.totales.find(val => val.title == "Comision por Tarjeta");
      comi!.value = this.calculatComisionPorTarjeta(tipoPago);
      this.totales = this.totales.slice();
      this.pagoCombinado=false;
    } else if(tipoPago === 'Combinado'){
      this.pagoCombinado=true;
      this.totales = this.totales.slice();
      this.aplicarComisionCombinado();
    }    
    else {
      let comi = this.totales.find(val => val.title == "Comision por Tarjeta");
      comi!.value = 0;
      this.totales = this.totales.slice();
      this.pagoCombinado=false;
    }
    this.calcularTotalFinal();
  }

  aplicarComisionCombinado(){
    let comi = this.totales.find(val => val.title == "Comision por Tarjeta");
    comi!.value = this.calculatComisionPorTarjeta("Combinado");
    this.totales = this.totales.slice();
    this.calcularTotalFinal();
  }

  calculatComisionPorTarjeta(tipoPago: string) {
    let comision=0;
    if(tipoPago==='Combinado'){
      comision = this.formularioVentas.controls.tarjeta.value  * this.comisionTarjeta * -1;
      let subTotalCliente = this.totales.find(val => val.title == "Sub Total Cliente");
      let totalEfectivo= subTotalCliente!.value - this.formularioVentas.controls.tarjeta.value;
      console.log('Calulando remanente',totalEfectivo);
      this.formularioVentas.controls.efectivo.setValue(totalEfectivo);
    }else{
      comision = (this.getTotalServicios() + this.calcularDescuento()) * this.comisionTarjeta * -1;
    }
    
    return Math.round((comision + Number.EPSILON) * 100) / 100;
  }
  
  calcularTotalCliente() {
    let subTotalCliente = this.totales.find(val => val.title == "Sub Total Cliente");
    const descuentos = this.totales.find(val => val.title == "Descuentos");
    subTotalCliente!.value = this.getTotalServicios() + descuentos!.value;
    this.totales = this.totales.slice();
  }

  calcularTotalFinal() {
    let totalFinal = this.totales.find(val => val.title == "Total");
    const comisiones = this.totales.find(val => val.title == "Comision por Tarjeta");
    const descuentos = this.totales.find(val => val.title == "Descuentos");
    totalFinal!.value = this.getTotalServicios() + comisiones!.value + descuentos!.value;
    this.totales = this.totales.slice();
  }

  agregarProducto(){
    if (this.nuevoProducto.invalid) {
      return;
    }
    console.log('mapa de inventario antes: ',this.mapInventory);
    let inventory=this.mapInventory.get(this.nuevoProductoSeleccionado.id);
    inventory=inventory-1;
    if(inventory<0){
      this.mostrarSnackBar('Producto Agotado');
      return;
    }
    this.mapInventory.set(this.nuevoProductoSeleccionado.id,inventory);

    

    console.log('mapa de inventario despes: ',this.mapInventory);
    this.summaryList.push(this.nuevoProductoSeleccionado);
    this.summaryList = this.summaryList.slice();
    this.aplicarDescuento();
    this.aplicarComision(this.formularioVentas.controls.tipoPago.value);
  }

  onChangeTipoPago() {
    this.formularioVentas.controls.tipoPago.valueChanges
      .subscribe(value => {
        this.aplicarComision(value);
      });
  }

  constructor(private formBuilder: FormBuilder,private medService: MedsoftService,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.onChangeTipoPago();
    this.medService.obtenerFormasDePago().subscribe(resp => this.tiposPago = resp);
    this.medService.obtenerProductosDisponibles().subscribe(prds=>{
      this.productos = prds;
      prds.forEach(element => {
        this.mapInventory.set(element.id,element.inventory);
      });
      
    });
    this.medService.obtenerParametroPorId('COMISION_TARJETA').subscribe(resp => {
      this.comisionTarjeta=Number(resp.body?.pmtValue);
      console.log(this.comisionTarjeta);
    })
  }

}
