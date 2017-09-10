import {FirebaseService} from '../providers/firebase'
export class Uzer {
  preferences=0
  likes=0//list with keys that are like "o","1","2","3"..
  dislikes=0//list with keys that are like "o","1","2","3"..
  reports=0//list with keys that are like "o","1","2","3"..
  userPosts=0
  stats={
    likes:0,
    reports:0,
    dislikes:0,
    reaches:0
  }
  basic={
    uid:"",
    username:"",
    bio:"One Proud Ethiopian",
    rank:0,
    currentPic:"",
    online:"",
    referrer:""
  }//list with keys that are like "o","1","2","3"..
  reachLimit=10
  fame=0
  connections=0
  properties={
    profilePics:0,
    digits:"",
    sefer:"None",
    fews:"None",
    relationshipStatus:"Single",
    interestedIn:"-",
    education:"None",
  }
  token=0
  refers=0
  people=0//list with keys that are like "o","1","2","3"..
  viewables=0//list with keys that are like "o","1","2","3"..
  suggestedPeople=0//list with keys that are like "o","1","2","3"..
  constructor(public fbs?:FirebaseService,public uid?:string) {
    // Quick and dirty extend/assign fields to this model
    if(fbs&&uid){
      var uid=uid
      fbs.getDatabase("/users/"+uid, false).then((res:any)=>{
        this.preferences=res.preferences
        this.likes=res.likes
        this.dislikes=res.dislikes
        this.reports=res.reports
        this.userPosts=res.userPosts
        this.stats=res.stats
        this.basic=res.basic
        this.reachLimit=res.reachLimit
        this.fame=res.fame
        this.connections=res.connections
        this.properties=res.properties
        this.token=res.token
        this.refers=res.refers
        this.people=res.people
        this.viewables=res.viewables
        this.suggestedPeople=res.suggestedPeople
        console.log("I got all the data bruh.", res)

      }).catch((err)=>{
        console.log("Error error...can't find user")
      })
    }
  }

}

///sense fame did something ...fix it before it ruins you
//like if reachLimit becomes <10, make it default to a 10 instead of bringing up 0
