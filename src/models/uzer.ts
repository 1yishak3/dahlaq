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
  reachLimit=0
  fame=0
  connections=0
  properties={
    profilePics:0,
    digits:"",
    sefer:"None",
    fews:"None",
    relationshipStatus:"Single & Looking",
    interestedIn:"-",
    education:"None",
  }
  refers:0
  people=0//list with keys that are like "o","1","2","3"..
  viewables=0//list with keys that are like "o","1","2","3"..
  suggestedPeople=0//list with keys that are like "o","1","2","3"..
  constructor() {
    // Quick and dirty extend/assign fields to this model
  }

}
