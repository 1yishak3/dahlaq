import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { ItemCreatePage } from '../item-create/item-create';
import { ItemDetailPage } from '../item-detail/item-detail';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { Items } from '../../providers/providers';
import { Uzer } from '../../models/uzer'
import { Item } from '../../models/item';
import { FirebaseService } from '../../providers/firebase'
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];
  search:boolean=false
  searching: any=false
  searchCtrl:FormControl
  searchTerm:string=""
  ranks: Array<string>
  viewList:Array<string>
  people:Array<Uzer>
  startAt:number
  notor:Array<string>
  fam:Array<string>
  basis:number
  master={}
  constructor(public fbs:FirebaseService,public http:Http,public navCtrl: NavController, public items: Items, public modalCtrl: ModalController) {
    this.searchCtrl=new FormControl()

  }

  /**
   * The view loaded, let's query our items for the list

   */
  ionWillEnter(){
    var vm=this
    this.fbs.getDatabase("/namesList/1",false).then(function(res){
      for (let i=0;i<Object.keys(res).length;i++){
        vm.fam.push(res[i])
      }
    }).catch(function(err){
      //to  be taken care of
      console.log("check internet connection")
    })
    this.fbs.getDatabase("/namesList/2",false).then(function(res){
      for (let i=0;i<Object.keys(res).length;i++){
        vm.notor.push(res[i])
      }
    }).catch(function(err){
      //to  be taken care of
      console.log("check internet connection")
    })
    vm.master["1"]=vm.fam
    vm.master["2"]=vm.notor
    vm.ranks=vm.master[vm.basis]
  }
  ionViewDidLoad() {
    this.getItems();
    this.searchCtrl.valueChanges.debounceTime(500).subscribe(search=>{
      this.getItems()
    })
  }
  onSearchInput(){
    this.searching = true;
  }
  searchOn(){
    this.search=!this.search
  }
  openItem(person: Uzer) {
    this.navCtrl.push(ItemDetailPage, {
      person: person
    });
  }
  getItems(){
    this.ranks=this.master[this.basis]
    this.filterAndGetRanks(this.searchTerm).then(function(res){
        this.searching=false;
    }).catch(function(err){

    })

    //return this.http.get(this.url + '/' + endpoint, options);
  }
  filterAndGetRanks(searchTerm){
    var vm=this
    return new Promise(function(resolve,reject){
      if(searchTerm!=""){
        vm.viewList=vm.ranks.filter((person) => {
            return person.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });
        vm.loadIt(vm.viewList)
      }else{
        vm.viewList=vm.ranks
        vm.loadIt(vm.ranks)
      }
    })
  }
  loadIt(data){
    var vm=this
    for(let i in data){
      this.fbs.getDatabase("/uidList/"+i,false).then(function(res){
        this.fbs.getDatabase("/users/"+res,false).then(function(res){
          vm.people.push(res)
        }).catch(function(err){

        })
      }).catch(function(err){

      })
      if(Number(i)===14||Number(i)===this.ranks.length-1){
        this.startAt=Number(i)
        break
      }
    }
  }
  pullToAddMore(e){
    var vm=this
    for(let i in this.viewList){
      var j=Number(i)+this.startAt
      this.fbs.getDatabase("/uidList/"+j,false).then(function(res){
        this.fbs.getDatabase("/users/"+res,false).then(function(res){
          vm.people.push(res)
        }).catch(function(err){

        })
      }).catch(function(err){

      })
      if(Number(i)===14||Number(i)===this.ranks.length-1){
        this.startAt=Number(i)+this.startAt
        e.complete()
        break
      }
    }
  }
}
