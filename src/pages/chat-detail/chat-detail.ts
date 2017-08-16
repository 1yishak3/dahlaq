import { Component, ElementRef, ViewChild, Renderer2, AfterViewChecked } from '@angular/core';

import { NavController, NavParams, ViewController,AlertController } from 'ionic-angular';
import { FirebaseService } from '../../providers/firebase'
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { Chat } from '../../models/chat'
import { Message } from '../../models/message'
import * as _ from "lodash"

@Component({
  selector: 'page-content',
  templateUrl: 'chat-detail.html',
})
export class ChatPage implements AfterViewChecked{
  @ViewChild('textt') text:any
  person:any
  messages:Array<any>
  textarea: any
  message:string
  sendable:Message
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
  constructor(public alertCtrl:AlertController,public fbs:FirebaseService,private rd:Renderer2, public navCtrl: NavController, public navParam:NavParams, public viewCtrl:ViewController) {
    this.person=navParam.get('person');

    this.user=fbs.currentUser().displayName
    this.uid=fbs.currentUser().uid
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
    this.text.keydown(function(){
      clearTimeout(this.timer)
      var then=this.message
      var vm=this
      setTimeout(function(){
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
    this.person=this.navParam.get('person');
    var vm=this
    if(this.person.chatId!==undefined){
      this.readAll()
      this.chatId=this.person.chatId
      for(let i in this.person.users){
        if(i!==this.fbs.currentUser().uid){
            this.oUser=this.person.users[i].username
            this.oUserUid=i
            this.fbs.getDatabase("/users/"+this.oUserUid+"/basic/online",false).then(function(res){
              vm.online=res
            })
        }
      }
      this.messages.push(this.person.lastMessage)
      this.fbs.getLimited("/chats/"+this.person.chatId+"/content/messages",75).then(function(res){
        //chat arrangments here
        //for(let i in res){
        //  vm.chat[i]=res[i]
        //}
        vm.chat.content.messages=res
        vm.messages=[]
        for (let i in vm.chat.content.messages){
          vm.messages.push(vm.chat.content.messages[i])
          console.log(i)
        }
        vm.messages.reverse()
        vm.ready=true
      }).catch(function(err){
          console.log("got this instead of beutifully ordered messages", err)
      })
    }else{
      //???
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
    if(this.person.chatId){
    this.fbs.setDatabase("/chats/"+this.chatId+"/users/"+this.fbs.currentUser().uid+"/unread",0,true).then
  }

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
  //
  //
  //
  //Take Care of uploading pics vids and filez using your previous code.
  //Create a service if you're not too lazy
  /*generateFileName(typ){
    var type=typ.name
    var name = this.fbs.currentUser().uid+"_"+Date.now()+type.substring(type.lastIndexOf("."),type.lastIndexOf(""))
    console.log(name)
    return name
  }
  getPicture(upload) {
    var cam=this.camera
    var vm = this.fbs
    var vm1=this.generateFileName
    if(!upload){
      var fp=this.processFile
      this.camera.takePicture(1).then(function(data){

        cam.getFile(data[0].fullpath).then(function(file){
          var pic = vm1(file)
          var url=vm.currentUser().uid+"/images/"+pic
          fp(url,file)
        }).catch(function(err){

        })
      }).catch(function(err){

      })
    }else{
      this.fileInput._elementRef.nativeElement.click();
    }
    //console.log(this.camera)
    // if (Camera['installed']()) {
    //   this.camera.getPicture({
    //     destinationType: this.camera.DestinationType.DATA_URL,
    //     targetWidth: 150,
    //     targetHeight: 150
    //   }).then((data) => {
    //     this.form.patchValue({ 'postData': 'data:image/jpg;base64,' + data });
    //   }, (err) => {
    //     alert('Unable to take photo');
    //   })
  //  }else {
  //     this.fileInput.nativeElement.click();
  //   }
  }
  getVideo(upload) {
    var cam=this.camera
    var vm = this.fbs
    var vm1=this.generateFileName
    if(!upload){
      var fp=this.processFile
      this.camera.takeVideo(1).then(function(data){

        cam.getFile(data[0].fullpath).then(function(file){
          var pic = vm1(file)
          var url=vm.currentUser().uid+"/videos/"+pic
          fp(url,file)
        }).catch(function(err){

        })
      }).catch(function(err){

      })
    }else{

      this.fileInput1._elementRef.nativeElement.click();
    }
  }

  getAttache() {
    this.fileInput2._elementRef.nativeElement.click();
  }
  onChangeInput(e){
    //display a uploading spinner fot the user to wait until it finishes
    var file=e.target.files[0]
    var pic= this.generateFileName(file)
    var url=this.fbs.currentUser().uid+"/videos/"+pic
    var pst = this.post
    this.fbs.setStorage(url,file).then(function(res){
      this.fbs.getStorage(url).then(function(res){
        console.log(res)
        if(this.get===1){
          pst.content.imageUrl=res
        }else if(this.get===2){
          pst.content.videoUrl=res
        }else if(this.get===3){
          pst.content.fileUrl=res
        }
      }).catch(function(err){
        console.log("URL get error", err)
      })
    })
  }

  processFile(url,fil) {
    var vm = this.fbs
    var pst =  this.post
    fil.file(function(file){
      vm.setStorage(url,file).then(function(res){
        vm.getStorage(url).then(function(res){
          console.log(res)
          if(this.get===1){
            pst.content.imageUrl=res
          }else if(this.get===2){
            pst.content.videoUrl=res
          }else if(this.get===3){
            pst.content.fileUrl=res
          }
        }).catch(function(err){
          console.log("URL get error", err)
        })
      })
    },function(err){
      console.log(err)
    })
  }
*/
  //Emoji's to be finally considered(that is after you are done with most things messaging)
  //
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
        this.fbs.setList("/users/"+this.uid+"/people",this.chatId).then(function(res){

        })

      }).catch(function(err){
        //you need to learn to wait for connectivity. Or does Firebase do that for you? Questions..
      })
    })
  }
  readAll(){
    var j=0
    var vm=this
    var updates={}
    for(let i in this.person.unread){
      var m=this.person.unread[i]
      updates["/chats/"+this.chatId+"/content/messages/"+m+"/read"]=true
    }
    updates["/chats/"+this.chatId+"/summary/users/"+this.fbs.currentUser().uid+"/unread"]={}
    this.fbs.setDatabase("/dummybase",updates,false).then(function(res){
      vm.fbs.getDatabase("/chats/"+this.chatId+"/summary",true).then(function(res){
        this.person=res
      }).catch(function(err){

      })
    }).catch(function(err){

    })
  }
  deleteChat(){
    this.fbs.rmDatabase("/users/"+this.uid+"/people/"+this.chatId).then(function(res){
      this.fbs.rmDatabase("/users/"+this.oUserUid+"/people/"+this.chatId).then(function(res){

      })
    })
  }
  sendMessage(){
    //if vm.messages was initially zero, indicates a new chat initiation so call upon create chat.
    this.sendable.content=this.message
    this.sendable.sender=this.user
    this.sendable.receiver=this.oUser
    this.sendable.time=Date.now()
    this.sendable.picture=this.pictureUrl
    this.sendable.video=this.videoUrl
    this.sendable.file=this.fileUrl
    this.sendable.read=false
    if(this.messages.length===0){
      this.messages.unshift(this.sendable)
      this.createChat().then(function(res){
        console.log("chat created")
      })
    }else{
      this.messages.unshift(this.sendable)
      this.doneSending()
    }
  }

  doneSending(){
    var vm=this
    this.subc.unsubscribe()
    if(this.person.users[this.uid].firstMessage===null){
      this.fbs.setDatabase("/chats/"+this.chatId+"/users/"+this.uid+"/firstMessage",this.sendable,true).then(function(res){
        this.fbs.setList("/users/"+this.uid+"/people",this.chatId).then(function(res){

        })
      })
    }
    this.fbs.setList("/chats/"+this.chatId+"/content/messages/",this.sendable)
    .then(function(res){
      vm.person.users[vm.oUserUid].unread[Object.keys(vm.person.users[vm.oUserUid].unread).length]=res
      var value={}
      value["/chats/"+vm.chatId+"/summary/users/"+vm.oUserUid+"/unread"]=_.cloneDeep(vm.person.users[vm.oUserUid].unread)
      value["/chats/"+vm.chatId+"/summary/lastMessage/"]=_.cloneDeep(vm.sendable)
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
    this.viewCtrl.dismiss(this.person);
  }
}
