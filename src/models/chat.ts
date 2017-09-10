
export class Chat {
  summary={
    users:{},
    lastMessage:{},
    chatId:"",
    lastTime:"",
  }
  content={
    messages:{},
    pictures:{},
    videos:{},
    files:{}
  }
  deleted=false
  constructor() {
    // Quick and dirty extend/assign fields to this model
  }

}
