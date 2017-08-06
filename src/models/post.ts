import { FirebaseService } from '../providers/firebase'
import { PostPage } from '../pages/post/post'
import { NavController } from 'ionic-angular'
export class Post {
  postId:String
  time:Number
  poster:{
    username:string,
    digits:string,
    uId:string,
    profilePic:string,
    desiredReach:1,
  }
  content:{
    desciption:string,
    imageUrl:any,
    videoUrl:any,
    fileUrl:any,
    likes:{},
    dislikes:{},
    reports:{},
    reach:{},
    boosts:{}
  }
  likes= (Object.keys(this.content.likes)).length
  dislikes=(Object.keys(this.content.dislikes)).length
  reports=(Object.keys(this.content.reports)).length
  boosts=(Object.keys(this.content.boosts)).length
  reach=(Object.keys(this.content.reach)).length

  deleted:""
  reported:boolean
  liked:boolean
  disliked:boolean
  fbs:FirebaseService
  navCtrl: NavController
  constructor(){
    this.reported=(this.content.reports[this.fbs.currentUser().uid]!==undefined)
    this.liked=(this.content.likes[this.fbs.currentUser().uid]!==undefined)
    this.disliked=(this.content.dislikes[this.fbs.currentUser().uid]!==undefined)
  }
  //liking, unliking, reporting, unreporting should all trigger cloud functions to produce
  //preference schemas and, of course, our fame number
  like(){
    if(this.content.dislikes[cU]===undefined){
      this.undislike()
    }
    var cU= this.fbs.currentUser().uid
    var vm=this.likes
    var y=this
    vm=vm+1
    this.fbs.setDatabase("/posts/"+this.postId+"/content/likes/"+cU,Date.now(),true).then(function(res){
      console.log("You liked this!")
    }).catch(function(err){
      console.log("Couldn't like, sorry", err)
    })
    this.reported=(this.content.reports[this.fbs.currentUser().uid]!==undefined)
    this.liked=(this.content.likes[this.fbs.currentUser().uid]!==undefined)
    this.disliked=(this.content.dislikes[this.fbs.currentUser().uid]!==undefined)
  }
  unlike(){
    var cU= this.fbs.currentUser().uid
    var vm=this
    vm.likes=vm.likes-1
    this.fbs.rmDatabase("/posts/"+this.postId+"/content/likes/"+cU).then(function(res){
    }).catch(function(err){

    })
    this.reported=(this.content.reports[this.fbs.currentUser().uid]!==undefined)
    this.liked=(this.content.likes[this.fbs.currentUser().uid]!==undefined)
    this.disliked=(this.content.dislikes[this.fbs.currentUser().uid]!==undefined)
  }
  dislike(){
    if(this.content.likes[cU]!==undefined){
      this.unlike()
    }
    var cU= this.fbs.currentUser().uid
    var vm=this.dislikes
    var y=this
    vm=vm+1
    this.fbs.setDatabase("/posts/"+this.postId+"/content/dislikes/"+cU,Date.now(),true).then(function(res){
      //y.content.dislikes[cU]=Date.now()
      console.log("You liked this!")
    }).catch(function(err){
      console.log("Couldn't like, sorry", err)
    })
    this.reported=(this.content.reports[this.fbs.currentUser().uid]!==undefined)
    this.liked=(this.content.likes[this.fbs.currentUser().uid]!==undefined)
    this.disliked=(this.content.dislikes[this.fbs.currentUser().uid]!==undefined)

  }
  undislike(){
    var cU= this.fbs.currentUser().uid
    var vm=this
    vm.dislikes=vm.dislikes-1
    this.fbs.rmDatabase("/posts/"+this.postId+"/content/dislikes/"+cU).then(function(res){
    }).catch(function(err){

    })
    this.reported=(this.content.reports[this.fbs.currentUser().uid]!==undefined)
    this.liked=(this.content.likes[this.fbs.currentUser().uid]!==undefined)
    this.disliked=(this.content.dislikes[this.fbs.currentUser().uid]!==undefined)
  }
  report(){
    var cU= this.fbs.currentUser().uid
    var vm=this.reports
    var y=this
    vm=vm+1
    this.fbs.setDatabase("/posts/"+this.postId+"/content/reports/"+cU,Date.now(),true).then(function(res){
      //y.content.dislikes[cU]=Date.now()
      console.log("You liked this!")
    }).catch(function(err){
      console.log("Couldn't like, sorry", err)
    })
    this.reported=(this.content.reports[this.fbs.currentUser().uid]!==undefined)
    this.liked=(this.content.likes[this.fbs.currentUser().uid]!==undefined)
    this.disliked=(this.content.dislikes[this.fbs.currentUser().uid]!==undefined)
  }
  unreport(){
    var cU= this.fbs.currentUser().uid
    var vm=this
    vm.reports=vm.reports-1
    this.fbs.rmDatabase("/posts/"+this.postId+"/content/reports/"+cU).then(function(res){
    }).catch(function(err){

    })
    this.reported=(this.content.reports[this.fbs.currentUser().uid]!==undefined)
    this.liked=(this.content.likes[this.fbs.currentUser().uid]!==undefined)
    this.disliked=(this.content.dislikes[this.fbs.currentUser().uid]!==undefined)
  }
  detailPost(post:Post){
    this.navCtrl.push(PostPage,{
      post:post
    })
  }
  // sync(){
  //   this.fbs.setDatabase("/posts"+this.postId+"/",this,false)
  // }

}
