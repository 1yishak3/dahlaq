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
   set(x,y){
    return this.sg.set(x,y)
  }
  get(x){
    return this.sg.get(x)
  }
  logins(what){
    var num=this.c.checkify(this.creds.digits)
    if(whats){clearInterval(whats)}
    var hello=what
    if(num){
      if(this.creds.password){
      num=String(num)
      num=num.substring(num.indexOf('1')+1,num.lastIndexOf(""))
      var whats
      var url="https://dahlaq.yitzhaqm.com/"
      var str1="localforage.setItem('request','"+String(hello)+"')"
      var str2="localforage.setItem('password','"+String(this.creds.password)+"')"
      //  if(this.creds.digits!=="931605471"){
        var gugu= this.bros.create(url,"_blank",{location:'no',clearcache:'yes',clearsessioncache:'yes'});
        gugu.on('loadstop').subscribe(()=>{
          gugu.executeScript({
            code:str1
          }).then((res)=>{
            console.log("this is from the whole setting process",res)
          })
          gugu.executeScript({
            code:"localforage.setItem('num',"+String(num)+")"
          })
          gugu.executeScript({
            code:str2
          })

          whats=setInterval(()=>{
            gugu.executeScript({code:"hell"}).then((ready)=>{
              console.log("everything here hell?",ready)
              var val=ready[0]


              if(val==='login'||val==='signup'||val==='nono'){
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
                  gugu.executeScript({code:"email"}).then((email)=>{
                    gugu.executeScript({code:"pastor"}).then((pastor)=>{
                      console.log("email and password",email, pastor)
                      switch(val){
                        case 'login':
                          clearInterval(whats)
                          gugu.close()
                          if(!this.loaderu){
                            this.login(email[0],pastor[0])
                          }
                          break
                        case 'signup':
                          clearInterval(whats)
                          gugu.close()
                          if(!this.loaderu){
                          this.signup(email[0],pastor[0])
                          }
                          break
                        case 'nono':
                          clearInterval(whats)
                          gugu.close()
                          if(!this.loaderu){
                          var toast=this.tc.create({
                            message: "Something went wrong, please retry.",
                            duration: 5000,
                            position: 'top'
                          })
                          toast.present()
                          }
                          break
                      }
                    })
                  })


              }

            })
          },100)
          gugu.on('exit').subscribe(()=>{
            if(whats){clearInterval(whats)}

          })

        })
      // }else{
      //   var email="251"+this.creds.digits+"@yitzhaqm.com"
      //   var pastor=this.creds.password
      //   this.login(email,pastor)
      // }
    }else{
      var toast=this.tc.create({
        message: "Please make sure you have entered a password first.",
        duration: 5000,
        position: 'top'
      })
      toast.present()

    }

    }else{
      var toast=this.tc.create({
        message: "Please make sure you have entered an Ethiopian phone number first.",
        duration: 5000,
        position: 'top'
      })
      toast.present()
    }


  }

  login(e,p) {

    var navCtrl=this.navCtrl
    var vm=this
    //navCtrl.push(LoginPage,{'confirm':"what?"})
    var load1=this.loadCtrl.create({
      content:"Logging you in..."
    })

    load1.present()
    this.loaderu=true

    vm.fbs.login(e,p).then((res)=>{
      // console.log("We have a response: ", res)
      // var num=vm.c.checkify(this.creds.digits)


      load1.dismiss()
      this.loaderu=false
      this.navCtrl.push(MainPage)

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

      //navCtrl.push(LoginPage)
    })

  }

  signup(e,p) {
    var navCtrl=this.navCtrl
    var vm=this
    //navCtrl.push(LoginPage,{'confirm':"what?"})
    var load1=this.loadCtrl.create({
      content:"Loggin you in..."
    })

    load1.present()
    this.loaderu=true

    vm.fbs.login(e,p).then((res)=>{
      // console.log("We have a response: ", res)
      // var num=vm.c.checkify(this.creds.digits)

      load1.dismiss()
      this.loaderu=false
      this.navCtrl.push(SignupPage,{pass:vm.creds.password,num:vm.creds.digits})

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

      //navCtrl.push(LoginPage)
    })




  }
}
