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
  ranks: Array<any>
  viewList:Array<any>=[]
  people:Array<any>=[]
  startAt:number
  notor:Array<string>=[]
  fam:Array<string>=[]
  basis:any
  master={}
  connected:boolean
  keeper:any
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
    this.fbs.getDatabase("/fameList",false).then(function(res){
      console.log("Got fameList...time to display", res)
      for (let i=0;i<Object.keys(res).length;i++){
        console.log("in for loop rank")
        var key=Object.keys(res)[i]
        vm.fam.push(res[key])
      }
      vm.ranks=vm.fam
      if(vm.fam){
        vm.getItems();
      }else{
        console.log("fam is undefined? Why??", vm.fam)
      }
      // lc.dismiss()
    }).catch(function(err){
      //to  be taken care of
      // lc.dismiss()
      console.log("check internet connection ranks, ",err)
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
        // vm.ranks[0]["username"]="Mohammed"
        // vm.ranks[1]["username"]="Minyelshewa"
        vm.viewList=vm.ranks.filter((person) => {
            console.log("filter? Person", person)
            var car=person.username.toLowerCase().indexOf(searchTerm.toLowerCase())
            console.log(car,car>-1)
            if(car>-1){
              if(!vm.keeper[person.username]){
                vm.keeper[person.username]=true
                return car>-1
              }else if(vm.keeper[person.username]){
                return car<-1
              }else{
                return car>-1
              }
            }else{
              if(vm.keeper[person.username]){
                delete vm.keeper[person.username]
              }
              return car>-1
            }
        });
        console.log("viewlist? ",vm.viewList)
        vm.loadIt(vm.viewList)
        resolve("done")
      }else{
        console.log(searchTerm)
        console.log("emptyyyy")
        vm.viewList=_.cloneDeep(vm.ranks)
        vm.loadIt(vm.viewList)
      }
    })
  }
  loadIt(data){
    var vm=this
    vm.people=[]
    for(let i in data){
      this.fbs.getDatabase("/users/"+data[i].uid+"/basic",false).then(function(res:any){
        var dat=data[i]
        dat["currentPic"]=res.currentPic
        dat["bio"]=res.bio
        dat["username"]=res.username
        dat["rank"]=Number(res.rank)+1
        console.log("About to push ranks")
        vm.people.push(dat)
        console.log(vm.people)
      }).catch(function(err){
        console.log("sadd...unable to bring basics of guy")
      })
      if(Number(i)===25||Number(i)===data.length-1){
      this.startAt=Number(i)
      break
    }
    }
  }
  pullToAddMore(e){
    var vm=this
    for(let i in this.viewList){
      var j=Number(i)+this.startAt
      this.fbs.getDatabase("/users/"+this.viewList[j].uid+"/basic",false).then(function(res:any){
        var dat=this.viewList[j]
        dat["currentPic"]=res.currentPic
        dat["bio"]=res.bio
        vm.people.push(dat)
      }).catch(function(err){

      })
      if(Number(i)===25||Number(i)===this.viewList.length-1){
        this.startAt=Number(i)+this.startAt
        e.complete()
        break
      }
    }
  }
}
