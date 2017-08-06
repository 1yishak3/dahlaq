export class Uzer {
  preferences=[]
  likes=[]
  dislikes=[]
  reports:Array<Object>
  userPosts:Array<String>
  username=""
  bio=""
  rank=0
  fame=0
  properties={
    profilePics:[],
    digits:"",
    city:"",
    food:"",
    relationshipStatus:"",
    education:"",
    refers:{}
  }
  currrentPic=""
  people={}
  viewables:Array<String>
  suggestedPeople:Array<String>
  constructor(private userProperties: any) {
    // Quick and dirty extend/assign fields to this model
  }

}
