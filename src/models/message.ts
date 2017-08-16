export class Message {
  sender:string
  receiver:string
  content:string
  time:any
  picture:string
  video:string
  file:string
  read:boolean
  constructor(private messageContent?: any) {
    // Quick and dirty extend/assign fields to this model
  }

}
