import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, Events } from 'ionic-angular';
import { PostPage } from '../post/post'
import { FirebaseService } from '../../providers/firebase'
import { WelcomePage } from '../welcome/welcome'
import { Uzer } from '../../models/uzer'
import { Post } from '../../models/post'
import { StreamingMedia } from '@ionic-native/streaming-media'
import moment from 'moment'
import * as _ from 'lodash'
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
  cardItems: any[];
  @ViewChild(Nav) nav: Nav;
  viewables=[]
  profile:Uzer
  uid:string
  arrayStopped=1
  j:number
  newList:Array<any>
  toggled:boolean=false
  ready:boolean
  postz:any={}
  liste:any=[]
  constructor(public sm:StreamingMedia,public navCtrl: NavController, public events : Events ,public fbs:FirebaseService) {
   this.uid=this.fbs.currentUser().uid
   this.profile=new Uzer()
   this.viewables=[]
   fbs.snap()
  }
  ionViewWillEnter(){
    if (this.viewables.length>=50){
      for(let i=0;i<14;i++){
        this.viewables.pop()
      }
    }
    this.getNewstuff().then(function(res){
      console.log("Got the stuff ;)")
    }).catch(function(err){
      console.log("An error has come up", err)
    })
  }
  handleEmoji(event){

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
      vm.fbs.getDatabase("/users/"+vm.uid+"/viewables",true,null).then(function(snap){
        //console.log(snap)

        console.log("this is the snap from VIEWABLESSS: ",snap)
        //console.log(vm.profile.viewables)
      //  var gool=false
        for (let k in snap){
          var item=snap[k]
          if(vm.viewables.length!==0&&snap[k]!=undefined&&snap[k]!=null){
            if(vm.postz[item]===undefined){
              vm.newList.unshift(item)
              vm.postz[item]=true
            }
            // if(item===vm.viewables[0].postId){
            //   gool=true
            // }
          }else if(vm.viewables.length===0&&snap[k]!=undefined&&snap[k]!=null){
            vm.newList.unshift(item)
            vm.postz[item]=true
          }
        }
        console.log("this is the new list:",vm.newList)
        //var j = vm.profile.viewables.length-this.array
        //vm.newList.reverse()
        if(vm.newList.length!==0){
          for(let i in vm.newList){

            vm.fbs.getDatabase("/posts/"+vm.newList[i],true,vm.uid).then(function(res){
              var post=new Post(vm.fbs,vm.navCtrl,vm.newList[i],true)
              for(let i in res){
                post[i]=res[i]
              }
              vm.liste.push(post)
              if(Number(i)===14||Number(i)===vm.newList.length-1){
                vm.arrayStopped=Number(i)+1
                vm.liste.sort(function(a,b){
                  return b.time-a.time
                })
              }
              console.log(post)
            }).catch(function(err){
              console.log("couldn't get post,",err)
            })
            if(Number(i)===14||Number(i)===vm.newList.length-1){
              vm.viewables=vm.liste
              break
            }
          }
        }

        vm.ready=true
        console.log(vm.viewables)
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
        var k =Number(i)+j
        if(vm.newList[k]!==undefined){
          vm.fbs.getDatabase("/posts/"+vm.newList[k],false,vm.uid).then(function(res){
            var post = new Post(vm.fbs,vm.navCtrl,vm.newList[k],true)
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
            vm.arrayStopped=k+1
            e.complete()
            break
          }
        }
      }
    }
    e.complete()
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

      //this.events.publish('dude')
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
    this.arrayStopped=1
  }
}
