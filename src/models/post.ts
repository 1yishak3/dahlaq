export class Item {

  constructor(private postProperties: any) {
    // Quick and dirty extend/assign fields to this model
    postProperties={
      "postId":"",
      "time":"#time",
      "poster":{
        "username":"#A",
        "digits":"##",
        "userId":"#",
        "userImage":"",
        "desiredReach":""
      },
      "content":{
        "desciption":"",
        "imageUrl":"",
        "likes":[{"userId":"","time":""},{}],
        "dislikes":[{"userId":"","time":""},{}],
        "reports":[{"userId":"","time":""}],
        "reach":[{"userId":"","time":""}],
        "boosts":[{"userId":"","time":"","bReach":""}]
      },
      "deleted":""
    }
    for (let f in Object.keys(postProperties)) {
      this[f] = postProperties[f];
    }
  }
}
