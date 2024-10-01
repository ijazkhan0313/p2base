<script>
import { useEventStore } from "@/stores/events"
import { useCouponStore } from "@/stores/coupon"
import { useUserStore } from "@/stores/users"
import moment from "moment"
import router from '@/router';

export default {
  setup(){
    const eventStore = useEventStore();
    const couponStore = useCouponStore();
    const userStore = useUserStore();
    const event = eventStore.getEvent;
    const diffSetting = eventStore.getDiffSetting;
    let themes;
    if(diffSetting.themes){
      themes = diffSetting.themes.join(', ')
    }else{
      themes = "Bannière France"
    }
    
    const userInfos = userStore.getUser
    return { eventStore, event, diffSetting ,couponStore, userStore,userInfos , themes}
  },
  data(){
    return{
      search_value:'',
      couponList:[],
      promoPrice: this.diffSetting.totalPrice,
      vat: 0,
      globalPrice: this.diffSetting.totalPrice,
      totalPrice:0,
      codeError: false
    }
  },
  async mounted() {
   await this.couponStore.fetchAll();
    this.vat = (this.globalPrice * 0.2).toFixed(2)
    this.totalPrice = (this.globalPrice * 1.2).toFixed(2)
  },
  methods:{
    async orderHandler(){
      const total = this.totalPrice;
      const eventId = this.event.identifier ? this.event.identifier : localStorage.getItem('eventIdentifier');
      const dateNow = this.formatDate(new Date());
      console.log(this.diffSetting)
      if(this.diffSetting.isAds === false){
        this.diffSetting['active'] = true;
        localStorage.setItem('orderDiff', JSON.stringify(this.diffSetting));
        await this.eventStore.eventUpdate(this.diffSetting, eventId );
        router.push('/confirmation')
      }else{
        localStorage.setItem('orderDiff', JSON.stringify(this.diffSetting));
        let newInvoice = {
            eventId: eventId,
            amount: this.globalPrice,
            orderDate: dateNow
        }; 
        localStorage.setItem('newInvoice', JSON.stringify(newInvoice));
        await this.eventStore.orderEvent(total);
        await this.eventStore.eventUpdate(this.diffSetting, this.event.identifier ? this.event.identifier : localStorage.getItem('eventIdentifier'))
      }
      this.$emit("orderState", {value:4})
     
    },
    returnToEventPage(){
       this.$emit("orderState", {value:6})
    },
    promoCode(){
        const search = this.search_value;
        const couponList =  this.couponStore.getCoupons
        let couponOffer;
        for(const coupon of couponList){
          if( coupon.title.trim() === search.trim()){
            couponOffer = coupon;
          }
        }
        if(!couponOffer){
          this.codeError = true;
          return
        }
        if(couponOffer.active === true) {
              if(couponOffer.usingTime < couponOffer.usingMaxTime || couponOffer.unlimited === true){
                if(couponOffer.promoType === "percent") {
                  this.globalPrice = (this.globalPrice * (couponOffer.value/100)).toFixed(2);
                  this.promoPrice = this.globalPrice
                }
                if(couponOffer.promoType === "euro") {
  
                  this.globalPrice = (this.globalPrice - couponOffer.value).toFixed(2);
                  this.promoPrice = this.globalPrice
                }
                if(couponOffer.discountTotal === true ||couponOffer.promoType === "percent" && couponOffer.value === 100){
                  this.globalPrice = 0
                  this.promoPrice = this.globalPrice
                }
              }
              this.diffSetting["isAds"] = false;
              this.vat = (this.globalPrice * 0.2).toFixed(2);
              this.totalPrice = (this.globalPrice  * 1.2).toFixed(2);
            }
      },
      formatDate(dateString) {
      return moment(dateString).format('DD/MM/YYYY');
    }
  
  }

}
</script>

<template>
  <div class="container">
    <div class="container_title">
      Récapitulatif de diffusion
    </div> 
    <div class="container_event-infos">
      <div class="event_infos-recap">
        <div class="event_infos"> 
          <span class="infos_title">Évènement à diffuser:</span>
          <span>{{ event.eventNameFr }}</span>
         </div>
         <div class="event_infos"> 
          <span class="infos_title">Catégories:</span>
          <span>{{ themes }} </span>  
        </div> 
        <div class="event_infos"> 
          <span class="infos_title">Rayon d'affichage:</span>
          <span v-if="diffSetting.banner === true" >France</span>
          <span v-else >{{ diffSetting.areaDiff }} KM</span>  
         
        </div>
        <div class="event_infos"> 
          <span class="infos_title">Date de démarrage de diffusion</span>
          <span>{{ diffSetting.startDiff }}</span> 
        </div>
        <div class="event_infos"> 
          <span class="infos_title">Date de fin de diffusion:</span>
          <span>{{ diffSetting.endDiff }}</span>  
        </div>
        <div class="event_infos" v-if="diffSetting.selectDates"> 
          <span class="infos_title">Date(s) de diffusion:</span>
          <span>{{ diffSetting.selectDates }}</span>  
        </div>
          <div class="order_infos-box">
          <div class="infos_title">Code promo</div>
          <div class="order_infos-box--container">
            <div class="promo-code">
              <input class="promo_field" type="text"  placeholder="ex: promo10" v-model="search_value">
              <button class="btn_promo" @click="promoCode">Valider</button>
            </div>
            <div v-if="codeError === true" class="error-code">Code promo inconnu</div>
          </div>
          </div>
        <div class="event_infos"> 
          <span class="infos_title">Montant total H.T. :</span>
          <span>{{   promoPrice >= 0 ?   promoPrice : diffSetting.totalPrice }}</span>  
        </div>
        <div class="event_infos">
           <span class="infos_title">Taxes:</span>
          <span> {{ vat }}</span>
        </div>
        <div class="event_infos">
           <span class="infos_title">Montant total T.T.C. :</span>
           <span>{{ totalPrice }}</span>  
        </div>
      </div>
      <div class="btn_box">
        <button @click=returnToEventPage() >Retour</button>
        <button v-if="totalPrice > 0" @click=orderHandler() >Payer et Diffuser</button>
        <button v-else @click=orderHandler() >Diffuser</button>
      </div>
    </div>
  </div>
  
</template>



<style lang="css" scoped>

.container{
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.container_title{
  padding-block: 1.5rem;
  font-size:2rem;
  font-weight: bold;
  color: white;
}
.container_event-infos{
  background-color:white;
  width: 95%;
  height: 85vh;
  border-radius:0.5rem;
  display: flex;
  flex-direction:column;
 
}
.event_infos-recap{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  height: 100%;
}
.event_infos, .order_infos-box{
  display: flex;
  justify-content: space-between;
  padding-inline: 2rem;
  width:95%;
  font-size: 1.2rem;
  color: black;
}
.btn_box{
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
button{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15rem;
  height: 3rem;
  background-color:var(--primary);
  border: none;
  border-radius:0.5rem;
  padding: 1rem;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
}
.btn_promo{
  width: 5rem;
  height: 2rem
}
.infos_title{
  color: var(--primary);
  font-weight: bold;
}
.order_infos-box--container{
  display: flex;
  flex-direction: column;
  width: 30%;
}

.promo-code{
  display: flex;
  justify-content: space-between;
}
.promo-code input{
  width: 75%;
}
.error-code{
  margin-top: 0.5rem;
  text-align: center;
  color: red;
  font-size: 0.8rem;
}
input{
  width: 70%;
  border-radius: 0.5rem;
  border:1px solid var(--primary);
  padding:0.5rem
}
.theme{
  color: red
}
</style>