import { Component, ViewChild, ElementRef} from '@angular/core';
import { NavController, Nav, Events, LoadingController,Content,Platform } from 'ionic-angular';
import { PostPage } from '../post/post'
import { FirebaseService } from '../../providers/firebase'
import { WelcomePage } from '../welcome/welcome'
import { Uzer } from '../../models/uzer'
import { Post } from '../../models/post'
import { StreamingMedia } from '@ionic-native/streaming-media'
import moment from 'moment'
import * as _ from 'lodash'
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage'
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
  cardItems: any[];
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Content) content:Content
  viewables=[]
  profile:Uzer
  uid:string
  arrayStopped=1
  j:number
  newList:Array<any>=[]
  toggled:boolean=false
  ready:boolean
  postz:any={}
  liste:any=[]
  connected:boolean
  firstTime:boolean=true
  noPosts:boolean=false
  show:any=true
  constructor(public platform:Platform,public sg:Storage,public lc:LoadingController, public nw:Network,public sm:StreamingMedia,public navCtrl: NavController, public events : Events ,public fbs:FirebaseService) {
    var urd;
   this.sg.get("uzer").then((res)=>{
     urd=this.fbs.currentUser()||res
     this.uid=urd.uid
     this.profile=new Uzer()
     this.viewables=[]
     console.log(this.uid)
     this.firstTime=true
     console.log("this is uiddddd",this.uid)
     fbs.snap(this.uid)
   })


   var vm=this
   var disc=nw.onDisconnect().subscribe(()=>{
     console.log("disconnected??")
     vm.connected=false
   })
   var conc=nw.onConnect().subscribe(()=>{
     vm.show=true
     vm.connected=true
     setTimeout(function(){
       vm.show=false
     },5000)
   })
  }

  ionViewWillEnter(){
    // this.platform.ready().then(()=>{
    //
    //
    // })
    this.content.scrollToTop(10)
    if (this.viewables.length>=50){
      for(let i=0;i<14;i++){
        this.viewables.pop()
      }
    }
    if(this.viewables.length===0){
      this.firstTime=true
    }
    if(this.fbs.currentUser()){
      if(this.viewables.length<=3){
        this.viewables=[]
        setTimeout(()=>{
          this.viewables=this.liste
        },10)
      }


      this.getNewstuff().then((res)=>{

        this.content.resize()

        console.log("got to resize",this.viewables)

        console.log("Got the stuff ;)")
      }).catch(function(err){
        console.log("An error has come up", err)
      })
    }

  }
  handleEmoji(event){

  }
  getNewstuff(){
    //this.ready=false
    //decide when users should see the loading thing
    //I also need to go to createUser in firebase and adjust so it throws an error when number is invalid.
    var vm=this
    // if(this.firstTime){
    //   var lc=this.lc.create({
    //     content:"Checking for new posts..."
    //   })
    //   lc.present()
    // }
    vm.newList=[]
    return new Promise(function(resolve,reject){
      vm.uid=vm.fbs.currentUser().uid
      //if disconnected take most recent cached posts and show them
      //if connected-
      vm.arrayStopped=1 //and then go with the below procedure
      var ld:any
      console.log("in the promise")

      console.log(vm.uid)
      vm.fbs.getDatabase("/users/"+vm.uid+"/viewables",true,true).then(function(snap){
        //console.log(snap)
        //console.log("I have the data...which means the prob is with your if")
        if(snap&&!(typeof snap === 'string' || snap instanceof String)){
          console.log(snap)
          vm.noPosts=false

          //console.log(vm.profile.viewables)
        // var gool=false
          // if(Object.keys(snap).length>=30){
          //   vm.newList=[]
          // }
          // var ref;
          // vm.fbs.getRef("/users/"+vm.uid+"/viewables").then(function(res){
          //   ref=res
          //   ref.onDisconnect().set(null)
          // })

          // view.onDisconnect().set(null).then((res)=>{
          //   console.log("nullified, ready for repopulation")
          // })
          console.log(snap)
          for (let k in snap){
            if(isNaN(snap[k])){
              var item=snap[k]
              if(item){
                if(vm.postz[item]===undefined){
                  vm.newList.unshift(item)
                  vm.postz[item]=true
                }
              }
            }

          }
          console.log("this is the new list:",vm.newList)
          //var j = vm.profile.viewables.length-this.array
          //vm.newList.reverse()
          if(vm.newList.length>=30){
            vm.viewables=[]
          }
          // if(vm.newList.length===0){
          //   vm.sg.get('mostRecent').then((y)=>{
          //     if(y){
          //       vm.newList=y
          //       if(vm.newList.length===0||!vm.newList){
          //         vm.noPosts=true
          //         if(vm.firstTime){
          //           // lc.dismiss()
          //         }
          //       }
          //     }else{
          //       vm.newList=[]
          //       if(vm.firstTime){
          //         // lc.dismiss()
          //       }
          //     }
          //   })
          // }

          // if(vm.newList.length!==0){
            // vm.sg.get('mostRecent').then((y)=>{
            //   var posts=y||[]
            //
            //   for(let i in vm.newList){
            //
            //     posts.push(vm.newList[i])
            //   }
            //   if(posts.length>30){
            //     var len=posts.length-30
            //     for(let i=0;i<=len;i++){
            //       posts.shift()
            //     }
            //
            //   }
            //   vm.sg.set('mostRecent',posts)
            // })
          // }
            for(let i in vm.newList){

              vm.fbs.getDatabase("/posts/"+vm.newList[i],true).then(function(res:any){
                console.log("post from base?",res)
                var post = new Post(vm.fbs,vm.navCtrl,vm.newList[i],false,res)
                // for(let i in res.content){
                //   post.content[i]=res.content[i]
                // }
                // for(let i in res.poster){
                //   post.poster[i]=res.poster[i]
                // }
                console.log("shit fuck",post)
                // for(let i in res){
                //    post[i]=res[i]
                // }
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
              
                if(vm.firstTime){
                  // lc.dismiss()
                }

                break
              }
            }
          }

          //else{
          //   console.log("snap is null")
          //   vm.sg.get('mostRecent').then((y)=>{
          //     var j=y||[]
          //     for(let i in j){
          //       if(!vm.postz[j[i]]){
          //         vm.newList.push(j[i])
          //         vm.postz[j[i]]=true
          //       }
          //     }
          //     if(vm.newList.length===0){
          //       vm.noPosts=true
          //       if(vm.firstTime){
          //         // lc.dismiss()
          //       }
          //     }
          //     if(vm.newList.length!==0){
          //       for(let i in vm.newList){
          //
          //         vm.fbs.getDatabase("/posts/"+vm.newList[i],true).then(function(res){
          //           var post=new Post(vm.fbs,vm.navCtrl,vm.newList[i],true)
          //           if(res){
          //             for(let i in res){
          //               post[i]=res[i]
          //             }
          //             vm.liste.push(post)
          //             if(Number(i)===14||Number(i)===vm.newList.length-1){
          //               vm.arrayStopped=Number(i)+1
          //               vm.liste.sort(function(a,b){
          //                 return b.time-a.time
          //               })
          //             }
          //             console.log(post)
          //           }
          //
          //         }).catch(function(err){
          //           console.log("couldn't get post,",err)
          //         })
          //         if(Number(i)===14||Number(i)===vm.newList.length-1){
          //           vm.viewables=vm.liste
          //           if(vm.firstTime){
          //             // lc.dismiss()
          //           }
          //
          //           break
          //         }
          //       }
          //     }
          //   })
          // }

          vm.ready=true

          console.log(vm.viewables)
          if(vm.firstTime){
            // if(lc){
            //   lc.dismiss().then((res)=>{
            //     console.log("dismisssed")
            //   }).catch((err)=>{
            //     console.log("error dismissing")
            //   })
            // }
          }
          vm.firstTime=false
          resolve("Got all posts")


      }).catch(function(err){
        console.log("Error getting profile ",err)

        if(vm.firstTime){
          // lc.dismiss()
        }
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
          vm.fbs.getDatabase("/posts/"+vm.newList[k],false,true).then(function(res){
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
  ionViewDidLeave(){
    this.arrayStopped=1
  }
}
