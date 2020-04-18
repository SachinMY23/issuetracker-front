import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllusersComponent } from './allusers/allusers.component';
import { RouterModule } from '@angular/router';
import { FirstcharComponent } from './firstchar/firstchar.component';



@NgModule({
  declarations: [AllusersComponent, FirstcharComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([

  ])
  ]
})
export class SharedModule { }
