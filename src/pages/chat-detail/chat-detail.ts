import { Component, ElementRef, ViewChild, Renderer2, AfterViewChecked } from '@angular/core';

import { NavController, NavParams, ViewController,AlertController,LoadingController,Content, TextInput, Platform } from 'ionic-angular';
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
import { Keyboard } from '@ionic-native/keyboard';
import {Storage} from '@ionic/storage'
@Component({
  selector: 'page-content',
  templateUrl: 'chat-detail.html',
})
export class ChatPage implements AfterViewChecked{
  @ViewChild('text') text:any
  @ViewChild('content') cont:any
  @ViewChild('fileInput') fileInput:ElementRef
  @ViewChild(Content) content:Content
  person:any
  messages:Array<any>=[]
  textarea: any
  message:string=""
  sendable:any=new Message()
  messageCtrl= new FormControl()
  chat:Chat
  subc:any
  chatId:any
  oUser:any
  user:any
  ready=false
  typing=false
  registered=false
  pictureUrl:any=""
  videoUrl:any=""
  fileUrl:any=""
  timer:any
  oUserUid:any
  uid:any
  toggled:boolean=false
  online:any
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
  tempMes:any=[]
  sub:any
  pic:any
  _isOpenEmojiPicker = false
  tpd:any
  fbs:FirebaseService
  cpic:any
  cacher:any
  constructor(public platform:Platform,
    public sg:Storage,public keyb:Keyboard,
    public ir:Ng2ImgToolsService,
    public camera:Camera,
    public lc:LoadingController,
    public nw:Network,
    public alertCtrl:AlertController,
    private rd:Renderer2,
    public navCtrl: NavController,
    public navParam:NavParams,
    public viewCtrl:ViewController) {
    this.firstTime=true
    console.log("here?")

    this.person=navParam.get('person');

    this.fbs =navParam.get('fbs')
    console.log(this.person)
    this.user=this.fbs.currentUser().displayName
    this.uid=this.fbs.currentUser().uid
    this.keyb=new Keyboard()
    this.platform.ready().then((a)=>{
      console.log("here?")
      this.keyb.disableScroll(true)
    })
    this.keyb.onKeyboardShow().subscribe((v)=>{
      console.log("yes please")


      this.content.resize()
      console.log("Am I being resized?1")
    })
    this.keyb.onKeyboardHide().subscribe((v)=>{
      this.content.resize()
      console.log("Am I being resized?2")
    })

    if(this.person.chatId){
      this.spoken=true
      for(let i in this.person.users){
        if(i!==this.uid){

          this.oUser=this.person.users[i].username
          this.oUserUid=i
        }
        console.log(this.oUserUid)


      }
      this.fbs.getDatabase("/users/"+this.oUserUid+"/basic/currentPic",true).then((res)=>{
        console.log(res)
        this.cpic=res
      })
      this.fbs.getRef("/chats/"+this.chatId+"/content/mCache").on("value",(cacher)=>{
        if(this.cacher){
          if(this.cacher!==cacher){
            this.doMessaging()
          }
        }else{
          this.doMessaging()
        }
      })

    }else{
      this.cpic=this.person.currentPic
      this.oUser=this.person.username
      this.oUserUid=this.person.uid
      this.spoken=false
      this.fbs.getDatabase("/users/"+this.oUserUid+"/basic/currentPic",true).then((res)=>{
        console.log(res)
        this.cpic=res
      })
    }
    this.fbs.getDatabase("/users/"+this.oUserUid+"/basic/currentPic",true).then((res)=>{
      console.log(res)
      this.cpic=res
    })
    this.user=this.fbs.currentUser().displayName
    this.uid=this.fbs.currentUser().uid

    console.log(this.oUser,this.oUserUid)
    this.conquer()
   }
   openPerson(){
     this.viewCtrl.dismiss()
     this.navCtrl.push(ItemDetailPage,{person:this.oUserUid})
   }
   conquer(){
     var online=this.fbs.getRef("/users/"+this.oUserUid+"/basic/online/")
     online.on('value',(res)=>{
       this.online=res.val()
     })
     this.sub=this.fbs.getRef("/chats/"+this.person.chatId+"/summary/users/"+this.oUserUid+"/typing")
     this.sub.on('value',(snap)=>{
       this.typing=snap.val()
     })
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
    // this.subscribe()
     //console.log("this.text",this.text)
     if(this.spoken){
       if(this.message.length<41){

         this.text._elementRef.nativeElement.style.overflow="hidden";
         this.text._elementRef.nativeElement.style.height="35px"
       }
       else{
         this.text._elementRef.nativeElement.style.overflow="auto"
         this.text._elementRef.nativeElement.scrollTop=this.text._elementRef.nativeElement.scrollHeight
         this.text._elementRef.nativeElement.style.height = (this.text._elementRef.nativeElement.scrollHeight-22) +"px";
      }
    }



  }
  keydown(event){
    console.log("keydown event has been triggered")
    if(this.tpd){
      this.fbs.setDatabase("/chats/"+this.chatId+"/users/"+this.fbs.currentUser().uid+"/typing",true,true)
      .then((res)=>{
        console.log("Set it already")
        this.tpd=false
      })
      .catch((err)=>{
        console.log("err, ",err)
        this.tpd=true
      })
    }
    var vm=this
    clearTimeout(timer)
    var then=vm.message
    var timer=setTimeout(()=>{
      console.log("In the timeout...")

      var now=vm.message
      if(now===then){
        console.log("setting database")
        vm.fbs.setDatabase("/chats/"+vm.chatId+"/users/"+vm.fbs.currentUser().uid+"/typing",false,true)
        .then((res)=>{
          console.log("Set it already")
          this.tpd=true
        })
        .catch((err)=>{
          this.tpd=false
          console.log("err, ",err)
        })
      }
    },666)



  }
  ionViewDidLoad(){

  }
  ionViewWillEnter(){
    console.log("entering")

    // var online=this.fbs.getRef("/users/"+this.oUserUid+"/basic/online/")
    // online.on('value',(res)=>{
    //   this.online=res.val()
    //   console.log("status",this.online)
    // },(err)=>{
    //   console.log("some error,",err)
    // })

    //this.person=this.navParam.get('person');


    if(this.firstTime){
      console.log("FIRST TIME")

      this.doMessaging()
      this.firstTime=false
      console.log(this.messages)
    }
    console.log("herre?")
    if(this.person.chatId){
      console.log("not a virgin")
      this.getNew()
      console.log(this.messages)
    //  this.readAll()
    }

  }
  getNew(){
    var unread=this.person.users[this.uid].unread
    if(unread!==0){
      for(let i in unread){
        this.fbs.getDatabase("/chats/"+this.person.chatId+"/content/messages/"+unread[i],true).then((res:any)=>{

          this.tempMes.push(new Message(this.fbs,res,this.person.chatId,unread[i]))
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

        }
      }
      this.messages.push(this.person.lastMessage)
      this.fbs.getLimited("/chats/"+this.person.chatId+"/content/messages",50,"time").then((res)=>{
        //chat arrangments here
        //for(let i in res){
        //  vm.chat[i]=res[i]
        //}
        // vm.chat.content.messages=res
        this.sg.set("recentFifti",res)
        this.fbs.getDatabase("/chats/"+this.chatId+"/content/mCache",true).then((re)=>{
          this.sg.set("recentFiftiCache",re)
          this.cacher=re
        })
        vm.tempMes=[]
        console.log(res)
        var messages=res
        for (let i in messages){
          vm.tempMes.push(new Message(this.fbs,messages[i],this.person.chatId,i))
        }
        console.log("tempMes",vm.tempMes)
        vm.tempMes.sort((a,b)=>{
          return b.time-a.time
        })
        vm.messages=vm.tempMes
        console.log(vm.messages)

      },(err)=>{
          console.log("got this instead of beutifully ordered messages", err)
      })
    }else{
      //about sendding a habesha hi
      vm.spoken=false
    }
  }
  handleEmoji(e){
    this._isOpenEmojiPicker = !this._isOpenEmojiPicker;
       if (!this._isOpenEmojiPicker) {
           this.text.setFocus();
       }
       this.content.resize();
       this.scrollToBottom();
  }
  scrollToBottom() {
       setTimeout(() => {
           if (this.content.scrollToTop) {
               this.content.scrollToTop();
           }
       }, 400)
   }

  signalTyping(){
    var val=true
    this.fbs.setDatabase("/chats/"+this.chatId+"/users/"+this.fbs.currentUser().uid+"/typing",val,true).then((res)=>{
      this.subc.unsubscribe()
    })
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
      this.camera.takePicture(1).then(function(data:any){
        cam.getFile(data.fullpath).then(function(file){
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
      this.fileInput.nativeElement.click();
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
    var k=[]
    k.push(file)
    vm.ir.resize(k,450,450).subscribe(res=>{
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
    this.chat=new Chat()
    return new Promise((resolve,reject)=>{
      var vm=this
      this.chatId=this.person.uid+"_"+this.uid+"_"+Date.now()
      //customize the chat before setting it
      var crat=this.uid
      var nCrat=this.person.uid
      var users={}
      var photo=this.fbs.currentUser().photoURL
      users[crat]={
        creater:true,
        username:this.user,
        image:photo,
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
      console.log("I have reached here")

      this.chat.summary.chatId=this.chatId

      this.chat.summary.lastTime=this.sendable.time
      for(let i in vm.messages){
        var thi={}
        thi["sender"]=vm.messages[i].sender
        thi["receiver"]=vm.messages[i].receiver
        thi["content"]=vm.messages[i].content
        thi["time"]=vm.messages[i].time
        thi["picture"]=vm.messages[i].picture
        thi["read"]=vm.messages[i].read
        thi["sent"]=vm.messages[i].sent
        thi["senderUid"]=vm.messages[i].senderUid
        thi["resUid"]=vm.messages[i].resUid
        this.chat.content.messages[i]=thi
        if(vm.messages.length-1===Number(i)){
          this.chat.summary.lastMessage= thi
        }
        if(vm.messages.length-1===0){
            users[crat].firstMessage=thi
        }
        console.log("In the for loop")
      }
      this.chat.summary["users"]=users
      console.log("At setDatabase...gud fela",this.chatId, this.chat)
      this.fbs.setDatabase("/chats/"+this.chatId,this.chat,true).then(function(res){
        vm.registered=true
        console.log("Gotten sent?")
        vm.person=vm.chat.summary
        vm.spoken=true
      }).catch(function(err){
        console.log("hello, anyone here?", err)
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
    if (!this._isOpenEmojiPicker) {
      this.text.setFocus();
    }

    if((this.pictureUrl!==""||this.message!=="")&&!this.uploading){
      console.log(this.message)

      this.sendable.content=_.cloneDeep(this.message)
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
      this.message=""
      this.pictureUrl=""
      this.complete=false;
      this.uploading=false;
      console.log("cont, ",this.cont)
      if(this.cont){
        this.cont._elementRef.nativeElement.scrollTop=0
      }
      if(!this.person.users){

        this.messages.unshift(this.sendable)
        console.log(this.message,this.sendable)
        console.log(this.messages)
        this.createChat().then((res)=>{
          console.log("chat created")
          this.spoken=true
        })
      }else{
        this.messages.unshift(this.sendable)
        this.message=""
        if(this.spoken){
          this.text._elementRef.nativeElement.style.height="35px"
          this.text._elementRef.nativeElement.scrollTop=0
        }

        this.doneSending().then(()=>{
          this.message=""
          this.currentFile=""
          this.uploading=false
        }).catch((err)=>{
          console.log("Error",err)
        })
      }
    }
  }

  doneSending(){
    return new Promise((resolve,reject)=>{
      var vm=this

      var thi={}
      thi["sender"]=vm.sendable.sender
      thi["receiver"]=vm.sendable.receiver
      thi["content"]=vm.sendable.content
      thi["time"]=vm.sendable.time
      thi["picture"]=vm.sendable.picture
      thi["read"]=vm.sendable.read
      thi["sent"]=vm.sendable.sent
      thi["senderUid"]=vm.sendable.senderUid
      thi["resUid"]=vm.sendable.resUid
      if(this.person.users[this.uid].firstMessage===null){
        this.fbs.setDatabase("/chats/"+this.chatId+"/users/"+this.uid+"/firstMessage",thi,true).then(function(res){
          // this.fbs.setList("/users/"+this.uid+"/people",this.chatId).then(function(res){
          //
          // })
          console.log("What what?")
        })
      }
      this.fbs.setList("/chats/"+this.chatId+"/content/messages/",thi)
      .then((res)=>{
        if(vm.person.users[vm.oUserUid].unread===0){
          vm.person.users[vm.oUserUid].unread={}
          vm.person.users[vm.oUserUid].unread[Object.keys(vm.person.users[vm.oUserUid].unread).length]=res
        }else{
          vm.person.users[vm.oUserUid].unread[Object.keys(vm.person.users[vm.oUserUid].unread).length]=res
        }

        var value={}
        value["/chats/"+vm.chatId+"/summary/users/"+vm.oUserUid+"/unread"]=vm.person.users[vm.oUserUid].unread
        value["/chats/"+vm.chatId+"/summary/lastMessage/"]=thi
        value["/chats/"+vm.chatId+"/summary/lastTime/"]=vm.sendable.time

        this.fbs.setDatabase("/seceretFiles/",value,false).then(function(res){
            vm.sendable= new Message()
            resolve()
        }).catch(function(err){
          console.log("error sending message",err)
          reject(err)
        })
      }).catch(function(err){
        console.log("this error occured, ",err)
        reject(err)
      })
    })

  }
  cancel() {

    this.viewCtrl.dismiss();
  }
}
