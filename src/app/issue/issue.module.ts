import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchComponent } from './search/search.component';
import { IssueComponent } from './issue/issue.component';
import { CreateComponent } from './create/create.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SigninComponent } from '../user/signin/signin.component';
import { EditComponent } from './edit/edit.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import { MyissueComponent } from './myissue/myissue.component'



@NgModule({
  declarations: [DashboardComponent, SearchComponent, IssueComponent, CreateComponent, EditComponent, MyissueComponent],
  imports: [
    CommonModule,
    CKEditorModule,
    FormsModule,
    RouterModule.forChild([
      {path:'create/:userId',component:CreateComponent},
      {path:'dashboard/:userId',component:DashboardComponent},
      {path:'issueview/:issueId',component:IssueComponent},
      {path:'search',component:SearchComponent},
      {path:'edit/:issueId',component:EditComponent},
      {path:'myissues/:userId',component:MyissueComponent}
  ])
  ]
})
export class IssueModule { }
