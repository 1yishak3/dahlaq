import { Component } from '@angular/core';
import { NavController, ToastController, NavParams,LoadingController} from 'ionic-angular';

import { MainPage } from '../../pages/pages';

import { User } from '../../providers/user';

import { TranslateService } from '@ngx-translate/core';

import {Network} from '@ionic-native/network'
import { FirebaseService } from '../../providers/firebase'


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'

})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { code: string } = {
    code:""
  };
  once: number = 0;
  // Our translated text strings
  private loginErrorString: string;
  fbs:  any
  vid: any
  connected:boolean
  show:any=true
  phone:any
  constructor(public loadCtrl: LoadingController,
    public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public fbss: FirebaseService,
    public nvp: NavParams,
    public nw:Network) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
    this.fbs=fbss
    this.vid = this.nvp.get("vid")
    this.phone= this.nvp.get("num")
    var vm=this
    this.nw=new Network
    var disc=nw.onDisconnect().subscribe(()=>{
      vm.connected=false
      console.log("Not connected")
    })
    var conc=nw.onConnect().subscribe(()=>{
      vm.show=true
      vm.connected=true
      console.log("connected")
      setTimeout(function(){
        vm.show=false
        console.log("closing curtains")
      },5000)
    })
  }

  // Attempt to login in through our User service
  cv(str:string){
    if(str!=""&&str){
      return true
    }else{
      return false
    }
  }
  doLogin() {
  //  var cCode=this.nvp.get("confirm")
    //this.navCtrl.push(MainPage);
    var load=this.loadCtrl.create({
      content:"Logging you in..."
    })
    load.present()
    var vm=this
    if(this.cv(this.account.code)){
      var credential = this.fbss.auther().PhoneAuthProvider.credential(this.vid,this.account.code)
      this.fbss.getAuth().signInWithCredential(credential).then((res)=>{
        if(vm.fbss.currentUser().displayName===""){
          load.dismiss()
          let toast = this.toastCtrl.create({
            message: "It looks like you don't have an account with us yet, please signup for an account to use Dahlaq",
            duration: 3333,
            position: 'top'
          });
          toast.present();
          vm.fbss.currentUser().delete()
          this.navCtrl.pop()

        }else{
          console.log("Login Successful")
          load.dismiss()
          let toast = this.toastCtrl.create({
            message: "Welcome back! See what's new and catch up with friends!",
            duration: 2017,
            position: 'top'
          });
          toast.present();
          this.navCtrl.push(MainPage);
        }
      }).catch((err)=>{
        //this.navCtrl.push(MainPage);
        console.log("Error with the confirmation code", err)
        load.dismiss()
        let toast = this.toastCtrl.create({
          message: "Login failed. Please make sure you enter the right SMS code.",
          duration: 2017,
          position: 'top'
        });
        toast.present();
        this.navCtrl.pop()
      })
    }else{
      load.dismiss()
      let toast = this.toastCtrl.create({
        message: "Please make sure you enter the right SMS code.",
        duration: 2017,
        position: 'top'
      });
      toast.present();
    }
  }
}
