import { Component } from '@angular/core';
import { NavController, ToastController, NavParams,LoadingController } from 'ionic-angular';

import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';

import { TranslateService } from '@ngx-translate/core';
import { FirebaseService } from '../../providers/firebase'
import { Uzer } from '../../models/uzer'

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  person:Uzer
  account: { username: string, password: string, code: string } = {
    username: '',
    password: '',
    code: ''
  };

  // Our translated text strings
  once:number=0;
  private signupErrorString: string;
  confirmationResult: any
  constructor(public fbs:FirebaseService,
    public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public nvp : NavParams,
  public loadCtrl:LoadingController) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
    this.confirmationResult = this.nvp.get("confirm")
  }
  doSignup() {
    this.person=new Uzer()
    this.once=this.once+1
    var vm=this.fbs
    var vm1=this
    var say="Creating your account..."
    var load1=this.loadCtrl.create({
      content:say
    })
    // Attempt to login in through our User service
    console.log(this.confirmationResult)
    if (this.once<2){
      console.log("I got here...then something happened")
      this.confirmationResult.confirm(this.account.code).then((resp) => {
        load1.present()

        this.person.properties.digits=vm.currentUser().phoneNumber
        console.log(this.person.properties.digits)
        this.person.basic.uid=vm.currentUser().uid
        console.log(this.person.basic.uid)
        vm.currentUser().updateProfile({
          displayName: this.account.username,
          photoURL:null
        }).then(function() {
          // Update successful.
          console.log("displayName updated to: ",vm1.account.username)
        }).catch(function(error) {
          // An error happened.
          console.log("Unable to update user name for auth()",error)
        });

        console.log(vm.currentUser().displayName)
        this.person.basic.username=this.account.username
        console.log("I'm in")
        vm.setDatabase("/users/"+vm.currentUser().uid,this.person,true).then(function(res){
          say="creating correspondence"
          vm.setDatabase("/ref/"+vm.currentUser().displayName,vm.currentUser().uid,true)
          vm1.navCtrl.push(MainPage);
          load1.dismiss()
          console.log("Login Succesful!")
        }).catch(function(err){
          console.log("User Creation ERROR in Database",err)
        })
        vm.setList("/adminsLists/users",vm.currentUser().uid).then(function(res){
          console.log("Successfully added to admin's list")
        }).catch(function(err){
          console.log("Sorry, couldn't add you to the list", err)
        })

      }).catch( (err) => {

        //this.navCtrl.push(MainPage); // TODO: Remove this when you add your signup endpoint

        // Unable to sign up
        console.log("I'm not in: ",err)
        let toast = this.toastCtrl.create({
          message: "Yooo How is this even possible?",
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
    }
  }
}
