import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent implements OnInit {

  public email: any;
  public confirmEmail: any;

  constructor(public router: Router,
    public toastr: ToastrService,
    public appService: AppService) { }

  ngOnInit() {
  }
  public goToLogin: any = () => {
    this.router.navigate(['/login'])
  }

  public recoverPassFunction: any = () => {
    if (!this.email) {
      this.toastr.warning("Enter Your Mail Id")
    }
    else if (!this.confirmEmail) {
      this.toastr.warning('Please Confirm Your Email')
    }
    else if (this.email !== this.confirmEmail) {
      this.toastr.warning('Email Id Doesnt Match')
    }
    else {
      let data = {
        email: this.email
      }
      this.appService.recoverPass(data).subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          console.log(apiResponse);
          this.toastr.success("Password Sent To Your Mail successfully...");
          setTimeout(() => {
            this.router.navigate(['/login'])
          }
            , 2000);

        } else {
          this.toastr.error("hi  apiResponse.message");
        }
        (err) => {
          this.toastr.warning("some Error Occured while signin");
          this.goToLogin();
        }
      }
      )
    }
  }
}
