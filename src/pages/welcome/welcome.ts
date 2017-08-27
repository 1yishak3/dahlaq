import { Component, AfterViewInit} from '@angular/core';
import { NavController,Events,ToastController, LoadingController } from 'ionic-angular';

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
  constructor(public loadCtrl:LoadingController,public tc:ToastController,public events:Events,public navCtrl: NavController, public fire : FirebaseService) {
    this.fbs=fire
    this.ev=events
   }

   ngAfterViewInit(){
   }

  login() {

    var navCtrl=this.navCtrl
    var vm=this
    //navCtrl.push(LoginPage,{'confirm':"what?"})
    var load1=this.loadCtrl.create({
      content:"Sending you your SMS code..."
    })

    load1.present()
    this.fbs.recaptcha("login-button").then(value => {
      console.log("success reCaptcha")
      vm.recaptchaVerifier=value
      vm.fbs.login(vm.creds, vm.recaptchaVerifier).then(function(res){
        console.log("We have a response: ", res)
        load1.dismiss()
        navCtrl.push(LoginPage,{"confirm":res})
      }).catch(function(err){
      //  vm.fbs.currentUser().delete()
        load1.dismiss()
        console.log("Error loging in. Cause: ",err)
        var toast=vm.tc.create({
          message: "Sorry, an error has occured. Make sure you are connected to the internet, and that you have entered a valid Ethiopian phone number.",
          duration: 3000,
          position: 'top'
        })
        toast.present()
        //navCtrl.push(LoginPage)
      })
    }).catch(function(err){
      load1.dismiss()
      console.log("error recaptcha ",err)
    })

  }

  signup() {
    console.log(this.creds)
    /*var happy = this.fbs.linkToNumber
    var creds= this.creds
    var vm=this


    var recaptchaVerifier1 = this.recaptchaVerifier1*/
    var load1=this.loadCtrl.create({
      content:"Sending you your SMS code..."
    })
    load1.present()

    var vm=this
    this.fbs.recaptcha("signup-button").then(value => {
      console.log("success reCaptcha",value)
      this.recaptchaVerifier1=value
      var confirmationResult;
      var navCtrl=this.navCtrl
      vm.fbs.createUser(vm.creds, vm.recaptchaVerifier1).then(function(res){
        console.log("This is the conf code",res)
        load1.dismiss()
        confirmationResult = res
        navCtrl.push(SignupPage,{"confirm":confirmationResult})
      }).catch(function(err){
        load1.dismiss()
        if(vm.fbs.currentUser()){
          vm.fbs.currentUser().delete()
        }
        if(err==="notEthiopian"){
          var toast=vm.tc.create({
            message:"Please make sure you entered your Ethiopian phone number. e.g. 931605471 or 0931605471",
            duration: 3000,
            position: 'top'
          })
          toast.present()
        }else{
          var toast=vm.tc.create({
            message: "Sorry, an error has occured. Make sure you are connected to the internet.",
            duration: 3000,
            position: 'top'
          })
          toast.present()
        }
        //toast saying An error with the network occured, click back and try again.
        //navCtrl.push(SignupPage,{"confirm":confirmationResult})
      })
    }).catch(function(err){
      load1.dismiss()
       var toast=vm.tc.create({
        message: "Sorry, something went wrong in verifying your number. Please try again.",
        duration: 3000,
        position: 'top'
      })
      toast.present()
      console.log("error recaptcha ",err)
    })



  }
}
