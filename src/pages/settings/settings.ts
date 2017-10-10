import { Component , ViewChild} from '@angular/core';
//import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';

//import { Settings } from '../../providers/settings';

import { TranslateService } from '@ngx-translate/core';
import {FirebaseService } from '../../providers/firebase'
import * as _ from 'lodash'
import { Camera } from '../../providers/camera'
//import { PopoverPage } from '../popovers/propop'
import { Network } from '@ionic-native/network'
import { Ng2ImgToolsService} from 'ng2-img-tools'
import {Storage} from '@ionic/storage'
import {WelcomePage} from '../welcome/welcome'
import {MenuPage} from '../menu/menu'
import {Device} from '@ionic-native/device'
import {File} from '@ionic-native/file'
import {FileChooser} from '@ionic-native/file-chooser'
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
  saved:boolean=false
  bool:any
  thisPage:boolean=false
  props:any
  connected:boolean
  complete=false
  uploading=false
  progress:number=0
  currentFile:string=""
  currentPic:any
  profilePics:any=[]
  person:any
  constructor( public fc:FileChooser,
    public fl:File,
    public dv:Device,
    public sg:Storage,
    public ir:Ng2ImgToolsService,
    public lc:LoadingController,
    public nw:Network,
    public popCtrl:AlertController,
    public camera:Camera,
    public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    public fbs:FirebaseService)
  {

    this.profile= navParams.get('user')
    this.profilec=(this.profile)
    this.currentPic=this.profilec.basic.currentPic
    this.props=Object.keys(this.profilec.properties)
    var vm=this
    var disc=nw.onDisconnect().subscribe(()=>{
      vm.connected=false
    })
    var conc=nw.onConnect().subscribe(()=>{
      vm.connected=true
    })
  }
  // logout(){
  //   this.fbs.getAuth().signOut().then(()=>{
  //     this.sg.set("log",false)
  //     this.navCtrl.pop()
  //     this.tabs.select(0)
  //     this.navCtrl.setRoot(WelcomePage)
  //     this.navCtrl.popToRoot()
  //   })
  // }
  goAbout(){
    this.navCtrl.push(MenuPage)
  }
  ionViewWillEnter(){
    // this.profile= this.navParams.get('user')
    // this.profilec = this.profile
  }
  removePhoto(){
    this.profilec.basic.currentPic=""
  }
  showChoices(e){
    let pop = this.popCtrl.create({
      title:"Choose Method",
      buttons:[{
        text:"Open Camera",
        handler:dat=>{
        //  pop.dismiss()
          this.getPicture(false)
        }
      },{
        text:"Open Files",

        handler:dat=>{
          //pop.dismiss()
          this.getPicture(true)
        }
      },{
        text:"Cancel",
        role:"cancel",
        handler: dar=>{
      //    pop.dismiss()
          console.log('cancelled')}
      }]
    })
    pop.present()
  }
  generateFileName(typ){
    var type=typ.name
    var name = this.fbs.currentUser().uid+"_"+Date.now()+type.substring(type.lastIndexOf("."),type.lastIndexOf(""))
    console.log(name)
    return name
  }
  onChangeInput(e){
    //display a uploading spinner fot the user to wait until it finishes
    var vm=this
    this.complete=false
    this.uploading=true
    var file=e.target.files[0]
    var pic= this.generateFileName(file)
    vm.currentFile=file.name
    var k=[]
    k.push(file)
    vm.ir.resize(k,450,450).subscribe(res=>{

      file=res[0]||res
      var where="/images/"

      var url=vm.fbs.currentUser().uid+where+pic
    //  var pst = this.post
      console.log("this is file",file)
      var task= vm.fbs.setStorage(url,file)
      var sub=task.on('state_changed',function(snap:any){
        console.log(snap.bytesTransferred)
        console.log(snap.totalBytes)

        vm.progress=(Number(snap.bytesTransferred)/Number(snap.totalBytes))*100
        console.log(vm.progress)
        console.log("this is your snapshot, ",snap)

      },
      function(err){
          console.log("This is your error",err)
      })
      task.then((snap)=>{
        console.log(snap)
          vm.fbs.getStorage(url).then((res:any)=>{
            this.currentPic=res
            this.profilePics.push(res)
            vm.complete=true
            vm.uploading=false
          })
      })
    },err=>{
      console.log("errrrrrrror ",err)
    })

  }

  processFile(url,fil) {
    var vm = this.fbs
    var pst =  this.profilec
    this.complete=false
    this.uploading=true
    if(pst.properties.profilePics){
      for(let i in pst.properties.profilePics){
        this.profilePics.push(pst.properties.profilePics[i])
      }
    }



      vm.setStorage(url,fil,true).then((res)=>{
        vm.getStorage(url).then((res)=>{
          console.log(res)

            // pst.properties.profilePics.push(res)
            // pst.basic.currentPic=res
            this.currentPic=res
            this.profilePics.push(res)
            this.uploading=false
            this.complete=true

        }).catch(function(err){
          console.log("URL get error", err)
        })
      })

  }
  getPicture(upload) {
    this.thisPage=false
    var cam=this.camera
    var vm = this.fbs
    var vm1=this.generateFileName
    if(!upload){
      var fp=this.processFile
      this.camera.takePicture(1).then((data:any)=>{
        console.log("pic taken?")
        cam.getFile(data).then((file)=>{
          console.log("hello getfile")
          var pic = this.generateFileName(data)
          var url="/"+vm.currentUser().uid+"/images/"+pic
          this.processFile(url,file)
        }).catch(function(err){
          console.log(err)
        })
      }).catch(function(err){
        console.log(err)
      })
    }else{
      if(this.dv.platform.toLowerCase()==="android"){
        if(this.dv.version.substring(0,1)=='4'){
          this.fc.open().then((filePath)=>{

            var pathe="file://"+filePath.substring(7,filePath.lastIndexOf("/"))
            var subs=filePath.substring(filePath.lastIndexOf("/")+1,filePath.lastIndexOf(""))
            this.fl.readAsDataURL(pathe,subs).then((file)=>{
              var url="/"+vm.currentUser().uid+"/images/"+subs
              this.currentFile=subs
              this.processFile(url,file)
            })
          })
        }else{
          this.fileInput.nativeElement.click()
        }
      }else{
        this.fileInput.nativeElement.click()
      }
    }
  }
  saveAndGoToProfile(){
    var  g=this.lc.create({
      content:"Saving your profile..."
    })
    g.present()



    var prsn={}
    prsn["/users/"+this.fbs.currentUser().uid+"/basic"]=this.profilec.basic
    prsn["/users/"+this.fbs.currentUser().uid+"/properties"]=this.profilec.properties

    this.fbs.setDatabase("/users/"+this.fbs.currentUser().uid+"/basic/currentPic",this.currentPic,true).then((res)=>{
      this.fbs.setDatabase("/users/"+this.fbs.currentUser().uid+"/basic/bio",this.profilec.basic.bio,true).then((res)=>{
        this.fbs.setDatabase("/users/"+this.fbs.currentUser().uid+"/properties/sefer",this.profilec.properties.sefer,true).then((res)=>{
          this.fbs.setDatabase("/users/"+this.fbs.currentUser().uid+"/properties/fews",this.profilec.properties.fews,true).then((res)=>{
            this.fbs.setDatabase("/users/"+this.fbs.currentUser().uid+"/properties/relationshipStatus",this.profilec.properties.relationshipStatus,true).then((res)=>{
              this.fbs.setDatabase("/users/"+this.fbs.currentUser().uid+"/properties/interestedIn",this.profilec.properties.interestedIn,true).then((res)=>{
                this.fbs.setDatabase("/users/"+this.fbs.currentUser().uid+"/properties/education",this.profilec.properties.education,true).then((res)=>{
                  this.fbs.setDatabase("/users/"+this.fbs.currentUser().uid+"/properties/profilePics",this.profilePics,true)
                  console.log("profile successfully updated")
                  g.dismiss()
                  this.navCtrl.pop()
                })
              })
            })
          })
        })
      })

    }).catch(function(err){
      console.log("Sadly, your profile has not been updated", err)
      g.dismiss()

    })

  }
  exitToProfileWithoutSaving(){
    console.log("Not Saved")
    this.profilec=this.navParams.get('user')
    this.navCtrl.pop()
  }
  keepUpdatingOrSomething(){

  }
  ionViewWillLeave(){
    this.profilec=this.navParams.get('user')

  }
  ngOnChanges() {
    console.log('Ng All Changes');
  }
}
