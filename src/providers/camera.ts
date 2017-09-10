import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular'
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import {MediaCapture,MediaFile,CaptureError,CaptureImageOptions,CaptureVideoOptions} from '@ionic-native/media-capture'
import { File } from '@ionic-native/file'
//import {ImageResizer} from '@ionic-native/image-resizer'
import { Ng2ImgToolsService } from 'ng2-img-tools'
@Injectable()
export class Camera{

  constructor(public ir:Ng2ImgToolsService,public plt:Platform,public fl: File,public mc:MediaCapture){

  }
  takePicture(limit){
    return new Promise(function(resolve,reject){
      this.mc.captureImage(function(data){
        console.log("Camera Success",data)
        resolve(data)
      },function(err){
        console.log("Camera error,",err)
        reject(err)
      },{limit: limit})

    })
  }
  takeVideo(limit){
    return new Promise(function(resolve,reject){
      this.mc.captureVideo(function(data){
        console.log("Camera Success",data)
        resolve(data)
      },function(err){
        console.log("Camera error,",err)
        reject(err)
      },{limit: limit})

    })
  }
  takeAudio(limit){
    return new Promise(function(resolve,reject){
      this.mc.captureAudio(function(data){
        console.log("Record Success",data)
        resolve(data)
      },function(err){
        console.log("Record error,",err)
        reject(err)
      },{limit: limit})

    })
  }
  gf(url){
    return new Promise(function(resolve,reject){
      this.fl.resolveLocalFilesystemUrl(url,function(fileEntry){
        console.log(fileEntry)
        resolve(fileEntry)
      },function(err){
        console.log(err)
        reject(err)
      })
    })
  }
  getFile(url){
    var vm=this
    return new Promise (function(resolve,reject){
      vm.plt.ready().then(function(res){
        vm.gf(url).then(function(res:any){
          if(res.type.match("image.*")){
            var k=[]
            k.push(res)
            vm.ir.resize(k,450,450).subscribe(res2=>{
              console.log(res2)
                resolve(res2)
            },err=>{
              console.log("errrrrrrror ",err)
            })
          }else{
            resolve(res)
          }

        }).catch(function(err){
          reject(err)
        })
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
