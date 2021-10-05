import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error/error.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
   ErrorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]

})
export class SharedModule { }
