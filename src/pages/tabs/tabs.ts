import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { Tab1Root } from '../pages';
import { Tab2Root } from '../pages';
import { Tab10Root } from '../pages';
import { Tab4Root } from '../pages';
import { Tab5Root } from '../pages';
import {FirebaseService} from '../../providers/firebase'

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab10Root;
  tab5Root: any = Tab5Root;
  tab4Root: any = Tab4Root;

  tab1Title = "Ranks";
  tab2Title = "Create";
  tab3Title = "Profile";
  tab4Title = "Posts";
  tab5Title = "Chats"
  unread:number=0
  constructor(public fbs:FirebaseService, public navCtrl: NavController, public translateService: TranslateService) {
    console.log(Tab10Root)
    console.log(Tab1Root)

    /*translateService.get(['TAB1_TITLE', 'TAB2_TITLE', 'TAB3_TITLE']).subscribe(values => {
      this.tab1Title = values['TAB1_TITLE'];
      this.tab2Title = values['TAB2_TITLE'];
      this.tab3Title = values['TAB3_TITLE'];
    });*/
    this.int()
  }
  int(){
    var f=setInterval(()=>{
      var cnt=0
      var sRef= this.fbs.getRef("/users/"+this.fbs.currentUser().uid+"/people")
      sRef.once("value").then((snap)=>{
        var list=snap.val()
        for(let k  in list){
          if(k!=="cache"&&list!=="repopulate"){
            var cid=snap[k]
            this.fbs.getDatabase("/chats/"+cid+"/summary/users/"+this.fbs.currentUser().uid+"/unread",true).then((sn)=>{
              if(sn){
                cnt=cnt+Object.keys(sn).length
              }
            })
          }
        }
        this.unread=cnt
        console.log(this.unread)
      })
    },2500)

  }
}
