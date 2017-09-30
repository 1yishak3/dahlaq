import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { Item } from '../../models/item';

import { Items } from '../../providers/providers';
import {FirebaseService} from '../../providers/firebase'
import {Post} from '../../models/post'
import {StreamingMedia} from '@ionic-native/streaming-media'
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  currentItems: any = [];
  profile:any
  postList:any
  number:any
  listP:any={}
  posts:any
  initP:any=[]
  constructor(public fbs:FirebaseService,public sm:StreamingMedia,public navCtrl: NavController, public navParams: NavParams, public items: Items) {
    this.profile=navParams.get('profile')
    console.log(this.profile)
    this.postList=[]
    for(let i in this.profile.userPosts){
      this.postList.push(this.profile.userPosts[i])
    }
    console.log(this.postList)
    this.getFiftin()
  }
  ionViewWillEnter(){
    this.fbs.getDatabase("/users/"+this.profile.basic.uid+"/userPosts",true,true).then((list:any)=>{
      if(list.cache!==this.postList.cache){
        this.postList=list
        this.getFiftin()
      }
    })
  }
  getFiftin(){
    var init=this.number||0
    console.log(init)
    var pid
    for(var i=init;i<this.postList.length;i++){
      console.log("For loop",this.postList)
      pid=this.postList[i]
      if(pid&&i!="cache"&&isNaN(pid)){
        this.fbs.getDatabase("/posts/"+pid,true).then((post:any)=>{

          if(post){
            //console.log(this.listP[post.postId])
            if(!this.listP[post.postId]){
              console.log("post",post)
              var pst=new Post(this.fbs,this.navCtrl,this.postList[i],true,post)
              // for(let k in post){
              //   pst[k]=post[k]
              //   //console.log(k,pst[k],post[k])
              //
              // }
              console.log(pst)
              this.initP.push(pst)
              this.listP[post.postId]=true
            }
          }
        })
      }
      if(i-init===14||i>=this.postList.length-1){
        console.log("i-init",this.initP)
        this.initP.sort(function(a,b){

          return a.time>b.time
        })
        console.log("this",this.initP)
        this.posts=this.initP
        console.log("Your posts",this.posts)
        this.number=i+1
        break
      }
    }
  }
  pullToAddMore(e){
    this.getFiftin()
    e.complete()
  }
  /**
   * Perform a service for the proper items.
   */
  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.currentItems = [];
      return;
    }
    this.currentItems = this.items.query({
      name: val
    });
  }

  /**
   * Navigate to the detail page for this item.
   */

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

}
