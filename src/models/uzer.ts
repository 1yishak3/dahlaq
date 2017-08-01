export class Uzer {

  constructor(private userProperties: any) {
    // Quick and dirty extend/assign fields to this model
    userProperties={
      "preferences":[{"digit":"//likiliness(normal probability=0.5)"},{}],
      "likes":[{
        "postId":"#",
        "time":"#"
        },{}
      ],
      "dislikes":[{
        "postId":"#",
        "time":"#"
        },{}
      ],
      "reports":{"postId":{"post":"","deleted":"boolean"}},
      "userPosts":[{"postId":"#"}],
      "properties":{
        "username":"A",
        "digits":"#",
        "fame":"#",
        "bio":"",
        "city":"",
        "food":"",
        "rank":"",
        "education":"",
        "relationshipS":""
      },
      "admin":"boolean",
      "login":"boolean",
      "people":[{
        "username":"A",
        "digits":"#",
        "lastMessage":"",

      },{}],
      "chats":{"username":{
        "messages_+day":[
          {
            "sender":"username",
            "receiver":"username",
            "content":"ABC",
            "time":"time"
          }
        ]
      },
      "viewables":[{"postId":"post"},{}]
      }
    }
    for (let f in Object.keys(userProperties)) {
      this[f] = userProperties[f];
    }
  }

}
