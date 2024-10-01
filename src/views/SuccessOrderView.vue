<script>
import { useUserStore } from "@/stores/users"
import { useEventStore } from "@/stores/events"
import router from "@/router";
export default {
  setup(){
    const userStore = useUserStore();
    const eventStore = useEventStore();
    return { userStore, eventStore }
  },
  data(){
    return{
      diffSetting: this.eventStore.getDiffSetting,
      userEmptyData: true,
      userData:{},
      invoice: null
    }
  },
  async mounted() {
    await this.fetchUser();
   if(this.userData.user.streetAddress != "" && this.userData.user.city != "" && this.userData.user.brandName != ""  && this.userData.user.firstname != "" && this.userData.user.lastname != ""){
    this.userEmptyData = false
   }
   this.invoice = localStorage.getItem('newInvoice')
   await this.eventStore.saveInvoice(this.invoice)
   
  },
  methods:{
    async fetchUser(){
        const email = localStorage.getItem("userEmail")
        const adminMail = localStorage.getItem("accountMail")
        if(adminMail){
          await  this.userStore.fetchUserInfos(adminMail);
        }else{
          await  this.userStore.fetchUserInfos(email);
        }
        this.userData = this.userStore.getUser
      },
    async closeEventCase(nbre){
      const order = JSON.parse(localStorage.getItem("orderDiff"));
      order['active'] = true;
      await this.eventStore.eventUpdate(order, order.identifier)
     if(nbre === 2){
      router.push({path: '/dashboard', query: {activeId:5}})
     }
     if(nbre === 3){
      router.push({path: '/dashboard', query: {activeId:1}})
     }
     localStorage.removeItem('orderDiff')
    },
  }

}
</script>


<template>
    <div class="popup_container" >
    <div>
        <div class="orderPopUp_container">
            <div class="orderPopUp_title">Votre diffusion à bien été enregistré !</div>
            <div v-if="userEmptyData === true" class="">Votre évènement est en attente de validation par un administrateur, <br>
                merci de completer vos coordonnées pour l'envoi de votre facture.
            </div> 
            <div v-if="userEmptyData === false" class="">votre évènement est en attente de validation par un administrateur. <br>
                vous serez informer par mail de son statut
            </div> 
            <div class="orderPopUp-buttons">
                <button v-if="userEmptyData === false" class="orderPopUpBtn" @click="closeEventCase(3)">Retour à l'accueil</button>
                <button v-if="userEmptyData === true" class="orderPopUpBtn" @click="closeEventCase(2)">Completer mes coordonnées</button>
            </div>
        </div>
    </div>
  </div>
</template>

<style lang="css" scoped> 
.popup_container{
  
  width: 100vw;
  height: 100vh;
  background-color: white;
  z-index: 0;
  opacity: 0.8;
  overflow: hidden;
}
.orderPopUp_container{
  position: absolute;
  width: 40rem;
  height: 20rem;
  background-color:var(--primary);
  top: 50%;
  left:50%;
  transform: translate(-50%, -50%);
  border-radius:0.5rem;
  display: flex;
  flex-direction: column;
  justify-content:space-around;
  align-items: center;
  font-size:1.2rem;
  text-align: center;
  z-index:2;
}
.orderPopUp_title{
  font-size:2rem;
}
.orderPopUp-buttons{
  width: 30rem;
  display: flex;
  justify-content:space-around;
}
.orderPopUpBtn{
  border-radius: 0.5rem;
  border:none;
  width: 10rem;
  height: 2rem;
  background-color:white;
  
  color:var(--primary);
  cursor: pointer;
}
</style>
