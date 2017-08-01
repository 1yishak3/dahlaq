import { Component } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';

import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';

import { TranslateService } from '@ngx-translate/core';
import { FirebaseService } from '../../providers/firebase'


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { username: string, password: string, code: string } = {
    username: '',
    password: '',
    code: ''
  };

  // Our translated text strings
  once:number=0;
  private signupErrorString: string;
  confirmationResult: any
  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public nvp : NavParams) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
    this.confirmationResult = this.nvp.get("confirm")
  }
  doSignup() {
    this.once=this.once+1
    // Attempt to login in through our User service
    console.log(this.confirmationResult)
    if (this.once<2){
      console.log("I got here...then something happened")
      this.confirmationResult.confirm(this.account.code).then((resp) => {
        this.navCtrl.push(MainPage);
        console.log("Login Succesful!")
      }).catch( (err) => {

        //this.navCtrl.push(MainPage); // TODO: Remove this when you add your signup endpoint

        // Unable to sign up
        let toast = this.toastCtrl.create({
          message: this.signupErrorString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
    }
  }
}
