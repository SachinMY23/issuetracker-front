import { Injectable } from '@angular/core';
import{HttpClient,HttpHeaders} from '@angular/common/http';
import {HttpErrorResponse,HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cookie} from  'ng2-cookies/ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url = 'http://api.techway.xyz';
 // private url = 'http://localhost:3000';



  constructor(public http:HttpClient) { }

  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage


  public setUserInfoInLocalStorage = (data) =>{

    localStorage.setItem('userInfo', JSON.stringify(data))


  }

  public deleteUserInfoInLocalStorage=()=>{
    localStorage.removeItem('userInfo')

  }

  public signupFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)
      .set('countryCode',data.countryCode);

    return this.http.post(`${this.url}/api/v1/users/signup`, params);

  } // end of signupFunction function.

  public signinFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(this.url+'/api/v1/users/login',params);
  } // end of signinFunction function.

  
  public logout(): Observable<any> {

    const params = new HttpParams()
      .set('authToken', Cookie.get('authtoken'));
      console.log(Cookie.get('authtoken'))


    return this.http.post(`${this.url}/api/v1/users/logout`, params);
    
  } 
  // end logout fun
  public socialLogin(email):Observable<any>{
    const params=new HttpParams().
    set('email',email)

    return this.http.post(this.url+'/api/v1/users/social/login',params);

  }

  public getAllIssues(data):Observable<any>{
    return this.http.get(`${this.url}/api/v1/issues/all/${data.userId}?authToken=${Cookie.get('authtoken')}&skip=${data.skip}`);

  }

  public createIssue(createObject):Observable<any>{
  
    let params=new HttpParams()
    .set('title',createObject.title)
    .set('description',createObject.description)
    .set('assignId',createObject.assigneeId)
    .set('reporterName',createObject.reporterName)
    .set('attachments',createObject.attachments)
    .set('authToken',Cookie.get('authtoken'))
    
    return this.http.post(`${this.url}/api/v1/issues/create/${createObject.userId}`,params);

  }

  public allUsers(data):Observable<any>{
  
    
    return this.http.get(`${this.url}/api/v1/users/all/users?authToken=${Cookie.get('authtoken')}&skip=${data.skip}`);

  }
  public editIssue(data):Observable<any>{

     let params=new HttpParams()
    .set('title',data.title)
    .set('description',data.description)
    .set('assignId',data.assigneeId)
    .set('attachments',data.attachments)
    .set('authToken',Cookie.get('authtoken'))
    
    return this.http.post(`${this.url}/api/v1/issues/edit/${data.issueId}`,params);

  }
  public getComments(commentObject):Observable<any>{
  
    
    return this.http.get(`${this.url}/api/v1/comments/all/${commentObject.issueId}?skip=${commentObject.skip}&authToken=${Cookie.get('authtoken')}`);

  }
  public addComments(commentObject):Observable<any>{
  
   const params=new  HttpParams()
   .set('comment',commentObject.comment)
   .set('name', commentObject.name)
   .set('authToken',Cookie.get('authtoken'))

    return this.http.post(`${this.url}/api/v1/comments/add/${commentObject.issueId}`,params);

  }

  public getAllUsers(data):Observable<any>{
    return this.http.get(`${this.url}/api/v1/users/all/users?skip=${data.skip}&authToken=${Cookie.get('authtoken')}`);
  }

  public addWatchers(watcherObject):Observable<any>{
    const params=new HttpParams()
    .set('userId',watcherObject.userId)
    .set('authToken',Cookie.get('authtoken'))

    return this.http.post(`${this.url}/api/v1/issues/addwatchers/${watcherObject.issueId}`,params)
  }

  public getWatchers(watcherObject):Observable<any>{
    
    return this.http.get(`${this.url}/api/v1/issues/allwatchers/${watcherObject.issueId}?skip=${watcherObject.skip}&authToken=${Cookie.get('authtoken')}`)
  }

  public getSingleIssue(issueId):Observable<any>{
    return this.http.get(`${this.url}/api/v1/issues/single/${issueId}?&authToken=${Cookie.get('authtoken')}`)
  }

  public getSerachResults(data):Observable<any>{
    return this.http.get(`${this.url}/api/v1/issues/searched?searchString=${data.searchString}?skip=${data.skip}&authToken=${Cookie.get('authtoken')}`)
  }

  

  public getMyIssues:any=(data)=>{
    return this.http.get(`${this.url}/api/v1/issues/my/${data.userId}?skip=${data.skip}&authToken=${Cookie.get('authtoken')}`)

  }
  public markCompleted(data):Observable<any>{
    let params=new HttpParams().
    set('authToken',Cookie.get('authtoken'))
    return this.http.post(`${this.url}/api/v1/issues/complete/${data.issueId}`,params)

  }

  public recoverPass(data):Observable<any>{
    const params=new HttpParams()
    .set('email',data.email);

    return this.http.post(this.url+'/api/v1/users/recover/password',params);
}

public changePass(data):Observable<any>{
  let authtok=Cookie.get('authtoken');

  const params=new HttpParams()
  .set('currPassword',data.oldPass)
  .set('newPassword',data.newPass);

  return this.http.post(this.url+`/api/v1/users/change/password/${data.userId}?authToken=${authtok}`,params);
}

}
