
import { Component, OnInit } from '@angular/core';
import {ElementRef,ViewChild} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Observable, from} from 'rxjs'
import * as  s3 from 'aws-s3'
import { Reference } from '@angular/compiler/src/render3/r3_ast';
import { types } from 'util';
import {AppService} from './../../app.service'
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {ActivatedRoute,Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr'
import {IssueSocketService} from './../../issue-socket.service'
import { UploadService } from 'src/app/upload.service';
import * as AWS from 'aws-sdk/global'
import * as S3 from 'aws-sdk/clients/s3';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  
  @ViewChild('id',{static:false})id:ElementRef
  public Editor=ClassicEditor;

  public title:any;
  public description="Type your description here";
  public moreUsers:any;
  public user:any;
  public userId=this._route.snapshot.params.userId;
  public selectedFiles:FileList
  public attachment='';
  Folder='attachments/'
  Bucket='attachments-issue';
  public loaded:any;
  public skip=0;
  public loadMoreUsersButton:boolean;
  public loadPreviousUsersButton:boolean;

  public linhttps:"https://attachments-issue.s3.ap-south-1.amazonaws.com/attachments/iron-man-hd-2018-bn.jpg"

  private getS3Bucket():any{
    const bucket=new S3({
      accessKeyId:`AKIA3OKLVKRSOFY5AGNX`,
      secretAccessKey:`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`,
      region:`ap-soth-1`
     });
     return bucket;
  }

  public allUsers=[];
  constructor(public http:HttpClient,
       public appService:AppService,
       public _route:ActivatedRoute,
       public toastr:ToastrService,
       public router:Router,
       public socketService:IssueSocketService,
       public uploadService:UploadService) { }

  ngOnInit(): void {
this.getAllUsers()
  }

  public upload:any=()=>{
    this.loaded=false;
    for(var i=0;i<this.selectedFiles.length;i++){
    let file=this.selectedFiles.item(i)
    this.toastr.success((i+1)+" Files uploaded successfully")
    
  }
 
  }
  public selectFile=(event)=>{
      this.selectedFiles=event.target.files;
  
  }
  public postIssueFunction:any=()=>{
    if(!this.user){
       this.toastr.show("Please assign the issue to someone.")
    }
    for(var i=0;i<this.selectedFiles.length;i++){
      this.attachment=this.attachment+`,${this.Folder}${this.selectedFiles[i].name}`
    }
    console.log(this.attachment)
    console.log("attachment is "+this.attachment)
    console.log(this.user)
    let arr=this.user.split(',')
    console.log(arr)
    console.log("user"+arr[1])
    let postIssueObject={
      title:this.title,
      description:this.description,
      attachments:this.attachment,
      reporterName:Cookie.get('receiverName'),
      reporterId:this.userId,
      assigneeId:arr[1],
      userId:this.userId
    }
    this.appService.createIssue(postIssueObject).subscribe((apiResponse)=>{
        console.log(apiResponse)
        this.toastr.success("Issue Created Successfully...");
        let data={
          title:apiResponse.data[0].title,
          reporterName:apiResponse.data[0].reporterName,
          assigneeId:arr[1],
          issueId:apiResponse.data[0].issueId
        }       
        this.socketService.issueAlert(data);
        setTimeout(()=>{
            this.router.navigate([`dashboard/${this.userId}`])
        },2000)
      }
     
      ,
    (err)=>{
      if(err.status===404){
      this.toastr.warning("Issue Creation Failed.")
      }
     }
    )
}



/*public loadMoreUsers:any=()=>{
   
}
/*
 
const S3Client = new S3(config);
/*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */
 
/* This is optional */
/* 
S3Client
    .uploadFile(file, newFileName)
    .then(data => console.log(data))
    .catch(err => console.error(err))
 */
  /**
   * {
   *   Response: {
   *     bucket: "your-bucket-name",
   *     key: "photos/image.jpg",
   *     location: "https://your-bucket.s3.amazonaws.com/photos/image.jpg"
   *   }
   * }
   */
    public goBack:any=()=>{
      this.router.navigate([`/dashboard/${this.userId}`])
    }
    public getAllUsers:any=()=>{
      let data={
        skip:0
      }
      this.appService.allUsers(data).subscribe((apiResponse)=>{
        if(apiResponse.status==200){
          if(apiResponse.data.length<10){
            this.loadMoreUsersButton=false;
          }else{
          this.loadMoreUsersButton=true;
          }
        this.allUsers=apiResponse.data;
        console.log(this.allUsers)
        }
      })
    }
    
    public submit:any=()=>{
      console.log(this.description)
    }
    public loadMoreUsers:any=()=>{
      this.skip++;
      let data={
        skip:10*this.skip
      }
      this.appService.allUsers(data).subscribe((apiResponse)=>{
        if(apiResponse.status==200){
          if(apiResponse.data.length<10){
            this.loadMoreUsersButton=false;

          }
          this.loadPreviousUsersButton=true;
        this.allUsers=apiResponse.data;
        console.log(this.allUsers)
        }else{
          this.skip--;
        }
      })
    }
    public loadPreviousUsers:any=()=>{
      let data={
        skip:10*(this.skip-1)
      }
      this.appService.allUsers(data).subscribe((apiResponse)=>{
        if(apiResponse.status==200){
          if(this.skip==0){
            this.loadMoreUsersButton=true;
            this.loadPreviousUsersButton=false;
          }
          this.skip--;
          console.log("skip is"+this.skip)
        this.allUsers=apiResponse.data;
        console.log(this.allUsers)
        }   
      })
    }
}
