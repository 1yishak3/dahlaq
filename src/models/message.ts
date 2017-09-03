export class Message {
  sender:string
  receiver:string
  content:string
  time:any
  picture:string
  video:string
  file:string
  read:boolean
  sent:boolean
  senderUid:any
  resUid:any
  constructor(private mc?: any) {
    if(mc){
      this.sender=mc.sender
      this.receiver=mc.receiver
      this.content=mc.content
      this.time=mc.time
      this.picture=mc.picture
      this.read=mc.read
      this.sent=mc.sent
      this.senderUid=mc.senderUid
      this.resUid=mc.resUid
    }
    // Quick and dirty extend/assign fields to this model
  }

}
