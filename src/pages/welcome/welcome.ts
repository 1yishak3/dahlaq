import { Component, AfterViewInit} from '@angular/core';
import { NavController,Events,ToastController, LoadingController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { FirebaseService } from '../../providers/firebase'
import { User } from '../../providers/user'
import{ MainPage } from '../pages'

import {InAppBrowser} from '@ionic-native/in-app-browser'
import {Storage} from '@ionic/storage'
declare var require: any;
const localforage: LocalForage = require("localforage");
localforage.config({
  name:"Dahlaq"
});
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
  loaderu:boolean=false
  constructor(public sg:Storage,public bros:InAppBrowser,public c:User,public loadCtrl:LoadingController,public tc:ToastController,public events:Events,public navCtrl: NavController, public fire : FirebaseService) {
    this.fbs=fire
    this.ev=events
   }

   ngAfterViewInit(){
   }

  login() {
    return new Promise((resolve,reject)=>{
      var navCtrl=this.navCtrl
      var vm=this
      //navCtrl.push(LoginPage,{'confirm':"what?"})
      var load1=this.loadCtrl.create({
        content:"Logging you in..."
      })

      load1.present()
      this.loaderu=true
      console.log(this.creds.digits)
      vm.fbs.login(this.creds.digits).then((res)=>{

        load1.dismiss()
        this.loaderu=false
        this.navCtrl.push(LoginPage,{num:this.creds.digits,vid:res})
        resolve()

      }).catch(function(err){
      //  vm.fbs.currentUser().delete()
        load1.dismiss()
        this.loaderu=false
        console.log("Error loging in. Cause: ",err)
        var toast=vm.tc.create({
          message: "Couldn't log you in. Make sure you are connected to the internet, and that you have entered a valid phone number and password combo.",
          duration: 3000,
          position: 'top'
        })
        toast.present()
        reject()
      })
    })
  }

  signup() {
    return new Promise((resolve,reject)=>{
      var navCtrl=this.navCtrl
      var vm=this
      //navCtrl.push(LoginPage,{'confirm':"what?"})
      var load1=this.loadCtrl.create({
        content:"Loggin you in..."
      })

      load1.present()
      this.loaderu=true

      vm.fbs.createUser(this.creds.digits).then((res)=>{

        load1.dismiss()
        this.loaderu=false
        this.navCtrl.push(SignupPage,{pass:vm.creds.password,num:vm.creds.digits,vid:res})
        resolve()

      }).catch((err)=>{
      //  vm.fbs.currentUser().delete()
        load1.dismiss()
        this.loaderu=false
        console.log("Error loging in. Cause: ",err)
        var toast=vm.tc.create({
          message: "Couldn't log you in. Make sure you are connected to the internet, and that you have entered a valid phone number and password combo.",
          duration: 5000,
          position: 'top'
        })
        toast.present()
        reject()
      })


    })



  }
}
