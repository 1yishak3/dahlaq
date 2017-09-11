import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular'
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import {MediaCapture,MediaFile,CaptureError,CaptureImageOptions,CaptureVideoOptions} from '@ionic-native/media-capture'
import { File,FileEntry } from '@ionic-native/file'
//import {ImageResizer} from '@ionic-native/image-resizer'
import { Ng2ImgToolsService } from 'ng2-img-tools'
import { Camera as Cam} from '@ionic-native/camera'
@Injectable()
export class Camera{

  constructor(public c:Cam,public ir:Ng2ImgToolsService,public plt:Platform,public fl: File,public mc:MediaCapture){

  }
  takePicture(limit){
    console.log("Do you even get here? Camera")
    var options:CaptureImageOptions={limit:limit}
    return new Promise((resolve,reject)=>{
      console.log("And here? CAMERA")
      this.mc.captureImage(options).then((data)=>{
        console.log("Camera Success",data)
        resolve(data[0])
      }).catch((err)=>{
        console.log("Camera error,",err)
        reject(err)
      })

    })
  }
  takeVideo(limit){
    var options:CaptureImageOptions={limit:limit}
    return new Promise((resolve,reject)=>{
      this.mc.captureVideo(options).then((data)=>{
        console.log("Camera Success",data)
        resolve(data[0])
      }).catch((err)=>{
        console.log("Camera error,",err)
        reject(err)
      })

    })
  }
  takeAudio(limit){
    var options:CaptureImageOptions={limit:limit}
    return new Promise((resolve,reject)=>{
      this.mc.captureAudio(options).then((data)=>{
        console.log("Record Success",data)
        resolve(data[0])
      }).catch((err)=>{
        console.log("Record error,",err)
        reject(err)
      })
    })
  }
  gf(url){
    return new Promise((resolve,reject)=>{
      this.fl.resolveLocalFilesystemUrl(url).then((fileEntry)=>{
        console.log(fileEntry)
        resolve(fileEntry)
      }).catch((err)=>{
        console.log(err)
        reject(err)
      })
    })
  }
  getFile(data:any){
    var vm=this
    return new Promise ((resolve,reject)=>{
      vm.plt.ready().then((res)=>{
        var path="file://"+data.fullPath.substring(7,data.fullPath.lastIndexOf("/"))
        console.log(path)
        this.fl.readAsDataURL(path,data.name).then((res:any)=>{
          var file=res
          console.log("Let's see what happens,",file)
          if(file.type.match("image.*")){
            var k=[]
            k.push(file)
            vm.ir.resize(k,450,450).subscribe(res2=>{
              console.log(res2)
              resolve(res2)
            },err=>{
              console.log("errrrrrrror ",err)
            })
          }else{
            resolve(file)
          }
        }).catch((err)=>{
          console.log("Shit, turned out to be an error", err)
        })
        // vm.gf(url).then(function(res:FileEntry){
        //
        //   res.file((res)=>{
        //     console.log(res)

        //
        //   },(err)=>{
        //     console.log("res probs, ",err)
        //   })
        //
        // }).catch(function(err){
        //   console.log("you should learn to log more",err)
        //   reject(err)
        // })



        //////If this doesn't work out, make sure you go on to use the normal file getter.
        // var options = {
        //   uri: url,
        //   folderName: "Protonet Messenger",
        //   quality: 90,
        //   width: 600,
        //   height: 400};
        // this.ir.resize(options).then(function(img){
        //   resolve(img)
        // }).catch(function(res){
        //   console.log(res)
        // })
      }).catch(function(err){
        console.log("Error preparing device",err)
      })
    })

  }

}
