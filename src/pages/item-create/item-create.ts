import { Component, ViewChild,ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, ViewController,PopoverController } from 'ionic-angular';
import { Post } from '../../models/post'
import { Camera } from '../../providers/camera';
import { FirebaseService } from '../../providers/firebase'
import { PopoverPage } from '../popovers/propop'


@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;
  @ViewChild('fileInput1') fileInput1;
  @ViewChild('fileInput2') fileInput2;
  isReadyToPost: boolean;
  post:Post
  item: any;
  postId:any
  bool:any
  get:number
  constructor(public popCtrl:PopoverController,public fbs: FirebaseService, public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera) {

  }

  showChoices(e,bool, num){
    this.bool=bool
    this.get=num
    let pop = this.popCtrl.create(PopoverPage)
    pop.present({
      ev:e
    })
  }

  ionViewDidLoad() {

  }
  generatePostId(){
    var uid = this.fbs.currentUser().uid
    var time = Date.now();
    console.log(uid+time)
    this.post.postId = uid+time
  }
  submitPost(){
    var vm=this.fbs
    if(!this.post.postId){
      this.generatePostId()
    }
    this.post.poster.username=this.fbs.currentUser().displayName
    this.post.poster.digits=this.fbs.currentUser().phoneNumber
    this.post.poster.uId=this.fbs.currentUser().uid
    this.post.poster.profilePic=this.fbs.currentUser().photoURL
    this.fbs.setDatabase("posts/"+this.post.postId,this.post,true).then(function(res){
      console.log("Success with, ",res)
      //pop up notifying success
      //pop to posts tab
    }).catch(function(err){
      console.log(err)

    })
    vm.getDatabase("adminsLists/posts",true, vm.currentUser().uid).then(function(res){
      var list=[]
      for(let i in res){
        list.push(res[i])
      }
      list.push(vm.currentUser().uid)
      vm.setDatabase("adminsLists/posts",list,true).then(function(res){
        console.log("Successfully added to admin's list")
      }).catch(function(err){
        console.log("Soory, couldn't add you to the list", err)
      })
    })
  }
  generateFileName(typ){
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

  getProfileImageStyle() {
    //return 'url(' + this.form.controls['postData'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.post = new Post
    this.navCtrl.popToRoot();
  }



  getNews() {
  }


}
