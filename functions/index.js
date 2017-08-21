const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

exports.senseLike = functions.database.ref("/posts/{pid}/content/likes/{lid}").onWrite(e => {
  var uid = e.params.lid
  var pid = e.params.pid
  var posterLikes = e.data.ref.parent.parent.parent.parent.parent.child("users").child(uid).child("likes")
  var likesRef = e.data.ref.parent
  var likesCount = e.data.ref.parent.parent.parent.child("likes")
  return likesCount.transaction(current => {
    posterLikes.once('value', function(snap) {
      if (snap.val() === 0) {
        posterLikes.set({"0": pid}).then(function(res) {
          if (e.data.exists() && !e.data.previous.exists()) {
            return (current || 0) + 1
          } else if (!e.data.exists() && e.data.previous.exists()) {
            return (current || 0) - 1
          }
        }).catch(function(err) {
          console.log("error, ", err)
        })
      } else {
        posterLikes.push(pid).then(function(res) {
          if (e.data.exists() && !e.data.previous.exists()) {
            return (current || 0) + 1
          } else if (!e.data.exists() && e.data.previous.exists()) {
            return (current || 0) - 1
          }
        }).catch(function(err) {
          console.log("error", err)
        })
      }
    })
  }).then(() => {
    console.log("like added")
  })
})
exports.senseDislike = functions.database.ref("/posts/{pid}/content/dislikes/{did}").onWrite(e => {
  var uid = e.params.did
  var pid = e.params.pid
  var posterDislikes = e.data.ref.parent.parent.parent.parent.parent.child("users").child(uid).child("dislikes")
  var dislikesRef = e.data.ref.parent
  var dislikesCount = e.data.ref.parent.parent.parent.child("dislikes")
  return dislikesCount.transaction(current => {
    posterDislikes.once('value', function(snap) {
      if (snap.val() === 0) {
        posterDislikes.set({"0": pid}).then(function(res) {
          if (e.data.exists() && !e.data.previous.exists()) {
            return (current || 0) + 1
          } else if (!e.data.exists() && e.data.previous.exists()) {
            return (current || 0) - 1
          }
        }).catch(function(err) {
          console.log("error, ", err)
        })
      } else {
        posterDislikes.push(pid).then(function(res) {
          if (e.data.exists() && !e.data.previous.exists()) {
            return (current || 0) + 1
          } else if (!e.data.exists() && e.data.previous.exists()) {
            return (current || 0) - 1
          }
        }).catch(function(err) {
          console.log("error", err)
        })
      }
    })
  }).then(() => {
    console.log("dislike added")
  })
})
exports.senseReport = functions.database.ref("/posts/{pid}/content/reports/{rid}").onWrite(e => {
  var uid = e.params.rid
  var pid = e.params.pid
  var posterReps = e.data.ref.parent.parent.parent.parent.parent.child("users").child(uid).child("reports")
  var reportsRef = e.data.ref.parent
  var reportsCount = e.data.ref.parent.parent.parent.child("reports")
  return reportsCount.transaction(current => {
    posterReps.once('value', function(snap) {
      if (snap.val() === 0) {
        posterReps.set({"0": pid}).then(function(res) {
          if (e.data.exists() && !e.data.previous.exists()) {
            return (current || 0) + 1
          } else if (!e.data.exists() && e.data.previous.exists()) {
            return (current || 0) - 1
          }
        }).catch(function(err) {
          console.log("error, ", err)
        })
      } else {
        posterReps.push(pid).then(function(res) {
          if (e.data.exists() && !e.data.previous.exists()) {
            return (current || 0) + 1
          } else if (!e.data.exists() && e.data.previous.exists()) {
            return (current || 0) - 1
          }
        }).catch(function(err) {
          console.log("error", err)
        })
      }
    })
  }).then(() => {
    console.log("report added/removed")
  })
})
exports.like = functions.database.ref("/posts/{pid}/content/likes/{lid}").onWrite(e => {
  var pid = e.params.pid
  var uid = e.params.lid
  var prefRef = e.data.ref.parent.parent.parent.parent.parent.child("users").child(uid).child("preferences")
  e.data.ref.parent.parent.parent.child("poster").child("uid").once('value', function(snap) {
    var poster = snap.val()
    var postRef = prefRef.child(poster)
    return postRef.transaction(current => {
      var t = (current || 0.5) - 0.07
      if (t < 0) {
        return 0
      } else if (t > 1) {
        return 1
      } else if (t >= 0 || t <= 1) {
        return t
      }
    })
  })
})
exports.dislike = functions.database.ref("/posts/{pid}/content/dislikes/{did}").onWrite(e => {
  var pid = e.params.pid
  var uid = e.params.did
  var prefRef = e.data.ref.parent.parent.parent.parent.parent.child("users").child(uid).child("preferences")
  e.data.ref.parent.parent.parent.child("poster").child("uid").once('value', function(snap) {
    var poster = snap.val()
    var postRef = prefRef.child(poster)
    return postRef.transaction(current => {
      var t = (current || 0.5) + 0.07
      if (t < 0) {
        return 0
      } else if (t > 1) {
        return 1
      } else if (t >= 0 || t <= 1) {
        return t
      }
    })
  })
})
exports.report = functions.database.ref("/posts/{pid}/content/reports/{rid}").onWrite(e => {
  var pid = e.params.pid
  var uid = e.params.rid
  var prefRef = e.data.ref.parent.parent.parent.parent.parent.child("users").child(uid).child("preferences")
  e.data.ref.parent.parent.parent.child("poster").child("uid").once('value', function(snap) {
    var poster = snap.val()
    var postRef = prefRef.child(poster)
    return postRef.transaction(current => {
      var t = (current || 0.5) + 0.1
      if (t < 0) {
        return 0
      } else if (t > 1) {
        return 1
      } else if (t >= 0 || t <= 1) {
        return t
      }
    })
  })
})
exports.senseL = functions.database.ref("/posts/{pid}/likes").onWrite(e => {
  e.data.ref.parent.child("poster").child("uid").once('value', function(uid) {
    var uid1 = uid.val()
    var personLikes = e.data.ref.parent.parent.parent.child("users").child(uid1).child("stats").child("likes")
    return personLikes.transaction(current => {
      if (e.data.val() > e.data.previous.val()) {
        return (current || 0) + 1
      } else if (e.data.val() < e.data.previous.val()) {
        return (current || 0) - 1
      } else {
        return
      }
    })
  })
})
exports.senseD = functions.database.ref("/posts/{pid}/dislikes").onWrite(e => {
  e.data.ref.parent.child("poster").child("uid").once('value', function(uid) {
    var uid1 = uid.val()
    var personDislikes = e.data.ref.parent.parent.parent.child("users").child(uid1).child("stats").child("dislikes")
    return personDislikes.transaction(current => {
      if (e.data.val() > e.data.previous.val()) {
        return (current || 0) + 1
      } else if (e.data.val() < e.data.previous.val()) {
        return (current || 0) - 1
      } else {
        return
      }
    })
  })
})
exports.senseR = functions.database.ref("/posts/{pid}/reports").onWrite(e => {
  e.data.ref.parent.child("poster").child("uid").once('value', function(uid) {
    var uid1 = uid.val()
    var personReps = e.data.ref.parent.parent.parent.child("users").child(uid1).child("stats").child("reports")
    return personReps.transaction(current => {
      if (e.data.val() > e.data.previous.val()) {
        return (current || 0) + 1
      } else if (e.data.val() < e.data.previous.val()) {
        return (current || 0) - 1
      } else {
        return
      }
    })
  })
})
exports.senseStats = functions.database.ref("/users/{uid}/stats").onWrite(e => {
  var data = e.data.val()
  var newFame = recalcFame(data)

  return e.data.ref.parents.child("fame").set(newFame)
})

//REORDER THE ADMINSLIST
exports.senseFame = functions.database.ref("/users/{uid}/fame").onWrite(e => {
  //reorder the adminsList users list accordingly
  var fame = e.data.val()
  var rankRef=e.data.ref.parent.child("basic/rank")
  var limit = reachLimit(fame)
  var tell;
  if (e.data.val() < e.data.previous.val()) {
    tell = -1
  } else if (e.data.val() > e.data.previous.val()) {
    tell = 1
  } else {
    tell = 0
  }
  var uid = e.params.uid
  var usersRef = e.data.ref.parent.parent.parent.child("adminsLists/users")
  var fameRef = e.data.ref.parent.parent.parent.child("fameList")
  return fameRef.transaction(current => {
    var newList = efficient(current, uid, tell, fame,rankRef)
    return newList
  })
})
exports.senseNewPost = functions.database.ref("/posts/{pid}").onCreate(e => {
  if (e.data.exists()) {
    var reachRef = e.data.ref.parent.parent.child("users/stats/reaches")
    e.data.ref.child("poster/desiredReach").once('value').then(function(snap) {
      var reach = snap.val()
      return reachRef.transaction(current => {
        return (current || 0) + Number(reach)
      })
    })
  }
})
exports.senseAuth = functions.database.ref("/users/{uid}").onCreate(e => {
  var uid = e.params.uid
  var name= e.data.val().basic.username
  e.data.ref.parent.parent.child("fameList").once('value').then(function(snap) {
    var list = {}
    var index;
    if (snap.val()) {
      list = snap.val()
      index=Object.keys(list).length
      list[index] = {
        "uid": uid,
        "fame": 0,
        "username":name

      }
    } else {
      list = {
        0: {
          "uid": uid,
          "fame": 0,
          "username":name

        }
      }
    }
    e.data.ref.child("basic/rank").set(index).then(function(res){
      return e.data.ref.parent.parent.child("fameList").set(list)
    }).catch(function(err){
      return e.data.ref.parent.parent.child("fameList").set(list)
    })

  })
})
//exports.fillUp2 = functions.database.ref("/users/{uid}").onCreate(e => {})
exports.fillUp = functions.database.ref("/users/{uid}/viewables").onWrite(e => {
  if (e.data.val()===undefined||e.data.val()===null) {
    var prefRef = e.data.ref.parent.child("preferences")
    var viewRef = e.data.ref
    var uid=e.params.uid
    var actRef=e.data.ref.parent.parent.parent.child("posts")
    var postsRef = e.data.ref.parent.parent.parent.child("adminsLists/posts")
    if(!e.data.val()&&e.data.previous.val()){
      return postsRef.once('value').then(function(snap) {
        var posts = snap.val()
        prefRef.once('value').then(function(snaps) {
          var prefs = snaps.val()
          populate(posts, prefs,postsRef).then(function(list, prefs) {
            prefRef.set(prefs).then(function(res){
              var liste=list
              for (var k=0;k<liste.length;k++){
                var pid=liste[k]
                var pRef=actRef.child(pid).child("content/reach")
                pRef.once('value').then(function(snap){
                  var reach=snap.val()
                  if(reach===0){
                    reach={}
                    reach[uid]=Date.now()
                  }else{
                    reach[uid]=Date.now()
                  }
                  pRef.set(reach).then(function(res){
                    console.log("reach updated")
                  })
                })
              }
              return viewRef.set(list)
            })

          })
        })
      })
    }
  }
})
exports.chooseUp = functions.database.ref("/users/{uid}/basic/online").onWrite(e => {
  if (e.data.val() === true){
    var pplRef = e.data.ref.parent.parent.child("people")
    var sgRef = e.data.ref.parent.parent.child("suggestedPeople")
    var adminRef = e.data.ref.parent.parent.parent.parent.child("adminsLists/users")
    var propRef = e.data.ref.parent.parent.child("properties")
    var fameRef= e.data.ref.parent.parent.parent.parent.child("fameList")
    // adminRef.once('value').then(function(snap){
    //   var uzs=snap.val()
    //   pplRef.once('value').then(function(snaps){
    //      var frns=snaps.val()
    //
    //      propRef.once('value').then(function(sn){
    //         var props=sn.val()
    //         sgRef.once('value').then(function(sg){
    //           var pps=sg.val()
    //           var suggestions=pick(uz,uzs,frns,pps)
    //
    //           return sgRef.set(suggestions)
    //         })
    //      })
    //
    //   })
    // })
    var uid=e.params.uid
    return fameRef.once('value').then(function(snap){
      var list=snap.val()
      var suggestList=pick2(uid,list)
      return fameRef.set(suggestList)
    })
  }
})
exports.chats= functions.database.ref("/chats/{chatId}").onCreate(e =>{
  var pRef=e.data.ref.child("summary/users")
  var usersRef=e.data.ref.parent.parent.child("users")\
  var chat=e.params.chatId
   return pRef.once('value').then(function(snap){
    var users= snap.val()
    var list=[]
    for(let i in users){
      list.push(i)
    }
    usersRef.child(list[0]).child("people").push(chat).then(function(res){
      return usersRef.child(list[1]).child("people").push(chat)
    })
  })
})
exports.reachs= functions.database.ref("/posts/{pid}/content/reach").onWrite(e =>{
  var reach = e.data.ref.parent.parent.child("reach")
  var nowe=e.data.val()
  var then=e.data.previous.val()
  return reach.transaction(current=>{
    if(Object.keys(nowe).length!==Object.keys(then).length){
      return (current||0)+1
    }else{
      return current
    }
  })
})
exports.senseReach= functions.database.ref("/posts/{pid}/reach").onWrite(e =>{
  return e.data.ref.parent.child("poster/uid").once('value').then(function(snap){
    var uid=snap.val()
    var uRef=e.data.ref.parent.parent.parent.child("users").child(uid).child("stats/reaches")
    return uRef.transaction(current=>{
      return (current||0)+1
    })
  })

})
exports.senseAuthForRefer= functions.database.ref("/users/{uid}").onCreate(e =>{
  var reff=e.data.val().basic.referrer
  if(reff!==""){
    var ref=e.data.ref.parent.parent.child("ref")
    ref.child(reff).once('value').then(function(snap){
      var f=snap.val()
      if(f&&f!==null){
        e.data.ref.parent.child(f).child("refers").once('value').then(function(snap){
          var val=snap.val()
          if(val===0||val===null||!val){
            val={}
            val[e.params.uid]=Date.now()
          }
          else{
            val[e.params.uid]=Date.now()
          }
          return   e.data.ref.parent.child(f).child("refers").set(val)
        })
      }
    })
  }
})
exports.senseRefer=functions.database.ref("/users/{uid}/refers").onWrite(e =>{
  if(e.data.previous.val()!==0){
    if(Object.keys(e.data.val()).length>Object.keys(e.data.previous.val()).length){
      return e.data.ref.parent.child("fame").transaction(current =>{
        return(current||0)+0.1
      })
    }
  }
})
exports.actualAuth=functions.auth.user().onCreate(e =>{
  var email=e.data.email
  var num= email.substring(0,lastIndexOf("@"))
  if(!checkNum(num)){
    return e.data.delete()
  }
})
//exports.emptyViewables = functions.database.ref("/users/{uid}/viewables").on
// const pick=function(user, users,frends,suggested){
//
// }
const checkNum=function(num){
  var truth=false
  var sub1=num.substring(0,3)
  var sub2=num.substring(3, lastIndexOf(""))
  if(sub1==="251"&&sub2.length===9){
    truth=true
  }
  return truth
}
const pick2=function(uid,list){
  var k = Object.keys(list)
  var scrd=0
  var uids=[]
  for(var i=0;i<k.length;i++){
    var key=k[i]
    if(list[key].uid===uid){
      scrd=key
      break
    }
  }
  var num=Number(scrd)
  if(num){
    var l=num-10
    var m=num+10
    var n=num-1
    var o =num+1
    while(n>=l&&o<=m){
      if(list[n]){
        uids.unshift(list[n])
      }
      if(list[o]){
        uids.push(list[o])
      }
    }
  }
  return uids

}
const check=function(event, pid){
  var postRef= event.child(pid)
  postRef.child("reach").once('value').then(function(snap){
    var r=snap.val()
    postRef.child("poster/desiredReach").once('value').then(function(snap){
      var r2=snap.val()
      if(r>=r2){
        return true
      }else {
        return false
      }
    })
  })
}
const populate = function(psts, prfs,ev) {
  return new Promise(function(resolve, reject) {
    var list = []
    var posts = psts
    var prefs = prfs
    var key = Object.keys(posts)
    for (var i = key.length - 1; i >= 0; i--) {
      var rand = Math.random()
      var k = key[i]
      var uid = posts[k].uid
      var pid=posts[k].pid
      var newPrefs={}
      var reached=check(ev,pid)
      if(!reached){
        if (prefs[uid]) {
          if (prefs[uid] <= rand) {

            list.push(posts[k].pid)
            newPrefs[pid]=true
          } else {
            continue
          }
        } else {
          prefs[uid] = 0.5

          if (rand >= 0.5) {
            newPrefs[pid]=true
            list.push(posts[k].pid)
          } else {
            continue
          }

        }
      }
      if(list.length>=30){
        break
      }
    }
    var j =0
    while(j<5&&list.length<30){
      for (var i = key.length - 1; i >= 0; i--) {
        var rand = Math.random()
        var k = key[i]
        var uid = posts[k].uid
        if (prefs[uid]) {
          if (prefs[uid] <= rand&&!newPrefs[pid]) {
            list.push(posts[k].pid)
            newPrefs[pid]=true
          } else {
            continue
          }
        } else {
          prefs[uid] = 0.5
          if (rand >= 0.5&&) {
            list.push(posts[k].pid)
            newPrefs[pid]=true
          } else {
            continue
          }

        }
        if(list.length>=30){
          break
        }
      }
      j++
    }
    if (list) {
      resolve(list, prefs)
    } else {
      reject("error")
    }
  })
}

const recalcFame = function(data) {
  var unreacted = data.reach - (data.likes + data.dislikes + data.reports)
  var fame = (data.reach * (data.likes - data.dislikes) - (unreacted * (1 + data.reports))) / (data.reach * (1 + data.reports))
  return fame
}
const reachLimit = function(fame) {
  var limit = Math.ceil(fame) * 1000
  return limit
}
const efficient = function(ls, uid, tell, fame, rf) {
  var nums = Object.keys(ls)
  var uids = []
  var fames = []
  var key = ""
  for (var i = 0; i < uids.length; i++) {

    if (ls[i].uid === uid) {
      key = i
      uids.push(ls[i].uid)
      fames.push(fame)
    } else {
      uids.push(ls[i].uid)
      fames.push(ls[i].fame)
    }
  }
  var key = uids.indexOf(uid)

  if (tell === -1) {
    var i = key + 1
    while (fames[i] > fames[key] && i < fames.length) {
      i++
    }
    var newPos = i - 1
    var j = key + 1
    while (j <= newPos) {
      uids[j - 1] = uids[j]
      fames[j - 1] = fames[j]
      j++
    }
    fames[newPos] = ls[key].fame
    uids[newPos] = uid
    rf.set(newPos)
    var newSet = []
    for (var l = 0; l < uids.length; l++) {
      newSet.push({"uid": uids[l], "fame": fames[l]})
    }
    return newSet
  } else if (tell === 1) {
    var i = key - 1
    while (fames[i] < fames[key] && i >= 0) {
      i--
    }
    var newPos = i + 1
    var j = key - 1
    while (j >= newPos) {
      uids[j + 1] = uids[j]
      fames[j + 1] = fames[j]
      j--
    }
    fames[newPos] = ls[uid] //?
    uids[newPos] = uid
    var newSet = []
    for (var l = 0; l < uids.length; l++) {
      newSet.push({"uid": uids[l], "fame": fames[l]})
    }
    return newSet
  } else {
    return
  }

}
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
