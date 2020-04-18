import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router'
import {AppService} from './../../app.service';
import {ToastrService} from 'ngx-toastr'
import {Cookie} from 'ng2-cookies/ng2-cookies'
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public issueId:any;
  public allIssues:any;
  public skipCount=0;
  public nextButton:boolean=true;
  public previousButton:boolean=false;

 
  constructor(public router:Router,
    public _route:ActivatedRoute,
    public appService:AppService,
    public toastr:ToastrService)
  {}
  public goSomewhere:any=()=>{
    this.router.navigate(['/create/bfbh'])
  }
  public ngOnInit(){
    this.getSearchedIssue();
  }

    public goBack=()=>{
        this.router.navigate([`/dashboard/${Cookie.get('receiverId')}`])
    }
    public getSearchedIssue:any=()=>{
      let data={
        skip:10*this.skipCount,
        searchString:this._route.snapshot.queryParams.string
      }
      this.appService.getSerachResults(data).subscribe((apiResponse)=>{
        if(apiResponse.status===200){
          if(apiResponse.data.length===0){
            this.nextButton=false;
            this.toastr.show("No issues found")
          }
          if(apiResponse.data.length<10){
            this.nextButton=false;
         }
          this.allIssues=apiResponse.data;
          this.skipCount++;
        }
        else if(apiResponse.status===404){
          this.toastr.show("No issues Found...")
        }else{
          this.toastr.error("Database error.")
        }
      })}
      
  
    public getMoreIssues=()=>{
      let data={
        skip:10*this.skipCount
      }
      console.log("skip is"+data.skip)
      this.appService.getAllIssues(data).subscribe((apiResponse)=>{
        if(apiResponse.status){
          if(apiResponse.data.length<2){
            this.nextButton=false;
            this.previousButton=true;
          }
          if(apiResponse.data.length===0){
            this.nextButton=false;
            this.toastr.show("No issues found")
            this.previousButton=true;
          }
          this.previousButton=true;
          console.log(apiResponse)
          this.allIssues=apiResponse.data;
          console.log(this.allIssues)
          this.skipCount++;
        }},
       (err)=>{
         this.toastr.error("No issues found")
       }
      )
    }
    public sortByDate:any=()=>{
      this.allIssues.sort(function(a,b){
        var dateA=a.createdOn,dateB=b.createdOn;
        if(dateA<dateB){
          return -1
        }
        if(dateA>dateB){
          return 1
        }
        return 0;
  
     })
    }
  
    public sortByTitle:any=()=>{
      this.allIssues.sort(function(a,b){
         var titleA=a.title.toLowerCase(),titleB=b.title.toLowerCase();
         if(titleA<titleB){
           return -1
         }
         if(titleA>titleB){
           return 1
         }
         return 0;
  
      })
    }
    public sortByReporterName:any=()=>{
      this.allIssues.sort(function(a,b){
         var nameA=a.reporterName,nameB=b.reporterName;
         if(nameA<nameB){
           return -1
         }
         if(nameA>nameB){
           return 1
         }
         return 0;
  
      })
    }
    public sortByStatus:any=()=>{
      this.allIssues.sort(function(a,b){
         var statusA=a.status,statusB=b.status;
         if(statusA<statusB){
           return -1
         }
         if(statusA>statusB){
           return 1
         }
         return 0;
  
      })
    }
 
  
}
