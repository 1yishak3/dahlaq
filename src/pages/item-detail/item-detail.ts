import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Items } from '../../providers/providers';
import { SettingsPage } from '../settings/settings'
import { FirebaseService } from '../../providers/firebase'
import { Post } from '../../models/post'
import { Uzer } from '../../models/uzer'
import { StreamingMedia } from '@ionic-native/streaming-media'
import * as _ from 'lodash'
import {ChatPage} from '../chat-detail/chat-detail'
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  uid: any;
  profile: Uzer
//  isUser:boolean
  userPosts=[]
  arrayStopped=1
  j:Number
  newList:Array<any>
  props:any
  postz:any={}
  ready:boolean
  check:any
  dud:any
  constructor(public sm:StreamingMedia,public fbs:FirebaseService,public navCtrl: NavController, navParams: NavParams, items: Items) {
    this.uid = navParams.get('person') || fbs.currentUser().uid;
    this.check=fbs.currentUser().uid===this.uid;
    this.profile=new Uzer()
    this.props=Object.keys(this.profile.properties)

  }
  ionViewWillEnter(){
    this.getNewstuff()
  }
  getNewstuff(){
    //this.ready=false
    var vm=this
    return new Promise(function(resolve,reject){
      vm.uid=vm.fbs.currentUser().uid
      //if disconnected take most recent cached posts and show them
      //if connected-
      vm.arrayStopped=1 //and then go with the below procedure
      vm.newList=[]
      console.log(vm.uid)
      vm.fbs.getDatabase("/users/"+vm.uid+"/userPosts",true,null).then(function(snap){
        //console.log(snap)

        console.log("this is the snap from userPosts: ",snap)
        //console.log(vm.profile.userPosts)
      //  var gool=false
        for (let k in snap){
          var item=snap[k]
          if(vm.userPosts.length!==0&&snap[k]!=undefined&&snap[k]!=null){
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

          for(let i in vm.newList){

            vm.fbs.getDatabase("/posts/"+vm.newList[i],true,vm.uid).then(function(res){
              var post=new Post(vm.fbs,vm.navCtrl,vm.newList[i],true)
              for(let i in res){
                post[i]=res[i]
              }
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
    if(j>=0){
      for(let i in vm.newList){
        var k =j-Number(i)
        console.log(i,k)
        vm.fbs.getDatabase("/posts/"+vm.newList[k],false,vm.uid).then(function(res){
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
    this.fbs.getDatabase("/users/"+this.fbs.currentUser().uid+"/people/",true).then(function(res){
      var chat=""
      for(let i in res){
        if(res[i].indexOf(vm.uid)!==-1){
          chat=res[i]
          break
        }
      }
      if(chat!==""){
        vm.fbs.getDatabase("/chats/"+chat+"/summary",true).then(function(res){
          vm.navCtrl.push(ChatPage,{person:res})
        })
      }else if(chat===""){
        vm.navCtrl.push(ChatPage,{person:vm.profile.basic})
      }
    })
  }

}
