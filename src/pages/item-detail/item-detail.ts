import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Items } from '../../providers/providers';
import { SettingsPage } from '../settings/settings'
import { FirebaseService } from '../../providers/firebase'

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  uid: any;
  profile: any
  isUser:boolean
  constructor(public fbs:FirebaseService,public navCtrl: NavController, navParams: NavParams, items: Items) {
    this.uid = navParams.get('item') || fbs.currentUser().uid;
    this.fbs.userCheck.subscribe((boolean)=>{
      this.isUser==boolean
    })
    fbs.getDatabase("users/"+this.uid,false,this.uid).then(function(snap){
      this.profile=snap
      console.log(snap)
    })
  }

  openSettings(e){
    if(this.uid===this.fbs.currentUser().uid){
      this.navCtrl.push(SettingsPage, {
        user: this.profile

      })
    }
  }

}
