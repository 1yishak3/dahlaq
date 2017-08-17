import { Component } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';

import { MainPage } from '../../pages/pages';

import { User } from '../../providers/user';

import { TranslateService } from '@ngx-translate/core';
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
  cCode: any
  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public fbss: FirebaseService,
    public nvp: NavParams) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
    this.fbs=fbss
    this.cCode = this.nvp.get("confirm")
  }

  // Attempt to login in through our User service
  doLogin() {
  //  var cCode=this.nvp.get("confirm")
    //this.navCtrl.push(MainPage);
    var vm=this
    this.once=this.once+1
    if (this.once<2){
      //this.navCtrl.push(MainPage);
      this.cCode.confirm(this.account.code).then((res)=>{
        if(vm.fbss.currentUser().displayName===""){
            vm.fbss.currentUser().delete()
            let toast = this.toastCtrl.create({
              message: "It looks like don't have an account with us yet, please signup on this page to enjoy Dahlaq",
              duration: 3333,
              position: 'top'
            });
            toast.present();
            this.navCtrl.pop()

        }else{
          console.log("Login Successful")
          this.navCtrl.push(MainPage);
        }
      }).catch((err)=>{
        //this.navCtrl.push(MainPage);
        console.log("Error with the confirmation code", err)
        let toast = this.toastCtrl.create({
          message: "You tried signing in with the wrong code, please try again.",
          duration: 3333,
          position: 'top'
        });
        toast.present();
        this.navCtrl.pop()
      })
    }
  }
}
