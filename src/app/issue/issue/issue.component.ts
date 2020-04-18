import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router'
import {AppService} from './../../app.service';
import {ToastrService} from 'ngx-toastr'
import {Cookie} from 'ng2-cookies/ng2-cookies'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { IssueSocketService } from 'src/app/issue-socket.service';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css']
})
export class IssueComponent implements OnInit {
  @ViewChild('scrollMe',{static:false})scrollMe:ElementRef

  
  public Editor

  public title:any;
  public description:any;
  public attachments=[];
  public reporterName:any;
  public date:any;
  public allWatchers=[];
  public allComments=[];
  public issueId=this._route.snapshot.params.issueId;
  public comment:any;
  public searchClient=this._route.snapshot.queryParams.searchclient;
  public notifClient=this._route.snapshot.queryParams.Notification;
  public commentSkip=1;
  public watcherSkip=1;
  public loadCommentsButton=true;
  public loadWatchersButton=true;
  public assigneeArray:any;
  public watchers:any;
  public reporterId:any;
  public isOwner:any;
  public status:any;
  
  constructor(public router:Router,
    public _route:ActivatedRoute,
    public appService:AppService,
    public toastr:ToastrService,
    public socket:IssueSocketService) { }

  ngOnInit(): void {
    console.log(this.searchClient)
    this.getIssue()
    this.getWatchers()
    this.getComment()
    setTimeout(()=>{
            console.log(this.attachments)
    },2000)
  
  }
 
  public goBack=()=>{
    this.router.navigate([`/dashboard/${Cookie.get('receiverId')}`])
  }
  public addWatcher:any=()=>{
    let watcherObject={
      userId:Cookie.get('receiverId'),
      issueId:this.issueId

    }
    console.log(watcherObject)
     this.appService.addWatchers(watcherObject).subscribe((apiResponse)=>{
       if(apiResponse.status===200){
         this.getWatchers();
         this.toastr.success("Added as watcher for this issue...")
         this.searchClient="false";

       }
       else{
        this.toastr.warning("Failed to watch issue.")
       }
     })
  }

  public getWatchers:any=()=>{
    let watcherObject={
      issueId:this.issueId,
      skip:0*this.watcherSkip
    }
     this.appService.getWatchers(watcherObject).subscribe((apiResponse)=>{
       if(apiResponse.status===200){
         if(apiResponse.data.length<10){
           this.loadWatchersButton=false;
         }
         this.allWatchers=apiResponse.data;
         console.log(this.allWatchers)
         this.watcherSkip++;
       }
   }),
   (err)=>{
       this.loadWatchersButton=false;
   }
  }
  public editIssue:any=()=>{
     this.router.navigate([`/edit/${this.issueId}`])
  }

  public addComment:any=()=>{
    let commentObject={
        issueId:this.issueId,
        name:Cookie.get('receiverName'),
        comment:this.comment
      }
      let data={
        commentorName:commentObject.name,
        commentorId:Cookie.get('receiverId'),
        title:this.title,
        issueId:this.issueId,
        assigneeArray:this.assigneeArray,
        watchers:this.watchers,
        reporterId:this.reporterId
      }
     this.appService.addComments(commentObject).subscribe((apiResponse)=>{
       if(apiResponse.status===200){
          this.toastr.success("Commented Successfully...")
          this.getComment();
          this.comment=''
          this.socket.commentAlert(data);
       }else{
         this.toastr.warning("Failed to comment for this issue...")
       }
     })
  }

  public getComment:any=()=>{
    let commentData={
      issueId:this.issueId,
      skip:0
    }
    this.appService.getComments(commentData).subscribe((apiResponse)=>{
    console.log(apiResponse)
      if(apiResponse.status==200){

        console.log("api response"+apiResponse)
        console.log("comments"+apiResponse.data[0]);
        if(apiResponse.data.length<10 || apiResponse.data.length==0){
          this.loadCommentsButton=false;
        }
        this.allComments=apiResponse.data;
        this.allComments.sort(function(a,b){
          var dateA=a.createdOn,dateB=b.createdOn;
          if(dateA<dateB){
            return -1
          }
          if(dateA>dateB){
            return 1
          }
          return 0;
    
       })
      }else{
        this.loadCommentsButton=false;
      }
    })
  }
  public getIssue:any=()=>{
    this.appService.getSingleIssue(this.issueId).subscribe((apiResponse)=>{
      console.log(apiResponse)
      if(apiResponse.status===200){
        this.title=apiResponse.data[0].title;
        this.description=apiResponse.data[0].description;
        this.reporterName=apiResponse.data[0].reporterName;
        this.date=apiResponse.data[0].createdOn;
        this.attachments=apiResponse.data[0].attachments;
        this.assigneeArray=apiResponse.data[0].assigneeId
        this.watchers=apiResponse.data[0].watchers;
        this.reporterId=apiResponse.data[0].reporterId;
        this.status=apiResponse.data[0].status;
        if(Cookie.get('receiverId')==this.reporterId){
          this.isOwner=true;
        }
      }
      else{
        this.toastr.show("Failed to fetch issue details")
      }
    })
  }
  public openLink=(url)=>{
     let link=`https://attachments-issue.s3.ap-south-1.amazonaws.com/${url}`
  }
  public loadMoreComments:any=()=>{

      let commentData={
        issueId:this.issueId,
        skip:10*this.commentSkip
      }
      this.appService.getComments(commentData).subscribe((apiResponse)=>{
        console.log("skip is"+commentData.skip)
        if(apiResponse.status==200){
          console.log(apiResponse.data.length)
          if(apiResponse.data.length<10 || apiResponse.data.length==0){
            this.loadCommentsButton=false;
          }
          this.commentSkip++;
          this.allComments=apiResponse.data;
            this.allComments.sort(function(a,b){
              var dateA=a.createdOn,dateB=b.createdOn;
              if(dateA<dateB){
                return -1
              }
              if(dateA>dateB){
                return 1
              }
              return 0;
        
           })
          } else{
            this.loadCommentsButton=false;
          }
        })
     
  }
  public loadMoreWatchers=()=>{
    let watcherData={
      issueId:this.issueId,
      skip:10*this.watcherSkip
    }
    this.appService.getWatchers(watcherData).subscribe((apiResponse)=>{
      if(apiResponse.status===200){
        this.watcherSkip++;
        if(apiResponse.data.length<10){
          this.loadWatchersButton=false;
        }
        this.allWatchers=apiResponse.data;
      }
      else{
        this.loadWatchersButton=false;
      }
    })
  }

  public markCompleted:any=()=>{
    let data={
      issueId:this.issueId
    }
      this.appService.markCompleted(data).subscribe((apiResponse)=>{
        if(apiResponse.status==200){
          this.toastr.success("Issued marked as completed.")
          this.status="done"
        }else{
          this.toastr.error("Something went wrong")
        }
      })
  }

  public sendMessageUsingKeypress: any = (event: any) => {

    if (event.keyCode === 13 && this.comment!='') { // 13 is keycode of enter.
      this.addComment();
      this.comment='';

    }

  } 
  
}
