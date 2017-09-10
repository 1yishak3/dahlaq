import {Injectable, EventEmitter} from '@angular/core';
import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import { User } from './user'
import { Events, LoadingController } from 'ionic-angular'
import { Uzer } from '../models/uzer'
import { Storage } from '@ionic/storage'

import * as firebase from "firebase";
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'
import 'firebase/messaging'






@Injectable()
export class FirebaseService {
  userCheck: EventEmitter<Boolean>
  authCallback: any;
  user: any
  ev: any
  messaging: any
  nexmo: any
  constructor(public stg:Storage, public lc?: LoadingController, public usr?: User, public events?: Events) {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCYT5qaezgIxItyCT_idaM0rXNnKA9eBMY",
      authDomain: "dahlaq-c7e0f.firebaseapp.com",
      databaseURL: "https://dahlaq-c7e0f.firebaseio.com",
      projectId: "dahlaq-c7e0f",
      storageBucket: "dahlaq-c7e0f.appspot.com",
      messagingSenderId: "500593695235"
    };
    firebase.initializeApp(config);
    this.user = usr
    this.ev = events
    this.userCheck = new EventEmitter
    this.messaging = firebase.messaging()
    //  this.nexmo=new NexmoVerify({appId:"1042dab6",sharedSecret:"ab54c189dc474c91"})
    //  this.snap()
    // check for changes in auth status


  }
  getAuth(){
    return firebase.auth()
  }

  getPermissionAndToken() {
    var vm = this
    return new Promise(function(resolve, reject) {
      vm.messaging.requestPermission()
        .then(function() {
          console.log('Notification permission granted.');
          vm.messaging.onTokenRefresh(function() {
            vm.messaging.getToken()
              .then(function(refreshedToken) {
                console.log('Token refreshed.');
                // Indicate that the new Instance ID token has not yet been sent to the
                // app server.
                // ...
                resolve(refreshedToken)
              })
              .catch(function(err) {
                console.log('Unable to retrieve refreshed token ', err);
              });
          });

          // ...
        })
        .catch(function(err) {
          console.log('Unable to get permission to notify.', err);
          reject(err)
        });

    })
  }
  snap(uid) {
    var vm = this
    var consRef = this.getRef("/users/" + this.currentUser().uid + "/connections")
    var onRef = this.getRef("/users/" + uid + "/basic/online")
    var conRef = this.getRef("/.info/connected")
    conRef.on('value', function(snap) {
      if (snap.val()) {
        console.log("Do you see me??", uid)
        vm.setDatabase("/users/" + uid + "/basic/online", { "on": true, "time": firebase.database.ServerValue.TIMESTAMP }, true).then(function(res) {

        })
      }
      var con = consRef.push()
      con.set(true)
      con.onDisconnect().remove()
      onRef.onDisconnect().set({ "on": false, "time": firebase.database.ServerValue.TIMESTAMP })
    })
  }
  connected() {
    return new Promise(function(resolve, reject) {
      firebase.database().ref(".info/connected").on("value", function(snap) {
        if (snap.val() === true || snap.val() === false) {
          resolve(snap.val())
        } else {
          reject("problems with .info/connected");
        }
      });
    })
  }
  getRef(url) {
    var ref: any = firebase.database().ref(url)
    return ref
  }
  onAuthStateChanged(_function) {
    return firebase.auth().onAuthStateChanged((_currentUser) => {
      if (_currentUser) {
        console.log("User " + _currentUser.uid + " is logged in with " + _currentUser.providerData);
        _function(_currentUser);
      } else {
        console.log("User is logged out");
        _function(null)
      }
    })
  }
  firebaseAuth() {
    return firebase.auth()
  }


  transac(url, func) {
    return new Promise(function(resolve, reject) {
      var ref = firebase.database().ref(url)
      ref.transaction(func)
    })
  }
  setList(url, val) {
    var vm = this
    return new Promise(function(resolve, reject) {
      //var newKey=firebase.database().ref(url).push().key
      var ref = firebase.database().ref(url).push()
      var key = ref.key
      vm.setDatabase(url + "/" + key, val, true).then(function(res) {
        resolve(key)
      }).catch(function(err) {
        reject(err)
      })
    })
  }
  getLimited(url, num,by) {
    return new Promise(function(resolve, reject) {
      firebase.database().ref(url).orderByChild(by).limitToLast(num).on("child_added",(snapshot)=>{
  // This callback will be triggered exactly two times, unless there are
  // fewer than two dinosaurs stored in the Database. It will also get fired
  // for every new, heavier dinosaur that gets added to the data set.
      console.log(snapshot.key);
      resolve(snapshot.val())
    },(err)=>{
      reject(err)
    });

    })
  }
  rmDatabase(url) {
    return new Promise(function(resolve, reject) {
      firebase.database().ref(url).remove().then(function(res) {
        resolve(res)
      }).catch(function(err) {
        reject(err)
      })
    })
  }
  getDatabase(url, once, ctrl?:boolean) {

    return new Promise((resolve, reject)=>{
      this.stg.get(url+"/cache").then((c)=>{
        firebase.database().ref(url+"/cache").once('value').then((res)=>{
          if(res!==c&&res){
              if(ctrl){
                var load= this.lc.create({
                  content:"Getting stuff..."
                })
                load.present()
              }


              firebase.database().ref(url).once('value').then((res)=>{
                console.log(res.val())
                if(ctrl){load.dismiss()}
                var x=res.val()
                this.stg.set(url+"/cache",x.cache).then(()=>{
                  this.stg.get(url).then((res)=>{
                    var what=res||[]
                    for(let i in x){
                      what.push(x[i])
                    }
                    this.stg.set(url,what)
                  })

                })

                resolve(res.val())
              }).catch(function(err) {
                console.log(err)
                if(ctrl){load.dismiss()}
                reject(err)
              })

          }else{
            this.stg.get(url).then((res)=>{
              if(res){
                resolve(res)
              }else{
                reject("Sorry, cache has null too.")
              }

            }).catch((err)=>{
              reject(err)
            })
          }
        })
      })
    })
  }
  setDatabase(url, value, set) {
    return new Promise(function(resolve, reject) {
      if (set) {
        firebase.database().ref(url).set(value).then(function(res) {
          //console.log(res)
          resolve(res)
        }).catch(function(err) {
          console.log(err)
          reject(err)
        })
      } else {
        //var val = {}
        //val[url]=value
        firebase.database().ref().update(value).then(function(res) {
          console.log(res)
          resolve(res)
        }).catch(function(err) {
          console.log(err)
          reject(err)
        })
      }
    })
  }
  // getStorageUrl(url,){
  //   return new Promise(function(resolve,reject){
  //
  //   })
  // }
  getStorage(url) {
    return new Promise(function(resolve, reject) {
      var ref = firebase.storage().ref().child(url)
      ref.getDownloadURL().then(function(res) {
        console.log(res)
        var ress: any = res
        resolve(ress)
      }).catch(function(err) {
        console.log(err)
        reject(err)
      })
    })
  }
  setStorage(url, value) {
    var uploadTask = firebase.storage().ref().child(url).put(value)
    return uploadTask
  }
  currentUser() {
    return firebase.auth().currentUser
  }
  createUser(creds, pass?: any, veri?: any, ) {
    var number = creds.digits;
    var num = this.user.checkify(number);
    var email = this.user.emailify(num)
    var password = pass || this.user.passwordGen(number)

    var cr;
    console.log(email + "---" + password)
    return new Promise(function(resolve, reject) {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
      if (email === null) {
        reject("notEthiopian")
      }
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function(d) {
        console.log("Account creation successful, proceeding with phone number verification,", d)
        var user = firebase.auth().currentUser

        resolve(email)

      }).catch(function(err) {
        console.log("Account not created", err)
        reject(err)
      })
    }).catch((err)=>{
      reject(err)
      console.log("created account")
    })
  })

  }
  linkToNumber(number) {

    var user = firebase.auth().currentUser;
    var cr;
    var vm = this
    return new Promise(function(resolve, reject) {
      var ver = vm.nexmo.verify(number).then(() => {
        resolve(vm.nexmo)
      }).catch(() => {
        reject(vm.nexmo)
      })
    })
  }
  recaptcha(id) {
    //var recaptchaVerifier
    return new Promise(function(resolve, reject) {
      resolve(new firebase.auth.RecaptchaVerifier(id, {
        "size": "invisible",
        "callback": function(response) {
        },

      }))
    })
  }
  logout() {
    return new Promise(function(resolve, reject) {
      firebase.auth().signOut().then(function(sucl) {
        console.log("logged out")
        resolve(sucl)
      }).catch(function(er) {
        console.log("no logging out...you're stuck :)", er)
        reject(er)
      })
    })
  }
  login(creds, pass?: any, verify?: any) {
    var num = this.user.checkify(creds.digits)
    var email = this.user.emailify(num)
    var password = pass
    var vm = this
    return new Promise(function(resolve, reject) {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {

          // Existing and future Auth states are now persisted in the current
          // session only. Closing the window would clear any existing state even
          // if a user forgets to sign out.
          // ...
          // New sign-in will be persisted with session persistence.
          if (pass&&pass!=="") {
            firebase.auth().signInWithEmailAndPassword(email, password).then((res) => {
              resolve("Signed In!")
            }).catch((err) => {
              reject(err)
            })
          }else{
            reject("Password")
          }

        })
        .catch(function(error) {
          // Handle Errors .
          reject(error)
          var errorCode = error;
          var errorMessage = error.message;

        });
      // firebase.auth().signInWithPhoneNumber(num, verify)
      // .then(function(authData) {
      //   resolve(authData)
      // })
      // .catch(function(_error) {
      //   console.log("Login Failed!", _error);
      //   reject(_error)
      // })
    })
  }

  /*uploadPhotoFromFile(_imageData, _progress) {


    return new Observable(observer => {
      var _time = new Date().getTime()
      var fileRef = firebase.storage().ref('images/sample-' + _time + '.jpg')
      var uploadTask = fileRef.put(_imageData['blob']);

      uploadTask.on('state_changed', function(snapshot) {
        console.log('state_changed', snapshot);
        _progress && _progress(snapshot)
      }, function(error) {
        console.log(JSON.stringify(error));
        observer.error(error)
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        var downloadURL = uploadTask.snapshot.downloadURL;

        // Metadata now contains the metadata for file
        fileRef.getMetadata().then(function(_metadata) {

          // save a reference to the image for listing purposes
          var ref = firebase.database().ref('images');
          ref.push({
            'imageURL': downloadURL,
            'thumb': _imageData['thumb'],
            'owner': firebase.auth().currentUser.uid,
            'when': new Date().getTime(),
            //'meta': _metadata
          });
          observer.next(uploadTask)
        }).catch(function(error) {
          // Uh-oh, an error occurred!
          observer.error(error)
        });

      });
    });
  }*/

  /*getDataObs() {
      var ref = firebase.database().ref('images')
      var that = this

      return new Observable(observer => {
          ref.on('value',
              (snapshot) => {
                  var arr = []

                  snapshot.forEach(function (childSnapshot) {
                      var data = childSnapshot.val()
                      data['id'] = childSnapshot.key
                      arr.push(data);
                  });
                  observer.next(arr)
              },
              (error) => {
                  console.log("ERROR:", error)
                  observer.error(error)
              });
      });
  }*/
}
