import { defineStore } from 'pinia'
import axios from 'axios';

export const useAdminStore = defineStore(("adminStore"), {
  state: () => ({
    settings: {}
  }),
  getters: {
    getSettings(state) {
      return state.settings;
    }
  },
  actions: {
    async defineSettings(prices) {
      await axios.post(import.meta.env.VITE_API_URL + "/admin/setPrices", prices, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.userToken}` } }
      );

    },
    async getPriceSettings() {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/admin/getPrices", { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.userToken}` } })
      this.settings = res.data
    },
    async getStats(){
      const res = await axios.get(import.meta.env.VITE_API_URL + "/admin/stats", { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.userToken}` } })
      return res.data[0];
    },
    async sendMail(userEmail){
      await axios.post(import.meta.env.VITE_API_URL + "/validityEventMail",{email:userEmail} , { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.userToken}` } })
    }
  }

})