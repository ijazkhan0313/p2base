
<script>
import { useCouponStore } from "@/stores/coupon";
import { useAdminStore } from "@/stores/admin";
import { useEventStore } from "@/stores/events";

export default {
  setup(){
    const couponStore = useCouponStore();
    const settingStore = useAdminStore();
    const eventsStore = useEventStore();
    const settings = settingStore.getSettings[0];
    const api = eventsStore.getImgApi;






   
    return { couponStore, settingStore, settings, eventsStore,api};
  },
  data(){
    return {       
      settingsData:null,
      couponTitle: "",
      usesNumber: "",
      couponType:"percent",
      unlimited: '0',
      couponValue:"",
      settings:[],
      coupons:[],
      updateCouponTitle: false,
      couponDetails: {},
      activeId: 1,
      adminMenu:[
        {id:1, titleLink: 'Forfaits'},
        {id:2, titleLink: 'Coupons'},
        {id:3, titleLink: 'Satistiques'},
        {id:4, titleLink: 'Modération Évènements'}

      ],
      option100: "",
      option200: "",
      optionFrance: "",
      moreCategory:  0,
      dailyBannerPrice: "",
      annualPrice:  "",
      dailyPrice:  "",
      basePrice: '',
      monthPrice:'',
      years: [],
      selectedDay: null,
      selectedMonth: null,
      selectedYear: null,
      monthList: [],
      events:[],
      stats:[],
      uniqAppVisits:[],
      mailPopUp: false,
      pricePopUp: false,
    }
  },
  async mounted(){
    await this.couponStore.fetchAll();
    await this.settingStore.getPriceSettings();
    this.stats = await this.settingStore.getStats();
    this.getUniqueIPsByDay(this.stats.uniqAppVisits)
    this.coupons = this.couponStore.getCoupons;
    this.couponDetails = this.couponStore.getOneCoupon;
    this.settingsData = this.settingStore.getSettings[0]
    this.basePrice = this.settingsData.basePrice;
    this.dailyBannerPrice= this.settingsData.dailyBannerPrice;
    this.monthPrice= this.settingsData.monthPrice;
    this.annualPrice = this.settingsData.annualPrice;
    this.moreCategory = this.settingsData.moreCategory;
    this.option100 = this.settingsData.option100;
    this.option200 =   this.settingsData.option200;
    this.optionFrance =this.settingsData.optionFrance;
    this.dailyPrice =  this.settingsData.dailyPrice;
    this.generateYears();
    this.generateMonthList();
    this.fetchPendingsEvents();
   
  },
  computed(){
    this.coupons = this.couponStore.getCoupons;
    this.basePrice = this.settingsData.basePrice
  },
  methods: {
    async sendUserMail(email){
      this.mailPopUp = true;
      //await this.settingStore.sendMail(email)
    },
    eventsFilter(array){
      let filterEventsArray = [];
      for (const event of array){
        if (event.active === true && event.pending === true){
          console.log(event)
          filterEventsArray.push(event);
        }
      }
      this.events = filterEventsArray
    },
    async statsFilter() {
      this.stats = await this.settingStore.getStats();
      const selectedDate = new Date(this.selectedYear, this.selectedMonth - 1, this.selectedDay);
      const filteredData = Object.entries(this.stats).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        const filteredArray = value.filter(item => {
        const itemDate = new Date(item.date);
        if(this.selectedYear && this.selectedMonth === 'Janvier' ) {
          return itemDate.getFullYear() === this.selectedYear;
        }
        if (this.selectedMonth && !this.selectedDay) {
          return itemDate.getMonth() === this.selectedMonth - 1;
        }
        if (this.selectedDay) {
          return itemDate.getDate() === selectedDate.getDate();
        } 
      });

      acc[key] = filteredArray;
    }
    return acc;
    }, {});
    this.stats = filteredData;
    this.getUniqueIPsByDay(this.stats.uniqAppVisits)
    },
    async resetFilter(){
      this.stats = await this.settingStore.getStats();
      this.selectedYear = "";
      this.selectedMonth = "";
      this.selectedDay= "";
    },
    getUniqueIPsByDay(array) {
        const uniqueIPsByDay = array.reduce((result, visit) => {
        const existingVisit = result.find(item => this.isSameDay(item.date, visit.date));
        if (existingVisit) {
          if (!existingVisit.mobileIps.includes(visit.mobileIp) && !this.isIPDuplicate(existingVisit, visit.mobileIp)) {
              existingVisit.mobileIps.push(visit.mobileIp);
          }
        } else {
          result.push({
            date: visit.date,
            mobileIps: [visit.mobileIp]
          });
        }
        return result;
      }, []);

      this.uniqAppVisits = uniqueIPsByDay;
    },
    isSameDay(date1, date2) {
      const parsedDate1 = new Date(date1);
      const parsedDate2 = new Date(date2);
      return (
        parsedDate1.getFullYear() === parsedDate2.getFullYear() &&
        parsedDate1.getMonth() === parsedDate2.getMonth() &&
        parsedDate1.getDate() === parsedDate2.getDate()
      );
    },
    isIPDuplicate(existingVisit, mobileIp) {
        return existingVisit.mobileIps.some(ip => ip === mobileIp);
    },
    resetUpdate(){
      this.updateCouponTitle = false
      this.couponValue = ""
    },
    couponChange(){
      console.log(this.couponType)
    },
    generateYears() {
      const anneeActuelle = new Date().getFullYear();
      for (let annee = 2022; annee <= anneeActuelle; annee++) {
        this.years.push(annee);
      }
    },
    generateMonthList() {
      const monthList = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      const selectedYear = parseInt(this.selectedYear);
      const actualDate = new Date();
      const moisActuel = actualDate.getMonth();
      const actualYear = actualDate.getFullYear();

      this.monthList = [];

      if (selectedYear === actualYear) {
        for (let i = moisActuel; i >= 0; i--) {
          this.monthList.unshift(monthList[i]); 
        }
        this.selectedMonth = monthList[0];
      } else {
        for (let i = 11; i >= 0; i--) {
          this.monthList.unshift(monthList[i]); 
        }
        this.selectedMonth = monthList[11];
      }
    },
    async fetchPendingsEvents(){
      const mail = localStorage.getItem("accountMail");

       await this.eventsStore.fetchPendingEvents(mail);
       const eventsArray = this.eventsStore.getUserEvents;
       this.eventsFilter(eventsArray)
    },
    async defineAdminPrice(){
      this.pricePopUp = true
      let  basePriceSet =this.basePrice
      if(basePriceSet.includes(","))basePriceSet = basePriceSet.replace(",",".")
      let  dailyBannerPriceSet =this.dailyBannerPrice
      if(dailyBannerPriceSet.includes(","))dailyBannerPriceSet = dailyBannerPriceSet.replace(",",".")
      let  annualPriceSet = this.annualPrice
      if(annualPriceSet.includes(","))annualPriceSet = annualPriceSet.replace(",",".")
      let  dailyPriceSet =this.dailyPrice
      if(dailyPriceSet.includes(","))dailyPriceSet = dailyPriceSet.replace(",",".")
      let monthPriceSet = this.monthPrice
      if(monthPriceSet.includes(","))monthPriceSet = monthPriceSet.replace(",",".")
     
      let adminPrices = {
        basePrice: basePriceSet ?? this.settings[0]["basePrice"] ,
        dailyBannerPrice: dailyBannerPriceSet ?? this.settings[0]["baseBannerPrice"],
        annualPrice: annualPriceSet ?? this.settings[0]["annualBannerPrice"],
        monthPrice: monthPriceSet ?? this.settings[0]["monthPrice"],
        moreCategory: this.moreCategory ?? this.settings[0]["moreCategory"],
        option100: this.option100 ?? this.settings[0]["option100"] ,
        option200: this.option200 ?? this.settings[0]["option200"],
        optionFrance:this.optionFrance  ?? this.settings[0]["optionFrance"],
        dailyPrice: dailyPriceSet ?? this.settings[0]["dailyPrice"],
      }
      await this.settingStore.defineSettings(adminPrices)
    },
   async addCoupon(){
      let coupon ;
      let unlimitedValue;
      this.unlimited === "1" ? unlimitedValue = true : unlimitedValue = false;
      if(this.couponType === "percent"){
        coupon= {
        title : this.couponTitle,
        promoType: "percent",
        value:this.couponValue, 
        usingTime: this.uses,
        usingMaxTime:this.usesNumber,
        unlimited:unlimitedValue,
        active: true 
      }
      }
      if(this.couponType === "euro"){
        coupon ={
        title: this.couponTitle,
        promoType: "euro",
        value: this.couponValue, 
        usingTime: this.uses,
        usingMaxTime:this.usesNumber,
        unlimited: unlimitedValue,
        active: true 
      }
      }
      if(this.couponType === "free"){
        coupon = {title: this.couponTitle, 
        promoType: "free",
        discountTotal: true,
        value: "", 
        usingTime: this.uses,
        usingMaxTime:this.usesNumber,
        unlimited: unlimitedValue,
        active: true }
      }
      if(this.couponType === "notAds"){
        coupon = {title: this.couponTitle, 
        promoType: "free",
        discountTotal: true,
        value: "", 
        usingTime: this.uses,
        usingMaxTime:this.usesNumber,
        unlimited: unlimitedValue,
        active: true }
      }
      await this.couponStore.add(coupon);
      this.coupons = this.couponStore.getCoupons;
    },
    async getCouponInfos(id){
      this.updateCouponTitle = true;
      await  this.couponStore.getOne(id)
      this.couponDetails = await this.couponStore.getOneCoupon;
      this.couponValue = this.couponDetails.promoType
      this.unlimited = this.coupcouponDetails.unlimited === true ? '1' : '0';
    },
    async updateCoupon(id){
      this.updateCouponTitle = false;
      await this.couponStore.update(id, this.couponDetails);
      this.coupons = this.couponStore.getCoupons;
      console.log(this.coupcouponDetails)
     
      
    },
    async deleteCoupon(id){
      await this.couponStore.delete(id);
      this.coupons = this.couponStore.getCoupons;
    },
    selectLink(id) {              
        this.activeId = id;
        },
    isImage(filename) {
      return /\.(jpg|jpeg|png|gif|bmp)$/i.test(filename);
    },
    isVideo(filename) {
      return /\.(mp4|mpeg|mp3)$/i.test(filename);
    },
    async eventActivation(id){
      const event = {
        pending : false
      }
      await this.eventsStore.eventUpdate(event, id);
      await this.fetchPendingsEvents();
    },
    getDaysInMonth: function(year, month) {
      let lastDay = new Date(year, month, 0);
      let numDays = lastDay.getDate();
      let days = [];
      for (var i = 1; i <= numDays; i++) {
        days.push(i);
      }
      return days;
  }
  },
}
</script>

<template >


  <div class="admin_container">
    <div class="admin_container-titles">
      <div class="admin-titles" v-for="(link, index) in adminMenu" :key="index">
        <span class="span_page-title" v-bind:class="{active:(link.id === activeId)}" @click="selectLink(link.id)">{{ link.titleLink }}</span>
      </div>
    </div>
      <div v-if="activeId === 1" class="admin_container-prices">
        <div class="admin_prices-box">
              <div class="admin_field">
                <label for="ppd">Prix journalier Évènement:</label>
                <div class="input_devise">
                  <input type="text" placeholder="29,90" v-model="basePrice">
                  <span class="devise">€</span>
                </div>
              </div>
              <div class="admin_field">
                <label for="f1">Prix mensuel Évènement:</label>
                <div class="input_devise">
                  <input type="text" placeholder="299,90" v-model="monthPrice">
                  <span class="devise">€</span>
                </div>
              </div>
              <div class="admin_field">
                <label for="f1">Prix annuel Évènement:</label>
                <div class="input_devise">
                  <input type="text" placeholder="299,90" v-model="annualPrice">
                  <span class="devise">€</span>
                </div>
              </div>
              <div class="admin_field">
                <label  for="two">Prix journalier Périodique:</label>
                <div class="input_devise">
                  <input type="text" placeholder="20" v-model="dailyPrice">
                  <span class="devise">€</span>
                </div>
              </div>
              <div class="admin_field">
                <label for="AnnualbannerPrice">Prix journalier Bannière :</label>
                <div class="input_devise">
                  <input type="text" placeholder="69,90" v-model="dailyBannerPrice">
                  <span class="devise">€</span>
                </div>
              </div>
              <div class="admin_field">
                <label for="bannerPrice">Option 100 KM :</label>
                <div class="input_devise">
                  <input type="text" placeholder="10" v-model="option100">
                  <span class="devise">%</span>
                </div>
              </div>
              <div class="admin_field">
                <label for="f1">Option France:</label>
                <div class="input_devise">
                <input type="text" placeholder="30" v-model="optionFrance">
                  <span class="devise">%</span>
                </div>
              </div>
             
              <div class="admin_field">
                <label  for="f1">Option 200 KM :</label>
                <div class="input_devise">
                  <input type="text" placeholder="20" v-model="option200">
                  <span class="devise">%</span>
                </div>
              </div>
             
              <div class="admin_field">
                <label  for="one">catégorie supplémentaire:</label>
                <div class="input_devise">
                  <input type="text" placeholder="15%" v-model="moreCategory">
                  <span class="devise">%</span>
                </div>
              </div>
            
        </div>
        <div class="btn_container">
          <button>Annuler</button>
          <button @click="defineAdminPrice">Valider</button>
        </div>
      </div>
      <div v-if="activeId === 2" class="admin_container-coupons">
       
     <div class="admin_promoCode-bar">
        <div class="admin_promoCode-label">Libellé</div>
        <div class="admin_promoCode-promo">Remise</div>
        <div class="admin_promoCode-nombre ">Utilisations</div>
      </div>
     <div class="admin_promoCode-list">
      <div class="admin_promoCode-list_box">
        <div class="promoCode-box" v-for="(item, index) in coupons" :key="item._id">
          <div class="admin_promoCode">
            <div class="promoCode_name">{{item.title}}</div>
            <div v-if="item.promoType === 'percent'" class="promoCode_promo ml">{{ item.value }} %</div>
            <div v-if="item.promoType === 'euro'" class="promoCode_promo ml">{{ item.value }} €</div>
            <div v-if="item.discountTotal" class="promoCode_promo ml">100%</div>
          </div>
          <div class="promoCode_actions-box">
            <div class="promoCode_using">
            <div v-if="item.unlimited === false" class="promoCode_use"> {{ item.usingTime }} / {{ item.usingMaxTime }}</div>
            <div v-else class="promoCode_use"> Illimité</div>
          </div>
          <div class="btn_code_box">
            <img class="img_btn" @click="getCouponInfos(item._id)" src="@/assets/pen.png" alt="">
            <img class="img_btn2" @click="deleteCoupon(item._id)" src="@/assets/delete.png" alt=""> 
          </div>
          </div>
        </div>
      </div>
     </div>
     <div v-if="updateCouponTitle === false" class="admin_promoCode-title">Nouveau coupon</div>
     <div  v-else class="admin_promoCode-title">Modification de coupon</div>
      <div v-if="updateCouponTitle === false" class="admin_promoCode-box">
        <div class="admin_promoCode-field">
          <label class="coupon_label " for="couponName">Nom</label>
          <input class="coupon_input" type="text" placeholder="assoGratis" v-model="couponTitle">
        </div>
        <div class="admin_promoCode-field">
          <label class="coupon_label " for="type">Type</label>
        <select class="coupon_input-select"   v-model="couponType" @change="couponChange()">
          <option value="percent">Pourcentage</option>
          <option value="euro">Remise en euro</option>
          <option value="free">Gratuité</option>
          <option value="notAds">Non publicitaire</option>
        </select>
        </div>
        <div class="admin_promoCode-field"  v-if="unlimited === '0'">
          <label class="coupon_label " for="usesNumber">Nombre</label>
          <input class="coupon_input coupon_nbre" type="text" placeholder="25" v-model="usesNumber">
        </div>
        <div class="admin_promoCode-field">
          <label class="coupon_label " for="usesNumber">Illimité</label>
          <select name="" id="" v-model="unlimited">
          <option value="1">Oui</option>
          <option value="0">Non</option></select>
        </div>
        <div v-if="couponType === 'percent' || couponType === 'euro' " class="admin_promoCode-field-price">
          <label class="coupon_label " for="coupon_price">Montant</label>
          <input class="coupon_input" type="text" placeholder="25" v-model="couponValue">
          <span class="coupon_devise" v-if="couponType === 'percent'" >%</span>
          <span  class="coupon_devise"  v-else >€</span>
        </div>
        <button class="coupon-validation" @click="addCoupon">Valider</button>
      </div>
      <div v-if="updateCouponTitle === true" class="admin_promoCode-box">
        <div class="admin_promoCode-field">
          <label class="coupon_label " for="couponName">Nom</label>
          <input class="coupon_input-title" type="text"  v-model="couponDetails.title">
        </div>
        <div class="admin_promoCode-field">
          <label class="coupon_label " for="type">Type</label>
        <select class="coupon_input-select"   v-model="couponValue"  @change="couponChange()">
          <option value="percent">Pourcentage</option>
          <option value="euro">Remise en euro</option>
          <option value="free">Gratuité</option>
          <option value="notAds">Non publicitaire</option>
        </select>
        </div>
        <div class="admin_promoCode-field" v-if="couponDetails.unlimited === false">
          <label class="coupon_label " for="usesNumber">Nombre</label>
          <input class="coupon_input coupon_nbre" type="text" placeholder="25" v-model="couponDetails.usingMAxTime">
        </div>
        <div class="admin_promoCode-field">
          <label class="coupon_label " for="usesNumber">Illimité</label>
          <select name="" id="" v-model="unlimited">
          <option value="1">Oui</option>
          <option value="0">Non</option></select>
        </div>
        <div v-if="couponType === 'percent' || couponType === 'euro' " class="admin_promoCode-field-price">
          <label class="coupon_label " for="coupon_price">Montant</label>
          <div class="input_devise">
          <input class="coupon_input-value " type="text" placeholder="25" v-model="couponDetails.value">
          <div  v-if="couponDetails.promoType === 'percent'" class="devise whiteC">%</div>
          <div v-else class="devise whiteC">€</div>
          </div>
         
        </div>
        <div class="btn_coupon-box">
          <button class="coupon-validation" @click="updateCoupon(couponDetails._id)">Valider</button>
          <button class="coupon-undo" @click="resetUpdate()">Annuler</button>
        </div>
       
      </div>
     
      </div>
    <div v-if="activeId === 3" class="admin_container-stats">
      <div class="stats_filter">Filtres</div>
      <div class="divider"></div>
      <div class="period_titles-box">
        
       
        
      </div>
      <div class="period_box">
        <div class="days_box" v-if="selectedMonth && selectedYear">
          <span class="period_title">Jour</span>
          <select id="jour" name="jour" v-model="selectedDay">
            <option v-for="day in getDaysInMonth(selectedYear, selectedMonth)" :value="day">{{ day }}</option>
          </select>
        </div>
        <div class="month_box">
          <span class="period_title">Mois</span>
          <select id="mois" name="mois" v-model="selectedMonth">
            <option v-for="(month, index) in monthList" :value="index+1" :key="index">{{ month }}</option>
          </select>
        </div>
        <div class="year_box">
          <span class="period_title">Année</span>
          <select id="annee" name="annee" v-model="selectedYear" @change="generateMonthList">
            <option v-for="year in years" :value="year">{{ year }}</option>
          </select>
        </div>
        <button @click="statsFilter">Actualiser</button>
        <button @click="resetFilter">Réinitialiser</button>
      </div>
      <div class="stats_results">Statistiques</div>
      <div class="results_box">
        <div class="result-line">
          <div class="result_title">Visites du site (plateforme place2be.fr )</div>
          <div class="result"> {{ stats.webVisits.length }}</div>
        </div>
        <div class="result-line">
          <div class="result_title">Visites de l'application</div>
          <div class="result">{{stats.appVisits.length}}</div>
        </div>
        <div class="result-line">
          <div class="result_title">Visiteurs uniques</div>
          <div class="result">{{uniqAppVisits.length}}</div>
        </div>
        <div class="result-line">
          <div class="result_title">Évènements créés</div>
          <div class="result">{{stats.eventCreation.length}}</div>
        </div>
        <div class="result-line">
          <div class="result_title"> Téléchargements de l'application</div>
          <div class="result">{{stats.appDownloads.length}}</div>
        </div>
        <div class="result-line">
          <div class="result_title"> Annonceurs</div>
          <div class="result">{{stats.advertiserCreation.length}}</div>
        </div>
        <div class="result-line">
          <div class="result_title"> Diffuseurs</div>
          <div class="result">{{stats.diffuserCreation.length}}</div>
        </div>
        <div class="result-line">
          <div class="result_title"> Ulitisateurs mobiles</div>
          <div class="result">{{stats.mobileUserCreation.length}}</div>
        </div>
      </div>
    </div>
    <div v-if="activeId === 4" class="admin_container-validation">
        <div class="pendingEvents_container">
            <div class="pendingEvents" v-for="event in events" :key="event._id" >
              <div class="pendingEvents_img">
                <img class="event_pict" v-if="isImage(event.eventFile)" :src=" api + event.eventFile"/>
                <video class="event_pict" v-if="isVideo(event.eventFile)" :src=" api + event.eventFile"/>
                <iframe v-if="event.videoLink && !isImage(event.eventFile) && !isVideo(event.eventFile) " :src="event.videoLink"></iframe>
              </div>
              <div class="pendingEvents_details">
                  <div class="pendingEvents_title">Titre: {{ event.eventNameFr }}</div>
                  <div class="pendingEvents_date">
                    <div class="pendingEvents_dateStart">Date: {{ event.startDate }}</div>
                    <span class="spacebtw"> - </span>
                    <div class="pendingEvents_dateEnd"> {{ event.endDate }}</div>
                  </div>
                  <div class="pendingEvents_time">
                    <div class="pendingEvents_timeStart">Horaire: {{ event.startTime }}</div>
                    <span class="spacebtw"> - </span>
                    <div class="pendingEvents_timeEnd">{{ event.endTime }}</div>
                  </div>
                  <div class="adresse">
                    <div class="span">Ville: {{ event.city }}</div>
                  </div>
                  <div class="theme_box" v-if='event.themes[0] !== ""'>Catégorie(s):
                    <div  class="theme" v-for="theme in event.themes">{{theme}}</div>
                  </div>
                  <div v-if="event.banner === true" class="pendingEvents_themes" >Bannière</div>
                  <div class="pendingEvents_desc">Description: {{ event.descriptionFr }}</div>
                  <div class="pendingEvents_conditions">Conditions: {{ event.conditionsFr }}</div>
                  <div class="pendingEvents_conditions"></div>
                  <div class="pendingEvents_free" v-if='event.minPrice[0] === ""  || event.maxPrice[0] === "" '>Gratuit</div>
                  <div class="pendingEvents_price">
                    <div class="pendingEvents_prices" v-if='event.minPrice[0] !== ""  || event.maxPrice[0] !== "" '>Tarifs: {{ event.minPrice[0] }}€ </div>
                    <span v-if='event.minPrice[0] !== ""  || event.maxPrice[0] !== "" '> - </span>
                    <div class="pendingEvents_prices" v-if='event.minPrice[0] !== ""  || event.maxPrice[0] !== "" '>{{ event.maxPrice[0]}}€ </div>
                  </div>
                  <div class="pendingEvents_validation">
                      <div class="pendingEvents_author">{{ event.author }}</div>
                      <div class="pendingEvents_btn">
                        <div class="activation_btn" @click="eventActivation(event.identifier)">Activer</div>
                        <div class="mail_btn" @click="sendUserMail(event.author)">Email
                        </div>
                      </div>
                  </div>
              </div>
            </div>
        </div>
    </div>
  </div>
  <div v-if="pricePopUp === true || mailPopUp === true" class="popUp_container" ></div>
  <div v-if="pricePopUp === true" >
   <div class="deletePopUp_container">
     <div class="deletePopUp_title">Prix mis à jour avec succès !</div>
     <div class="deletePopUp-buttons">
       <button class="deletePopupBtn" @click="pricePopUp = false">Ok</button>
     </div>
   </div>
  </div>
  <div v-if="mailPopUp === true" >
   <div class="deletePopUp_container">
     <div class="deletePopUp_title">Mail envoyé avec succès !</div>
     <div class="deletePopUp-buttons">
       <button class="deletePopupBtn" @click="mailPopUp = false">Ok</button>
     </div>
   </div>
  </div>
</template>

<style lang="css" scoped>
.admin_container{
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3rem
}
.admin_container-prices, .admin_container-coupons, .admin_container-stats, .admin_container-validation{
  width: 95%;
  height: 88%;
  background-color: white;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
 
}
.admin_container-stats{
  justify-content: flex-start;
}
.admin_container-title, .admin_promoCode-title{
  padding:1rem;
  font-size:2rem;
  font-weight: bold;

}
.admin_field{
  width:95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.admin_prices-box{
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  padding-block:1rem;
}
.admin_prices-box_left, .admin_prices-box_right, .admin_cat-box_left, .admin_cat-box_right{
  width: 45%;
}
.admin_categories-box{
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.catLabel, .coupon_label{
  color: white;
  font-size:1rem; 
}
.whiteC{
  color: white;
}
.coupon_input, .coupon_input-title, .coupon_input-value{
  text-align: end;
  background-color: white;
  color: black;
  border: none;
  padding: 0.3rem;
  width: 60%
}
.coupon_input{
  text-align:center;
}

.coupon_nbre{
  width: 2.5rem;
}
.admin_promoCode-box{
  width: 95%;
  display: grid;
  grid-template-columns: 20% 20% 15% 15% 15% 15%;
  justify-content: space-around;
  height: 12%;
  background-color: var(--primary);
  align-items: center;
  border-radius: 0.5rem;
}
.btn_coupon-box{
  display:flex;
  flex-direction: column;
  justify-content:center;
  justify-self: center;
  align-self: center;
}
.admin_promoCode-list{
  background-color: var(--primary);
  border-radius: 0.5rem;
  width: 95%;
  height: 60vh;
 
}

input:focus::placeholder {
  color:   transparent;
}
.btn_container{
  width: 95%;
  padding-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
}

.ml{
  margin-left: 3rem;
}
.btn_mr{
  margin-right: 1rem;
}
button{
  padding-inline: 2rem;
  padding-block: 0.5rem;
  color:white;
  background-color:var(--primary);
  border: 1px solid white;
  border-radius: 0.5rem;
  cursor: pointer;
}
.activation_btn, .mail_btn{
  background-color: white ;
  color: var(--primary) ;
  width: 100%;
  padding-inline: 2rem;
  padding-block: 0.5rem;
  border: 1px solid white;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-right: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}


.coupon-validation, .coupon-undo{
  width:95%;
  margin-bottom: 0.2rem;
  padding-inline: 2rem;
  padding-block: 0.5rem;
  color:var(--primary);
  background-color:white;
  border: 1px solid var(--primary);
  border-radius: 0.5rem;
  align-self: center;
  justify-self: center;
  cursor: pointer;
  text-align: center;
}

.coupon-validation:hover, .coupon-undo:hover{
  background-color:var(--primary);
  color: white;
  border: 1px solid white;
}
.admin_promoCode-field{
  justify-self: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}
.admin_promoCode-field-price{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.admin_promoCode-list{
  display: flex; 
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
}
.admin_promoCode-bar{
  
  padding-block: 0.5rem;
  width: 100%;
  background-color: white;
  color:var(--primary);
  display: flex;
  justify-content: space-around;
  border-radius: 0.5rem;
}
.admin_promoCode-label, .admin_promoCode-promo, .admin_promoCode-nombre {
  font-size: 1.5rem;
}

.admin_promoCode{
  width: 50%;
  display: flex;
  justify-content: space-between;
}
.btn_code_box{
  display: flex;
  justify-content: flex-end;
  width: 10%;

}
.admin_promoCode-list_box{
  width: 95%;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.img_btn{
  height: 1.2rem;
  cursor: pointer;
}
.img_btn2{
  margin-left: 1rem;
  height: 1.2rem;
  cursor: pointer;
}

select{
  height:2rem;
  border-radius:0.5rem;
  font-size:1rem;
  margin-inline: 1rem;
}
.promoCode-box{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  color: var(--primary);
  border-radius: 0.5rem;
  height: 2.5rem;
  padding-inline: 1rem;
  margin-top: 0.3rem;
}
input[type="checkbox"]:checked {
  accent-color:white;
}
.promoCode_actions-box{
  width: 20%;
  display: flex;
  justify-content: space-between;
}
.coupon_input-title{
  width: 60%;
}
.coupon_input-select{
  width: 100%;
}

.coupon_amount{
  width: 30%
}
.admin_container-titles{
  display: flex;
  width:95%;
  color: black;
}
label{
  color: black;
  font-size: 1rem;
  padding-bottom: 1rem;
}
input{
  border: 1px solid var(--primary);
  border-radius: 0.5rem;;
  color: black;
  padding-block: 0.3rem;
  font-size: 1.2rem;
  text-align: center;
}
.span_page-title{
  border: 1px solid white;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  display: flex;
  justify-content: center;
  padding: 1rem;
  font-weight: bold;
  font-size:1.2rem
}
.admin-titles{
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
}
.active{
    background-color: white;
    color:var(--primary);
  }
  .devise, .coupon_devise{
    color: var(--primary);
    position: absolute;
   
    right:0.5rem;
    display: flex;
    align-items: center;
    padding: 1rem;
    font-size: 1.2rem;;
  }
.coupon_devise{
  color: white;
  top:2.5rem;
  padding:0
}
.mail_link{
  text-decoration: none;
  font-size: 1rem;
  color: var(--primary);
}


  .input_devise{
    position: relative;
    display: flex;
    align-items: center;
  }
 .admin_promoCode-field_nbre{
  width: 25%;
  display: flex;
  align-items: center;
 }
 .period_box{
  width:95%;
  display: flex;
  justify-content: flex-end
 }

 .period_title{
  color: var(--primary);
 }
 .stats_filter, .stats_results{
  color: var(--primary);
  width: 95%;
  border-bottom: 1px solid var(--primary);
  margin-block: 1rem;
  font-size:1.2rem
 }
 .results_box{
  width: 95%;
  height:100%;
  display: flex;
  flex-direction: column;
  justify-content:space-around

 }
 .result-line{
  width: 95%;
  display: flex;
  justify-content: space-between;

  
 }
 .result_title{
  color: var(--primary);
  font-size:1rem
 }
 .result{
  color: var(--primary);
 }
 .pendingEvents_container{
  width:95%;
  height: 95%;
  border-radius: 0.5rem;
  overflow: scroll;
 }
 .pendingEvents{
  width: 100%;
  height: 30%;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  border-radius: 0.5rem;
  margin-block: 1rem;;
 }
 .pendingEvents_img{
  width: 25%;
  display: flex;
  justify-content:center;
  padding: 1rem
 }
 .event_pict, .event_video, .event_videoLink{
  width: 100%;
  height:90%;
  object-fit: cover;
  border-radius: 0.5rem;
}
.pendingEvents_date,.pendingEvents_time, .pendingEvents_price, .pendingEvents_validation, .pendingEvents_btn{
  display: flex;
}
.pendingEvents_details{
  width: 70%;
  height:85%;
  display:flex;
  flex-direction: column;
  justify-content:space-between;
}
.pendingEvents_validation{
  width: 100%;
  display: flex;
  justify-content:space-between;
  align-items:center;
}
.spacebtw{
      margin-inline: 0.5rem;
      display: block;
    }
.theme_box{
  display: flex;
}
.theme{
  margin-inline: 0.5rem;
}
.deletePopUp_container, .update_popUp{
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
 font-size:2rem;
 text-align: center;
 z-index:2;
}

.deletePopUp-buttons{
 width: 30rem;
 display: flex;
 justify-content:space-around;
}
.deletePopupBtn{
 border-radius: 0.5rem;
 border:none;
 width: 10rem;
 height: 2rem;
 background-color:white;
 color:var(--primary);
 cursor: pointer;
}
.popUp_container{
 position: absolute;
 width: 100vw;
 height: 100vh;
 background-color: black;
 z-index: 0;
 opacity: 0.8;
 overflow: hidden;
}
  @media screen and (max-width: 1000px) {
    .admin_container{
      width: 95%;
      height: 67vh;
    }
    .admin_container-prices, .admin_container-coupons, .admin_container-stats{
      height: 90%
    }
    .admin_promoCode-list{
      height: 40vh;
    }
    .admin_promoCode-field, .admin_promoCode-field-price{
      justify-content: space-between;
      width: 75%;
    }
    .admin_promoCode-box{
      height: 20vh;
      flex-direction: column;
      padding-block: 1rem;;
    }
    .illimited{
      display: flex;
    }

  }
</style>