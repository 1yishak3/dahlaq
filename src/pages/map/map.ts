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
    var pRef = fbs.getRef("/users/"+this.fbs.currentUser().uid+"/people")
    pRef.on('value',(snap)=>{
      var pipi = snap.val();
      if(pipi){
        this.updateList(pipi)
      }
    })
  }
  //to be usesd when leaving a chat modalCtrl
  updateList(p){
    var vm=this
    for(let i in p){
      if(i!="cache"){
        var person=p[i]
        this.fbs.getRef("/chats/"+person+"/summary").once('value').then((cht:any)=>{
          var chat=cht.val()
          if(chat){
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

            this.people.push(chat)
          }
          this.people.sort((a,b)=>{
            return b.lastTime-a.lastTime
          })
        })
      }
    }
  }
  refreshChats(){
    var vm=this
    return new Promise((resolve,reject)=>{
      var people=[]
      this.fbs.getDatabase("/users/"+this.fbs.currentUser().uid+"/people",true).then((res)=>{

          console.log("???????")
          for(let j in this.people){
            var cid=this.people[j].chatId
            console.log(cid)
            this.fbs.getRef("/chats/"+cid+"/summary").once('value').then((res:any)=>{
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
    this.people=[]
    this.fbs.getRef("/users/"+this.uid+"/people").once('value').then((res:any)=>{
      // for(let i in res){
      //   vm.profile[i]=res[i]
      // }
      var pps=[]

      for(let i in res){
        if(!this.history[res[i]]){
          this.history[res[i]]=true
          this.fbs.getRef("/chats/"+res[i]+"/summary").once('value').then(function(res){
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
            pps.push(chat)
            if(pps.length!==0){
              pps.sort(function(a,b){
                return Number(b.lastTime)-Number(a.lastTime)
              })

            }
          }).catch(function(err){
            console.log("Couldn't get chat, ",err)
          })

        }
      }
      vm.people=pps

      vm.sorted=true
      this.fbs.getRef("/users/"+this.uid+"/suggestedPeople").once('value').then((res:any)=>{
        console.log('kjhgfd')
        if(!(typeof res === 'string' || res instanceof String)){
          for(let k in res){
            if(k!=="cache"){
              vm.suggestedPeople.push(res[k])
            }
          }
          vm.refreshList()
        }

      })
    }).catch(function(err){
      console.log("Error getting profile, ",err)
    })
  }
  refreshList(){
    //var prev=-1
    var vm=this
    console.log("changed",this.suggestedPeople)
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
          temp.push(this.suggestedPeople[lucky])
          if(i===4){
            vm.miniList=temp
          }
        }else{
          if(i<key.length){
            console.log("hello world",i)
            temp.push(this.suggestedPeople[i])
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
