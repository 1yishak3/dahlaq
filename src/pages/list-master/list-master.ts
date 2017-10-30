import { Component } from '@angular/core';
import { NavController, ModalController,LoadingController } from 'ionic-angular';

import { ItemCreatePage } from '../item-create/item-create';
import { ItemDetailPage } from '../item-detail/item-detail';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { Items } from '../../providers/providers';
import { Uzer } from '../../models/uzer'
import { Item } from '../../models/item';
import { FirebaseService } from '../../providers/firebase'
import {Network} from '@ionic-native/network'
import * as _ from 'lodash'
import {Storage} from '@ionic/storage'

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  //currentItems: Item[];
  search:boolean=false
  searching: any=false
  searchCtrl:FormControl
  searchTerm:string=""
  ranks: Array<any>=[]
  viewList:Array<any>=[]
  people:Array<any>=[]
  startAt:number
  notor:Array<string>=[]
  fam:Array<string>=[]
  basis:any
  master={}
  connected:boolean
  keeper:any
  nada:boolean=false
  peopled:boolean=false
  story:any={}
  constructor(public sg:Storage,public lc:LoadingController,public nw:Network,public fbs:FirebaseService,public http:Http,public navCtrl: NavController, public items: Items, public modalCtrl: ModalController) {
    this.searchCtrl=new FormControl()
    this.keeper={}
    var vm=this
    var disc=nw.onDisconnect().subscribe(()=>{
      vm.connected=false
    })
    var conc=nw.onConnect().subscribe(()=>{
      vm.connected=false
    })
    var vm=this

    // this.fbs.getDatabase("/notorList",false).then(function(res){
    //   if(res){
    //     for (let i=0;i<Object.keys(res).length;i++){
    //       vm.notor.push(res[i])
    //     }
    //   }else{
    //     vm.notor=null
    //   }
    // }).catch(function(err){
    //   //to  be taken care of
    //   console.log("check internet connection")
    // // })
    // vm.master["1"]=vm.fam
    // vm.master["2"]=vm.notor
    // if(vm.notor===null){
    //   vm.basis="1"
    // }



  }

  /**
   * The view loaded, let's query our items for the list

   */

  ionViewWillEnter(){
    // var lc=this.lc.create({
    //   content:"Loading the ranks..."
    // })
    // lc.present()
    var vm=this
    vm.fam=[]
    this.fbs.getDatabase("/fameList/cache",true).then((cc)=>{
        this.sg.get("/fameList/cache").then((c)=>{
          if(c!=cc||this.ranks.length===0){
            this.fbs.getDatabase("/fameList",true).then(function(res){
              for (let i=0;i<Object.keys(res).length;i++){
                console.log("in for loop rank")
                var key=Object.keys(res)[i]
                if(isNaN(res[key])){
                  vm.fam.push(res[key])
                }
              }
              vm.ranks=vm.fam
              if(vm.fam){
                vm.getItems();
                if(vm.ranks.length<=1){
                  vm.nada=true
                  vm.peopled=false
                }else{
                  vm.nada=false
                  if(vm.ranks.length<50){
                    vm.peopled=true
                  }else{
                    vm.peopled=false
                  }

                }
              }else{
                console.log("fam is undefined? Why??", vm.fam)
              }
              // lc.dismiss()
            }).catch(function(err){
              //to  be taken care of
              // lc.dismiss()
              console.log("check internet connection ranks, ",err)
            })
          }
        })
    })


    this.searchCtrl.valueChanges.debounceTime(500).subscribe(search=>{
      console.log("I am detecting changes in search parameter and proceeding with getting items")
      this.getItems()
    })
  }
  ionViewDidLoad() {

  }
  onSearchInput(){
    this.searching = true;
  }
  searchOn(){
    this.search=!this.search
  }
  openItem(person) {
      this.navCtrl.push(ItemDetailPage, {
        person: person.uid
      });
  }
  getItems(){
    this.filterAndGetRanks(this.searchTerm).then(function(res){
        this.searching=false;
    }).catch(function(err){

    })

    //return this.http.get(this.url + '/' + endpoint, options);
  }
  filterAndGetRanks(searchTerm){
    var vm=this
    return new Promise(function(resolve,reject){
      console.log("I have entered filter and get ranks")
      if(searchTerm!==""){
        console.log(vm.ranks)

        vm.viewList=vm.ranks.filter((person) => {

              return (person.username.toLowerCase().indexOf(searchTerm.toLowerCase())!=-1)

            // console.log(car,car>-1)
            // if(car>-1){
            //   if(!vm.keeper[person.username]){
            //     vm.keeper[person.username]=true
            //     return car>-1
            //   }else if(vm.keeper[person.username]){
            //     return car<-1
            //   }else{
            //     return car>-1
            //   }
            // }else{
            //   if(vm.keeper[person.username]){
            //     delete vm.keeper[person.username]
            //   }
            //   return car>-1
            // }
        });

        vm.loadIt(vm.viewList).then(()=>{
          resolve("done")
        }).catch(()=>{
          reject()
        })
        resolve("done")
      }else{
        console.log(searchTerm)
        console.log("emptyyyy")
        vm.viewList=vm.ranks
        vm.loadIt(vm.viewList).then(()=>{
          resolve()
        }).catch(()=>{
          reject()
        })

      }
    })
  }
  loadIt(data){
    return new Promise((resolve,reject)=>{
      this.startAt=0
      var vm=this
      vm.people=[]
      var news=[]
      for(let i in data){
        this.fbs.getDatabase("/users/"+data[i].uid+"/basic",false).then(function(res:any){
          var dat=data[i]
          dat["currentPic"]=res.currentPic
          dat["bio"]=res.bio
          dat["username"]=res.username
          dat["rank"]=Number(res.rank)
          console.log("About to push ranks")
          news.push(dat)

          news.sort((a,b)=>{
            return a.rank-b.rank
          })
          if(Number(i)>=25||Number(i)===data.length-1){
            vm.people=news
          }
          //console.log(vm.people)
        }).catch(function(err){
          console.log("sadd...unable to bring basics of guy")
          reject()
        })
        if(Number(i)>=25||Number(i)===data.length-1){
          this.startAt=Number(i)

          resolve()
          break

        }
      }
    })

  }
  pullToAddMore(e){
    var vm=this
    var j=this.startAt+1
    var dis=true
    for(let i in this.viewList){
      dis=false
      if(Number(i)>=j){
      this.fbs.getDatabase("/users/"+this.viewList[i].uid+"/basic",false).then((res:any)=>{
        var dat=this.viewList[i]
        dat["currentPic"] = res.currentPic
        dat["bio"] = res.bio
        dat["username"] = res.username
        dat["rank"] = Number(res.rank)
        vm.people.push(dat)
        vm.people.sort((a,b)=>{
          return a.rank - b.rank
        })
        if(Number(i) - j >= 14||Number(i) === this.viewList.length - 1){

          e.complete()
        }
      }).catch(function(err){
        e.complete()
      })
      }
      if(Number(i) - j >= 14||Number(i) >= this.viewList.length - 1){
        dis=true
        this.startAt=Number(i)
        break
      }

    }
    if(dis){
      e.complete()
    }

  }
}
