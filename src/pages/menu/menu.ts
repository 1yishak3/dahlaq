import { Component, ViewChild } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';


import {InAppBrowser} from '@ionic-native/in-app-browser'


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  // A reference to the ion-nav in our component
  @ViewChild(Nav) nav: Nav;

//  rootPage: any = ContentPage;

  pages: Array<{ title: string, component: any }>;

  constructor(public navCtrl: NavController, public bros:InAppBrowser) {
    // used for an example of ngFor and navigation

  }

  // ionViewDidLoad() {
  //   console.log('Hello MenuPage Page');
  // }
  //
  // openPage(page) {
  //   // Reset the content nav to have just this page
  //   // we wouldn't want the back button to show in this scenario
  //   this.nav.setRoot(page.component);
  // }
  goLegal(){
    var url="https://licenses.yitzhaqm.com"
    var br= this.bros.create(url,"_blank",{location:'no',clearcache:'yes',clearsessioncache:'yes'})

  }
}
