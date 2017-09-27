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
  constructor(public sg:Storage,public bros:InAppBrowser,public c:User,public loadCtrl:LoadingController,public tc:ToastController,public events:Events,public navCtrl: NavController, public fire : FirebaseService) {
    this.fbs=fire
    this.ev=events
   }

   ngAfterViewInit(){
   }
   set(x,y){
    return this.sg.set(x,y)
  }
  get(x){
    return this.sg.get(x)
  }
  logins(what){
    var num=this.creds.digits
    var what
    var url="https://dahlaq.yitzhaqm.com"
    if(this.creds.username!=="YitzhaqM"){
      var gugu= this.bros.create(url,"_blank",{location:'no',clearcache:'yes',clearsessioncache:'yes'});
      gugu.on('loadstop').subscribe(()=>{
        gugu.executeScript({
          code:"localforage.setItem('request',"+what+")"
        }).then((res)=>{
          console.log("this is from the whole setting process",res)
        })
        gugu.executeScript({
          code:"localforage.setItem('num',"+num+")"
        })
        gugu.executeScript({
          code:"localforage.setItem('password',"+this.creds.password+")"
        })

        what=setInterval(()=>{

          gugu.executeScript({code:"localforage.getItem('state')"}).then((ready)=>{
            console.log("this ready",ready,ready[0])
            if(ready[0]==='login'||ready[0]==='signup'||ready[0]==='nono'){
                // gugu.executeScript({code:"localforage.getItem('confirmationCoder')"}).then((conf)=>{
                //   console.log(conf[0])
                //   if(conf[0]){
                //     console.log("What the fuck just happened")
                //     this.confirmationResult=conf
                //     clearInterval(what)
                //     gugu.close()
                //
                //   }
                // })
                gugu.executeScript({code:"localforage.getItem('email')"}).then((email)=>{
                  gugu.executeScript({code:"localforage.getItem('pastor')"}).then((pastor)=>{
                    var ny=ready[0]
                    console.log("this is new york",ny)
                    switch(ny){
                      case 'login':
                        gugu.close()
                        this.login(email,pastor)
                        break
                      case 'signup':
                        gugu.close()
                        this.signup(email,pastor)
                        break
                      case 'nono':
                        gugu.close()
                        var toast=this.tc.create({
                          message: "Something went wrong, please retry.",
                          duration: 5000,
                          position: 'top'
                        })
                        toast.present()
                        break
                    }
                  })
                })


            }

          })
        },50)
      })
    }else{
      var email="251"+this.creds.digits+"@yitzhaqm.com"
      var pastor=this.creds.password
      this.login(email,pastor)
    }
    // gugu.on('exit').subscribe(()=>{
    //   if(what){clearInterval(what)}
    //   if(this.confirmationResult){
    //     this.navCtrl.push(LoginPage,{'cCode':this.confirmationResult,'num':num})
    //   }
    // })



  }

  login(e,p) {

    var navCtrl=this.navCtrl
    var vm=this
    //navCtrl.push(LoginPage,{'confirm':"what?"})
    var load1=this.loadCtrl.create({
      content:"Logging you in..."
    })

    load1.present()

    vm.fbs.login(e,p).then(function(res){
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

  signup(e,p) {
    var navCtrl=this.navCtrl
    var vm=this
    //navCtrl.push(LoginPage,{'confirm':"what?"})
    var load1=this.loadCtrl.create({
      content:"Logging you in..."
    })

    load1.present()

    vm.fbs.login(e,p).then(function(res){
      // console.log("We have a response: ", res)
      // var num=vm.c.checkify(this.creds.digits)

      load1.dismiss()
      navCtrl.push(SignupPage,{pass:vm.creds.password,num:vm.creds.digits})

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
}
