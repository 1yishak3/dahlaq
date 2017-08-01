import { Component, ElementRef, ViewChild, Renderer2, AfterViewChecked } from '@angular/core';

import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-content',
  templateUrl: 'chat-detail.html',
})
export class ChatPage implements AfterViewChecked{
  @ViewChild('textt') text:any
  digits:string
  message:string = ""
  textarea: any
  constructor(private rd:Renderer2, public navCtrl: NavController, public navParam:NavParams, public viewCtrl:ViewController) {
    this.digits=navParam.get('chatWith');

   }

   ngAfterViewInit(){
    console.log(this.text)
   }
   ngAfterViewChecked(){

     if(this.message.length<41){
       this.text._elementRef.nativeElement.style.overflow="hidden";
       this.text._elementRef.nativeElement.style.height="45px"
     }
     else{
       this.text._elementRef.nativeElement.style.overflow="auto"
       this.text._elementRef.nativeElement.scrollTop=this.text._elementRef.nativeElement.scrollHeight
       this.text._elementRef.nativeElement.style.height = (this.text._elementRef.nativeElement.scrollHeight-22) +"px";
    }
   }
   cancel() {
     this.viewCtrl.dismiss();
   }
}
