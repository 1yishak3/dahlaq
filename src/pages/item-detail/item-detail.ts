import { Component,NgZone,OnInit } from '@angular/core';
import { NavController, NavParams,LoadingController,ModalController } from 'ionic-angular';

import { Items } from '../../providers/providers';
import { SettingsPage } from '../settings/settings'
import { FirebaseService } from '../../providers/firebase'
import { Post } from '../../models/post'
import { Uzer } from '../../models/uzer'
import { StreamingMedia } from '@ionic-native/streaming-media'
import * as _ from 'lodash'
import {ChatPage} from '../chat-detail/chat-detail'
import { Network } from '@ionic-native/network'
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  zone:NgZone
  uid: any;
  profile: any
//  isUser:boolean
  userPosts:Array<any>=[]
  arrayStopped=1
  j:Number
  newList:Array<any>=[]
  props:any
  postz:any={}
  ready:boolean
  check:any
  dud:any=[]
  connected:boolean
  show:any=true
  showEverything:boolean=false

  constructor(public mc:ModalController,public lc:LoadingController,public nw:Network,public sm:StreamingMedia,public fbs:FirebaseService,public navCtrl: NavController, public navParams: NavParams, public items: Items) {

    var vm=this
    var disc=nw.onDisconnect().subscribe(()=>{
      vm.connected=false
    })
    var conc=nw.onConnect().subscribe(()=>{
      vm.show=true
      vm.connected=true
      setTimeout(function(){
        vm.show=false
      },5000)
    })



    //this.props=Object.keys(this.profile.properties)

  }
  getProfile(){
    var l= this.lc.create({content:"Loading Profile..."})
    l.present()
    return new Promise((resolve,reject)=>{
      this.fbs.getDatabase("/users/"+this.uid,false).then((res)=>{
          var f=new Uzer()
          for(let i in res){
            f[i]=res[i]
          }
          l.dismiss()
          resolve(f)
        //console.log(this.profile)
      }).catch((err)=>{
        l.dismiss()
        reject("ugh")
        console.log("Error is, ",err)
      })
    })

  }
  ngOnInit(){
    // var vm=this
    // var cr=this.lc.create({
    //   content:"Loading profile..."
    // })
    // cr.present()
    // vm.fbs.getDatabase("/users/"+this.uid,false).then((res:any)=>{
    //   console.log("this is profile ",res)
    //   vm.zone.run(()=>{
    //     for(let i in res){
    //       vm.profile[i]=res[i]
    //     }
    //     vm.props=res.properties
    //     console.log("Does this even succeed? Cause I can use ngZone if it does",vm.props)
    //     console.log(res.basic)
    //     vm.showEverything=true
    //     cr.dismiss()
    //   })
    // }).catch(function(err){
    //   console.log("Err at profile getting, ",err)
    //   cr.dismiss()
    // })
  }
  ionViewWillEnter(){
    this.uid = this.navParams.get('person') || this.fbs.currentUser().uid;
    this.check=this.fbs.currentUser().uid===this.uid;
    // var vm=this
    // var cr=this.lc.create({
    //   content:"Loading profile..."
    // })
    // cr.present()
    // vm.fbs.getDatabase("/users/"+this.uid,false).then(function(res:any){
    //   for(let i in res){
    //     vm.profile[i]=res[i]
    //   }
    //   vm.props=res.properties
    //   console.log("Does this even succeed? Cause I can use ngZone if it does",vm.props)
    //   console.log(res.basic)
    //   vm.showEverything=true
    //   cr.dismiss()
    // }).catch(function(err){
    //   console.log("Err at profile getting, ",err)
    //   cr.dismiss()
    // })
    this.getProfile().then((res)=>{
      if(!_.isEqual(this.profile,res)){
        this.profile=res
      }
    })
    this.getNewstuff()
  }
  getNewstuff(){
    //this.ready=false
    var vm=this
    return new Promise(function(resolve,reject){

      //if disconnected take most recent cached posts and show them
      //if connected-
      vm.arrayStopped=1 //and then go with the below procedure
      vm.newList=[]
      console.log(vm.uid)
      vm.fbs.getDatabase("/users/"+vm.uid+"/userPosts",true).then(function(snap){
        console.log(snap)

        console.log("this is the snap from userPosts: ",snap)
        //console.log(vm.profile.userPosts)
      //  var gool=false
        for (let k in snap){
          var item=snap[k]
          if(vm.userPosts.length!==0&&snap[k]!==undefined&&snap[k]!==null){
            if(vm.postz[item]===undefined){
              vm.newList.unshift(item)
              vm.postz[item]=true
            }
            // if(item===vm.userPosts[0].postId){
            //   gool=true
            // }
          }else if(vm.userPosts.length===0&&snap[k]!=undefined&&snap[k]!=null){
            vm.newList.unshift(item)
            vm.postz[item]=true
          }
        }
        console.log("this is the new list:",vm.newList)
        //var j = vm.profile.userPosts.length-this.array
        //vm.newList.reverse()

        if(vm.newList.length!==0){
          console.log("in the if loop of userposts")
          for(let i in vm.newList){
            console.log("are you in the for loop?", vm.dud)
            vm.fbs.getDatabase("/posts/"+vm.newList[i],true).then(function(res){
              var post=new Post(vm.fbs,vm.navCtrl,vm.newList[i],true)
              for(let i in res){
                post[i]=res[i]
              }
              console.log("vm.dud")
              vm.dud.push(post)
              if(Number(i)===14||Number(i)===vm.newList.length-1){
                vm.arrayStopped=Number(i)+1
                vm.dud.sort(function(a,b){
                  return b.time-a.time
                })
              }
              console.log(post)
            }).catch(function(err){
              console.log("couldn't get post,",err)
            })
            if(Number(i)===14||Number(i)===vm.newList.length-1){
              console.log("here perhaps??")
              console.log("dud",vm.dud)
              vm.userPosts=vm.dud
              break
            }
          }
        }
        vm.ready=true
        console.log(vm.userPosts)
        resolve("Got all posts")
      }).catch(function(err){
        console.log("Error getting profile ",err)
        reject(err)
      })
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

  pullToAddMore(e){
    var vm=this
    var j=vm.arrayStopped
    if(j<vm.newList.length){
      for(let i in vm.newList){
        var k =j+Number(i)
        console.log(i,k)
        vm.fbs.getDatabase("/posts/"+vm.newList[k],false).then(function(res){
          var post = new Post(vm.fbs,vm.navCtrl,vm.newList[k],true)
          for(let i in res){
            post[i]=res[i]
          }
          vm.userPosts.push(post)
          console.log(post)
          //vm.array=vm.array+1
        }).catch(function(err){
          console.log("couldn't get post,",err)
        })
        if(Number(i)===14||Number(i)===vm.newList.length-1){
          vm.arrayStopped=k-1
          e.complete()
          break
        }
      }
    }
    e.complete()
  }
  openSettings(e){
    if(this.uid===this.fbs.currentUser().uid){
      this.navCtrl.push(SettingsPage, {
        user: this.profile

      })
    }
  }
  openChat(e){
    var vm=this
    this.fbs.getDatabase("/users/"+this.fbs.currentUser().uid+"/people",true).then((res)=>{
      var chat=""
      console.log("in 1")
      if(res){
        for(let i in res){
          if(res[i].indexOf(vm.uid)!==-1){
            chat=res[i]
            break
          }
        }
      }
      console.log("in 2")
      if(chat!==""){
        vm.fbs.getDatabase("/chats/"+chat+"/summary",true).then((res)=>{
          var addModal = this.mc.create(ChatPage,{person:res,fbs:this.fbs});
          addModal.onDidDismiss(item => {
            //maybe set it in storage  for safe keeping?
            //the refresh chat thing?
          })
          addModal.present();

        })
      }else if(chat===""){
        console.log("in 3")
        var be:any=vm.profile
        console.log("be is set", be.basic)
        var addModal = this.mc.create(ChatPage,{person:be.basic,fbs:this.fbs});
        console.log("this happens??")
        addModal.onDidDismiss(item => {
          //maybe set it in storage  for safe keeping?
          //the refresh chat thing?
        })
        addModal.present();
      }
    })
  }

}
