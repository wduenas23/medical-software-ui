import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error/error.component';
import { MaterialModule } from '../material/material.module';

import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
   ErrorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ]

})
export class SharedModule { }
