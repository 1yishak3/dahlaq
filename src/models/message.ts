import {FirebaseService} from '../providers/firebase'
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
  constructor(public fbs?:FirebaseService,private mc?: any,public cid?:any,public mid?:any) {
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
    if(fbs){

      if(fbs.currentUser().uid!=this.senderUid){
        this.read=true
        this.fbs.setDatabase("/chats/"+cid+"/content/messages/"+mid+"/read",true,true).then(()=>{

        })
      }
      var updater=this.fbs.getRef("/chats/"+this.cid+"/content/messages/"+this.mid)
      updater.on('value',snp=>{
        var m=snp.val()
        this.read=m.read
        this.sent=m.sent
      })
    }

    // Quick and dirty extend/assign fields to this model
  }
  update(){
      var updater=this.fbs.getRef("/chats/"+this.cid+"/content/messages/"+this.mid)
      updater.on('value').then(snp=>{
        var m=snp.val()
        this.read=m.read
        this.sent=m.sent
      })
  }

}
