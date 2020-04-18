import { Component, OnInit } from '@angular/core';
import {AppService} from './../../app.service';
import {ToastrService} from 'ngx-toastr'
@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html',
  styleUrls: ['./allusers.component.css']
})
export class AllusersComponent implements OnInit {

  public allUsers:any;
  constructor(public appService:AppService,
    public toastr:ToastrService) { }

  ngOnInit(): void {
  }

 
}
