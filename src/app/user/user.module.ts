import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import {FormsModule} from '@angular/forms'
import { RouterModule } from '@angular/router';
import { RecoverComponent } from './recover/recover.component';
import { ChangePassComponent } from './change-pass/change-pass.component';


@NgModule({
  declarations: [LoginComponent, SigninComponent, RecoverComponent, ChangePassComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path:'signup',component:SigninComponent},
      {path:'recover/password',component:RecoverComponent},
      {path:'change/password/:userId',component:ChangePassComponent}
   ])]
})
export class UserModule { }
