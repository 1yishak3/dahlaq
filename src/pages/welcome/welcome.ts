import { Component, AfterViewInit} from '@angular/core';
import { NavController,Events } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { FirebaseService } from '../../providers/firebase'

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  ev:any
  fbs:any;
  recaptchaVerifier: any
  recaptchaVerifier1: any
  creds:any={"digits":"",
    "username":"",
    "password":""
  }
  confirmationResult: any
  constructor(public events:Events,public navCtrl: NavController, public fire : FirebaseService) {
    this.fbs=fire
    this.ev=events
   }

   ngAfterViewInit(){
     this.recaptchaVerifier=this.fbs.recaptcha("login-button")
     this.recaptchaVerifier1=this.fbs.recaptcha("signup-button")
   }
  login() {
    var navCtrl=this.navCtrl
    this.fbs.login(this.creds, this.recaptchaVerifier).then(function(res){
      console.log("We have a response: ", res)
      navCtrl.push(LoginPage,{"confirm":res})
    }).catch(function(err){
      console.log("Error loging in. Cause: ",err)
      navCtrl.push(LoginPage)
    })
  }

  signup() {
    console.log(this.creds)
    /*var happy = this.fbs.linkToNumber
    var creds= this.creds


    var recaptchaVerifier1 = this.recaptchaVerifier1*/
    var confirmationResult;
    var navCtrl=this.navCtrl
    this.fbs.createUser(this.creds, this.recaptchaVerifier1).then(function(res){
      console.log("This is the conf code",res)
      confirmationResult = res
      navCtrl.push(SignupPage,{"confirm":confirmationResult})
    }).catch(function(err){
      console.log("You have an error",err)
      navCtrl.push(SignupPage,{"confirm":confirmationResult})
    })


  }
}
