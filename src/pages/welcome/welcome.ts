import { Component, AfterViewInit} from '@angular/core';
import { NavController,Events,ToastController, LoadingController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { FirebaseService } from '../../providers/firebase'
import { User } from '../../providers/user'
import{ MainPage } from '../pages'
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
  constructor(public c:User,public loadCtrl:LoadingController,public tc:ToastController,public events:Events,public navCtrl: NavController, public fire : FirebaseService) {
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
      content:"Logging you in..."
    })

    load1.present()

    vm.fbs.login(vm.creds,vm.creds.password).then(function(res){
      // console.log("We have a response: ", res)
      // var num=vm.c.checkify(this.creds.digits)

      load1.dismiss()
      navCtrl.push(MainPage)

    }).catch(function(err){
    //  vm.fbs.currentUser().delete()
      load1.dismiss()
      if(err="Password"){
        var toast=vm.tc.create({
          message: "Please enter a password. Type a new one if this is your first time at Dahlaq, or type your old password if you're returning.",
          duration: 5000,
          position: 'top'
        })
        toast.present()

      }else{
      console.log("Error loging in. Cause: ",err)
      var toast=vm.tc.create({
        message: "Couldn't log you in. Make sure you are connected to the internet, and that you have entered a valid phone number and password combo.",
        duration: 5000,
        position: 'top'
      })
      toast.present()
      }
      //navCtrl.push(LoginPage)
    })

  }

  signup() {
    console.log(this.creds)
    /*var happy = this.fbs.linkToNumber
    var creds= this.creds
    var vm=this


    var recaptchaVerifier1 = this.recaptchaVerifier1*/
    var load1=this.loadCtrl.create({
      content:"Signing you up..."
    })
    load1.present()

    var vm=this

      var confirmationResult;
      var navCtrl=this.navCtrl
      vm.fbs.createUser(vm.creds,vm.creds.password).then(function(res){
        load1.dismiss()

        navCtrl.push(SignupPage,{"num":vm.creds.digits})
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



  }
}
