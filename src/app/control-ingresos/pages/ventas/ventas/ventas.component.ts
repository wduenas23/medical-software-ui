import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormOfPayment, Income, Producto, Totales } from 'src/app/control-ingresos/interfaces/medicalService.interface';
import { MedsoftService } from 'src/app/control-ingresos/service/medsoft.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styles: [
    `
    .summary-card {
      width: 90%;
    }

    .summary-card-totals {
      width: 20%;
    }

    table {
      width: 90%;
    }

    `
  ]
})
export class VentasComponent implements OnInit {


  formularioVentas: FormGroup = this.formBuilder.group({
    cantidad: [0, [Validators.min(0)]],
    tipoPago: [, [Validators.required]],
    descuento: [0, [Validators.min(0)]],
    efectivo: [,[Validators.min(0)]],
    tarjeta: [, [Validators.min(0)]],
  })


  tiposPago: FormOfPayment[] = [];

  nuevoProducto: FormControl = this.formBuilder.control('', Validators.required);
  productos: Producto[] = [];
  nuevoProductoSeleccionado!: Producto;
  filteredOptions!: Producto[];

  displayedColumns = ['Detalle', 'Costo', 'Action'];
  summaryList: Producto[] = [];

  displayedColumnsTotals: string[] = ['title', 'value'];
  totales: Totales[] = [
    { title: 'Descuentos', value: 0 },
    { title: 'Sub Total Cliente', value: 0 },
    { title: 'Comisiones', value: 0 },
    { title: 'Total', value: 0 },
  ]

  income: Income | null = null;

  pagoCombinado: boolean=false;

  aplicarComisionCombinado(){
    let comi = this.totales.find(val => val.title == "Comisiones");
    //comi!.value = this.calculatComisionPorTarjeta("Combinado");
    this.totales = this.totales.slice();
    this.calcularTotalFinal();
  }

  getTotalServicios() {
    return this.summaryList.map(t => t.cost).reduce((acc, value) => acc + value, 0);
  }

  removeProducto(servicio: Producto) {

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

  guardar(){
    console.log('Touched: ', this.formularioVentas.touched);
    if (this.formularioVentas.invalid || !this.formularioVentas.touched) {
      this.formularioVentas.markAllAsTouched();
      return;
    }


    /*this.income = {
      services: this.summaryList,
      formOfPayment: this.formularioIngresos.controls.tipoPago.value,
      totals: this.totales,
      txDate: this.formularioIngresos.controls.fechaServicio.value,
      discount: this.formularioIngresos.controls.descuento.value
    }

    this.medService.guardarIngreso(this.income).subscribe(resp => {
      console.log("Respuesta Obtenida: ", resp);
      if (resp.code === "200") {
        this.resetAll();
        this.getDailySummary()
        this.mostrarSnackBar('Ingreso guardado exitosamente')
      }

    });*/
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
    const porcentajeDescuento = this.formularioVentas.controls.descuento.value;
    return (this.getTotalServicios() * (porcentajeDescuento / 100)) * -1;
  }

  aplicarComision(value: FormOfPayment) {
    const tipoPago = value ? value.description : '';
    if (tipoPago === 'Tarjeta') {
      let comi = this.totales.find(val => val.title == "Comisiones");
      comi!.value = this.calculatComisionPorTarjeta();
      this.totales = this.totales.slice();
      this.pagoCombinado=false;
    } else if(tipoPago === 'Combinado'){
      this.pagoCombinado=true;
      this.totales = this.totales.slice();
      this.aplicarComisionCombinado();
    }    
    else {
      let comi = this.totales.find(val => val.title == "Comisiones");
      comi!.value = 0;
      this.totales = this.totales.slice();
      this.pagoCombinado=false;
    }
    this.calcularTotalFinal();
  }

  calculatComisionPorTarjeta() {
    const comision = (this.getTotalServicios() + this.calcularDescuento()) * 0.07 * -1;
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
    const comisiones = this.totales.find(val => val.title == "Comisiones");
    const descuentos = this.totales.find(val => val.title == "Descuentos");
    totalFinal!.value = this.getTotalServicios() + comisiones!.value + descuentos!.value;
    this.totales = this.totales.slice();
  }

  agregarProducto(){
    if (this.nuevoProducto.invalid) {
      return;
    }
    console.log('Nuevo Producto: ', this.nuevoProductoSeleccionado)
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

  constructor(private formBuilder: FormBuilder,private medService: MedsoftService,) { }

  ngOnInit(): void {
    this.onChangeTipoPago();
    this.medService.obtenerFormasDePago().subscribe(resp => this.tiposPago = resp);
    this.medService.obtenerProductos().subscribe(prds=>{
      this.productos = prds;
    });
  }

}
