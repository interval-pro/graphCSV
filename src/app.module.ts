import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StyleModule } from 'src/@style/style.module';
import { SharedModule } from './@shared/shared.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './@containers/header/header.component';
import { MainComponent } from './@containers/main/main.component';
import { ClickOutsideDirective } from './@shared/directives/click-outside.directive';

const COMPONENTS = [
  AppComponent,
  HeaderComponent,
  MainComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ClickOutsideDirective,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    StyleModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
