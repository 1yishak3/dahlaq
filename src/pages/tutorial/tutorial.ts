import { Component } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';

import { MainPage } from '../pages';

import { TranslateService } from '@ngx-translate/core';



export interface Slide {
  title: string;
  description: string;
  image?: string;
}

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides: Slide[];
  showSkip = true;

  constructor(public navCtrl: NavController, public menu: MenuController, translate: TranslateService) {

        this.slides = [
          {
            title: "So what's the deal?",
            description: "Dahlaq is an Ethiopian social networking app made by Ethiopians for...you guessed it, ONLY Ethiopians! That's not so special? Well...",
            //image: 'assets/img/ica-slidebox-img-2.png',
          },
          {
            title: "We know what you want, and we are here to make sure you have it!",
            description: "As Ethiopians who eat the Shiro you eat and drink the Tej ;) you drink, we know what you prefer. And we are here to get you your wildest desires.",
          //  image: 'assets/img/ica-slidebox-img-3.png',
          },
          {
            title:"Remember when we said we know what you go through? No? Well...",
            description:  "With Dahlaq, it's always efficient! We know every Ethiopian avoids the pains of internet costs in any way they can. Honestly, it's horrible. With Dahlaq, we are committed to making sure you get the smoothest possible experience while saving a FORTUNE in internet money."+
            "We are continuously researching and implementing new ways to make the price of visiting Dahlaq a bare minimum." ,
          //  image: 'assets/img/ica-slidebox-img-3.png',
          },
          {
            title: "Let's cut to the chase...What's it going to be about?",
            description: "On Dahlaq, you can post whatever you like whenever you like. And guess what? You get to decide how many people you want to reach with your posts!\
             You will have a maximum limit of number of people to reach which increases everytime you post something.",
          //  image: 'assets/img/ica-slidebox-img-3.png',
          },
          {
            title: "But wait, there's more...",
            description: "Simple logic: The more you post and react to posts, the higher your rank will be(as long as you beat everybody else). When your posts are disliked or reported, your rank will be negatively affected, and likes will positively affect your rank.",
          //  image: 'assets/img/ica-slidebox-img-3.png',
          },
          {
            title: "And more...",
            description: "As always, there's also a chat page on which Dahlaq will suggest people you have a lot in common with. You can talk to them or whoever you like!",
          //  image: 'assets/img/ica-slidebox-img-3.png',
          },
          {
            title: "WE NEED YOU!",
            description: "Getting to decide how many people you can reach is a huge power, and poeple may abuse it. So it is up to you to simply click the Report button when you see a thing that you think is an ADVERTISEMENT or INAPPROPRIATE.\
            It's just like Liking and Disliking but if a lot of people  click the REPORT button on a post, the post will be deleted!",
          //  image: 'assets/img/ica-slidebox-img-3.png',
        },  {
            title: "Do you have an idea for Dahlaq? Do you want something added?",
            description: "We are open to any form of suggestions! We love them. Reach out to us (you can find our info on our About page) and we'll do whatever we can.",
          //  image: 'assets/img/ica-slidebox-img-3.png',
          },
        ];
  }

  startApp() {
    this.navCtrl.setRoot(MainPage, {}, {
      animate: true,
      direction: 'forward'
    });
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page

  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page

  }

}
