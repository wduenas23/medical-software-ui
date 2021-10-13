import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';

import localEsSv from '@angular/common/locales/es-SV';
import {DatePipe, registerLocaleData} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
registerLocaleData(localEsSv);
@NgModule({
  declarations: [
    AppComponent    
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    {provide:LOCALE_ID,useValue: 'es-SV' },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
