import { Component, OnInit } from '@angular/core';
import { AuthService,SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {IssueSocketService} from './../../issue-socket.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private user: SocialUser;
  private loggedIn: boolean;
 

  constructor(public appService: AppService,
    public router: Router,
    public toastr: ToastrService,
    public authService:AuthService,
    public socketService:IssueSocketService) { }
    
  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
  }
 
 
  signInWithGoogle(): void {
    console.log("Sign in With Google")
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((response)=>{
       console.log(response.email);
       this.appService.socialLogin(response.email).subscribe((apiResponse)=>{
        console.log(apiResponse)
        let data={
          userId:apiResponse.data.userDetails.userId
        }
        this.socketService.registerUser(data);
          Cookie.set('authtoken', apiResponse.data.authToken);
          Cookie.set('receiverId', apiResponse.data.userDetails.userId);
          Cookie.set('receiverName', apiResponse.data.userDetails.firstName + " " + apiResponse.data.userDetails.lastName);
          Cookie.set('receiverNo', apiResponse.data.userDetails.mobileNumber);
          Cookie.set('receiverEmail', apiResponse.data.userDetails.email);
          this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails);
          this.toastr.success("Login Successfull...");
          let userId = apiResponse.data.userDetails.userId;
         // this.socket.verifyUser();

        //  this.socket.registerUser(userId);

            setTimeout(() => {
              this.router.navigate([`/dashboard/${userId}`])
            }, 2000);
        
        },

       
        (err) => {
          this.toastr.warning("This email doesnt exist...please register");
          console.log(err);
          console.log(err.status);
        }
      )
      }
    )} 
  signOut(): void {
    this.authService.signOut().then((response)=>{
      console.log(response);

    });
  }
 

  public goToSignup: any = () => {
    this.router.navigate(['/signup']);
  }
  public goToRecoverPassword: any = () => {
    this.router.navigate(['/recover/password']);
  }
  public email: any;
  public password: any;


  //sign in function start
  public signinFunction: any = () => {
    if (!this.email) {
      this.toastr.warning("Enter Your Mail Id")
    }
    else if (!this.password) {
      this.toastr.warning("Enter Your Password");
    }
    else {
      let data = {
        email: this.email,
        password: this.password
      }
      this.appService.signinFunction(data).subscribe((apiResponse) => {
        console.log(apiResponse)
        let data={
          userId:apiResponse.data.userDetails.userId
        }
        this.socketService.registerUser(data);
          Cookie.set('authtoken', apiResponse.data.authToken);
          Cookie.set('receiverId', apiResponse.data.userDetails.userId);
          Cookie.set('receiverName', apiResponse.data.userDetails.firstName + " " + apiResponse.data.userDetails.lastName);
          Cookie.set('receiverNo', apiResponse.data.userDetails.mobileNumber);
          Cookie.set('receiverEmail', apiResponse.data.userDetails.email);
          this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails);
          this.toastr.success("Login Successfull...");
          let userId = apiResponse.data.userDetails.userId;
         // this.socket.verifyUser();

        //  this.socket.registerUser(userId);

            setTimeout(() => {
              this.router.navigate([`/dashboard/${userId}`])
            }, 2000);
        
        },

       
        (err) => {
          this.toastr.warning("You Entered Wrong Password");
          console.log(err);
          console.log(err.status);
        }
      )
      }
  }
}
