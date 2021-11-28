import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormOfPayment, Producto } from 'src/app/control-ingresos/interfaces/medicalService.interface';
import { MedsoftService } from 'src/app/control-ingresos/service/medsoft.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styles: [
  ]
})
export class VentasComponent implements OnInit {


  formularioVentas: FormGroup = this.formBuilder.group({
    cantidad: [0, [Validators.min(0)]],
    tipoPago: [, [Validators.required]],
    descuento: [0, [Validators.min(0)]],

  })


  tiposPago: FormOfPayment[] = [];

  nuevoProducto: FormControl = this.formBuilder.control('', Validators.required);
  productos: Producto[] = [];
  nuevoProductoSeleccionado!: Producto;
  filteredOptions!: Producto[];

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

  }

  aplicarDescuento(){

  }

  agregarProducto(){

  }


  constructor(private formBuilder: FormBuilder,private medService: MedsoftService,) { }

  ngOnInit(): void {
    this.medService.obtenerFormasDePago().subscribe(resp => this.tiposPago = resp);
    this.medService.obtenerProductos().subscribe(prds=>{
      this.productos = prds;
    });
  }

}
