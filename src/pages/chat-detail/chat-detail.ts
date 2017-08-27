import { Component, ElementRef, ViewChild, Renderer2, AfterViewChecked } from '@angular/core';

import { NavController, NavParams, ViewController,AlertController,LoadingController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase'
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { Chat } from '../../models/chat'
import { Message } from '../../models/message'
import * as _ from "lodash"
import {Network} from '@ionic-native/network'
import { Camera } from '../../providers/camera'
import { Ng2ImgToolsService} from 'ng2-img-tools'
import {ItemDetailPage} from '../item-detail/item-detail'
@Component({
  selector: 'page-content',
  templateUrl: 'chat-detail.html',
})
export class ChatPage implements AfterViewChecked{
  @ViewChild('textt') text:any
  @ViewChild('fileInput') fileInput:any
  person:any
  messages:Array<any>
  textarea: any
  message:string
  sendable:any
  messageCtrl:FormControl
  chat:Chat
  subc:any
  chatId:any
  oUser:any
  user:any
  ready=false
  typing=false
  registered=false
  pictureUrl:any
  videoUrl:any
  fileUrl:any
  timer:any
  oUserUid:any
  uid:any
  toggled:boolean=false
  online:any=false
  connected:boolean
  show:any=true
  conc:any
  disc:any
  firstTime:boolean
  spoken:boolean
  currentFile:string=""
  complete:any
  uploading:any
  progress:any
  tempMes:any
  sub:any
  constructor(public ir:Ng2ImgToolsService,public camera:Camera,public lc:LoadingController,public nw:Network,public alertCtrl:AlertController,public fbs:FirebaseService,private rd:Renderer2, public navCtrl: NavController, public navParam:NavParams, public viewCtrl:ViewController) {
    this.firstTime=true
    this.person=navParam.get('person');
    if(this.person.chatId){
      this.spoken=true

    }else{
      this.spoken=false
    }
    this.user=fbs.currentUser().displayName
    this.uid=fbs.currentUser().uid
    this.conquer()
   }
   openPerson(){
     this.viewCtrl.dismiss()
     this.navCtrl.push(ItemDetailPage,{person:this.uid})
   }
   conquer(){
     var vm=this
     vm.disc=vm.nw.onDisconnect().subscribe(()=>{
       vm.connected=false
     })
     vm.conc=vm.nw.onConnect().subscribe(()=>{
       vm.show=true
       vm.connected=true
       setTimeout(function(){
         vm.show=false
       },5000)
     })
   }
   ngAfterViewInit(){

   }

   ngAfterViewChecked(){

     if(this.message.length<41){
       this.text._elementRef.nativeElement.style.overflow="hidden";
       this.text._elementRef.nativeElement.style.height="45px"
     }
     else{
       this.text._elementRef.nativeElement.style.overflow="auto"
       this.text._elementRef.nativeElement.scrollTop=this.text._elementRef.nativeElement.scrollHeight
       this.text._elementRef.nativeElement.style.height = (this.text._elementRef.nativeElement.scrollHeight-22) +"px";
    }
    var vm=this
    this.text.keydown(function(){
      clearTimeout(timer)
      var then=vm.message
      var timer=setTimeout(function(){
        var now=vm.message
        if(now===then){
          vm.fbs.setDatabase("/chats/"+vm.chatId+"/users/"+vm.fbs.currentUser().uid+"/typing",false,true)
          .then(function(res){

          })
          .catch(function(err){

          })
        }
      },1000)
    })
  }
  ionViewWillEnter(){
    //this.person=this.navParam.get('person');
    if(this.firstTime){
      this.doMessaging()
    }
    if(this.person.chatId){
      this.getNew()
      this.readAll()
    }

  }
  getNew(){
    var unread=this.person.users[this.uid].unread
    if(unread!==0){
      for(let i in unread){
        this.fbs.getDatabase("/chats/"+this.person.chatId+"/content/messages/"+unread[i],true).then((res:any)=>{
          this.tempMes.push(new Message(res))
        })
      }
      this.tempMes.sort((a,b)=>{
        return b.time-a.time
      })
      this.messages=this.tempMes
    }
  }
  habeshaHi(){
    this.message="#habeshaHI!"
    this.sendMessage()
  }
  doMessaging(){
    var vm=this
    if(this.person.chatId){
      this.chatId=this.person.chatId
      for(let i in this.person.users){
        if(i!==this.fbs.currentUser().uid){
            this.oUser=this.person.users[i].username
            this.oUserUid=i
            var online=this.fbs.getRef("/users/"+this.oUserUid+"/basic/online/")
            online.on('value').then(function(res){
              vm.online=res
            })
            this.sub=this.fbs.getRef("/chats/"+this.person.chatId+"/summary/users/"+this.oUserUid+"/typing")
            this.sub.on('value').then((snap)=>{
              vm.typing=snap.val()
            })
        }
      }
      this.messages.push(this.person.lastMessage)
      this.fbs.getLimited("/chats/"+this.person.chatId+"/content/messages",75).then(function(res){
        //chat arrangments here
        //for(let i in res){
        //  vm.chat[i]=res[i]
        //}
        // vm.chat.content.messages=res
        vm.tempMes=[]
        for (let i in res){
          vm.tempMes.push(new Message(res[i]))
        }
        vm.tempMes.sort((a,b)=>{
          return b.time-a.time
        })
        vm.messages=vm.tempMes
        vm.firstTime=false
      }).catch(function(err){
          console.log("got this instead of beutifully ordered messages", err)
      })
    }else{
      //about sendding a habesha hi
      vm.spoken=false
    }
  }
  handleEmoji(e){
    this.message=this.message+e.char
  }

  signalTyping(){
    var val=true
    this.fbs.setDatabase("/chats/"+this.chatId+"/users/"+this.fbs.currentUser().uid+"/typing",val,true).then(function(res){
      this.subc.unsubscribe()
    })
  }
  ionViewDidLoad(){
    this.subscribe()
  }
  subscribe(){
    this.subc=this.messageCtrl.valueChanges.subscribe(input=>{
      if(this.registered){
        this.signalTyping()
      }
    })
  }
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Deletion',
      message: 'Are you sure you don\'t want to give this a shot?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log('Buy clicked');
            this.deleteChat()
          }
        }
      ]
    });
    alert.present();
  }
  showChoices(e){
    let pop = this.alertCtrl.create({
      title:"Choose Method",
      buttons:[{
        text:"Open Camera",
        handler:dat=>{
        //  pop.dismiss()
          this.getPicture(false)
        }
      },{
        text:"Open Files",

        handler:dat=>{
          //pop.dismiss()
          this.getPicture(true)
        }
      },{
        text:"Cancel",
        role:"cancel",
        handler: dar=>{
      //    pop.dismiss()
          console.log('cancelled')}
      }]
    })
    pop.present()
  }
  generateFileName(typ){
    var type=typ.name
    var name = this.fbs.currentUser().uid+"_"+Date.now()+type.substring(type.lastIndexOf("."),type.lastIndexOf(""))
    console.log(name)
    return name
  }
  processFile(url,fil) {
    var vm = this.fbs
    //var pst =  this.profilec
    var vm1=this
    fil.file(function(file){
      vm.setStorage(url,file).then(function(res){
        vm.getStorage(url).then(function(res){
          console.log(res)
          vm1.pictureUrl=res
          vm1.complete=true
          vm1.uploading=false
        }).catch(function(err){
          console.log("URL get error", err)
        })
      })
    },function(err){
      console.log(err)
    })
  }
  getPicture(upload) {
    //this.thisPage=false
    var cam=this.camera
    var vm = this.fbs
    var vm1=this.generateFileName
    if(!upload){
      var fp=this.processFile
      this.camera.takePicture(1).then(function(data){
        cam.getFile(data[0].fullpath).then(function(file){
          var pic = vm1(file)
          var url="/"+vm.currentUser().uid+"/images/"+pic
          this.complete=false
          this.uploading=true
          fp(url,file)
        }).catch(function(err){

        })
      }).catch(function(err){

      })
    }else{
      this.fileInput._elementRef.nativeElement.click();
    }
  }
  onChangeInput(e){
    //display a uploading spinner fot the user to wait until it finishes
    var vm=this
    this.complete=false
    this.uploading=true
    var file=e.target.files[0]
    var pic= this.generateFileName(file)
    vm.currentFile=file.name
    vm.ir.resize(file,600,400).subscribe(res=>{
      file=res
      var where="/images/"

      var url=vm.fbs.currentUser().uid+where+pic
    //  var pst = this.post
      console.log("this is file",file)
      var task= vm.fbs.setStorage(url,file)
      var sub=task.on('state_changed',function(snap:any){
        console.log(snap.bytesTransferred)
        console.log(snap.totalBytes)

        vm.progress=(Number(snap.bytesTransferred)/Number(snap.totalBytes))*100
        console.log(vm.progress)
        console.log("this is your snapshot, ",snap)

      },
      function(err){
          console.log("This is your error",err)
      })
      task.then(function(snap){
        console.log(snap)
          vm.fbs.getStorage(url).then(function(res:any){
            vm.pictureUrl=res
            vm.complete=true
            vm.uploading=false
          })
      })
    },err=>{
      console.log("errrrrrrror ",err)
    })

  }
  createChat(){
    return new Promise(function(resolve,reject){
      var vm=this
      this.chatId=this.person.uid+"_"+this.fbs.currentUser().uid+"_"+Date.now()
      //customize the chat before setting it
      var crat=this.fbs.currentUser().uid
      var nCrat=this.person.uid
      var users={}
      users[crat]={
        creater:true,
        username:this.fbs.currentUser().displayName,
        image:this.fbs.currentUser().photoURL,
        unread:0,
        typing:"",
        firstMessage:this.sendable
      }
      users[nCrat]={
        creator:false,
        username:this.person.username,
        image:this.person.currentPic,
        unread:0,
        typing:"",
        firstMessage:null
      }
      this.chat.summary["users"]=users
      this.chat.summary.chatId=this.chatId
      this.chat.summary.lastMessage= vm.messages[vm.messages.length-1]
      for(let i in vm.messages){
        this.chat.content.messages[i]=vm.messages[i]
      }
      this.fbs.setDatabase("/chats/"+this.chatId,this.chat,true).then(function(res){
        vm.registered=true
      }).catch(function(err){
        //you need to learn to wait for connectivity. Or does Firebase do that for you? Questions..
      })
    })
  }
  readAll(){
    var j=0
    var vm=this
    var updates={}
    if(this.person.unread!==0){
      for(let i in this.person.users[vm.uid].unread){
        var m=this.person.users[vm.uid].unread[i]
        updates["/chats/"+this.chatId+"/content/messages/"+m+"/read"]=true
      }
      updates["/chats/"+this.chatId+"/summary/users/"+this.fbs.currentUser().uid+"/unread"]=0
      this.fbs.setDatabase("/dummybase",updates,false).then(function(res){
        vm.fbs.getDatabase("/chats/"+this.chatId+"/summary",true).then(function(res){
          this.person=res
        }).catch(function(err){

        })
      }).catch(function(err){

      })
    }
  }
  deleteChat(){
    var vm=this
    var lc=this.lc.create({
      content:"Deleting chat..."
    })
    lc.present()
    vm.fbs.setDatabase("/chats/"+this.chatId+"/deleted", true,true).then(function(res){
      console.log(res)
      lc.dismiss()
      vm.navCtrl.pop()
    })

  }
  sendMessage(){
    //if vm.messages was initially zero, indicates a new chat initiation so call upon create chat.
    if(this.pictureUrl!==""||this.message!==""){
      this.sendable.content=this.message
      this.sendable.sender=this.user
      this.sendable.senderUid=this.uid
      this.sendable.resUid=this.oUserUid||this.person.uid
      this.sendable.receiver=this.oUser
      this.sendable.time=Date.now()
      this.sendable.picture=this.pictureUrl
      this.sendable.video=this.videoUrl
      this.sendable.file=this.fileUrl
      this.sendable.read=false
      this.sendable.sent=false
      if(!this.person.users){
        this.messages.unshift(this.sendable)
        this.createChat().then((res)=>{
          console.log("chat created")
          this.spoken=true
        })
      }else{
        this.messages.unshift(this.sendable)
        this.doneSending()
      }
    }
  }

  doneSending(){
    var vm=this
    this.subc.unsubscribe()
    if(this.person.users[this.uid].firstMessage===null){
      this.fbs.setDatabase("/chats/"+this.chatId+"/users/"+this.uid+"/firstMessage",this.sendable,true).then(function(res){
        // this.fbs.setList("/users/"+this.uid+"/people",this.chatId).then(function(res){
        //
        // })
      })
    }
    this.fbs.setList("/chats/"+this.chatId+"/content/messages/",this.sendable)
    .then(function(res){
      if(vm.person.users[vm.oUserUid].unread===0){
        vm.person.users[vm.oUserUid].unread={}
        vm.person.users[vm.oUserUid].unread[Object.keys(vm.person.users[vm.oUserUid].unread).length]=res
      }else{
        vm.person.users[vm.oUserUid].unread[Object.keys(vm.person.users[vm.oUserUid].unread).length]=res
      }

      var value={}
      value["/chats/"+vm.chatId+"/summary/users/"+vm.oUserUid+"/unread"]=vm.person.users[vm.oUserUid].unread
      value["/chats/"+vm.chatId+"/summary/lastMessage/"]=vm.sendable
      value["/chats/"+vm.chatId+"/summary/lastTime/"]=vm.sendable.time

      this.fbs.setDatabase("/seceretFiles/",value,false).then(function(res){
          vm.sendable= new Message()
      }).catch(function(err){
        console.log("error sending message",err)
      })
    }).catch(function(err){

    })
  }
  cancel() {
    this.subc.unsubscribe()
    this.viewCtrl.dismiss();
  }
}
