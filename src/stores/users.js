import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    pro: null,
    mob: null,
    token: null,
    type: null,
    userAccount: null,
    admin:null,
    loginError:null
  }),
  getters: {
    getUser(state) {
      return state.user;
    },
    getStatus(state) {
      return state.admin;
    },
    getPros(state) {
      return state.pro;
    },
    getMobs(state) {
      return state.mob;
    },
    getAccount(state) {
      return state.userAccount;
    },
    getType(state) {
      return state.type;
    }
  },
  actions: {
    async signIn(email, password) {
      try{
        const jsonData = JSON.stringify(`{"email": "${email}","password": "${password}"}`);
        const res = await axios.post(import.meta.env.VITE_API_URL + "/login", jsonData, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
        await axios.get(import.meta.env.VITE_API_URL + "/webVisitLog", { headers: { 'Content-Type': 'application/json; charset=utf-8'}});
        console.log(res)

        if(res.status === 202){
          const user = res.data;
          localStorage.setItem('isValidated', user.data.validUser);
            if (user.data.admin === true) {
              this.admin = user.data
              localStorage.setItem('accountMail', email);
              localStorage.setItem('state', "AUPB");
              } else {
              this.user = user.data;
              localStorage.setItem('userEmail', email);
              localStorage.setItem('state', "PBUU");
              }
              localStorage.setItem('token', user.token);
              this.token = user.token;
              // if (user.data.isEntreprise === false) {
              // this.type = 1;
        // } else {
        //   this.type = 2;
        // }
        router.push("/dashboard");
        }else{
          this.loginError = res.data
        }
        
      }catch(e){
        console.error(e.response.data)
        this.loginError = e.response.data
      }
     
    },
    async signUp(data) {
      const { diffuser, advertiser, email, pwd } = data;
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isValidated', false);
      const jsonData = JSON.stringify(
        `{"diffuser":"${diffuser}","advertiser":"${advertiser}","email": "${email}","password": "${pwd}", "platform": "WEB"}`);
      try {
        await axios.post(import.meta.env.VITE_API_URL + "/signup", jsonData, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
      } catch (e) {
        console.error(e);
      }
    },
    async fetchUserInfos(email) {
      const res = await axios.get(import.meta.env.VITE_API_URL + `/user/infos/${email}`, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
      if (res.data.user.admin === true) {
      this.admin = res.data
      }else{
        this.user = res.data
      }
    },
    async checkValidatedAccount() {
      const email = localStorage.getItem('userEmail');
      const isValidated = localStorage.getItem('isValidated');
      if (!email && isValidated === false) {
        router.push('/');
      } else {
        if (isValidated === false) {
          const res = await axios.get(import.meta.env.VITE_API_URL + `/validation/${email}`, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
          if (res.data.validUser === true) {
            localStorage.setItem('isValidated', true);
            localStorage.setItem('token', res.data.token);
            this.user = res;
          } else {
            router.push('/');
          }
        } else
          return
      }
    },
    async getProUsers(userMail) {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + `/admin/pro/${userMail}`, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
        this.pro = res.data
      } catch (err) {
        console.error(err)
      }
    },
    async getMobUsers(userMail) {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + `/admin/mob/${userMail}`, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
        this.mob = res.data
      } catch (err) {
        console.error(err)
      }
    },
    async fetchUserAccount(userMail) {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + `/user/infos/${userMail}`, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
        
        this.userAccount = res.data
        return res.data
      } catch (err) {
        console.error(err)
      }
    },
    async updateUser(id, userData) {
      try {
        const { phone, adress, city, zip, siret, brandName, firstname, lastname, webSite } = userData;
        const jsonData = JSON.stringify(
          `{"brandName":"${brandName}","firstname": "${firstname}", "lastname": "${lastname}","streetAddress": "${adress}","siret":"${siret}","city": "${city}","zipCode": "${zip}","phoneNumber": "${phone}", "webSite": "${webSite}"}`);
        await axios.patch(import.meta.env.VITE_API_URL + `/user/${id}`, jsonData, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
      } catch (err) {
        console.error(err);
      }
    },
    async deleteUser(id) {
      try {
        let userEmail = localStorage.getItem('accountMail') ? localStorage.getItem('accountMail') : localStorage.getItem('userMail')
        await axios.delete(import.meta.env.VITE_API_URL + `/users/${id}`, { headers: { 'Authorization': `Bearer ${this.userToken}` } });
        getProUsers(userEmail)
        getMobUsers(userEmail)
      } catch (error) {
        console.log(error)
      }
    },
    async sendResetReq(email){
      try {
        await axios.post(import.meta.env.VITE_API_URL + `/reset-pwd`,{email: email, provide : "WEB"});
      } catch (error) {
        console.log(error)
      }
    },
    async resetPwd(pwd, token){
      try {
        await axios.patch(import.meta.env.VITE_API_URL + `/user/reset-password`,{password: pwd, token : token, provide: "WEB"});
      } catch (error) {
        console.log(error)
      }
    },
    async getUserInvoices(email){
      try{
        const res = await axios.get(import.meta.env.VITE_API_URL + `/user/invoices/${email}`, { headers: { 'Authorization': `Bearer ${this.userToken}` } });
      return res.data
      }catch(e){
        console.log(e)
      }    
    }
  }
});
