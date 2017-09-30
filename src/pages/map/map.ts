import { Component, ViewChild } from '@angular/core';
import { NavController, Platform , ModalController,LoadingController} from 'ionic-angular';
import { ChatPage } from '../chat-detail/chat-detail'
import { ItemDetailPage } from '../item-detail/item-detail'
import { FirebaseService } from '../../providers/firebase'
import { Uzer } from '../../models/uzer'
import * as _ from "lodash"
import {Network} from '@ionic-native/network'

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

//  @ViewChild('map') map;
  uid:any
  profile:any
  search:boolean = false
  people:Array<any>=[]
  suggestedPeople:any=[]
  miniList:any=[]
  sorted:boolean
  connected:boolean
  show:any=true
  firstTime:any=true
  history:any={}
  totit:number=0
  already:any={}
  constructor(public lc:LoadingController,
    public nw:Network,
    public navCtrl: NavController,
    public platform: Platform,
    public modalCtrl: ModalController,
  public fbs:FirebaseService) {
  this.uid=fbs.currentUser().uid
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
  this.getNewChats()
  }
  //to be usesd when leaving a chat modalCtrl
  refreshChats(){
    var vm=this
    return new Promise((resolve,reject)=>{
      this.fbs.getDatabase("/users/"+this.fbs.currentUser().uid+"/people",true).then((res)=>{
        if(Object.keys(res).length===Object.keys(vm.people).length){
          console.log("???????")
          for(let j in this.people){
            var cid=this.people[j].chatId
            console.log(cid)
            this.fbs.getDatabase("/chats/"+cid+"/summary",true).then((res:any)=>{
              var chat=res
              for(let i in chat.users){
                if(i!==vm.uid){
                  chat["oUid"]=i
                  chat["currentPic"]=chat.users[i].image
                  if(chat.users[vm.uid].unread===0){
                    chat["unread"]=0
                  }else{
                    if(chat.users[vm.uid].unread){
                      chat["unread"]=Object.keys(chat.users[vm.uid].unread).length
                    }else{
                      chat['unread']=0
                    }
                  }


                }
              }

              this.people[j]=chat
              console.log("what ",this.people)

            })
          }
        }else{
          console.log("Dude, some how got inthe else new CHAT GET",Object.keys(res).length)
          console.log(Object.keys(vm.people).length)
          this.getNewChats()
        }
        resolve(this.people)
      })
    })


  }

  ionViewWillEnter() {
    // if(this.firstTime){
    //   var ch=this.lc.create({
    //     content:"Loading chats..."
    //   })
    //   ch.present()
    // }
    this.refreshChats().then((d)=>{
      // if(this.firstTime){  ch.dismiss()}
      this.firstTime=false
      console.log("refreshList: ",d)

    })
    this.refreshList()
  }
  /*openItem(number: string) {
    this.navCtrl.push(ChatPage, {
      chatWith: number
    });
  }*/
  getNewChats(){
    var vm=this
    this.uid=this.fbs.currentUser().uid
    this.fbs.getDatabase("/users/"+this.uid+"/people",false).then((res:any)=>{
      // for(let i in res){
      //   vm.profile[i]=res[i]
      // }


      for(let i in res){
        if(!this.history[res[i]]){
          this.history[res[i]]=true
          this.fbs.getDatabase("/chats/"+res[i]+"/summary", false).then(function(res){
            var chat:any=res
            var oUid=""
            for(let i in chat.users){
              if(i!==vm.uid){
                chat["oUid"]=i
                chat["currentPic"]=chat.users[i].image
                if(chat.users[vm.uid].unread===0){
                  chat["unread"]=0
                }else{
                  if(chat.users[vm.uid].unread){
                    chat["unread"]=Object.keys(chat.users[vm.uid].unread).length
                    vm.totit=vm.totit+Object.keys(chat.users[vm.uid].unread).length
                  }else{
                    chat["unread"]=0
                  }

                }


              }
            }
            vm.people.push(chat)
          }).catch(function(err){
            console.log("Couldn't get chat, ",err)
          })
        }
      }
      if(vm.people.length!==0){
        vm.people.sort(function(a,b){
          return Number(b.lastTime)-Number(a.lastTime)
        })
        console.log(vm.people)
      }
      vm.sorted=true
      this.fbs.getDatabase("/users/"+this.uid+"/suggestedPeople",true).then((res:any)=>{
        console.log('kjhgfd')
        if(!(typeof res === 'string' || res instanceof String)){
          for(let k in res){
            if(k!=="cache"){
              vm.suggestedPeople.push(res[k])
            }
          }
          vm.refreshList()
        }
        this.fbs.setDatabase("/users/"+this.uid+"/suggestedPeople","repopulate/"+Date.now(),true)
      })
    }).catch(function(err){
      console.log("Error getting profile, ",err)
    })
  }
  refreshList(){
    //var prev=-1
    var vm=this
    console.log("changedddd")
    if(this.suggestedPeople){
      var key = this.suggestedPeople.length
      var temp=[]
      var check={}
      for(let i=0;i<5;i++){
        console.log("this what it would have been,",key)
        if(key.length>5){
          console.log("why is key > 5??",key)
          var lucky=Math.floor(Math.random()*key.length)
          console.log(lucky)
          while(check[lucky]){
            lucky=Math.floor(Math.random()*key.length)
            console.log("This is ljsjucky ",lucky)
          }
          check[lucky]=true
          //prev=_.cloneDeep(lucky)
          vm.fbs.getDatabase("/users/"+this.suggestedPeople[lucky]+"/basic", false).then(function(res){
            temp.push(res)
          }).catch(function(err){
            console.log("unable to get the profile, sth's wong :P ", err)
          })
          if(i===4){
            vm.miniList=temp
          }
        }else{
          if(i<key.length){
            console.log("hello world",i)
            vm.fbs.getDatabase("/users/"+this.suggestedPeople[i]+"/basic",false).then((res)=>{
              temp.push(res)
            }).catch((err)=>{
              console.log("Error hereeee")
            })
          }
          if(i===4){
            console.log("this is temp",temp)
            vm.miniList=temp
          }
        }
      }
    }

  }
  unread(summary:any){
    if(summary.users[this.uid].unread){
      return Object.keys(summary.users[this.uid].unread).length
    }else{
      return 0
    }
  }
  username(summary){
    return summary.users[summary.oUid].username
  }
  openPerson(data) {
    let addModal = this.modalCtrl.create(ItemDetailPage,{person:data});
    addModal.onDidDismiss(item => {
      //maybe set it in storage  for safe keeping?
    })
    addModal.present();
  }
  openChat(data) {
    let addModal = this.modalCtrl.create(ChatPage,{person:data,fbs:this.fbs});
    addModal.onDidDismiss(item => {
      //maybe set it in storage  for safe keeping?
      //the refresh chat thing?
      this.refreshChats()
    })
    addModal.present();
  }
  searchOn(){
    this.search=!this.search
  }


}
