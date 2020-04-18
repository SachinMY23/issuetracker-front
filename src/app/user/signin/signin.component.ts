import { Component, OnInit } from '@angular/core';
import { AuthService,SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {AppService} from './../../app.service'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  public firstName: any;
  public lastName: any;
  public mobile: any;
  public email: any;
  public password: any;
  public countryCode: any;
  public confPassword:any;
  constructor(public router: Router,
    public appService:AppService,
    public toastr: ToastrService,
    private authService: AuthService) { }


  ngOnInit(): void {
  }
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
 
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  } 
 
  signOut(): void {
    this.authService.signOut();
  }
  public goToLogin: any = () => {
    this.router.navigate(['/login'])
  }
  public signupFunction: any = () => {
    if (!this.firstName) {
      this.toastr.warning('Enter Your First Name')
    }
    else if (!this.lastName) {
      this.toastr.warning('Enter Your Last Name')
    } else if (!this.mobile) {
      this.toastr.warning('Enter Your Mobile No. ')
    } else if (!this.email) {
      this.toastr.warning('Enter Your Mail id ')
    } else if (!this.password) {
      this.toastr.warning('Enter Your Password')
    }else if(this.password!==this.confPassword){
      this.toastr.warning("Passwords Doesnt Match")
    }
    else {
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobileNumber: this.mobile,
        email: this.email,
        password: this.password,
        countryCode: this.countryCode
      }
      console.log(data);

      this.appService.signupFunction(data).subscribe((apiResponse) => {
        console.log(apiResponse);
        if (apiResponse.status === 200) {
          this.toastr.success("Signup Successfull...");

          setTimeout(() => {
            this.goToLogin();
          }, 2000);
        } else {
          this.toastr.error(apiResponse.message);
        }
      },
        (err) => {
          this.toastr.warning("Some Error Occured while signup");
        }
      );
    }
  }//end of sign up function
}
