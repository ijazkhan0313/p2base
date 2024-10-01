import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core';
import axios from 'axios';




export const useEventStore = defineStore("event", {
  state: () => ({
    events: null,
    event: {},
    eventStatus:null,
    userEvents: null,
    allEvents: null,
    userToken: useLocalStorage('token'),
    latRes: "",
    lngRes: "",
    diffSetting: null,
    stripeSession: "",
    imgApi: import.meta.env.VITE_IMG_API + 'events/'
  }),
getters: {
  getEvent(state) {
    return state.event;
  },
  getAllEvents(state) {
    return state.allEvents
  },
  getUserEvents(state) {
    return state.events
  },
  getImgApi(state) {
    return state.imgApi
  },
  getDiffSetting(state) {
    return state.diffSetting
  },
getFilteredEvents: (state) => (searchFilter) => {
  if (!state.events) return [];
  return state.events.filter(event => 
    (!searchFilter.nom || event.nom.includes(searchFilter.nom)) &&
    (!searchFilter.categorie || event.categorie.includes(searchFilter.categorie)) &&
    (!searchFilter.dateMin || event.date >= searchFilter.dateMin) &&
    (!searchFilter.dateMax || event.date <= searchFilter.dateMax)
  );
}
},
  actions: {
    setEventStatus(status){
      this.eventStatus = status
      
    },
    setEvent(event) {
      try {
        this.event = event;
      } catch (error) {
        console.log(error)
      }
    },
    async addEvent(event) {
      try {
        const res = await axios.post(import.meta.env.VITE_API_URL + "/add-event", event, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${this.userToken}` } });
        const eventId = res.data.identifier
        localStorage.setItem('eventIdentifier',eventId);
        const events = this.events
        const newEvent = this.event
        console.log('newEvent', newEvent);
        console.log('this.event', this.event);
        
        events.push(newEvent)
        this.events = events
      } catch (error) {
        console.log(error)
      }
    },
    async eventUpdate(event, id){
      try {
          await axios.patch(import.meta.env.VITE_API_URL + `/event/${id}`, event, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${this.userToken}` } });
      }catch(e){
        console.error(e)
      }
    },
    async searchEventGeolocation(adress, zip) {
      try {
        await axios.get(import.meta.env.VITE_GEO_API + `${adress}&postcode=${zip}`).then(result => {
          this.lngRes = result.data.features[0]['geometry']['coordinates'][0],
            this.latRes = result.data.features[0]['geometry']['coordinates'][1]
        })
      } catch (error) {
        console.log(error)
      }
    },
    async setDiffSettings(settings) {
      this.diffSetting = settings
    },
    async orderEvent(totalPrice) {
      console.log(typeof totalPrice)
      const total = parseFloat(totalPrice) * 100
      const eventObj = { name: this.event.identifier ? this.event.identifier : localStorage.getItem('eventIdentifier')   , price: total.toFixed(0) };
      try {
        await axios.post(import.meta.env.VITE_API_URL + "/order", eventObj, {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }).then(response => {
          window.location = response.data.url
        });
      } catch (e) {
        console.error(e)
      }
    },
    async getOneEvent(identifier){
      const res = await axios.get(import.meta.env.VITE_API_URL + `/p2bEvent/${identifier}`, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${this.userToken}` } });
      this.event = res.data;
      return res.data;
    },
    async fetchEvents(userEmail) {
      const res = await axios.get(import.meta.env.VITE_API_URL + `/events/all/${userEmail}`, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${this.userToken}` } });
      this.allEvents = res.data;
    },
    async fetchPendingEvents(userEmail) {
      const res = await axios.get(import.meta.env.VITE_API_URL + `/admin/events/${userEmail}`, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${this.userToken}` } });
      this.events = res.data
    },
    async fetchUserEvents(email) {
      const res = await axios.get(import.meta.env.VITE_API_URL + `/events/user-events/${email}`, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${this.userToken}` } });
      this.events = res.data;
      return res.data
    },
    async delete(id) {
      await axios.delete(import.meta.env.VITE_API_URL + `/event/${id}`, { headers: { 'Authorization': `Bearer ${this.userToken}` } });
      const adminMail = localStorage.getItem('accountMail') 
      const userMail  = localStorage.getItem('userEmail')
      if(adminMail){
        this.fetchEvents(adminMail)
      }else{
        this.fetchUserEvents(userMail)
      }
    },
    async saveInvoice(invoice){
      await axios.post(import.meta.env.VITE_API_URL + `/event/add-invoice`,  invoice, {headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.userToken}` }}).then(res => localStorage.removeItem('eventIdentifier'));
    }
  }
});