import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, Events } from 'ionic-angular';
import { PostPage } from '../post/post'
import { FirebaseService } from '../../providers/firebase'
import { WelcomePage } from '../welcome/welcome'
import { Uzer } from '../../models/uzer'
import { Post } from '../../models/post'
import { StreamingMedia } from '@ionic-native/streaming-media'
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
  cardItems: any[];
  @ViewChild(Nav) nav: Nav;
  viewables=[]
  profile:Uzer
  uid:String
  arrayStopped=1
  j:Number
  newList:Array<Post>
  constructor(public sm:StreamingMedia,public navCtrl: NavController, public events : Events ,public fbs:FirebaseService) {
    this.uid=this.fbs.currentUser().uid
  }
  ionViewWillEnter(){
    if (this.viewables.length===50){
      for(let i=0;i<14;i++){
        this.viewables.pop()
      }
    }
    this.getNewstuff().then(function(res){
      console.log("Got the stuff 2")
    }).catch(function(err){
      console.log("An error has come up", err)
    })
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
        for (let k in vm.profile.viewables){
          var item=vm.profile.viewables[vm.profile.viewables.length-Number(k)-1]
          if(item!==vm.viewables[vm.viewables.length-1].postId){
            vm.newList.push(item)
          }else{
            break
          }
        }
        //var j = vm.profile.viewables.length-this.array
        for(let i in vm.newList){
          var index=vm.newList.length-1-Number(i)
          vm.fbs.getDatabase("/posts/"+vm.newList[index],false,vm.uid).then(function(res){
            var post=new Post
            for(let i in res){
              post[i]=res[i]
            }
            vm.viewables.unshift(post)
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
          vm.viewables.push(post)
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
  refresher(e){
    this.getNewstuff().then(function(res){
      console.log("Got the stuff")
      e.complete()
    }).catch(function(err){
      console.log("Unable to get new posts:",err)
      e.complete()
    })
  }
  doLogout(){
    this.fbs.logout().then((res)=>{
      console.log("I'm here")

      this.events.publish('dude')
      //this.nav.popToRoot()

    }).catch((err)=>{
      console.log("Can't logout")
    })/*
    this.events.subscribe('dude',()=>{
      var user = this.fbs.currentUser()
      console.log("this is you",user)
      this.nav.setRoot(WelcomePage)
    })*/


  }
  ionViewWillLeave(){
    this.array=1
  }
}
