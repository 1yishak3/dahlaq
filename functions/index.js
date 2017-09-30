const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
//add cache
//incorporate the phone auth again. Hopefully, you haven't deleted much
//about page/s
exports.senseLike = functions.database.ref("/posts/{pid}/content/likes/{lid}").onWrite(e => {
  var uid = e.params.lid
  var pid = e.params.pid
  var likerRef = e.data.adminRef.parent.parent.parent.parent.parent.child("users").child(uid).child("likes")
  var likesRef = e.data.adminRef.parent
  var likesCount = e.data.adminRef.parent.parent.parent.child("likes")
  return likerRef.once('value').then((snap)=>{
    var personal=snap.val()
    if(personal===0){
      personal={
      }
      personal[pid]=Date.now()

    }else{
      personal[pid]=Date.now()
    }
    likerRef.set(personal).then((res)=>{
      return likesCount.transaction(data=>{
        if(e.data.exists()&&!e.data.previous.exists()){
          return (data||0)+1
        }else if(!e.data.exists()&&e.data.previous.exists()){
          return (data||0)-1
        }else{
          return data
        }
      })
    })
  })
})
exports.senseDislike = functions.database.ref("/posts/{pid}/content/dislikes/{did}").onWrite(e => {
  var uid = e.params.did
  var pid = e.params.pid
  var dislikerRef = e.data.adminRef.parent.parent.parent.parent.parent.child("users").child(uid).child("dislikes")
  var dislikesRef = e.data.adminRef.parent
  var dislikesCount = e.data.adminRef.parent.parent.parent.child("dislikes")
  return dislikerRef.once('value').then((snap)=>{
    var personal=snap.val()
    if(personal===0){
      personal={
      }
      personal[pid]=Date.now()

    }else{
      personal[pid]=Date.now()
    }
    dislikerRef.set(personal).then((res)=>{
      return dislikesCount.transaction(data=>{
        if(e.data.exists()&&!e.data.previous.exists()){
          return (data||0)+1
        }else if(!e.data.exists()&&e.data.previous.exists()){
          return (data||0)-1
        }else{
          return data
        }
      })
    })
  })
})
exports.senseReport = functions.database.ref("/posts/{pid}/content/reports/{rid}").onWrite(e => {
  var uid = e.params.rid
  var pid = e.params.pid
  var reporterRef = e.data.adminRef.parent.parent.parent.parent.parent.child("users").child(uid).child("reports")
  var reportsRef = e.data.adminRef.parent
  var reportsCount = e.data.adminRef.parent.parent.parent.child("reports")
  return reporterRef.once('value').then((snap)=>{
    var personal=snap.val()
    if(personal===0){
      personal={
      }
      personal[pid]=Date.now()

    }else{
      personal[pid]=Date.now()
    }
    reporterRef.set(personal).then((res)=>{
      return reportsCount.transaction(data=>{
        if(e.data.exists()&&!e.data.previous.exists()){
          return (data||0)+1
        }else if(!e.data.exists()&&e.data.previous.exists()){
          return (data||0)-1
        }else{
          return data
        }
      })
    })
  })
})
exports.onPostCreate=functions.database.ref("/posts/{pid}/poster/desiredReach").onCreate(e=>{
  e.data.adminRef.parent.child("uid").once('value').then((snap)=>{
    var uid=snap.val()
    admin.database().ref("/users/"+uid+"/reachLimit").once('value').then((snap)=>{
      if(e.data.exists()){
        if(Number(e.data.val())>Number(snap.val())){
          return e.data.adminRef.set(Number(snap.val()))
        }else{
          return e.data.adminRef.set(Number(e.data.val()))
        }
      }
    })

  })
})
//Anopther addition????????????????????????
exports.picSet=functions.database.ref("/posts/{pid}/poster/profilePic").onCreate(e =>{
  return e.data.adminRef.parent.child("uid").once('value').then((snap)=>{
    var uid=snap.val()
    admin.database().ref("/users/"+uid+"/basic/currentPic").once('value').then((snap)=>{
      return e.data.adminRef.set(snap.val())
    })
  })
})
exports.like = functions.database.ref("/posts/{pid}/content/likes/{lid}").onWrite(e => {
  var pid = e.params.pid
  var uid = e.params.lid
  var prefRef = e.data.adminRef.parent.parent.parent.parent.parent.child("users").child(uid).child("preferences")
  e.data.adminRef.parent.parent.parent.child("poster").child("uid").once('value', function(snap) {
    var poster = snap.val()
    if(poster){
      var postRef = prefRef.child(poster)
      return postRef.transaction(current => {
        var t = (current || 0.5) - 0.007
        if (t < 0) {
          return 0
        } else if (t > 1) {
          return 1
        } else if (t >= 0 || t <= 1) {
          return t
        }
      })
    }

  })
})
exports.dislike = functions.database.ref("/posts/{pid}/content/dislikes/{did}").onWrite(e => {
  var pid = e.params.pid
  var uid = e.params.did
  var prefRef = e.data.adminRef.parent.parent.parent.parent.parent.child("users").child(uid).child("preferences")
  e.data.adminRef.parent.parent.parent.child("poster").child("uid").once('value', function(snap) {
    var poster = snap.val()
    if(poster){
      var postRef = prefRef.child(poster)
      return postRef.transaction(current => {
        var t = (current || 0.5) + 0.007
        if (t < 0) {
          return 0
        } else if (t > 1) {
          return 1
        } else if (t >= 0 || t <= 1) {
          return t
        }
      })
    }

  })
})
exports.report = functions.database.ref("/posts/{pid}/content/reports/{rid}").onWrite(e => {
  var pid = e.params.pid
  var uid = e.params.rid
  var prefRef = e.data.adminRef.parent.parent.parent.parent.parent.child("users").child(uid).child("preferences")
  e.data.adminRef.parent.parent.parent.child("poster").child("uid").once('value', function(snap) {
    var poster = snap.val()
    if(poster){
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
    }

  })
})
exports.senseL = functions.database.ref("/posts/{pid}/likes").onWrite(e => {
  e.data.adminRef.parent.child("poster").child("uid").once('value', function(uid) {
    var uid1 = uid.val()
    if(uid1){
      var personLikes = e.data.adminRef.parent.parent.parent.child("users").child(uid1).child("stats").child("likes")
      return personLikes.transaction(current => {
        if (e.data.val() > e.data.previous.val()) {
          return (current || 0) + 1
        } else if (e.data.val() < e.data.previous.val()) {
          return (current || 0) - 1
        } else {
          return
        }
      })
    }

  })
})
exports.senseD = functions.database.ref("/posts/{pid}/dislikes").onWrite(e => {
  e.data.adminRef.parent.child("poster").child("uid").once('value', function(uid) {
    var uid1 = uid.val()
    if(uid1){
      var personDislikes = e.data.adminRef.parent.parent.parent.child("users").child(uid1).child("stats").child("dislikes")
      return personDislikes.transaction(current => {
        if (e.data.val() > e.data.previous.val()) {
          return (current || 0) + 1
        } else if (e.data.val() < e.data.previous.val()) {
          return (current || 0) - 1
        } else {
          return
        }
      })
    }
  })
})
exports.senseR = functions.database.ref("/posts/{pid}/reports").onWrite(e => {
  e.data.adminRef.parent.child("poster").child("uid").once('value', function(uid) {
    var uid1 = uid.val()
    if(uid1){
      var personReps = e.data.adminRef.parent.parent.parent.child("users").child(uid1).child("stats").child("reports")
      return personReps.transaction(current => {
        if (e.data.val() > e.data.previous.val()) {
          return (current || 0) + 1
        } else if (e.data.val() < e.data.previous.val()) {
          return (current || 0) - 1
        } else {
          return
        }
      })
    }

  })
})
exports.senseStats = functions.database.ref("/users/{uid}/stats").onWrite(e => {
  var data = e.data.val()
  const recalcFame = function(data) {
    var u = data.reaches - (data.likes + data.dislikes + data.reports)
    var rs=data.reaches
    var l=data.likes
    var d=data.dislikes
    var r=data.reports
    var fame=((rs*(l-d))-(u*(1+r)))/(rs*(1+r))
    //,var fame = (data.reaches * (data.likes - data.dislikes) - (unreacted * (1 + data.reports))) / (data.reaches * (1 + data.reports))
    return fame
  }
  var newFame = recalcFame(data)

  return e.data.adminRef.parent.child("fame").set(newFame)
})

//REORDER THE ADMINSLIST
exports.senseFame = functions.database.ref("/users/{uid}/fame").onWrite(e => {
  //reorder the adminsList users list accordingly

  const reachLimit = function(fame) {
    var limit = Math.ceil(fame * 100)
    if(limit<10){
      return 10
    }else{
      return limit
    }
  }

  const efficient = function(ls, uid, tell, fame, rf,nm) {
    if(ls){
      var nums = Object.keys(ls)
      var uids = []
      var fames = []
      var unames=[]
      var key = ""
      for (var i = 0; i < nums.length; i++) {

        if (ls[nums[i]].uid === uid) {
          key1 = nums[i]
          uids.push(ls[nums[i]].uid)
          fames.push(fame)
          unames.push(ls[nums[i]].username)
        } else {
          uids.push(ls[nums[i]].uid)
          fames.push(ls[nums[i]].fame)
          unames.push(ls[nums[i]].username)
        }
      }

      var key= uids.indexOf(uid)
      if (tell === -1) {
        var i = Number(key) + 1
        while (fames[i] > fames[key] && i < fames.length) {
          i++
        }
        var newPos = i - 1
        var j = key + 1
        while (j <= newPos) {
          uids[j - 1] = uids[j]
          fames[j - 1] = fames[j]
          unames[j-1]=unames[j]
          j++
        }
        fames[newPos] = fame
        uids[newPos] = uid
        unames[newPos]=nm
        rf.set(newPos+1)
        var newSet = []
        for (var l = 0; l < uids.length; l++) {
          newSet.push({"uid": uids[l], "fame": fames[l],"username":unames[l]})
        }
        return newSet
      } else if (tell === 1) {
        var i =Number(key) - 1
        while (fames[i] < fames[key] && i >= 0) {
          i--
        }
        var newPos = i + 1
        var j = key - 1
        while (j >= newPos) {
          uids[j + 1] = uids[j]
          fames[j + 1] = fames[j]
          unames[j+1]=unames[j]
          j--
        }
        fames[newPos] =fame
        uids[newPos] = uid
        unames[newPos]=nm
        var newSet = []
        for (var l = 0; l < uids.length; l++) {
          newSet.push({"uid": uids[l], "fame": fames[l],"username":unames[l]})
        }
        return newSet
      } else {
        return null
      }
    }


  }
  var fame = e.data.val()
  var rankRef=e.data.adminRef.parent.child("basic/rank")
  var nameRef=e.data.adminRef.parent.child("basic/username")
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

  var usersRef = e.data.adminRef.parent.parent.parent.child("adminsLists/users")
  var fameRef = e.data.adminRef.parent.parent.parent.child("fameList")
  e.data.adminRef.parent.child("reachLimit").set(limit).then(function(res){
    return fameRef.transaction(current => {
      nameRef.once("value").then(snap=>{
        var name=snap.val()
        var newList = efficient(current, uid, tell, fame,rankRef,name)
        console.log("this is the new list",newList)
        if(newList){
          return newList
        }else{
          return current
        }
      })

    })
  }).catch(function(w){
    console.log("loglog",w)
  })
})
// exports.senseNewPost = functions.database.ref("/posts/{pid}/poster/desiredReach").onCreate(e => {
//   if (e.data.exists()) {
//     e.data.adminRef.parent.child("uid").once('value').then(function(snap){
//       var reachRef = e.data.adminRef.parent.parent.parent.parent.child("users").child(snap.val()).child("/stats/reaches")
//       var reach=e.data.val()
//       return reachRef.transaction(current => {
//         return (current || 0) + Number(reach)
//       })
//
//     })
//
//   }
// })
exports.senseAuth = functions.database.ref("/users/{uid}/basic/username").onCreate(e => {
  var uid = e.params.uid
  var name= e.data.val()
  e.data.adminRef.parent.parent.parent.parent.child("fameList").once('value').then(function(snap) {
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
      index=Object.keys(list).length
    } else {
      list = {
        0: {
          "uid": uid,
          "fame": 0,
          "username":name

        }
      }
      index=Object.keys(list).length
    }
    e.data.adminRef.parent.parent.child("basic/rank").set(index).then(function(res){
      return e.data.adminRef.parent.parent.parent.parent.child("fameList").set(list)
    }).catch(function(err){
      return e.data.adminRef.parent.parent.parent.parent.child("fameList").set(list)
    })

  })
})
//exports.fillUp2 = functions.database.ref("/users/{uid}").onCreate(e => {})
exports.fillUp = functions.database.ref("/users/{uid}/viewables").onWrite(e => {
  if (e.data.val()==="repopulate/") {
    var prefRef = e.data.adminRef.parent.child("preferences")
    var viewRef = e.data.adminRef
    var uid=e.params.uid
    var actRef=e.data.adminRef.parent.parent.parent.child("posts")
    var postsRef = e.data.adminRef.parent.parent.parent.child("adminsLists/posts")
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
        console.log("in promise")
        var list = []
        var posts = psts
        var prefs = prfs
        var key = Object.keys(posts)
        var newPrefs={}
        for (var i = key.length - 1; i >= 0; i--) {
          var rand = Math.random()
          var k = key[i]
          var uid = posts[k].uid
          var pid=posts[k].pid

          if(k!=="cache"){

            var reached=check(ev,pid)
              console.log("in checkkkk")
              if(!reached){
                if (prefs[uid]) {
                  if (rand>=prefs[uid]) {

                    list.push(posts[k].pid)
                    newPrefs[pid]=true
                  }
                } else {

                  if (rand >= 0.5 &&!newPrefs[pid]) {
                    newPrefs[pid]=true
                    list.push(posts[k].pid)
                  }

                }
              }


          }
          if(list.length>=50){
            break
          }


        }
        // var j =0
        // while(j<5&&list.length<30){
        //   for (var i = key.length - 1; i >= 0; i--) {
        //     var rand = Math.random()
        //     var k = key[i]
        //     var uid = posts[k].uid
        //     if (prefs[uid]) {
        //       if (prefs[uid] <= rand&&!newPrefs[pid]) {
        //         list.push(posts[k].pid)
        //         newPrefs[pid]=true
        //       } else {
        //         continue
        //       }
        //     } else {
        //       prefs[uid] = 0.5
        //       if (rand >= 0.5&&!newPrefs[pid]) {
        //         list.push(posts[k].pid)
        //         newPrefs[pid]=true
        //       } else {
        //         continue
        //       }
        //
        //     }
        //     if(list.length>=50){
        //       break
        //     }
        //   }
        //   j++
        // }
        if(list.length<50){
          console.log("in less than 50")
          for (var i = key.length - 1; i >= 0; i--) {

            //var rand = Math.random()
            var k = key[i]
            if(k!=="cache"){
              var uid = posts[k].uid
              if (prefs[uid]) {
                if (!newPrefs[pid]) {
                  list.push(posts[k].pid)
                  newPrefs[pid]=true
                } else {
                  continue
                }
              } else {
                if (!newPrefs[pid]) {
                  list.push(posts[k].pid)
                  newPrefs[pid]=true
                } else {
                  continue
                }

              }
              if(list.length>=50){
                break
              }
            }
          }
        }
        if (list) {
          return list
        } else {
          return "error"
        }

    }

    if(!e.data.val()&&e.data.previous.val()){
      return postsRef.once('value').then(function(snap) {
        var posts = snap.val()
        prefRef.once('value').then(function(snaps) {
          var prefs = snaps.val()
          var list=populate(posts, prefs,postsRef)

              // var liste=list
              // for (var k=0;k<liste.length;k++){
              //   var pid=liste[k]
              //   var pRef=actRef.child(pid).child("content/reach")
              //   pRef.once('value').then(function(snap){
              //     var reach=snap.val()
              //     if(reach===0){
              //       reach={}
              //       reach[uid]=Date.now()
              //     }else{
              //       reach[uid]=Date.now()
              //     }
              //     pRef.set(reach).then(function(res){
              //       console.log("reach updated")
              //     })
              //   })
              // }
              console.log(list)
              var lob={}
              for (var i=0;i<list.length;i++){
                lob[i]=list[i]
              }
              lob["cache"]=Date.now()

              return viewRef.set(lob)


        })
      })
    }
  }
})
exports.chooseUp = functions.database.ref("/users/{uid}/suggestedPeople").onWrite(e => {
  if (e.data.val()=="repopulate/"){
    console.log("time to repopulate")
    var pplRef = e.data.adminRef.parent.child("people")
    var sgRef = e.data.adminRef.parent.child("suggestedPeople")
    var adminRef = e.data.adminRef.parent.parent.parent.child("adminsLists/users")
    var propRef = e.data.adminRef.parent.child("basic").child("properties")
    var fameRef= e.data.adminRef.parent.parent.parent.child("fameList")
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
    const pick2=function(uid,list){
      var k = Object.keys(list)
      var scrd;
      var uids=[]
      var num;
      for(var i=0;i<k.length;i++){
        var key=k[i]
        if(key!=="cache"){
          if(list[key].uid===uid){
            scrd=key
            break
          }
        }else{
          break
        }
      }
      if(scrd){
        var num=Number(scrd)
      }
      if(num){
        var l=num-10
        var m=num+10
        var n=num-1
        var o =num+1
        while(n>=l&&o<=m){
          if(list[n]){
            uids.unshift(list[n].uid)
          }
          if(list[o]){
            uids.push(list[o].uid)
          }
          n=n-1
          o=o+1

        }
      }
      return uids

    }
    var uid=e.params.uid
    return fameRef.once('value').then(function(snap){
      var list=snap.val()
      var suggestList=pick2(uid,list)
      console.log(suggestList)
      if(suggestList.length!==0){
        var lob={}
        for (var i=0;i<suggestList.length;i++){
          lob[i]=suggestList[i]
        }
        lob["cache"]=Date.now()
        console.log(lob)
        return sgRef.set(lob)
      }else{
        return sgRef.set(0)
      }
    })
  }
})
exports.messagess=functions.database.ref("/chats/{cid}/content/messages/{mid}").onWrite(e=>{
  var mref=e.data.adminRef.parent
  var prop=e.params.mid
  if(prop!=="cache"){
    mref.once("value").then(function(snap){
      var messages=snap.val()
      messages["cache"]=Date.now();
      return mref.set(messages)
    })
  }
})
exports.summariess=functions.database.ref("/chats/{cid}/summary/{sid}").onWrite(e=>{
  var mref=e.data.adminRef.parent
  var prop=e.params.sid
  if(prop!=="cache"){
    mref.once("value").then(function(snap){
      var messages=snap.val()
      messages["cache"]=Date.now();
      return mref.set(messages)
    })
  }
})
exports.basicss=functions.database.ref("/users/{uid}/basic/{whatever}").onWrite(e=>{
  var mref=e.data.adminRef.parent
  var prop=e.params.whatever
  if (prop!=="cache"){
    mref.once("value").then(function(snap){
      var messages=snap.val()
      messages["cache"]=Date.now();
      return mref.set(messages)
    })
  }
})
exports.pplss=functions.database.ref("/users/{uid}/people/{whatever}").onWrite(e=>{
  var mref=e.data.adminRef.parent
  var prop=e.params.whatever
  if (prop!=="cache"){
    mref.once("value").then(function(snap){
      var messages=snap.val()
      messages["cache"]=Date.now();
      return mref.set(messages)
    })
  }
})
exports.postsss=functions.database.ref("/posts/{pid}/{bid}").onWrite(e=>{
  var mref=e.data.adminRef.parent
  var prop=e.params.bid
  if (prop!=="cache"){
    mref.once("value").then(function(snap){
      var messages=snap.val()
      messages["cache"]=Date.now();
      return mref.set(messages)
    })
  }
})
exports.propss=functions.database.ref("/users/{uid}/properties/{whatever}").onWrite(e=>{
  var mref=e.data.adminRef.parent
  var prop=e.params.whatever
  if (prop!=="cache"){
    mref.once("value").then(function(snap){
      var messages=snap.val()
      messages["cache"]=Date.now();
      return mref.set(messages)
    })
  }
})

exports.readables=functions.database.ref("/chats/{cid}/content/messages/{mid}/read").onWrite(e=>{
  if(e.data.previous.exists()){
    var mid=e.params.mid
    if(e.data.val()===true){
      var mRef=e.data.adminRef.parent
      mRef.once("value").then(function(snap){
        var ruid=snap.val().resUid
        var uRef=mRef.parent.parent.parent.child("summary/users").child(ruid).child("unread")
        uRef.once("value").then(function(snaps){
          var arr=snaps.val()
          var key=Object.keys(arr)
          for(var i=0;i<key.length;i++){
            if(key[i]===mid){
              console.log('found the message')
              console.log("here")
              return uRef.child(i).remove()
            }
          }
        })
      })
    }
  }
})
exports.chats= functions.database.ref("/chats/{chatId}").onCreate(e =>{
  var pRef=e.data.adminRef.child("summary/users")
  var usersRef=e.data.adminRef.parent.parent.child("users")
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
  var reach = e.data.adminRef.parent.parent.child("reach")
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
  return e.data.adminRef.parent.child("poster/uid").once('value').then(function(snap){
    var uid=snap.val()
    var uRef=e.data.adminRef.parent.parent.parent.child("users").child(uid).child("stats/reaches")
    return uRef.transaction(current=>{
      return (current||0)+1
    })
  })

})
exports.senseAuthForRefer= functions.database.ref("/users/{uid}/basic/referrer").onCreate(e =>{
  var reff=e.data.val()
  if(reff!==""){
    var ref=e.data.adminRef.parent.parent.parent.parent.child("ref")
    ref.child(reff).once('value').then(function(snap){
      var f=snap.val()
      if(f&&f!==null){
        e.data.adminRef.parent.child(f).child("refers").once('value').then(function(snap){
          var val=snap.val()
          if(val===0||val===null||!val){
            val={}
            val[e.params.uid]=Date.now()
          }
          else{
            val[e.params.uid]=Date.now()
          }
          return   e.data.adminRef.parent.parent.parent.child(f).child("refers").set(val)
        })
      }
    })
  }
})
exports.senseRefer=functions.database.ref("/users/{uid}/refers").onWrite(e =>{
  if(e.data.previous.val()!==0){
    if(Object.keys(e.data.val()).length>Object.keys(e.data.previous.val()).length){
      return e.data.adminRef.parent.child("fame").transaction(current =>{
        return(current||0)+0.05
      })
    }
  }
})
// exports.actualAuth=functions.auth.user().onCreate(e =>{
//   var email=e.data.email
//   var num= email.substring(0,email.lastIndexOf("@"))
//   const checkNum=function(num){
//     var truth=false
//     var sub1=num.substring(0,3)
//     var sub2=num.substring(3, email.lastIndexOf(""))
//     if(sub1==="251"&&sub2.length===9){
//       truth=true
//     }
//     return truth
//   }
//
//   if(!checkNum(num)){
//     return e.data.delete()
//   }
// })
exports.proPic=functions.database.ref("/users/{uid}/basic/currentPic").onWrite(e =>{
  if(e.data.val()===""){
    return e.data.adminRef.set("https://firebasestorage.googleapis.com/v0/b/dahlaq-c7e0f.appspot.com/o/defaults%2Fplaceholder.png?alt=media&token=9ccd76a4-b182-47db-9115-13ff2cd72137").then((res)=>{
      return admin.auth().updateUser(e.params.uid,{
        photoURL: "https://firebasestorage.googleapis.com/v0/b/dahlaq-c7e0f.appspot.com/o/defaults%2Fplaceholder.png?alt=media&token=9ccd76a4-b182-47db-9115-13ff2cd72137"
      })
    })

  }
})
exports.chatDelete=functions.database.ref("/chats/{cid}/deleted").onWrite(e =>{
  if(e.data.val()===true){
    return e.data.adminRef.parent.child("summary/users").once('value').then(function(snap){
      var users=snap.val()
      if(users){
        var key=Object.keys(users)
        ref1=e.data.adminRef.parent.parent.parent.child("users").child(key[0])
        ref2=e.data.adminRef.parent.parent.parent.child("users").child(key[1])
      }
      ref1.child("people").child(e.params.cid).remove().then(function(res){
        return ref2.child("people").child(e.params.cid).remove()
      })
    })
  }
})

exports.sendPush1 = functions.database.ref('/chats/{cid}/content/messages/{message}').onCreate(e => {
  var message=e.data.val()
  var req=''
  var refff=e.data.adminRef.parent.once("value").then((r)=>{
    var t=r.val()
    if(Object.keys(t).length===1){
      req=" request"
    }else{
      req=''
    }
  })
  var uid=message.resUid
  return e.data.adminRef.parent.parent.parent.parent.parent.child("users").child(uid).child("token").once('value')
  .then(function(res){
    var token=res.val()
    var payload = {
      notification: {
          title: 'New message'+req+' from '+message.sender,
          body: message.content,
          sound: 'default',
          badge: '1',
          icon: 'https://firebasestorage.googleapis.com/v0/b/dahlaq-c7e0f.appspot.com/o/defaults%2Fdahlaqapk.png?alt=media&token=93344e5d-a249-4f7e-b11d-55551d2ac833',
          tag:'messageReport'
      }
    };

    return admin.messaging().sendToDevice(token,payload)

  })
});
exports.sendPush = functions.database.ref('/chats/{cid}').onCreate(e => {
    // let projectStateChanged = false;
    // let projectCreated = false;
    // let projectData = event.data.val();
    // if (!event.data.previous.exists()) {
    //     projectCreated = true;
    // }
    // if (!projectCreated && event.data.changed()) {
    //     projectStateChanged = true;
    // }
    // let msg = 'You have a new chat request.';
		// if (projectCreated) {
		// 	msg = `The following new project was added to the projec`;
		// }
    // return loadUsers().then(users => {
    //     let tokens = [];
    //     for (let user of users) {
    //         tokens.push(user.pushToken);
    //     }
    //     let payload = {
    //         notification: {
    //             title: 'Firebase Notification',
    //             body: msg,
    //             sound: 'default',
    //             badge: '1'
    //         }
    //     };
    //     return admin.messaging().sendToDevice(tokens, payload);
    // });

    var users=e.data.val().summary.users
    var uid=""
    var cra=""
    if(users){
      for(var i=0;i<Object.keys(users).length;i++){
        var key=Object.keys(users)[i]
        if(users[key].creator===false){
          uid=users[key].uid
          if(i===0){
            cra=users[1].username
          }else{
            cra=users[0].username
          }
        }
      }
      return e.data.adminRef.parent.parent.child("users").child(uid).child("token").once('value')
      .then(function(snap){
        var token=snap.val()
        var payload = {
          notification: {
              title: 'New Chat Request',
              body: 'You got a #habeshaHi from '+ cra+"! Tap to reply.",
              sound: 'default',
              badge: '1'
          }
        };

        return admin.messaging().sendToDevice(token,payload)
      })
    }
});
exports.sent=functions.database.ref("/chats/{cid}/content/messages/{mid}").onWrite(e =>{
  if(!e.data.previous.exists()){
    return e.data.adminRef.child("sent").set(true)
  }

})
// exports.checkValidityOfUser=functions.auth.user().onCreate(ev=>{
//   var uid = ev.data.uid
//   var digit=ev.data.phoneNumber||ev.data.providerData.phoneNumber
//   if(digit){
//     functions.database.ref("/users/"+uid).onCreate(e =>{
//       if(e.data.val().properties.digits!==digit){
//         return admin.auth().deleteUser(uid)
//       }
//     })
//   }
// })
exports.checkUserV=functions.database.ref("/users/{uid}/properties/digits").onCreate(e =>{
  var uid=e.params.uid
  var num=e.data.val()
  return admin.auth().getUser(uid).then(function(res){
    var number=res.phoneNumber
    if(number){
      if(num!==number){
        console.log("number 1",num)
        console.log("number 2",number)
        return admin.auth().deleteUser(uid).then(function(res){
          return e.data.adminRef.parent.parent.remove()
        })
      }
    }
  })
})
exports.proPic2=functions.database.ref("/users/{uid}/basic/currentPic").onWrite(e =>{
  if(e.data.val()!==""){
    var uid=e.params.uid
    var url=e.data.val()
    return admin.auth().updateUser(uid,{
      photoURL:url
    })
  }
})

////Newly added SYNC IMMEDIATELY
exports.digitVerify=functions.database.ref("/users/{uid}/properties/digits").onWrite(e=>{
  // admin.auth().getUser(e.params.uid).then((res)=>{
  //   var num=res.phoneNumber
  //   if(num){
  //     if(e.data.val()!==num){
  //       return e.data.adminRef.set(num)
  //     }
  //   }
  // })
  const checkify=function(num){
    if ((num.length===10&&num[0]==='0'&&num[1]!=='0')||(num.length===9&&num[0]!==0)){
      if(num.length===10){
        return "+251"+num.substring(1,num.lastIndexOf(''))
      }
      else{
        return "+251"+num
      }
    }
    else{
      return null
    }
  }
  var numbe=e.data.val()
  var numb=numbe.substring(3,numbe.lastIndexOf(""))
  var num=checkify(numb)
  if(num){
    return e.data.adminRef.set(num)
  }

})


// function loadUsers() {
//     let dbRef = admin.database().ref('/users');
//     let defer = new Promise((resolve, reject) => {
//         dbRef.once('value', (snap) => {
//             let data = snap.val();
//             let users = [];
//             for (var property in data) {
//                 users.push(data[property]);
//             }
//             resolve(users);
//         }, (err) => {
//             reject(err);
//         });
//     });
//     return defer;
// }
//exports.emptyViewables = functions.database.ref("/users/{uid}/viewables").on
// const pick=function(user, users,frends,suggested){
//
// }

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
