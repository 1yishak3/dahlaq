import { Component, ViewChild } from '@angular/core';
import { ViewController,NavController, Nav } from 'ionic-angular';
import { SettingsPage } from '../settings/settings'

//import { ContentPage } from '../content/content';
@Component({
  template: `
    <ion-list>
      <ion-list-header>Get Your New Picture</ion-list-header>
      <button ion-item (click)="getPicture(false)">Take One</button>
      <button ion-item (click)="getPicture(true)">Open Gallery</button>
      <button ion-item (click)="removePhoto()">Remove Current Photo</button>
      <button ion-item (click)="close()">Cancel Upload</button>
    </ion-list>
  `
})
export class PopoverPage {
  constructor(public viewCtrl: ViewController, public stgs: SettingsPage){

  }
  removePhoto(){
    this.stgs.removePhoto()
  }
  getPicture(upload){
    this.stgs.getPicture(upload)
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
