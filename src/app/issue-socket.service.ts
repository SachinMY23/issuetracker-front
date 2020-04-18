import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs';
import {catchError} from 'rxjs/operators'
import {tap,map} from 'rxjs/operators'
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {HttpErrorResponse,HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IssueSocketService {

  private url = 'http://api.techway.xyz';
 // private url = 'http://localhost:3000';

  private socket;


  constructor(public http: HttpClient) {
    // connection is being created.
    // that handshake
    this.socket = io(this.url);

  }

 

  public registerUser=(data)=>{
    console.log("Registering user")
    this.socket.emit('register',data);
  }

  public issueAlert= (data) => {


      this.socket.emit('assignee-alert',data); // end Observable

  }
  public directAlert=()=>{
    return Observable.create((observer) => {

      this.socket.on(Cookie.get('receiverId'), (data) => {

        observer.next(data);

      }); // end Socket

    }); // 
  }
  
  public editAlert=(data)=>{
    this.socket.emit('edit-alert',data);
  }

  public commentAlert=(data)=>{
    this.socket.emit('comment-alert',data);
  }

  public disconnect=(data)=>{
    this.socket.emit('disconnect',data)
  }
//error handler
  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError
  
}
