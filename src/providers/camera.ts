import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular'
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import {MediaCapture,MediaFile,CaptureError,CaptureImageOptions,CaptureVideoOptions} from '@ionic-native/media-capture'
import { File } from '@ionic-native/file'
@Injectable()
export class Camera{

  constructor(public plt:Platform,public fl: File,public mc:MediaCapture){

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
    return new Promise (function(resolve,reject){
      this.plt.ready().then(function(res){
        this.gf(url).then(function(res){
          resolve(res)
        }).catch(function(err){
          reject(err)
        })
      }).catch(function(err){
        console.log("Error preparing device",err)
      })
    })

  }

}
