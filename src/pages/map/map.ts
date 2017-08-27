import { Component, ViewChild } from '@angular/core';
import { NavController, Platform , ModalController} from 'ionic-angular';
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
  constructor(public nw:Network,
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
    this.fbs.getDatabase("/users/"+this.fbs.currentUser().uid+"/people",false).then((res)=>{
      if(Object.keys(res).length===Object.keys(vm.people).length){
        for(let i in this.people){
          var cid=this.people[i].chatId
          this.fbs.getDatabase("/chats/"+cid+"/summary",true).then((res)=>{
            this.people[i]=res
          })
        }
      }else{
        this.getNewChats()
      }
    })
  }

  ionViewWillEnter() {
    this.refreshChats()
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
    this.fbs.getDatabase("/users/"+this.uid,false).then(function(res:any){
      // for(let i in res){
      //   vm.profile[i]=res[i]
      // }
      vm.profile=res
      for(let i in res.people){
        this.fbs.getDatabase("/chats/"+res.people[i]+"/summary", false).then(function(res){
          var chat=res
          var oUid=""
          for(let i in chat.users){
            if(i!==vm.uid){
              chat["oUid"]=i
              chat["currentPic"]=chat.users[i].image
              if(chat.users[vm.uid].unread===0){
                chat["unread"]=0
              }else{
                chat["unread"]=Object.keys(chat.users[vm.uid].unread).length
              }


            }
          }
          vm.people.push(chat)
        }).catch(function(err){
          console.log("Couldn't get chat, ",err)
        })
      }
      if(vm.people.length!==0){
        vm.people.sort(function(a,b){
          return Number(b.lastTime)-Number(a.lastTime)
        })
      }
      vm.sorted=true
      vm.suggestedPeople=vm.profile.suggestedPeople
    }).catch(function(err){
      console.log("Error getting profile, ",err)
    })
  }
  refreshList(){
    //var prev=-1
    var vm=this
    var key = Object.keys(this.suggestedPeople)
    var temp=[]
    var check={}
    for(let i=0;i<5;i++){
      console.log("this what it would have been,",check[0])
      if(key.length>5){
        var lucky=Math.floor(Math.random())*key.length
        console.log(lucky)
        while(check[lucky]){
          lucky=Math.floor(Math.random())*key.length
          console.log("This is lucky ",lucky)
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
          vm.fbs.getDatabase("/users/"+this.suggestedPeople[i]+"/basic",false).then((res)=>{
            temp.push(res)
          }).catch((err)=>{
            console.log("Error hereeee")
          })
        }
        if(i===4){
          vm.miniList=temp
        }
      }
    }

  }
  openPerson(data) {
    let addModal = this.modalCtrl.create(ItemDetailPage,{person:data});
    addModal.onDidDismiss(item => {
      //maybe set it in storage  for safe keeping?
    })
    addModal.present();
  }
  openChat(data) {
    let addModal = this.modalCtrl.create(ChatPage,{person:data});
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
