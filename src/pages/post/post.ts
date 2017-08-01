import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {
  post: any = {}
  constructor(public navCtrl: NavController, public navParam: NavParams ) {
    this.post = navParam.get('post')
  }

}
