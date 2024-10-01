import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core';
import axios from 'axios';




export const useCouponStore = defineStore("coupon", {
  state: () => ({
    coupon: {},
    coupons: [],
    userToken: useLocalStorage('token'),
  }),
  getters: {
    getCoupons(state) {
      return state.coupons
    },
    getOneCoupon(state) {
      return state.coupon
    }
  },
  actions: {
    async fetchAll() {
      try {
        const data = await axios.get(import.meta.env.VITE_API_URL + "/admin/coupons", { headers: { 'Authorization': `Bearer ${this.userToken}` } })
        this.coupons = data.data;
      } catch (error) {
        console.log(error)
      }
    },
    async add(coupon) {
      try {
        await axios.post(import.meta.env.VITE_API_URL + "/admin/add-coupon", coupon, { headers: { 'Authorization': `Bearer ${this.userToken}` } });
        await this.fetchAll()
      } catch (error) {
        console.log(error)
      }
    },
    async getOne(id) {
      const data = await axios.get(import.meta.env.VITE_API_URL + `/admin/coupon/${id}`, { headers: { 'Authorization': `Bearer ${this.userToken}` } })
      this.coupon = data.data[0]
    },
    async update(id, coupon) {
      const data = await axios.put(import.meta.env.VITE_API_URL + `/admin/coupon/${id}`, coupon, { headers: { 'Authorization': `Bearer ${this.userToken}` } })
      await this.fetchAll()
    },
    async delete(id) {
      try {
        await axios.delete(import.meta.env.VITE_API_URL + `/admin/coupon/${id}`, { headers: { 'Authorization': `Bearer ${this.userToken}` } });
        await this.fetchAll()
      } catch (error) {
        console.log(error)
      }
    },

  }
});
