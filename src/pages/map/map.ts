import { Component, ViewChild,AfterViewChecked } from '@angular/core';
import { NavController, Platform , ModalController,LoadingController} from 'ionic-angular';
import { ChatPage } from '../chat-detail/chat-detail'
import { ItemDetailPage } from '../item-detail/item-detail'
import { FirebaseService } from '../../providers/firebase'
import { Uzer } from '../../models/uzer'
import * as _ from "lodash"
import {Network} from '@ionic-native/network'
import {Storage} from '@ionic/storage'
import {Badge} from '@ionic-native/badge'

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage implements AfterViewChecked{

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
  go:any
  promises:any=[]
  pps:any={}
  constructor(public badge:Badge,
    public stg:Storage,
    public lc:LoadingController,
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
    stg.get("ppap").then((f)=>{
      if(f){
        this.people=f
      }
    })
    console.log("bebebebebe")
    this.getNewChats()
    console.log("like can you not see me?")
    //var pRef = fbs.getRef("/users/"+this.fbs.currentUser().uid+"/people")
    // pRef.on('value',(snap)=>{
    //   var pipi = snap.val();
    //   if(pipi){
    //     this.updateList(pipi)
    //   }
    // })
  }
  //to be usesd when leaving a chat modalCtrl
  updateList(p){
    var vm=this
    var empty=[]
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

            empty.push(chat)
          }
          empty.sort((a,b)=>{
            return b.lastTime-a.lastTime
          })
        })
      }
    }
    this.people=empty
  }
  refreshChats(){
    var vm=this
    return new Promise((resolve,reject)=>{
      var people=[]
      this.fbs.getDatabase("/users/"+this.fbs.currentUser().uid+"/people",true).then((res:any)=>{
          if(this.people.length!==Object.keys(res).length-1){
            console.log("1  ",res)
            var empty=[]
            for(let j in res){
              console.log("jj ",j)
              if(j!='cache'){
                var cid=res[j]
                console.log(cid)
                console.log("/chats/"+cid+"/summary")
                this.fbs.getRef("/chats/"+cid+"/summary").once('value').then((res:any)=>{


                  var chat=res.val()
                  console.log(res, res.val(),"nana")
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
                  empty.push(chat)
                  empty.sort((a,b)=>{
                    return b.lastTime-a.lastTime
                  })



                })
              }

            }


          }else{
            console.log("2  ",res)
            var empty=[]
            for(let j in this.people){
              var cid=this.people[j].chatId
              console.log(cid)
              if(typeof res[j]!=='string' && !(res[j] instanceof String &&res[j])){
              this.fbs.getRef("/chats/"+cid+"/summary").once('value').then((res:any)=>{
                var chat=res.val()
                console.log(res, res.val(),"nana")
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

                empty.push(chat)


              })
            }
            }

          }


        resolve(empty)
      })
    })


  }
  ionViewDidLeave(){

  }
  async requestPermission() {
    try {
      let hasPermission = await this.badge.hasPermission();
      console.log(hasPermission);
      if (!hasPermission) {
        let permission = await this.badge.registerPermission();
        console.log(permission);
      }
    } catch (e) {
      console.error(e);
    }
  }
  async setBadges(badgeNumber: number) {
    try {
      let badges = await this.badge.set(badgeNumber);
      console.log(badges);
    } catch (e) {
      console.error(e);
    }
  }
  async getBadges() {
    try {
      let badgeAmount = await this.badge.get();
      console.log(badgeAmount);
    }
    catch (e) {
      console.error(e);
    }
  }
  async increaseBadges(badgeNumber: string) {
    try {
      let badge = await this.badge.increase(Number(badgeNumber));
      console.log(badge);
    } catch (e) {
      console.error(e);
    }
  }
  async decreaseBadges(badgeNumber: string) {
    try {
      let badge = await this.badge.decrease(Number(badgeNumber));
      console.log(badge);
    } catch (e) {
      console.error(e);
    }
  }
  async clearBadges(){
    try {
      let badge = await this.badge.clear();
      console.log(badge);
    }
    catch(e){
      console.error(e);
    }
  }


  ionViewDidEnter() {
    this.requestPermission().then(()=>{
      this.clearBadges()
      this.setBadges(0)
    })


    // if(this.firstTime){
    //   var ch=this.lc.create({
    //     content:"Loading chats..."
    //   })
    //   ch.present()
    // }
    // this.refreshChats().then((d:any)=>{
    //   // if(this.firstTime){  ch.dismiss()}
    //   this.people=d
    //   this.firstTime=false
    //
    // })
    if(Math.random()>=0.5){
      this.refreshList()
    }

  }
  ngAfterViewChecked(){
    // this.refreshChats().then((d:any)=>{
    //   this.people=d
    // })
  }
  /*openItem(number: string) {
    this.navCtrl.push(ChatPage, {
      chatWith: number
    });
  }*/
  updatest(ras){


  }
  getNewChats(){
    console.log("in get new chats")
    var vm=this
    this.uid=this.fbs.currentUser().uid
    this.people=[]
  
    this.fbs.getRef("/users/"+this.uid+"/people").on('value',(rese:any)=>{
      // for(let i in res){
      //   vm.profile[i]=res[i]
      // }
      var pps={}
      var res=rese.val()
      this.promises=[]
      for(let i in res){
        console.log("resss",res, res[i])
          //this.history[res[i]]=true
          if(i!=="cache"&&res[i]){
            this.promises.push(
              this.fbs.getRef("/chats/"+res[i]+"/summary").on('value',(resd)=>{
                  var chat:any=resd.val()
                  var oUid=""
                  for(let i in chat.users){
                    if(i!==this.uid){
                      chat["oUid"]=i
                      chat["currentPic"]=chat.users[i].image
                      if(chat.users[this.uid].unread===0){
                        chat["unread"]=0
                      }else{
                        if(chat.users[this.uid].unread){
                          chat["unread"]=Object.keys(chat.users[this.uid].unread).length
                        }else{
                          chat["unread"]=0
                        }

                      }


                    }
                  }
                  this.pps[res[i]]=chat
                  var g=[]
                  for(let i in this.pps){
                    g.push(this.pps[i])
                  }
                  g.sort((a,b)=>{
                    return b.lastTime-a.lastTime
                  })
                  this.people=g
                  this.stg.set("ppap",this.people)
              },(err)=>{
                console.log(err)
              })
            )
          }
      }
      Promise.all(this.promises).then((results:any)=>{
        console.log("rrrrr",results)
        console.log("dfdgd",g)
        var g=[]
        for(let i in this.pps){
          g.push(this.pps[i])
        }
        g.sort((a,b)=>{
          return b.lastTime - a.lastTime
        })

        vm.people=g


      })


      vm.sorted=true
      this.fbs.getRef("/users/"+this.uid+"/suggestedPeople").once('value').then((rese:any)=>{
        var res=rese.val()
        console.log('kjhgfd',res)
        if(!(typeof res === 'string' || res instanceof String)){
          for(let k in res){
            if(k!=="cache"&&res[k].uid!==this.uid&&res[k].uid){
              vm.suggestedPeople.push(res[k])
            }
          }
          vm.refreshList()
        }

      })
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
        if(key>5){
          console.log("why is key > 5??",key)
          var lucky=Math.floor(Math.random()*key)
          console.log(lucky)
          while(check[lucky]){
            lucky=Math.floor(Math.random()*key)
            console.log("This is ljsjucky ",lucky)
          }
          check[lucky]=true
          //prev=_.cloneDeep(lucky)
          temp.push(this.suggestedPeople[lucky])
          if(i===4){
            vm.miniList=temp
          }
        }else{
          if(i<key){
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
    this.navCtrl.push(ItemDetailPage,{person:data.uid});

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
