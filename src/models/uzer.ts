export class Uzer {
  preferences={}
  likes={}//list with keys that are like "o","1","2","3"..
  dislikes={}//list with keys that are like "o","1","2","3"..
  reports={}//list with keys that are like "o","1","2","3"..
  userPosts={}
  basic={
    uid:"",
    username:"",
    bio:"",
    rank:0,
    currrentPic:"",
    online:""
  }//list with keys that are like "o","1","2","3"..
  fame=0
  connections={}
  properties={
    profilePics:{},
    digits:"",
    city:"",
    food:"",
    relationshipStatus:"",
    education:"",
    refers:{}
  }
  people={}//list with keys that are like "o","1","2","3"..
  viewables={}//list with keys that are like "o","1","2","3"..
  suggestedPeople={}//list with keys that are like "o","1","2","3"..
  constructor() {
    // Quick and dirty extend/assign fields to this model
  }

}
