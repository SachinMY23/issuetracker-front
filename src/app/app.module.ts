import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http'
import {UserModule} from './../app/user/user.module';
import {SharedModule} from './../app/shared/shared.module';
import {IssueModule} from './../app/issue/issue.module';
import {RouterModule} from '@angular/router'
import { LoginComponent } from './user/login/login.component';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import {UploadService} from './../app/upload.service'
 
const googleId="609736432263-enliitqgg4nci79k91fhtl426d8uab6m.apps.googleusercontent.com";
const facebookId="916720005348270"
let config = new AuthServiceConfig([
  
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(googleId)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(facebookId)
  }
]);
 
export function provideConfig() {
  return config;
}
 

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    SocialLoginModule.initialize(config),
    SharedModule,
    UserModule,
    IssueModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path:'login',component:LoginComponent,pathMatch:'full'},
      {path:'',redirectTo:'login',pathMatch:'full'},
      {path:'*',component:LoginComponent},
      {path:'**',component:LoginComponent}
  ])],
  providers: [{provide: AuthServiceConfig,
    useFactory: provideConfig},UploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
