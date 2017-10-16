import { OnInit } from '@angular/core'
import { PostPage } from '../pages/post/post'
import { NavController } from 'ionic-angular'
import { FirebaseService } from '../providers/firebase'
export class Post {
  postId:string
  time:number
  likes:any
  dislikes:any
  reports:any
  boosts:any
  reach:any
  poster={
    username:"",
    digits:"",
    uid:"",
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

  constructor(public fbs:FirebaseService,public navCtrl:NavController,public pId?:string, public tr?:boolean,public paste?:any){
  //  console.log("this is this: ",fbs)
    this.uid=fbs.currentUser().uid
    this.postId=pId
    console.log(paste)
    if(paste){
      for(let i in paste){
      //  console.log(i)
        this[i]=paste[i]
      }
      this.poster=paste.poster
      console.log(this.poster,paste.poster)
    }
  //  console.log("this is the uid: ",this.uid)

    // this.likes= (Object.keys(this.content.likes)).length
    // this.dislikes=(Object.keys(this.content.dislikes)).length
    // this.reports=(Object.keys(this.content.reports)).length
    // this.boosts=(Object.keys(this.content.boosts)).length
    // this.reach=(Object.keys(this.content.reach)).length
    //
    // this.reported=(this.content.reports[this.uid]!==undefined)
    // this.liked=(this.content.likes[this.uid]!==undefined)
    // this.disliked=(this.content.dislikes[this.uid]!==undefined)
    if(tr){
      this.bootstrap()
    }
  }
  //liking, unliking, reporting, unreporting should all trigger cloud functions to produce
  //preference schemas and, of course, our fame number
 // ngOnInit(){
 //   this.bootstrap()
 //   console.log("ngOnInit")
 // }
 // ionViewWillEnter(){
 //   this.bootstrap()
 //   console.log("I have started")
 // }
  bootstrap(){
    var vm=this

    this.fbs.getDatabase("/posts/"+this.postId,false).then((res:any)=>{
      //var pst:any= res
      if(this.poster.uid){
        this.fbs.getDatabase("/users/"+this.poster.uid+"/basic/currentPic",true).then((ress:any)=>{
          this.poster.profilePic=ress
        })
      }

      vm.poster=res.poster
      vm.content=res.content
      if(res.content.likes!==undefined&&res.content.likes!==null){
        vm.likes=Object.keys(res.content.likes).length
        vm.liked=(vm.content.likes[vm.uid]!==undefined)
      }
      if(res.content.dislikes!==undefined&&res.content.dislikes!==null){
        vm.dislikes=Object.keys(res.content.dislikes).length
        vm.disliked=(vm.content.dislikes[vm.uid]!==undefined)
      }
      if(res.content.reports!==undefined&&res.content.reports!==null){
        vm.reports=Object.keys(res.content.reports).length
        vm.reported=(vm.content.reports[vm.uid]!==undefined)
      }

    }).catch(function(err){
      console.log("an error has occured, ",err)
    })
    this.fbs.getDatabase("/posts/"+this.postId+"/content/reach",true).then(function(res){
      var reach = res
      if(!reach){
        reach={}
      }
      if(reach===0){
        reach={}
        reach[vm.uid]=Date.now()
      }else{
        reach[vm.uid]=Date.now()
      }
      vm.fbs.setDatabase("/posts/"+vm.postId+"/content/reach",reach,true).then(function(res){
        console.log("reach updated")
      })
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
    this.likes++
    this.liked=true
    if(this.disliked){
      this.disliked=false
      this.dislikes--
    }
    if(this.reported){
      this.reported=false
      this.reports--
    }
    this.fbs.setDatabase("/posts/"+this.pId+"/likes/"+this.uid,true,true).then(()=>{
      this.fbs.setDatabase("/posts/"+this.pId+"/dislikes/"+this.uid,null,true).then(()=>{
        this.fbs.setDatabase("/posts/"+this.pId+"/reports/"+this.uid,null,true)
      })
    })
  }
  unlike(){
    this.likes--
    this.liked=false

    this.fbs.setDatabase("/posts/"+this.pId+"/likes/"+this.uid,null,true).then(()=>{

    })
  }

  dislike(){
    this.dislikes++
    this.disliked=true
    if(this.liked){
      this.liked=false
      this.likes--
    }

    this.fbs.setDatabase("/posts/"+this.pId+"/dislikes/"+this.uid,true,true).then(()=>{
      this.fbs.setDatabase("/posts/"+this.pId+"/likes/"+this.uid,null,true).then(()=>{

      })
    })
  }
  undislike(){
    this.dislikes--
    this.disliked=false
    this.fbs.setDatabase("/posts/"+this.pId+"/dislikes/"+this.uid,null,true).then(()=>{

    })
  }
  report(){
    this.reported=true
    this.reports++
    if(this.liked){
      this.liked=false
      this.likes--
    }
    this.fbs.setDatabase("/posts/"+this.pId+"/reports/"+this.uid,true, true).then(()=>{
      this.fbs.setDatabase("/posts/"+this.pId+"/likes/"+this.uid,null,true).then(()=>{

      })
    })
  }
  unreport(){
    this.reported=false
    this.reports--
    this.fbs.setDatabase("/posts/"+this.pId+"/reports/"+this.uid,null,true).then(()=>{
      
    })
  }
  // like(){
  //   var y=this
  //
  //   if(this.disliked){
  //     y.likes=y.likes+1
  //     y.liked=true
  //     this.undislike().then(function(res){
  //       var cU= y.fbs.currentUser().uid
  //       var vm=y.likes
  //       if(y.reported){
  //         y.unreport().then(function(res){
  //           y.fbs.setDatabase("/posts/"+y.postId+"/content/likes/"+cU,Date.now(),true).then(function(res){
  //             console.log("You liked this!")
  //             // y.reported=(y.content.reports[y.fbs.currentUser().uid]!==undefined)
  //             // y.liked=(y.content.likes[y.fbs.currentUser().uid]!==undefined)
  //             // y.disliked=(y.content.dislikes[y.fbs.currentUser().uid]!==undefined)
  //             // console.log(y.liked,y.reported,y.disliked)
  //           }).catch(function(err){
  //             console.log("Couldn't like, sorry", err)
  //             y.liked=false
  //             y.likes=y.likes-1
  //           })
  //         }).catch(function(err){
  //
  //         })
  //
  //       }else{
  //         y.fbs.setDatabase("/posts/"+y.postId+"/content/likes/"+cU,Date.now(),true).then(function(res){
  //           console.log("You liked this!")
  //           // y.reported=(y.content.reports[y.fbs.currentUser().uid]!==undefined)
  //           // y.liked=(y.content.likes[y.fbs.currentUser().uid]!==undefined)
  //           // y.disliked=(y.content.dislikes[y.fbs.currentUser().uid]!==undefined)
  //           // console.log(y.liked,y.reported,y.disliked)
  //         }).catch(function(err){
  //           console.log("Couldn't like, sorry", err)
  //           y.liked=false
  //           y.likes=y.likes-1
  //         })
  //       }
  //     }).catch(function(err){
  //       console.log(err)
  //     })
  //
  //   }else if(this.reported){
  //     y.likes=y.likes+1
  //     y.liked=true
  //     this.unreport().then(function(res){
  //       var cU= y.fbs.currentUser().uid
  //       //var vm=y.likes
  //       if(y.disliked){
  //         y.undislike().then(function(res){
  //           y.fbs.setDatabase("/posts/"+y.postId+"/content/likes/"+cU,Date.now(),true).then(function(res){
  //             console.log("You liked this!")
  //             // y.reported=(y.content.reports[y.fbs.currentUser().uid]!==undefined)
  //             // y.liked=(y.content.likes[y.fbs.currentUser().uid]!==undefined)
  //             // y.disliked=(y.content.dislikes[y.fbs.currentUser().uid]!==undefined)
  //             // console.log(y.liked,y.reported,y.disliked)
  //           }).catch(function(err){
  //             console.log("Couldn't like, sorry", err)
  //             y.liked=false
  //             y.likes=y.likes-1
  //           })
  //         }).catch(function(err){
  //
  //         })
  //
  //       }else{
  //         y.fbs.setDatabase("/posts/"+y.postId+"/content/likes/"+cU,Date.now(),true).then(function(res){
  //           console.log("You liked this!")
  //           // y.reported=(y.content.reports[y.fbs.currentUser().uid]!==undefined)
  //           // y.liked=(y.content.likes[y.fbs.currentUser().uid]!==undefined)
  //           // y.disliked=(y.content.dislikes[y.fbs.currentUser().uid]!==undefined)
  //           // console.log(y.liked,y.reported,y.disliked)
  //         }).catch(function(err){
  //           console.log("Couldn't like, sorry", err)
  //           y.liked=false
  //           y.likes=y.likes-1
  //         })
  //       }
  //     }).catch(function(err){
  //       console.log(err)
  //     })
  //
  //
  //   }else{
  //
  //     var cU= this.fbs.currentUser().uid
  //     var vm=this.likes
  //     var y=this
  //     y.likes=y.likes+1
  //     y.liked=true
  //     this.fbs.setDatabase("/posts/"+this.postId+"/content/likes/"+cU,Date.now(),true).then(function(res){
  //       console.log("You liked this!")
  //       // y.reported=(y.content.reports[y.fbs.currentUser().uid]!==undefined)
  //       // y.liked=(y.content.likes[y.fbs.currentUser().uid]!==undefined)
  //       // y.disliked=(y.content.dislikes[y.fbs.currentUser().uid]!==undefined)
  //       // console.log(y.liked,y.reported,y.disliked)
  //     }).catch(function(err){
  //       console.log("Couldn't like, sorry", err)
  //       y.liked=false
  //       y.likes=y.likes-1
  //     })
  //   }
  //
  // }
  // unlike(){
  //   var vm=this
  //   return new Promise(function(resolve,reject){
  //     var cU= vm.fbs.currentUser().uid
  //     vm.likes=vm.likes-1
  //     vm.liked=false
  //     vm.fbs.rmDatabase("/posts/"+vm.postId+"/content/likes/"+cU).then(function(res){
  //       // if(this.content.likes[cU]){
  //       //   delete this.content.likes[cU]
  //       // }
  //       // vm.reported=(vm.content.reports[vm.fbs.currentUser().uid]!==undefined)
  //       // vm.liked=(vm.content.likes[vm.fbs.currentUser().uid]!==undefined)
  //       // vm.disliked=(vm.content.dislikes[vm.fbs.currentUser().uid]!==undefined)
  //       resolve("success")
  //     }).catch(function(err){
  //       vm.liked=true
  //       vm.likes=vm.likes+1
  //       reject("failure")
  //     })
  //   })
  //   }
  // dislike(){
  //   var cU= this.fbs.currentUser().uid
  //   var vm=this
  //   if(this.liked){
  //     vm.dislikes=vm.dislikes+1
  //     vm.disliked=true
  //     this.unlike().then(function(res){
  //
  //         vm.fbs.setDatabase("/posts/"+vm.postId+"/content/dislikes/"+cU,Date.now(),true).then(function(res){
  //           //y.content.dislikes[cU]=Date.now()
  //           // vm.reported=(vm.content.reports[vm.fbs.currentUser().uid]!==undefined)
  //           // vm.liked=(vm.content.likes[vm.fbs.currentUser().uid]!==undefined)
  //           // vm.disliked=(vm.content.dislikes[vm.fbs.currentUser().uid]!==undefined)
  //           console.log("You disliked this!")
  //         }).catch(function(err){
  //           console.log("Couldn't dislike, sorry", err)
  //           vm.disliked=false
  //           vm.dislikes=vm.dislikes-1
  //         })
  //     }).catch(function(f){
  //       console.log("unliking failed, sorry")
  //     })
  //   }else{
  //     var vm=this
  //     vm.dislikes=vm.dislikes+1
  //     vm.disliked=true
  //     this.fbs.setDatabase("/posts/"+this.postId+"/content/dislikes/"+cU,Date.now(),true).then(function(res){
  //       //y.content.dislikes[cU]=Date.now()
  //       // vm.reported=(vm.content.reports[vm.fbs.currentUser().uid]!==undefined)
  //       // vm.liked=(vm.content.likes[vm.fbs.currentUser().uid]!==undefined)
  //       // vm.disliked=(vm.content.dislikes[vm.fbs.currentUser().uid]!==undefined)
  //       console.log("You disliked this!")
  //     }).catch(function(err){
  //       console.log("Couldn't dislike, sorry", err)
  //       vm.disliked=false
  //       vm.dislikes=vm.dislikes-1
  //     })
  //   }
  //
  //
  // }
  // undislike(){
  //   var vm=this
  //   return new Promise(function(resolve, reject){
  //
  //   var cU= vm.fbs.currentUser().uid
  //   vm.dislikes=vm.dislikes-1
  //   vm.disliked=false
  //   vm.fbs.rmDatabase("/posts/"+vm.postId+"/content/dislikes/"+cU).then(function(res){
  //     // if(this.content.dislikes[cU]){
  //     //   delete this.content.dislikes[cU]
  //     // }
  //     // vm.reported=(vm.content.reports[vm.fbs.currentUser().uid]!==undefined)
  //     // vm.liked=(vm.content.likes[vm.fbs.currentUser().uid]!==undefined)
  //     // vm.disliked=(vm.content.dislikes[vm.fbs.currentUser().uid]!==undefined)
  //     resolve("success")
  //   }).catch(function(err){
  //     vm.dislikes=vm.dislikes+1
  //     vm.disliked=true
  //     reject("failure")
  //   })
  // })
  // }
  // report(){
  //   var vm=this
  //   if(this.liked){
  //     vm.reports=vm.reports+1
  //     vm.reported=true
  //     this.unlike().then(function(res){
  //       var cU= vm.fbs.currentUser().uid
  //
  //
  //       vm.fbs.setDatabase("/posts/"+vm.postId+"/content/reports/"+cU,Date.now(),true).then(function(res){
  //         //y.content.dislikes[cU]=Date.now()
  //         // vm.reported=(vm.content.reports[vm.fbs.currentUser().uid]!==undefined)
  //         // vm.liked=(vm.content.likes[vm.fbs.currentUser().uid]!==undefined)
  //         // vm.disliked=(vm.content.dislikes[vm.fbs.currentUser().uid]!==undefined)
  //         // console.log("You liked this!")
  //       }).catch(function(err){
  //         vm.reports=vm.reports-1
  //         vm.reported=false
  //         console.log("Couldn't like, sorry", err)
  //       })
  //     })
  //   }else{
  //     var cU= this.fbs.currentUser().uid
  //     var vm=this
  //     vm.reports=vm.reports+1
  //     vm.reported=true
  //     this.fbs.setDatabase("/posts/"+this.postId+"/content/reports/"+cU,Date.now(),true).then(function(res){
  //       //y.content.dislikes[cU]=Date.now()
  //       // vm.reported=(vm.content.reports[vm.fbs.currentUser().uid]!==undefined)
  //       // vm.liked=(vm.content.likes[vm.fbs.currentUser().uid]!==undefined)
  //       // vm.disliked=(vm.content.dislikes[vm.fbs.currentUser().uid]!==undefined)
  //       // console.log("You liked this!")
  //     }).catch(function(err){
  //       vm.reports=vm.reports-1
  //       vm.reported=false
  //       console.log("Couldn't like, sorry", err)
  //     })
  //   }
  // }
  // unreport(){
  //   var vm=this
  //   return new Promise(function(resolve,reject){
  //     var cU= vm.fbs.currentUser().uid
  //     vm.reports=vm.reports-1
  //     vm.reported=false
  //     vm.fbs.rmDatabase("/posts/"+vm.postId+"/content/reports/"+cU).then(function(res){
  //       // if(this.content.reports[cU]){
  //       //   delete this.content.reports[cU]
  //       // }
  //       // vm.reported=(vm.content.reports[vm.fbs.currentUser().uid]!==undefined)
  //       // vm.liked=(vm.content.likes[vm.fbs.currentUser().uid]!==undefined)
  //       // vm.disliked=(vm.content.dislikes[vm.fbs.currentUser().uid]!==undefined)
  //       resolve("Success")
  //     }).catch(function(err){
  //       vm.reports=vm.reports+1
  //       vm.reported=true
  //       reject("fail")
  //     })
  //   })
  //
  // }
  // detailPost(post:Post){
  //   this.navCtrl.push(PostPage,{
  //     post:post
  //   })
  // }
  // sync(){
  //   this.fbs.setDatabase("/posts"+this.postId+"/",this,false)
  // }

}
