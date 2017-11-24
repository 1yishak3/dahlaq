import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { StreamingMedia } from '@ionic-native/streaming-media'
import {Network} from '@ionic-native/network';
import { Settings } from './../../providers/settings';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {
  post: any
  connected:boolean
  selectedTheme: String
  constructor(public nw:Network,public sm:StreamingMedia,public navCtrl: NavController,  private storage: Storage, private settings: Settings, public navParam: NavParams ) {
    this.post = navParam.get('post')
    var vm=this
    var disc=nw.onDisconnect().subscribe(()=>{
      vm.connected=false
    })
    var conc=nw.onConnect().subscribe(()=>{
      vm.connected=false
    })
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    this.storage.get('theme').then((res) => {
      this.settings.setActiveTheme(res);
    });
  }
  playVideo(videoUrl){
    var options = {
    successCallback: function() {
      console.log("Video was closed without error.");
    },
    errorCallback: function(errMsg) {
      console.log("Error! " + errMsg);
    },
    orientation: 'portrait',
    shouldAutoClose: true,  // true(default)/false
    controls: true // true(default)/false. Used to hide controls on fullscreen
    };
    this.sm.playVideo(videoUrl, options);
  }

}
