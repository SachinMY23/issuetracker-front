import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { IssueSocketService } from 'src/app/issue-socket.service';

@Component({
  selector: 'app-myissue',
  templateUrl: './myissue.component.html',
  styleUrls: ['./myissue.component.css']
})
export class MyissueComponent implements OnInit {

  public userId=this._route.snapshot.params.userId;
  public issueId:any;
  public allIssues:any;
  public skipCount=0;
  public previousCount=this.skipCount-1;
  public nextButton:boolean=true;
  public previousButton:boolean=false;

  constructor(public router:Router,
    public _route:ActivatedRoute,
    public appService:AppService,
    public toastr:ToastrService,
    public socketService:IssueSocketService) { }

  ngOnInit(): void {
    this.getAllIssue();
  }
  
  public getAllIssue:any=()=>{
    let data={
      userId:this.userId,
      skip:0
    }
    this.appService.getMyIssues(data).subscribe((apiResponse)=>{
      if(apiResponse){
        if(apiResponse.data.length===0){
          this.nextButton=false;
          this.toastr.show("No issues found")
        }
        if(apiResponse.data.length<10){
          this.nextButton=false;
        }
        this.allIssues=apiResponse.data;
    }else{
      this.toastr.show("No issues reported by you.")
    }
  }
    )
    

   
  }

  public getMoreIssues=()=>{
    this.skipCount++;
    let data={
      userId:this.userId,
      skip:10*(this.skipCount)
    }
    console.log("skip is"+data.skip)
    this.appService.getMyIssues(data).subscribe((apiResponse)=>{
      if(apiResponse.status===200){
        if(apiResponse.data.length<10){
          this.nextButton=false;
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
      }
      else{
        this.toastr.show("No issues found")
        this.nextButton=false;
      }
    })
  }

  public goBack:any=()=>{
    this.router.navigate([`/dashboard/${this.userId}`])
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

  getPreviousIssues:any=()=>{
    let data={
      skip:10*(this.skipCount-1),
      userId:this.userId
    }
    this.appService.getMyIssues(data).subscribe((apiResponse)=>{
      if(apiResponse.status===200){
       this.skipCount--;
        if(this.skipCount==0){
          this.previousButton=false;
          this.nextButton=true;
        }
        console.log(apiResponse)
        this.allIssues=apiResponse.data;
        console.log(this.allIssues)
      }
      else{
        this.toastr.show("No issues found")
        this.nextButton=false;
      }
    })
  }

}
