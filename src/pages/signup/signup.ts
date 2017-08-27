import { ViewChild,Component,ElementRef,AfterViewInit } from '@angular/core';
import { NavController, ToastController, NavParams,LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { MainPage } from '../../pages/pages';
import {FirstRunPage} from '../../pages/pages'
import { User } from '../../providers/user';

import { TranslateService } from '@ngx-translate/core';
import { FirebaseService } from '../../providers/firebase'
import { Uzer } from '../../models/uzer'
import { Network } from '@ionic-native/network'
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  @ViewChild('name') name :any
  person:Uzer
  account: { username: string, refer: string, code: string } = {
    username: '',
    code: '',
    refer:''
  };
  connected:boolean
  // Our translated text strings
  once:number=0;
  ref:any
  available:string=""
  private signupErrorString: string;
  confirmationResult: any
  show:any=true
  timer:any
  constructor(public nw:Network,
    public fbs:FirebaseService,
    public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public nvp : NavParams,
    public loadCtrl:LoadingController) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
    this.confirmationResult = this.nvp.get("confirm")
    this.person=new Uzer()
    var vm=this
    var disc=nw.onDisconnect().subscribe(()=>{
      vm.connected=false
    })
    var conc=nw.onConnect().subscribe(()=>{
      console.log("What what? Connected?")
      vm.show=true
      vm.connected=true
      setTimeout(function(){
        vm.show=false
      },5000)
    })
  }
  checkU(str,str2){
    var vm=this
    var truth1=false;
    var truth2=false;
    var truth3=false;
    return new Promise(function(resolve,reject){
      vm.fbs.getDatabase("/ref",true).then(function(res){
        vm.ref=res
        if(vm.ref){
          if(!vm.ref[str]){
            truth1=true
          }
        }else{
          truth1=true
        }
        if(str2.length>=6&&!isNaN(str2)){
          truth2=true
        }
        if(str.length>4&&str.indexOf(" ")===-1&&str.length<23){
          truth3=true
        }
        resolve (truth2&&truth3&&truth1)
      })
    })

  }
  ionViewWillEnter(){
    var vm=this

  }
  ngAfterViewInit(){
    var vm=this
    console.log("name=> ",this.name)
    this.fbs.getDatabase("/ref", true).then(function(res){
      vm.ref=res
      vm.available="Checking..."
      var keyup = Observable.fromEvent(vm.name._elementRef.nativeElement, 'keydown');
      keyup.subscribe(function(data){

        clearTimeout(timer)


        var timer=setTimeout(function(){
          if(vm.ref){
            if(!vm.ref[vm.account.username]){
              if(vm.account.username.length>4){
                if(vm.account.username.indexOf(" ")===-1){
                  if(vm.account.username.length<23){
                    vm.available="Username is valid"
                  }else{
                    vm.available="Username must contain less than 23 characters"
                  }
                }else{
                  vm.available="Username can't contain spaces"
                }
              }else{
                vm.available="Username must contain 4 characters or more"
              }
            }else{
              vm.available="Username already taken"
            }
          }else{
            if(vm.account.username.length>4){
              if(vm.account.username.indexOf(" ")===-1){
                if(vm.account.username.length<23){
                  vm.available="Username is valid"
                }else{
                  vm.available="Username must contain less than 23 characters"
                }
              }else{
                vm.available="Username can't contain spaces"
              }
            }else{
              vm.available="Username must contain 4 characters or more"
            }
          }
        })
      })
  })
  }
  doSignup() {
    var load1=this.loadCtrl.create({
      content:"Verifying your number..."
    })
    load1.present()
    //this.person=new Uzer()
    this.checkU(this.account.username,this.account.code).then((sth)=>{
      console.log(sth)
      if(sth){
        this.once=this.once+1
        var vm=this.fbs
        var vm1=this


        // Attempt to login in through our User service
        console.log(this.confirmationResult)
        if (this.once<2){
          console.log("I got here...then something happened")
          this.confirmationResult.confirm(this.account.code).then((resp) => {
            load1.dismiss()
            load1=this.loadCtrl.create({content:"Creating your account..."})
            load1.present()
            this.person.properties.digits=vm.currentUser().phoneNumber
            //console.log(this.person.properties.digits)
            this.person.basic.uid=vm.currentUser().uid
            this.person.basic.referrer=this.account.refer
            //console.log(this.person.basic.uid)
            vm.currentUser().updateProfile({
              displayName: this.account.username,
              photoURL:""
            }).then(function() {
              // Update successful.
              console.log("displayName updated to: ",vm1.account.username)
            }).catch(function(error) {
              // An error happened.
              console.log("Unable to update user name for auth()",error)
            });

            console.log(vm.currentUser().displayName)
            this.person.basic.username=this.account.username
            var prsn={}
            prsn["basic"]=this.person.basic
            prsn["stats"]=this.person.stats
            prsn["properties"]=this.person.properties
            prsn["suggestedPeople"]=this.person.suggestedPeople
            prsn["viewables"]=this.person.viewables
            prsn["people"]=this.person.people
            prsn["refers"]=this.person.refers
            prsn["token"]=this.person.token
            prsn["connections"]=this.person.connections
            prsn["fame"]=this.person.fame
            prsn["reachLimit"]=this.person.reachLimit
            prsn["userPosts"]=this.person.userPosts
            prsn["dislikes"]=this.person.dislikes
            prsn["likes"]=this.person.likes
            prsn["reports"]=this.person.reports

            this.fbs.setDatabase("/users/"+vm.currentUser().uid,prsn,true).then(function(res){
              // var update={}
              // update["/users/"+vm.currentUser().uid+"/viewables"]=null
              // update["/users/"+vm.currentUser().uid+"/suggestedPeople"]=null
              // update["/users/"+vm.currentUser().uid+"/properties/profilePics"]=null
              // update["/users/"+vm.currentUser().uid+"/properties/refers"]=null
              // update["/users/"+vm.currentUser().uid+"/connections"]=null
              // update["/users/"+vm.currentUser().uid+"/userPosts"]=null
              // update["/users/"+vm.currentUser().uid+"/people"]=null
              // update["/users/"+vm.currentUser().uid+"/preferences"]=null
              // update["/users/"+vm.currentUser().uid+"/dislikes"]=null
              // update["/users/"+vm.currentUser().uid+"/likes"]=null
              // update["/users/"+vm.currentUser().uid+"/reports"]=null
              // vm.setDatabase("/dummbase",update,false).then(function(res){
              //   console.log("successfully set nulls", res)
              // }).catch(function(err){
              //   console.log("tell me the error", err)
              // })

              vm.getPermissionAndToken().then(function(token){
                vm.setDatabase("/users/"+vm.currentUser().uid+"/token",token,true).then(function(res){
                  console.log("We have set the token")
                }).catch(function(err){
                  console.log("We have not set the token")
                })
              }).catch(function(err){
                console.log("We couldn't get the token")
              })
              vm.setDatabase("/ref/"+vm1.account.username,vm.currentUser().uid,true).then((res)=>{
                vm1.navCtrl.push(FirstRunPage);
                load1.dismiss()
              })


              console.log("Login Succesful!")
            }).catch(function(err){
              console.log("User Creation ERROR in Database",err)
                vm.currentUser().delete()
            })
            vm.setDatabase("/adminsLists/users/"+vm.currentUser().uid,vm1.person.properties,true).then(function(res){
              console.log("Successfully added to admin's list")
            }).catch(function(err){
              console.log("Sorry, couldn't add you to the list", err)
            })

          }).catch( (err) => {

            //this.navCtrl.push(MainPage); // TODO: Remove this when you add your signup endpoint
            vm.currentUser().delete()
            // Unable to sign up
            console.log("I'm not in: ",err)
            let toast = this.toastCtrl.create({
              message: "Yooo How is this even possible?",
              duration: 3000,
              position: 'top'
            });
            toast.present();
          });
        }
      }else{
        let toast = this.toastCtrl.create({
          message: "Your entries are invalid. "+this.available+".",
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    })
  }
}
