import { Component, ViewChild,ElementRef,OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Nav,Tabs,NavController, ViewController,AlertController,LoadingController,ToastController ,Content, Platform} from 'ionic-angular';
import { Post } from '../../models/post'
import { Camera } from '../../providers/camera';
import { FirebaseService } from '../../providers/firebase'
import { Network } from '@ionic-native/network'
//import { PopoverPage } from '../popovers/propop'
import {Ng2ImgToolsService} from 'ng2-img-tools'
import {Keyboard} from '@ionic-native/keyboard'
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput:ElementRef;
  @ViewChild('fileInput1') fileInput1:any;
  @ViewChild('fileInput2') fileInput2:ElementRef;
  @ViewChild(Content) content:Content
//  app:App
  isReadyToPost: boolean;
  post:Post
  item: any;
  postId:any
  bool:any
  get:number
  text:string
  reach=0
  uid:any
  user:any
  uploading:boolean
  progress:number=0
  currentFile:any
  true:boolean
  complete:boolean
  tabs:Tabs
  connected:boolean
  show:any=true
  max:any
  basic:any
  constructor(public platform:Platform,
    public keyb:Keyboard,
    public ir: Ng2ImgToolsService ,
    public nw:Network,
    public toastCtrl:ToastController,
    public loadCtrl: LoadingController,
    public alertCtrl:AlertController,
    public fbs: FirebaseService,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public camera: Camera,
    private nav:Nav) {
    this.post=new Post(fbs,navCtrl)
    //console.log("app: ",this.app)
    this.tabs=navCtrl.parent
    this.user=fbs.currentUser()
    this.uid =fbs.currentUser().uid
    this.uploading=false
    this.true=false
    var vm=this
    this.keyb=new Keyboard()
    platform.ready().then((a)=>{
      console.log("here lies disableScroll")
      this.keyb.disableScroll(true)
    })
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
  }
  ngOnInit(){

  }
  ionViewWillEnter(){
    console.log("in after view init")
    this.keyb.onKeyboardShow().subscribe((v)=>{
      console.log("yes please")
      this.content.resize()
      console.log("Am I being resized?1")
    })
    this.keyb.onKeyboardHide().subscribe((v)=>{
      this.content.resize()
      console.log("Am I being resized?2")
    })

    var vm=this
    this.fbs.getDatabase("/users/"+this.uid+"/reachLimit",true).then((max)=>{

      this.fbs.getDatabase("/users/"+this.uid+"/basic",true).then((res)=>{
        vm.max=max
        this.basic=res

      })
    }).catch((err)=>{
      console.log(err)

    })

  }
  // ionViewWillEnter(){
  //
  // }
  ionViewDidEnter(){
    this.platform.ready().then(() => {
      this.keyb.disableScroll(true);
    });
  }

  ngAfterViewInit(){

  }
  showChoices(e,bool,num){
    this.bool=bool
    this.get=num
    if(bool===true){
      let pop = this.alertCtrl.create({
        title:"Choose Method",
        cssClass:"black",
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
    else if(bool===false){
      let pop = this.alertCtrl.create({
        title:"Choose Method",
        buttons:[{
          text:"Open Camera",
          handler:dat=>{
            this.getVideo(false)
          }
        },{
          text:"Open Files",

          handler:dat=>{
            this.getVideo(true)
          }
        },{
          text:"Cancel",
          role:"cancel",
          handler: dar=>{console.log('cancelled')}
        }]
      })
      pop.present()
    }
    else if(bool===null){
      this.getAttache()
    }
  }

  ionViewDidLoad() {

  }
  generatePostId(){
    var uid = this.fbs.currentUser().uid
    var time = Date.now();
    console.log(uid+time)
    this.post.postId = uid+"_"+time
    this.postId=this.post.postId
  }
  submitPost(){
    this.true=false
    var load1=this.loadCtrl.create({
      content:"Posting..."
    })
    load1.present()
    if(!this.uploading){
      if(this.user!==null){
      var vm=this.fbs
      var vm1=this
      if(!this.post.postId){
        this.generatePostId()
      }
      this.post.poster.username=this.user.displayName
      this.post.poster.digits=this.user.phoneNumber
      this.post.poster.uid=this.user.uid
      this.post.poster.profilePic=this.basic.currentPic

      this.post.poster.desiredReach=this.reach
      console.log(this.reach)
      console.log(this.post.poster.desiredReach)
      this.post.content.description=this.text
      var poste={
      }
      poste["postId"]=this.post.postId
      poste["time"]=Date.now()
      poste["poster"]=this.post.poster
      poste["content"]=this.post.content
      poste["deleted"]=false
      poste["likes"]=0
      poste["dislikes"]=0
      poste["boosts"]=0
      poste["reach"]=0
      poste["reports"]=0
      this.fbs.setDatabase("/posts/"+this.post.postId,poste,true).then(function(res){
        console.log("Success with, ",res)
        //pop up notifying success
        //pop to posts tab

        // vm1.app.getRootNav().getActiveChildNav().select(1);
        //vm1.navCtrl.parent.select(0)
        //vm.setDatabase("/dummybase",{""})
        vm1.text=""
        vm1.reach=0
        vm1.post = new Post(vm1.fbs,vm1.navCtrl)
        vm1.true=true
        vm1.currentFile=null
        vm1.complete=false
        load1.dismiss()
        var toast=vm1.toastCtrl.create({
          message: "Your post has been submitted!",
          duration: 2500,
          position: 'top'
        })
        toast.present()

        vm.getDatabase("/users/"+vm1.uid+"/viewables",true).then(function(res){
          var resu= "/users/"+vm1.uid+"/viewables"
          console.log(resu)
          if(res===0){
            console.log("in here")
            vm.setDatabase(resu,{"0":vm1.postId},true).then(function(res){
              vm.setDatabase(resu+"/cache",Date.now(),true).then(()=>{
                vm1.tabs.select(0)
                console.log("success setting viewables")

              })

            }).catch()
          }else{
            console.log("not in there")
            vm.setList(resu,vm1.postId).then(function(res){
              vm.setDatabase(resu+"/cache",Date.now(),true).then(()=>{
                vm1.tabs.select(0)
              

              })
              console.log("Added to viewables.",res)
              console.log(res)
            }).catch(function(err){
              console.log("What is the error", err)
            })
          }
        })
        vm.getDatabase("/users/"+vm1.uid+"/userPosts",true).then(function(res){
          var resu="/users/"+vm1.uid+"/userPosts"
          console.log(resu)
          if(res===0){
            console.log("in here")
            vm.setDatabase(resu,{"0":vm1.postId},true).then(function(res){
              console.log("success setting user posts")
            }).catch()
          }else{
            console.log("not in there")
            vm.setList(resu,vm1.postId).then(function(res){
              console.log("Added to user posts")
            }).catch(function(err){
              console.log("What is the error", err)
            })
          }
        })
        vm.getDatabase("/adminsLists/posts",true).then(function(res){
          var resu="/adminsLists/posts"
          console.log(resu)
          if(res===0){
            console.log("in here")
            vm.setDatabase(resu,{"0":{"pid":vm1.postId,"uid":vm1.uid}},true).then(function(res){
              console.log("success setting adminslist posts")
            }).catch()
          }else{
            console.log("Not in there")
            vm.setList(resu,{"pid":vm1.postId,"uid":vm1.uid}).then(function(res){
              console.log("Successfully added to admin's list with key: ",res)
            }).catch(function(err){
              console.log("Sorry, couldn't add you to the list", err)
            })
          }
        })
      }).catch(function(err){
        console.log(err)

      })
    }
  }else{
    console.log("Dude! Chill! Wait for the upload to finish!")
    var alert=this.alertCtrl.create({
      /////////////////////////////////////////
    })
  }

  }
  generateFileName(typ){
    var type=typ.name
    var name = this.uid+"_"+Date.now()+"_"+type.substring(type.lastIndexOf("."),type.lastIndexOf(""))
    console.log(name)
    return name
  }
  getPicture(upload) {
    var cam=this.camera
    var vm = this.fbs
    var vm2=this
    if(!upload){
      var fp=this.processFile
      this.camera.takePicture(1).then((data:any)=>{
        console.log(data,data.fullPath)
        cam.getFile(data).then((file:any)=>{
          console.log("this is the file, ",file)
          var pic = this.generateFileName(data)
          vm2.currentFile=data.name
          var url="/"+vm.currentUser().uid+"/images/"+pic
          this.processFile(url,file)
        }).catch(function(err){
          console.log("Error, ", err)
        })
      }).catch(function(err){
        console.log("Error taking picture, ",err)
      })
    }else{
    //  console.log(this.fileInput)
      this.fileInput.nativeElement.click()
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
    var vm2=this
    if(!upload){
      var fp=this.processFile
      this.camera.takeVideo(1).then((data:any)=>{

        cam.getFile(data).then((file:any)=>{
          var pic = this.generateFileName(data)
          vm2.currentFile=data.name
          var url=vm.currentUser().uid+"/videos/"+pic
          this.processFile(url,file)
        }).catch(function(err){

        })
      }).catch(function(err){

      })
    }else{
      //console.log("this is fileinput1 to: any : ",this.fileInput1)
      this.fileInput1.nativeElement.click();
    }
  }

  getAttache() {
    this.fileInput2.nativeElement.click();
  }
  onChangeInput(e){
    //display a uploading spinner fot the user to wait until it finishes
    var vm=this
    this.complete=false
    this.uploading=true
    var file=e.target.files[0]
    var pic= this.generateFileName(file)
    vm.currentFile=file.name
    if(file.type.substring(0,file.type.lastIndexOf('/'))=='image'){
      var k=[]
      console.log(file)
      k.push(file)
      vm.ir.resize(k,450,450).subscribe(res=>{
        file=res
        var where=""
        if(vm.get=1){
          where="/images/"
        }else if(vm.get=2){
          where="/videos/"
        }else if(vm.get=3){
          where="/files/"
        }
        var url=this.fbs.currentUser().uid+where+pic
        var pst = this.post
        console.log("this is file",file)
        var task= this.fbs.setStorage(url,file)
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
              if(vm.get===1){
                pst.content.imageUrl=res
              }else if(vm.get===2){
                pst.content.videoUrl=res
              }else if(vm.get===3){
                pst.content.fileUrl=res
              }
              vm.complete=true
              vm.uploading=false
            })
        })
      },err=>{
        console.log("errrrrrrror ",err)
      })
    }else{
      var where=""
      console.log("HEY NOT VIDEO")
      console.log(vm.get)
      if(vm.get===1){
        where="/images/"
      }else if(vm.get===2){
        where="/videos/"
      }else if(vm.get===3){
        where="/files/"
      }
      if(file.type.substring(0,file.type.lastIndexOf('/'))=='video'){
        console.log("sensed a video")
        where="/videos/"
      }
      var url=this.fbs.currentUser().uid+where+pic
      var pst = this.post
      console.log("this is file",file)
      var task= this.fbs.setStorage(url,file)
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
            console.log()
            if(vm.get===1){
            //  pst.content.imageUrl=res
            }else if(vm.get===2){
              pst.content.videoUrl=res
            }else if(vm.get===3){
              pst.content.fileUrl=res
            }
            if(file.type.substring(0,file.type.lastIndexOf('/'))=='video'){
              console.log("sensed a video")
              pst.content.videoUrl=res
            }
            vm.complete=true
            vm.uploading=false
          })
      })
    }

    // this.fbs.setStorage(url,file).then(function(res:any){
    //   vm.progress=(res.bytesTransfered/res.totalBytes)
    //   console.log("Uploaded?")
    //   if(vm.progress===100){
    //     console.log(" Supposedly the download url",res.downloadUrl)
    //     if(vm.get===1){
    //       pst.content.imageUrl=res.downloadUrl
    //     }else if(this.get===2){
    //       pst.content.videoUrl=res.downloadUrl
    //     }else if(this.get===3){
    //       pst.content.fileUrl=res.downloadUrl
    //     }
    //   }
      // this.fbs.getStorage(url).then(function(res){
      //   console.log(res)
      //   if(this.get===1){
      //     pst.content.imageUrl=res
      //   }else if(this.get===2){
      //     pst.content.videoUrl=res
      //   }else if(this.get===3){
      //     pst.content.fileUrl=res
      //   }
      // }).catch(function(err){
      //   console.log("URL get error", err)
      // })
  //     vm.uploading=false
  //   }).catch(function(err){
  //     console.log("error uploading file",err)
  //     vm.uploading=false
  //   })
  // }
  }
  dU(t){
    var URL=t.snapshot.downloadUrl
  }
  processFile(url,fil) {
    console.log("Processing...")
    this.uploading=true
    var vm = this.fbs
    var vm1=this
    var pst =  this.post
      console.log("fileeee2",fil)
      var task= this.fbs.setStorage(url,fil,true)
      task.on('state_changed',(snap:any)=>{
        console.log(snap.bytesTransferred)
        console.log(snap.totalBytes)

        vm1.progress=(Number(snap.bytesTransferred)/Number(snap.totalBytes))*100
        console.log(vm1.progress)
        if(vm1.progress===100){
          vm.getStorage(url).then((res:any)=>{
            if(vm1.get===1){
              pst.content.imageUrl=res
            }else if(vm1.get===2){
              pst.content.videoUrl=res
            }else if(vm1.get===3){
              pst.content.fileUrl=res
            }
            vm1.complete=true
            vm1.uploading=false
          })
          console.log(vm1.complete,vm1.uploading)
        }

        console.log("this is your snapshot, ",snap)
      },(err)=>{
          console.log("This is your error",err)
      })
      // this.fbs.setStorage(url,file).then(function(res:any){
      //   vm1.progress=(res.bytesTransfered/res.totalBytes)
      //   if(this.get===1){
      //     pst.content.imageUrl=res.downloadUrl
      //   }else if(this.get===2){
      //     pst.content.videoUrl=res.downloadUrl
      //   }else if(this.get===3){
      //     pst.content.fileUrl=res.downloadUrl
      //   }
      //   // this.fbs.getStorage(url).then(function(res){
      //   //   console.log(res)
      //   //   if(this.get===1){
      //   //     pst.content.imageUrl=res
      //   //   }else if(this.get===2){
      //   //     pst.content.videoUrl=res
      //   //   }else if(this.get===3){
      //   //     pst.content.fileUrl=res
      //   //   }
      //   // }).catch(function(err){
      //   //   console.log("URL get error", err)
      //   // })
      //   vm1.uploading=false
      // }).catch(function(err){
      //   console.log("error uploading file",err)
      //   vm1.uploading=false
      // })

  }

  getProfileImageStyle() {
    //return 'url(' + this.form.controls['postData'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.text=""
    this.reach=0
    this.post = new Post(this.fbs,this.navCtrl)
    this.currentFile=null
    this.tabs.select(0)
    this.complete=false
    this.uploading=false
    //this.app.getRootNav().getActiveChildNav().select(1)
  //  getRootNav().getActiveChildNav().select(1)
  //  this.navCtrl.parent.select(0)
  }
  ionViewWillLeave(){
    this.platform.ready().then(() => {
      this.keyb.disableScroll(true);
    });
  }


  getNews() {
  }


}
