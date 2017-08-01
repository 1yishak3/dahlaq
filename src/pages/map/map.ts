import { Component, ViewChild } from '@angular/core';
import { NavController, Platform , ModalController} from 'ionic-angular';
import { ChatPage } from '../chat-detail/chat-detail'
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition } from '@ionic-native/google-maps';

declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

//  @ViewChild('map') map;
  search:boolean = false
  items:any[]=[
    {
      "name": "Burt Bear",
      "profilePic": "assets/img/speakers/bear.jpg",
      "about": "Burt is a Bear."
    },
    {
      "name": "Charlie Cheetah",
      "profilePic": "assets/img/speakers/cheetah.jpg",
      "about": "Charlie is a Cheetah."
    },
    {
      "name": "Donald Duck",
      "profilePic": "assets/img/speakers/duck.jpg",
      "about": "Donald is a Duck."
    },
    {
      "name": "Eva Eagle",
      "profilePic": "assets/img/speakers/eagle.jpg",
      "about": "Eva is an Eagle."
    },
    {
      "name": "Ellie Elephant",
      "profilePic": "assets/img/speakers/elephant.jpg",
      "about": "Ellie is an Elephant."
    },
    {
      "name": "Molly Mouse",
      "profilePic": "assets/img/speakers/mouse.jpg",
      "about": "Molly is a Mouse."
    },
    {
      "name": "Paul Puppy",
      "profilePic": "assets/img/speakers/puppy.jpg",
      "about": "Paul is a Puppy."
    }
  ];
  constructor(private googleMaps: GoogleMaps, public navCtrl: NavController, public platform: Platform, public modalCtrl: ModalController) { }
  /*openItem(number: string) {
    this.navCtrl.push(ChatPage, {
      chatWith: number
    });
  }*/
  openItem(data) {
    let addModal = this.modalCtrl.create(ChatPage);
    addModal.onDidDismiss(item => {
    })
    addModal.present();
  }
  searchOn(){
    this.search=!this.search
  }


}
