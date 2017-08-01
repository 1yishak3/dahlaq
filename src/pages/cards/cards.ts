import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, Events } from 'ionic-angular';
import { PostPage } from '../post/post'
import { FirebaseService } from '../../providers/firebase'
import { WelcomePage } from '../welcome/welcome'

@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
  cardItems: any[];
  @ViewChild(Nav) nav: Nav;

  constructor(public navCtrl: NavController, public events : Events ,public fbs:FirebaseService) {
    this.cardItems = [
      {
        user: {
          avatar: 'assets/img/marty-avatar.png',
          name: 'Marty McFly'
        },
        date: 'November 5, 1955',
        image: 'assets/img/advance-card-bttf.png',
        content: 'Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy.',
      },
      {
        user: {
          avatar: 'assets/img/sarah-avatar.png.jpeg',
          name: 'Sarah Connor'
        },
        date: 'May 12, 1984',
        image: 'assets/img/advance-card-tmntr.jpg',
        content: 'I face the unknown future, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.'
      },
      {
        user: {
          avatar: 'assets/img/ian-avatar.png',
          name: 'Dr. Ian Malcolm'
        },
        date: 'June 28, 1990',
        image: 'assets/img/advance-card-jp.jpg',
        content: 'Your scientists were so preoccupied with whether or not they could, that they didn\'t stop to think if they should.'
      }
    ];

  }
  detailPost(post:any){
    this.navCtrl.push(PostPage,{
      post:post
    })
  }
  doLogout(){
    this.fbs.logout().then((res)=>{
      console.log("I'm here")

      this.events.publish('dude')
      //this.nav.popToRoot()

    }).catch((err)=>{
      console.log("Can't logout")
    })/*
    this.events.subscribe('dude',()=>{
      var user = this.fbs.currentUser()
      console.log("this is you",user)
      this.nav.setRoot(WelcomePage)
    })*/

  }
}
