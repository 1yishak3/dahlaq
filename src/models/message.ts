export class Message {

  constructor(private messageContent: any) {
    // Quick and dirty extend/assign fields to this model

    messageContent={
      "sender":"username",
      "receiver":"username",
      "content":"ABC",
      "time":"time",
      "picture":"URL",
      "video":"URL",
      "file":"URL",
      "read":Boolean
    }
    for (let f in Object.keys(messageContent)) {
      this[f] = messageContent[f];
    }
  }

}
