import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import {UploadService} from './../../upload.service'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { IssueSocketService } from 'src/app/issue-socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  public Editor=ClassicEditor;
  public title:any;
  public description:any;
  public attachments:any;
  public reporterName:any;
  public issueId=this._route.snapshot.params.issueId;
  public assigneeArray:any;
  public date:any;
  public allUsers:any;
  public skip=0;
  public selectedFiles:FileList;
  public assigneeId:any;
  public watchers:any;
  Folder='attachments/'
  Bucket='attachments-issue';
  public user:any;
  public userButton:any;
  public previousButton:any;
  public reporterId:any;

  constructor(public router:Router,
    public _route:ActivatedRoute,
    public appService:AppService,
    public toastr:ToastrService,
    public upload:UploadService,
    public socket:IssueSocketService) { }

  ngOnInit(): void {
    this.getIssue();
    this.getAllUsers();
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
        this.assigneeArray=apiResponse.data[0].assigneeId;
        this.watchers=apiResponse.data[0].watchers;
        this.reporterId=apiResponse.data[0].reporterId
      }
      else{
        this.toastr.show("Failed to fetch issue details")
      }
    })
  }

  public editIssue:any=()=>{
    if(this.user){
    let arr=this.user.split(',');
    this.assigneeArray.push(arr[1]);
    }
     let data={
      title:this.title,
      description:this.description,
      attachments:this.attachments,
      assigneeId:this.assigneeArray,
      issueId:this.issueId,
      editorName:Cookie.get('receiverName'),
      watchers:this.watchers,
      reporterId:this.reporterId,
      editorId:Cookie.get('receiverId')
     }
     console.log(data);
     this.appService.editIssue(data).subscribe((apiResponse)=>{
       if(apiResponse.status==200){
         this.toastr.success("Issue edited successfully...");
         this.socket.editAlert(data)
         this.router.navigate([`/issueview/${this.issueId}`])
       }
       else{
         this.toastr.warning("Failed to edit issue.")
       }
     })
  }

  public selectFile=(event)=>{
    this.selectedFiles=event.target.files;

}
  public goBack:any=()=>{
    this.router.navigate([`/issueview/${this.issueId}`])
  }
  public getAllUsers:any=()=>{
    let data={
      skip:0
    }
    this.appService.allUsers(data).subscribe((apiResponse)=>{
      if(apiResponse.data.length<10){
        this.userButton=false
      }else{
      this.userButton=true;
      }
      this.allUsers=apiResponse.data;
      console.log(this.allUsers)
    })
  }

  public loadMoreUsers:any=()=>{
    this.skip++;
    let data={
      skip:10*this.skip
    }
    this.appService.allUsers(data).subscribe((apiResponse)=>{
      if(apiResponse.status=200){
        if(apiResponse.data.length<10){
          this.userButton=false;
          this.previousButton=true;
        }else{
          this.userButton=true;
          this.previousButton=true; 
        }
      this.allUsers=apiResponse.data;
      console.log(this.allUsers)
      }else{
        this.skip--;
      }
    })
  }

  public deleteFile:any=(url)=>{
    console.log("attachments"+this.attachments)
    var index=this.attachments.indexOf(url);
    if(index>-1){
      this.attachments.splice(index,1)
    }
    console.log("After attchment"+this.attachments);
    this.upload.deleteFile(url);
  }

  public uploadFile:any=()=>{
    for(var i=0;i<this.selectedFiles.length;i++){
      let file=this.selectedFiles.item(i);
      let bool=this.upload.uploadfile(file)
      let fn=this.Folder+file.name
    this.attachments.push(fn);
    console.log(bool)
    }
    console.log("After upload"+this.attachments)
  }
  public loadPreviousUsers:any=()=>{
    let data={
      skip:10*(this.skip-1)
    }
    this.appService.allUsers(data).subscribe((apiResponse)=>{
      if(apiResponse.status==200){
        if(this.skip==0){
          this.userButton=true;
          this.previousButton=false;
        }
        this.skip--;
        console.log("skip is"+this.skip)
      this.allUsers=apiResponse.data;
      console.log(this.allUsers)
      }   
    })
  }
}
