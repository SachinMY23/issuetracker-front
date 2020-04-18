import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'
import {Router,ActivatedRoute} from '@angular/router'
import {AppService} from './../../app.service';
import {ToastrService} from 'ngx-toastr'
import { IssueSocketService } from 'src/app/issue-socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public userId=this._route.snapshot.params.userId;
  public issueId:any;
  public allIssues:any;
  public skipCount=0;
  public nextButton:boolean=true;
  public previousButton:boolean=false;
  public searchString:any;
  public issuesLoading=true;
  public clientName=Cookie.get('receiverName')

  constructor(public router:Router,
    public _route:ActivatedRoute,
    public appService:AppService,
    public toastr:ToastrService,
    public socketService:IssueSocketService) { }

  ngOnInit(): void {
     this.getAllIssue();
     this.socketService.directAlert().subscribe((data)=>{
       this.toastr.show(data.msg,'Notification',{tapToDismiss:true,disableTimeOut:true,closeButton:true}).onTap
       .pipe()
       .subscribe(()=>this.onClickToastr(data))
        //
       this.getAllIssue();
       console.log(data);
     })
  }
  
  public getAllIssue:any=()=>{
    this.issuesLoading=true;
    let data={
      userId:this.userId,
      skip:0
    }
    this.appService.getAllIssues(data).subscribe((apiResponse)=>{
        this.issuesLoading=false;
        if(apiResponse.data.length===0){
          this.nextButton=false;
          this.toastr.show("No issues found")
        }
        if(apiResponse.data.length<10){
          this.nextButton=false;
        }
        this.allIssues=apiResponse.data;
      },
     (err)=>{
         this.toastr.error("No issues Found");
         this.issuesLoading=false;
     }
    )
  }

  public getMoreIssues=()=>{
    this.skipCount++;
    this.issuesLoading=true;
    let data={
      userId:this.userId,
      skip:10*this.skipCount
    }
    console.log("skip is"+data.skip)
    this.appService.getAllIssues(data).subscribe((apiResponse)=>{
      this.issuesLoading=false;
        if(apiResponse.data.length<10){
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
      },
     (err)=>{
       this.toastr.error("No issues found")
       this.skipCount--;
       this.issuesLoading=false;
     }
    )
  }
  public goToCreateissue:any=()=>{
    this.router.navigate([`/create/${this.userId}`])
  }

  public goToIssueview:any=()=>{
    this.router.navigate([`/create/${this.issueId}`])
  }
  public goToLogout:any=()=>{
    let data={
      userId:Cookie.get('receiverId'),
      name:Cookie.get('receiverName')
    }
    this.appService.logout().subscribe((apiResponse)=>{
      if(apiResponse.status===200){
       
        this.toastr.success("Logged out successfully...")
        this.socketService.disconnect(data);
        Cookie.deleteAll();
        setTimeout(()=>{
            this.router.navigate(['/login'])
        },2000)
      }
      else{
        this.toastr.warning("Logout failed.")
      }
    })
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

  public searchIssue=()=>{
    console.log(this.searchString)
      this.router.navigate(['/search'],{queryParams:{string:this.searchString}})
  }

  public goToMyissues:any=()=>{
    this.router.navigate([`/myissues/${this.userId}`])
  }
  getPreviousIssues:any=()=>{
    let data={
      skip:10*(this.skipCount-1),
      userId:this.userId
    }
    this.appService.getAllIssues(data).subscribe((apiResponse)=>{
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
  public onClickToastr:any=(data)=>{
    console.log("toastr clicked"+data.msg);
    this.router.navigate([`/issueview/${data.issueId}`],{queryParams:{Notification:true}})
  }
  public goToChangePassword=()=>{
    this.router.navigate([`/change/password/${this.userId}`])
  }
}
