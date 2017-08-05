import { Component , ViewChild} from '@angular/core';
//import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, PopoverController} from 'ionic-angular';

//import { Settings } from '../../providers/settings';

import { TranslateService } from '@ngx-translate/core';
import {FirebaseService } from '../../providers/firebase'
import * as _ from 'lodash'
import { Camera } from '../../providers/camera'
import { PopoverPage } from '../popovers/propop'
/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  // Our local settings object
  @ViewChild('fileInput') fileInput:any
  profile:any
  profilec:any

  constructor(public popCtrl:PopoverController,
    public camera:Camera,
    public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    public fbs:FirebaseService)
  {
    this.profile= navParams.get('user')
    this.profilec= _.cloneDeep(this.profile)
  }
  removePhoto(){
    this.profilec.currentPic=""
  }
  showChoices(e){
    let pop = this.popCtrl.create(PopoverPage)
    pop.present({
      ev:e
    })
  }
  generateFileName(typ){
    var type=typ.name
    var name = this.fbs.currentUser().uid+"_"+Date.now()+type.substring(type.lastIndexOf("."),type.lastIndexOf(""))
    console.log(name)
    return name
  }
  onChangeInput(e){
    //display a uploading spinner fot the user to wait until it finishes
    var file=e.target.files[0]
    var pic= this.generateFileName(file)
    var url=this.fbs.currentUser().uid+"/videos/"+pic
    var pst = this.profilec
    this.fbs.setStorage(url,file).then(function(res){
      this.fbs.getStorage(url).then(function(res){
        console.log(res)
        pst.profile.profilePics.push(res)
      }).catch(function(err){
        console.log("URL get error", err)
      })
    })
  }

  processFile(url,fil) {
    var vm = this.fbs
    var pst =  this.profilec
    fil.file(function(file){
      vm.setStorage(url,file).then(function(res){
        vm.getStorage(url).then(function(res){
          console.log(res)
          pst.properties.profilePics.push(res)
          pst.currentPic=pst.properties.profilePics[pst.properties.profilePics.length-1]
        }).catch(function(err){
          console.log("URL get error", err)
        })
      })
    },function(err){
      console.log(err)
    })
  }
  getPicture(upload) {
    var cam=this.camera
    var vm = this.fbs
    var vm1=this.generateFileName
    if(!upload){
      var fp=this.processFile
      this.camera.takePicture(1).then(function(data){

        cam.getFile(data[0].fullpath).then(function(file){
          var pic = vm1(file)
          var url=vm.currentUser().uid+"/images/"+pic
          fp(url,file)
        }).catch(function(err){

        })
      }).catch(function(err){

      })
    }else{
      this.fileInput._elementRef.nativeElement.click();
    }
  }
  saveAndGoToProfile(){
    if(this.profile!==this.profilec){
      this.fbs
    }
  }
  exitToProfileWithoutSaving(){

  }
  keepUpdatingOrSomething(){

  }
  ngOnChanges() {
    console.log('Ng All Changes');
  }
}
