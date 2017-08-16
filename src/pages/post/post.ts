import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { StreamingMedia } from '@ionic-native/streaming-media'
@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {
  post: any = {}
  constructor(public sm:StreamingMedia,public navCtrl: NavController, public navParam: NavParams ) {
    this.post = navParam.get('post')
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
