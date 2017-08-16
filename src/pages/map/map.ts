import { Component, ViewChild } from '@angular/core';
import { NavController, Platform , ModalController} from 'ionic-angular';
import { ChatPage } from '../chat-detail/chat-detail'
import { FirebaseService } from '../../providers/firebase'
import { Uzer } from '../../models/uzer'
import * as _ from "lodash"


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

//  @ViewChild('map') map;
  uid:any
  profile:any
  search:boolean = false
  people:Array<any>
  suggestedPeople:any
  miniList:any
  sorted:boolean
  constructor(public navCtrl: NavController,
    public platform: Platform,
    public modalCtrl: ModalController,
  public fbs:FirebaseService) {
  this.uid=fbs.currentUser().uid
  }

  ionViewWillEnter() {
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
            }
          }
          vm.people.push(chat)
        }).catch(function(err){
          console.log("Couldn't get chat, ",err)
        })
      }
      vm.people.sort(function(a,b){
        return Number(b.lastTime)-Number(a.lastTime)
      })
      vm.sorted=true
      vm.suggestedPeople=vm.profile.suggestedPeople
      vm.refreshList()
    }).catch(function(err){
      console.log("Error getting profile, ",err)
    })
  }
  /*openItem(number: string) {
    this.navCtrl.push(ChatPage, {
      chatWith: number
    });
  }*/
  refreshList(){
    var prev=-1
    var vm=this
    for(let i=0;i<5;i++){
      var lucky=Math.floor(Math.random()*this.suggestedPeople.length)
      while(prev===lucky){
        var lucky=Math.floor(Math.random()*this.suggestedPeople.length)
      }
      prev=_.cloneDeep(lucky)
      vm.fbs.getDatabase("/users/"+this.suggestedPeople[i]+"/basic/", false).then(function(res){
        vm.miniList.push(res)
      }).catch(function(err){
        console.log("unable to get the profile, sth's wong :P ", err)
      })
    }

  }
  openChat(data) {
    let addModal = this.modalCtrl.create(ChatPage,{person:data});
    addModal.onDidDismiss(item => {
      //maybe set it in storage  for safe keeping?
    })
    addModal.present();
  }
  searchOn(){
    this.search=!this.search
  }


}
