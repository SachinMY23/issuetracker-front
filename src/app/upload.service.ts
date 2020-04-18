import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global'
import * as S3 from 'aws-sdk/clients/s3'
import {Observable} from 'rxjs';
import {FileUpload} from './fileupload'
import {of} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UploadService {
   
  Folder='attachments/'
  Bucket='attachments-issue'
  constructor() { }

  private getS3Bucket():any{
    const bucket=new S3({
      accessKeyId:`AKIA3OKLVKRSOFY5AGNX`,
      secretAccessKey:`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`,
      region:`ap-soth-1`
     });
     return bucket;
  }
  uploadfile(file){
    

     const params={
       Bucket:'attachments-issue',
       Key:this.Folder+file.name,
       Body:file,
       ACL:'public-read'
     }

     this.getS3Bucket().upload(params,function(err,data){
       if(err){
       console.log("There was an error while uploading your file",err)
       return false}
       else{
         console.log("Successfully uploaded file"+data.key)
         return true;
       }
     });
  }

  getFiles():Observable<any>{
    const fileUploads=new Array<FileUpload>();

    const params={
      Bucket:this.Bucket,
      Prefix:this.Folder
    };

   return this.getS3Bucket().listObjects(params,function(err,data){
      if(err){
        console.log("There was an error while getting your file",err)
        return;
      }
      else{
        console.log("Successfully get files",data)
      }

    }
    )}

    deleteFile(file){
      const params={
        Bucket:this.Bucket,
        Key:file
      };

      this.getS3Bucket().deleteObject(params,function(err,data){
        if(err){
          console.log("Failed to delete file"+err)
        }else{
          console.log("File deleted successfully")
        }
      })
    }
  }

