import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { StreamingMedia } from '@ionic-native/streaming-media'
import {Network} from '@ionic-native/network'
@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {
  post: any
  connected:boolean
  constructor(public nw:Network,public sm:StreamingMedia,public navCtrl: NavController, public navParam: NavParams ) {
    this.post = navParam.get('post')
    var vm=this
    var disc=nw.onDisconnect().subscribe(()=>{
      vm.connected=false
    })
    var conc=nw.onConnect().subscribe(()=>{
      vm.connected=false
    })
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
