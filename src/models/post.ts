export class Post {
  postId:String
  time:number
  poster:{
    username:string
    digits:string
    uId:string
    userImage:string
    desiredReach:1
  }
  content:{
    desciption:string
    imageUrl:any
    videoUrl:any
    fileUrl:any
    likes:[{"userId":"","time":""},{}]
    dislikes:[{"userId":"","time":""},{}]
    reports:[{"userId":"","time":""}]
    reach:[{"userId":"","time":""}]
    boosts:[{"userId":"","time":"","bReach":""}]
  }
  deleted:""

}
