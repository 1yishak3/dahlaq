import { OnInit } from '@angular/core'
import { PostPage } from '../pages/post/post'
import { NavController } from 'ionic-angular'
import { FirebaseService } from '../providers/firebase'
export class Post {
  postId:String
  time:Number
  likes:any
  dislikes:any
  reports:any
  boosts:any
  reach:any
  poster={
    username:"",
    digits:"",
    uId:"",
    profilePic:"",
    desiredReach:1,
  }
  content={
    description:"",
    imageUrl:"",
    videoUrl:"",
    fileUrl:"",
    likes:0,
    dislikes:0,
    reports:0,
    reach:0,
    boosts:0
  }

  deleted=""
  reported:boolean
  liked:boolean
  disliked:boolean
  uid:any

  constructor(public fbs:FirebaseService,public navCtrl:NavController){
  //  console.log("this is this: ",fbs)
    this.uid=fbs.currentUser().uid
  //  console.log("this is the uid: ",this.uid)

    this.likes= (Object.keys(this.content.likes)).length
    this.dislikes=(Object.keys(this.content.dislikes)).length
    this.reports=(Object.keys(this.content.reports)).length
    this.boosts=(Object.keys(this.content.boosts)).length
    this.reach=(Object.keys(this.content.reach)).length

    this.reported=(this.content.reports[this.uid]!==undefined)
    this.liked=(this.content.likes[this.uid]!==undefined)
    this.disliked=(this.content.dislikes[this.uid]!==undefined)
    //this.bootstrap()
  }
  //liking, unliking, reporting, unreporting should all trigger cloud functions to produce
  //preference schemas and, of course, our fame number
 ngOnInit(){
   this.bootstrap()
 }
  bootstrap(){
    var vm=this
    this.fbs.getDatabase("/posts/"+this.postId,false).then(function(res){
      var pst:any= res
      vm.poster=pst.poster
      vm.content=pst.content
      vm.likes=Object.keys(pst.content.likes).length
      vm.dislikes=Object.keys(pst.content.dislikes).length
      vm.reports=Object.keys(pst.content.reports).length
      vm.reported=(vm.content.reports[vm.uid]!==undefined)
      vm.liked=(vm.content.likes[vm.uid]!==undefined)
      vm.disliked=(vm.content.dislikes[vm.uid]!==undefined)
    })
  }
  /*function toggleStar(postRef, uid) {
  postRef.transaction(function(post) {
    if (post) {
      if (post.stars && post.stars[uid]) {
        post.starCount--;
        post.stars[uid] = null;
      } else {
        post.starCount++;
        if (!post.stars) {
          post.stars = {};
        }
        post.stars[uid] = true;
      }
    }
    return post;
  });
}*/
  like(){
    if(this.content.dislikes[cU]!==undefined){
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
    console.log(this.liked,this.reported,this.disliked)

  }
  unlike(){
    var cU= this.fbs.currentUser().uid
    var vm=this
    vm.likes=vm.likes-1
    this.fbs.rmDatabase("/posts/"+this.postId+"/content/likes/"+cU).then(function(res){
      delete this.content.likes[cU]
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
      delete this.content.dislikes[cU]
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
      delete this.content.likes[cU]
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
