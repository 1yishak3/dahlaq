import { Message } from "./message"
export class Chat {
  messages:Message[]

  constructor(private message:Message) {
    // Quick and dirty extend/assign fields to this model
    //type of Message
    var chat={
      "participant1":String,
      "participant2":String,
      "status":Boolean,
      "content":Array,
      "createdAt":Date.now()
    }
    for (let f in Object.keys(chat)) {
      this[f] = chat[f];
    }
  }

}
