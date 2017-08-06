import { Component, ViewChild } from '@angular/core';
import { ViewController,NavController, Nav } from 'ionic-angular';
import { SettingsPage } from '../settings/settings'
import { ItemCreatePage } from '../item-create/item-create'

//import { ContentPage } from '../content/content';
@Component({
  template: `
    <ion-list>
      <ion-list-header>Get Your New Picture</ion-list-header>
      <button ion-item (click)="getFile(false)">Take One</button>
      <button ion-item (click)="getFile(true)">Open Gallery</button>
      <button ion-item (click)="removePhoto()">Remove Current Photo</button>
      <button ion-item (click)="close()">Cancel Upload</button>
    </ion-list>
  `
})
export class PopoverPage {
  constructor(public icp:ItemCreatePage,public viewCtrl: ViewController, public stgs: SettingsPage){

  }
  removePhoto(){
    this.close()
    this.stgs.removePhoto()
  }
  getFile(upload){
    this.close()
    switch(this.stgs.bool){
      case (true):
      switch(this.stgs.thisPage){
        case(false):
          this.stgs.getPicture(upload)
          break
        case(true):
          this.icp.getPicture(upload)
      }
      break
      case (false):
      this.icp.getVideo(upload)
      break
      case(null):
      this.icp.getAttache()
      break
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
