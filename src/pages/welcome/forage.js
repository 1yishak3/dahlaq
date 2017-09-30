var require
const localforage = require('localforage')
localforage.config({
  name: 'Dahlaq'
})
const setter = function(where,val){
  return localforage.setItem(where,val)
}
const getter = function(where){
  return localforage.getItem(where)
}
