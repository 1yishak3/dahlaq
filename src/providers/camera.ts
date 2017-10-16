import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular'
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import {MediaCapture,MediaFile,CaptureError,CaptureImageOptions,CaptureVideoOptions} from '@ionic-native/media-capture'
import { File,FileEntry } from '@ionic-native/file'
//import {ImageResizer} from '@ionic-native/image-resizer'
import { Ng2ImgToolsService } from 'ng2-img-tools'
import { Camera as Cam, CameraOptions} from '@ionic-native/camera'
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
@Injectable()
export class Camera{
  options:CameraOptions

  constructor(public imageResizer:ImageResizer,public c:Cam,public ir:Ng2ImgToolsService,public plt:Platform,public fl: File,public mc:MediaCapture){
    this.options={
      destinationType:this.c.DestinationType.DATA_URL,
      encodingType:this.c.EncodingType.JPEG,
      sourceType: this.c.PictureSourceType.PHOTOLIBRARY,
      allowEdit:true
    }
  }
  // bringPhoto(){
  //   return new Promise((resolve,reject)=>{
  //     this.c.getPicture(this.options).then()
  //   })
  // }
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
    var path="file://"+data.fullPath.substring(7,data.fullPath.lastIndexOf("/"))
    var options = {
       uri: data.fullPath ,
       folderName: 'dahlaq-c7e0f',
       quality: 90,
       width: 450,
       height: 450
    } as ImageResizerOptions;


    var vm=this
    return new Promise ((resolve,reject)=>{
      vm.plt.ready().then((res)=>{

        console.log(path)


          if(data.type.match("image.*")){


            this.imageResizer.resize(options).then((filePath: string) =>{
              console.log('FilePath', filePath)
              var pathe="file://"+filePath.substring(7,filePath.lastIndexOf("/"))
              var subs=filePath.substring(filePath.lastIndexOf("/")+1,filePath.lastIndexOf(""))
              console.log(subs)
              this.fl.readAsDataURL(pathe,subs).then((res:any)=>{
                var file=res
                console.log("fileee",file)
                resolve(file)
              }).catch((err)=>{
                console.log("Shit, turned out to be an error", err)
                reject(err)
              })

            })
            .catch(e => {
              reject(e)
              console.log(e)
            });

          }else{
            this.fl.readAsDataURL(path,data.name).then((res:any)=>{
              var file=res
              resolve(file)
            }).catch((err)=>{
              console.log("Shit, turned out to be an error", err)
              reject(err)
            })
          }

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
