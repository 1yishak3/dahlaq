import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Items } from '../../providers/providers';
import { SettingsPage } from '../settings/settings'
import { FirebaseService } from '../../providers/firebase'
import { Post } from '../../models/post'
import { Uzer } from '../../models/uzer'
import { StreamingMedia } from '@ionic-native/streaming-media'

@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  uid: any;
  profile: Uzer
  isUser:boolean
  userPosts=[]
  arrayStopped=1
  j:Number
  newList:Array<Post>
  constructor(public sm:StreamingMedia,public fbs:FirebaseService,public navCtrl: NavController, navParams: NavParams, items: Items) {
    this.uid = navParams.get('item') || fbs.currentUser().uid;
    this.fbs.userCheck.subscribe((boolean)=>{
      this.isUser==boolean
    })

  }
  ionViewWillEnter(){

  }
  getNewstuff(){
    return new Promise(function(resolve,reject){
      this.uid=this.fbs.currentUser().uid
      var vm=this
      //if disconnected take most recent cached posts and show them
      //if connected-
      this.array=1 //and then go with the below procedure
      vm.newList=[]
      this.fbs.getDatabase("/users/"+this.uid,true,null).then(function(snap){
        for(let i in snap){
          vm.profile[i]=snap[i]
        }
        console.log(snap)
        for (let k in vm.profile.userPosts){
          var item=vm.profile.userPosts[vm.profile.userPosts.length-Number(k)-1]
          if(item!==vm.userPosts[vm.userPosts.length-1].postId){
            vm.newList.push(item)
          }else{
            break
          }
        }
        //var j = vm.profile.userPosts.length-this.array
        for(let i in vm.newList){
          var index=vm.newList.length-1-Number(i)
          vm.fbs.getDatabase("/posts/"+vm.newList[index],false,vm.uid).then(function(res){
            var post=new Post
            for(let i in res){
              post[i]=res[i]
            }
            vm.userPosts.unshift(post)
            console.log(post)
          }).catch(function(err){
            console.log("couldn't get post,",err)
          })
          if(Number(i)===14||Number(i)===vm.newList.length-1){
            vm.arrayStopped=index-1
            break
          }
        }
        resolve(null)
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
  /*like(post){
    post.like()
  }
  unlike(post){
    post.unlike
  }
  dislike(){

  }
  undislike(){

  }
  report(){

  }
  unreport(){

  }*/
  pullToAddMore(e){
    var vm=this
    var j=vm.arrayStopped
    if(j>=0){
      for(let i in vm.newList){
        var k =j-Number(i)
        vm.fbs.getDatabase("/posts/"+vm.newList[k],false,vm.uid).then(function(res){
          var post = new Post
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

}
