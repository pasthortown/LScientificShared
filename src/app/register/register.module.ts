import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RegisterRoutingModule,
    FormsModule
  ],
  declarations: [RegisterComponent]
})
export class RegisterModule { }
