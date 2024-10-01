<script>
import { useEventStore } from "@/stores/events"
import { useAdminStore } from "@/stores/admin";
import moment from 'moment';


export default {
  setup(){
    const eventStore = useEventStore();
    const event = eventStore.getEvent
    // console.log(event);
    const adminStore = useAdminStore();
    return {eventStore, adminStore, event}
  },
  data(){
    return {
      selectedOption: "",
      selectedOptions: [],
      dailyBannerPrice:"",
      categoryPrice:0,
      categoryMonthlyPrice:0,
      categoryAnnualPrice:0,
      monthlyAeraPrice:0,
      annualAeraPrice:0,
      kmPrice:0,
      settingsData:null,
      daily:0,
      monthly:0,
      periodiq:0,
      annual:0,
      banner:0,
      price:0,
      categories:1,
      startDate: this.event.startDate ? this.event.startDate : '',
      selectedArea: this.event.selectedArea ? this.event.selectedArea : '', 
      options:[
        {label: 'Vide-greniers - Brocantes', value: 'Brocante'},
        {label: 'Famille', value: 'Famille'},
        {label: 'Expositions', value: 'Expositions'},
        {label: 'Spectacles - Concerts - Bals', value: 'Spectacles'},
        {label: 'Sports - Loisirs', value: 'Sports'},
        {label: 'Évènements Culturels', value: 'Culturels'},
        {label: 'Visites guidées - Théatrales', value: 'Visites'},
        {label: 'Fêtes - Marchés - Foires', value: 'Marchés'},
        {label: 'Itinéraires touristiques', value: 'Itinéraires'},
        {label: 'Commémoration', value: 'Commémoration'},
      ],
      selectDays:1,
      days: Array.from({ length: 364 }, (_, i) => i + 1),
      selectedDate: '',
      selectedDates: this.event.selectDates ? this.event.selectDates :[],
      aeraPrice:0,
      dailyCat: false,
      dailyArea:false,
      dailyDate:false,
      monthCat: false,
      monthArea:false,
      monthDate:false,
      yearCat: false,
      yearArea:false,
      yearDate:false,
      periodCat: false,
      periodArea:false,
      periodDate:false,
      bannerDate: false

    }
  },
  async mounted() {
    console.log( this.event.themes.length);
    await this.adminStore.getPriceSettings();
    this.settingsData = this.adminStore.getSettings[0]
   
    this.daily = parseFloat(this.settingsData.basePrice).toFixed(2)
    this.monthly = parseFloat(this.settingsData.basePrice).toFixed(2)*30
    this.annual = parseFloat(this.settingsData.annualPrice).toFixed(2)
    this.periodiq =  parseFloat(this.settingsData.dailyPrice).toFixed(2)
    this.banner =  parseFloat(this.settingsData.dailyBannerPrice).toFixed(2)
    console.log(this.event.identifier)
  },
  computed:{
    monthEnd(){
      let endSettingDiff = moment(this.startDate).add(30, 'days');
      const endDiff =  endSettingDiff.format('YYYY-MM-DD');
      return endDiff
    },
    yearMonthEnd(){
      let endSettingDiff = moment(this.startDate).add(365, 'days');
      const endDiff =  endSettingDiff.format('YYYY-MM-DD');
      return endDiff
    },
    diffDateEnd(){
      let endSettingDiff = moment(this.startDate).add(this.selectDays, 'days');
      const endDiff =  endSettingDiff.format('YYYY-MM-DD');
      return endDiff
    },
    pack1Price(){
      const result = ((parseFloat(this.daily) + parseFloat(this.categoryPrice) + parseFloat(this.aeraPrice)) * this.selectDays).toFixed(2);
      if(isNaN(result)) {
          return this.daily;
      }
      return result;
    },
    pack2Price(){
      const result = ((parseFloat(this.monthly) + parseFloat(this.categoryMonthlyPrice) + parseFloat(this.monthlyAeraPrice))).toFixed(2);
      if(isNaN(result)) {
          return this.monthly;
      }
      return result;
    },
    pack3Price(){
      const result = ((parseFloat(this.annual) + parseFloat(this.categoryAnnualPrice) + parseFloat(this.annualAeraPrice))).toFixed(2);
      // if(isNaN(result)) {
      //     return this.annual;
      // }
      return result;
    },
    pack4Price(){
      let result;
      if(this.selectedDates.length > 0){
         result = ((parseFloat(this.periodiq) + parseFloat(this.categoryPrice) + parseFloat(this.aeraPrice)) * this.selectedDates.length).toFixed(2);
      }else{
        result = (parseFloat(this.periodiq) + parseFloat(this.categoryPrice) + parseFloat(this.aeraPrice)).toFixed(2);
      }
      if(isNaN(result)) {
          return this.periodiq;
      }
      return result;
    },
    pack5Price(){
      const result = ((parseFloat(this.banner)) * this.selectDays).toFixed(2);
      if(isNaN(result)) {
          return this.dailyBannerPrice;
      }
      return result;
    }
  },
  methods:{
    updateArea(nbre){
      if(nbre === 1){
        if(this.selectedArea === "30")this.aeraPrice = 0
        if(this.selectedArea === "100")this.aeraPrice = (this.daily *  (parseFloat(this.settingsData.option100))/100).toFixed(2) 
        if(this.selectedArea === "200")this.aeraPrice = (this.daily *  (parseFloat(this.settingsData.option200))/100).toFixed(2)
      }
      if(nbre === 2){
        if(this.selectedArea === "30")this.monthlyAeraPrice = 0
        if(this.selectedArea === "100")this.monthlyAeraPrice = (this.monthly *  (parseFloat(this.settingsData.option100))/100).toFixed(2) 
        if(this.selectedArea === "200")this.monthlyAeraPrice = (this.monthly *  (parseFloat(this.settingsData.option200))/100).toFixed(2)
      }
      if(nbre === 3){
        if(this.selectedArea === "30")this.annualAeraPrice = 0
        if(this.selectedArea === "100")this.annualAeraPrice = (this.annual *  (parseFloat(this.settingsData.option100))/100).toFixed(2) 
        if(this.selectedArea === "200")this.annualAeraPrice = (this.annual *  (parseFloat(this.settingsData.option200))/100).toFixed(2)
      }
      if(nbre === 4){
        if(this.selectedArea === "30")this.aeraPrice = 0
        if(this.selectedArea === "100")this.aeraPrice = (this.periodiq *  (parseFloat(this.settingsData.option100))/100).toFixed(2) 
        if(this.selectedArea === "200")this.aeraPrice = (this.periodiq *  (parseFloat(this.settingsData.option200))/100).toFixed(2)
      }
    },
    updateSelectedOptions(nbre) {
      if (this.selectedOption) {
        this.selectedOptions.push(this.selectedOption);
      }
      if(this.selectedOptions.length === 2){
      if(nbre === 1)this.categoryPrice = (this.daily * (parseFloat(this.settingsData.moreCategory)/100)).toFixed(2)
      if(nbre === 2)this.categoryMonthlyPrice = (this.monthly * (parseFloat(this.settingsData.moreCategory)/100)).toFixed(2)
      if(nbre === 3)this.categoryAnnualPrice = (this.annual * (parseFloat(this.settingsData.moreCategory)/100)).toFixed(2)
      if(nbre === 4)this.categoryPrice = (this.periodiq * (parseFloat(this.settingsData.moreCategory)/100)).toFixed(2)
      }
    },
    addDays(){
      this.pack1Price = parseFloat(this.daily) * this.selectDays
    },
    addDateToArray() {
      if (this.selectedDate !== '') {
        if(!this.selectedDates.includes(this.selectedDate)){
          this.selectedDates.push(this.selectedDate);
        this.selectedDate = '';
        }else return
      }
    },
    removeCategory(category){
      this.selectedOptions.splice(category, 1);
      this.categoryPrice = 0
    },
    removeDate(date){
      this.selectedDates.splice(date, 1);
      
    },
   
   
  async goToOrderPart(pack){
      let event;
      if(pack === 1){
        if(this.selectedOptions.length === 0){
          this.dailyCat = true
          return
        }
        if(this.selectedArea === ""){
          this.dailyArea = true
          return
        }
        if(this.startDate === ""){
          this.dailyDate = true
          return
        }
        event = {
          identifier: this.event.identifier ? this.event.identifier : localStorage.getItem("eventIdentifier"),
          themes: this.selectedOptions,
          startDiff: this.startDate,
          endDiff: this.diffDateEnd,
          areaDiff: this.selectedArea,
          totalPrice: this.pack1Price
        }
        console.log(event);
       await this.eventStore.setDiffSettings(event)
      }
      if(pack === 2){
        if(this.selectedOptions.length === 0){
          this.monthCat = true
          return
        }
        if(this.selectedArea === ""){
          this.monthArea = true
          return
        }
        if(this.startDate === ""){
          this.monthDate = true
          return
        }
        event = {
          identifier: this.event.identifier,
          themes: this.selectedOptions,
          startDiff: this.startDate,
          endDiff: this.monthEnd,
          areaDiff: this.selectedArea,
          totalPrice: this.pack2Price
        }
       await this.eventStore.setDiffSettings(event)
      }
      if(pack === 3){
        if(this.selectedOptions.length === 0){
          this.yearCat = true
          return
        }
        if(this.selectedArea === ""){
          this.yearArea = true
          return
        }
        if(this.startDate === ""){
          this.yearDate = true
          return
        }
        event = {
          identifier: this.event.identifier,
          themes: this.selectedOptions,
          startDiff: this.startDate,
          endDiff: this.yearMonthEnd,
          areaDiff: this.selectedArea,
          totalPrice: this.pack3Price
        }
       await this.eventStore.setDiffSettings(event)
      }
      if(pack === 4){
        if(this.selectedOptions.length === 0){
          this.periodCat = true
          return
        }
        if(this.selectedArea === ""){
          this.periodArea = true
          return
        }
        if(this.startDate === ""){
          this.periodDate = true
          return
        }
        event = {
          identifier: this.event.identifier,
          themes: this.selectedOptions,
          selectDates: this.selectedDates,
          areaDiff: this.selectedArea,
          totalPrice: this.pack4Price
        }
       await this.eventStore.setDiffSettings(event)
      }
      if(pack === 5){
        if(this.startDate === ""){
          this.bannerDate = true
          return
        }
        event = {
          identifier: this.event.identifier,
          startDiff: this.startDate,
          banner: true,
          endDiff: this.diffDateEnd,
          totalPrice: this.pack5Price
        }
       await this.eventStore.setDiffSettings(event)
      }
      console.log(event)
      this.$emit("closeMarketing",{ adsPart: false})
    }
  }
  
}
</script>

<template>
  <div class="global_container">
    <div class="container_title">Choisissez Votre forfait</div>
    <div class="package_container">
    <div class="container">
      <div class="package" >
        <div class="package_title red">Périodique</div>
        <div class="package_description">Diffusion par dates</div>
        <div class="divider"></div>
        <label class="subtitle" for="categories-select">Catégories(2 max.)</label>
       <select v-if="selectedOptions.length < 2" name="categories" id="" v-model="selectedOption" @change="updateSelectedOptions(4)" >
        <option v-for="option in options" :value="option.value">{{ option.label }}</option>
       </select>
       <div class="themes_box" v-if="selectedOptions.length > 0">
          <div  v-for="(theme, index) in selectedOptions" :key="index">
          <div @click="removeCategory(index)"  class="themes">
            <span>{{ theme }} </span>
            <img class="deleteBox" src="@/assets/poubelle.png" alt="" @click="deletePopUp = true">
          </div>
        </div>
       </div>
       <span v-if="periodCat === true" class="error_input">Catégorie(s) obligatoire(s)</span>
        <div class="divider"></div>
        <span  class="subtitle">Rayon de diffusion:</span>
        <select name="selectedArea" id="" v-model="selectedArea" @change.prevent="updateArea(4)">
          <option disabled selected value="" ></option>
          <option value="30">30 KM</option>
          <option value="100">100 KM</option>
          <option value="200">200 KM</option>
          <option value="France">France</option>
        </select>
        <span v-if="periodArea=== true" class="error_input">Rayon obligatoire</span>
        <div class="divider"></div>
        <div class="infos_input">
          <span  class="subtitle">Dates de diffusion:</span>
        <input type="date" v-model="selectedDate" @change="addDateToArray"/>
          <div  class="date_box">
            <div class="selectDate" v-for="selectDate in selectedDates" :key="index">
            <span @click=removeDate(index)>{{ selectDate }} &#x2612</span>
          </div>
        </div>                         
        </div>
        <span v-if="periodDate === true" class="error_input">Date(s) obligatoire(s)</span>                      
        <div class="divider"></div>
        <div class="price">
          <div  class="total_price">Total H.T.</div>
          <span> {{ pack4Price }} €</span>
        </div>
        <button @click=goToOrderPart(4) >Valider</button>
      </div>
      <div class="package">
        <div class="package_title">Mensuel</div>
        <div class="package_description">30 jours de diffusion à compter de la date de démarrage</div>
        <div class="divider"></div>
        <label  class="subtitle" for="categories-select">Catégories(2 max.)</label>
        <select v-if="selectedOptions.length < 2" name="categories" id="" v-model="selectedOption" @change="updateSelectedOptions(2)" >
          <option v-for="option in options" :value="option.value">{{ option.label }}</option>
        </select>
        <div class="themes_box" v-if="selectedOptions != null">
           <div  v-for="(theme, index) in selectedOptions" :key="index">
           <div @click="removeCategory(index)"  class="themes">
              <span>{{ theme }} </span>
              <img class="deleteBox" src="@/assets/poubelle.png" alt="" @click="deletePopUp = true">  
          </div>
         </div>
        </div>
        <span v-if="monthCat === true" class="error_input">Catégorie(s) obligatoire(s)</span>
        <div class="divider"></div>
        <span class="subtitle">Rayon de diffusion:</span>
        <select name="selectedArea" id="" v-model="selectedArea" @change.prevent="updateArea(2)">
          <option disabled selected value="" ></option>
          <option value="30">30 KM</option>
          <option value="100">100 KM</option>
          <option value="200">200 KM</option>
          <option value="france">France</option>
        </select>
        <span v-if="monthArea === true" class="error_input">Rayon obligatoire</span>
        <div class="divider"></div>
        <span class="subtitle">Nombre de jours de diffusion:</span>
        <div class="diff_duration">30 Jours</div>
        <div class="divider"></div>
        <div class="infos_input">
          <label class="subtitle" for="startDate">Date de démarrage</label>
          <input type="date" v-model="startDate"/>
        </div>
        <span v-if="monthDate === true" class="error_input">Date obligatoire</span>                                                                                    
        <div class="divider"></div>
        <div class="price">
          <div  class="total_price">Total H.T.</div>
          <span> {{ pack2Price }} €</span>
        </div>
        <button @click=goToOrderPart(2) >Valider</button>
      </div>
      <div class="package">
        <div class="package_title">Annuel</div>
        <div class="package_description">365 jours de parution</div>
        <div class="divider"></div>
        <label  class="subtitle" for="categories-select">Catégories(2 max.)</label>
       <select v-if="selectedOptions.length < 2" name="categories" id="" v-model="selectedOption" @change="updateSelectedOptions(3)" >
        <option v-for="option in options" :value="option.value">{{ option.label }}</option>
       </select>
       <div class="themes_box" v-if="selectedOptions != null">
          <div  v-for="(theme, index) in selectedOptions" :key="index">
          <div @click="removeCategory(index)"  class="themes">
            <span>{{ theme }} </span>
            <img class="deleteBox" src="@/assets/poubelle.png" alt="" @click="deletePopUp = true">  
          </div>
        </div>
       </div>
       <span v-if="yearCat === true" class="error_input">Catégorie(s) obligatoire(s)</span>
        <div class="divider"></div>
        <span  class="subtitle">Rayon de diffusion:</span>
        <select name="selectedArea" id="" v-model="selectedArea" @change="updateArea(3)">
          <option disabled selected value="" ></option>
          <option value="30">30 KM</option>
          <option value="100" >100 KM</option>
          <option value="200">200 KM</option>
          <option value="France">France</option>
        </select>
        <span v-if="yearArea === true" class="error_input">Rayon obligatoire</span>
        <div class="divider"></div>
        <span  class="subtitle">Nombre de jours de diffusion:</span>
        <div class="diff_duration">365 Jours</div>
          <div class="divider"></div>
          <div class="infos_input">
            <label  class="subtitle" for="startDate">Date de démarrage</label>
            <input type="date" v-model="startDate"/>
          </div>
          <span v-if="yearDate === true" class="error_input">Date obligatoire</span>                                                                                    
        <div class="divider"></div>
        <div class="price">
          <div  class="total_price">Total H.T.</div>
          <span> {{ pack3Price }} €</span>
        </div>
        <button @click=goToOrderPart(3) >Valider</button>
      </div>
      <div class="package">
        <div class="package_title">Journalier</div>
        <div class="package_description">un ou plusieurs jours qui se suivent</div>
        <div class="divider"></div>
        <label class="subtitle" for="categories-select">Catégories(2 max.)</label>
        <select v-if="selectedOptions.length < 2" name="categories" id="" v-model="selectedOption" @change="updateSelectedOptions(1)" >
          <option v-for="option in options" :value="option.value">{{ option.label }}</option>
        </select>
        <div class="themes_box" v-if="selectedOptions != null">
          <div  v-for="(theme, index) in selectedOptions" :key="index">
          <div @click="removeCategory(index)"  class="themes">
            <span>{{ theme }} </span>
            <img class="deleteBox" src="@/assets/poubelle.png" alt="" @click="deletePopUp = true">
            </div>
        </div>
      </div>
       <span v-if="dailyCat === true" class="error_input">Catégorie(s) obligatoire(s)</span>
        <div class="divider"></div>
        <span class="subtitle">Rayon de diffusion:</span>
        <select name="selectedArea" id="" v-model="selectedArea" @change.prevent="updateArea(1)">
          <option disabled selected value="" ></option>
          <option value="30">30 KM</option>
          <option value="100">100 KM</option>
          <option value="200">200 KM</option>
          <option value="France">France</option>
        </select>
        <span v-if="dailyArea === true" class="error_input">Rayon obligatoire</span>
        <div class="divider"></div>
        <span class="subtitle">Nombre de jours de diffusion:</span>
          <select name="days" id="" v-model="selectDays" @change="addDays">
            <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
          </select>
          <div class="divider"></div>
          <div class="infos_input">
            <label class="subtitle" for="startDate">Date de démarrage</label>
            <input type="date" v-model="startDate"/>
          </div>
          <span v-if="dailyDate === true" class="error_input">Date obligatoire</span>                                                                               
        <div class="divider"></div>
        <div class="price">
          <div  class="total_price">Total H.T.</div>
          <span> {{ pack1Price }} €</span>
        </div>
        <button @click=goToOrderPart(1) >Valider</button>
      </div>
      <div class="package" >
        <div class="package_title">Bannière</div>
        <div class="package_description">Diffusion dans la bannière en-tête - période à définir</div>
        <div class="divider"></div>
        <label  class="subtitle" for="categories-select">Catégories</label>
        <div class="subtitle_banner">
          <div>Bannière</div>
          <div>Principal</div>
        </div>
        <div class="divider"></div>
        <span  class="subtitle">Rayon de diffusion:</span>
        <div class="sub_fr" >France</div>
        <div class="divider"></div>
          <span  class="subtitle">Nombre de jours de diffusion:</span>
          <select name="days" id="" v-model="selectDays">
            <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
          </select>
          <div class="divider"></div>
          <div class="infos_input">
            <label  class="subtitle" for="startDate">Date de démarrage</label>
            <input class="date_input" type="date" v-model="startDate"/>
          </div>
          <span v-if="bannerDate === true" class="error_input">Date obligatoire</span>                                                                                    
          <div class="divider"></div>
          <div class="price">
          <div class="total_price">Total H.T.</div>
          <span> {{ pack5Price }} €</span>
        </div>
        <button @click=goToOrderPart(5) >Valider</button>
      </div>
    </div>


    
  </div>
  <div class="container advantages">
      <h2>Avantages</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.</p>
    </div>
  </div>
  
</template>



<style lang="css" scoped>

.advantages {
  width: 80%;
  margin: 2rem auto;
  padding: 1rem;
  background-color: #ecf0f1;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.advantages h2 {
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 1rem;
  padding: 30px;
}

.advantages p {
  color: #2c3e50;
  font-size: 1rem;
  line-height: 1.5;
  padding: 30px;
}

.selectedOption{
  color: white;
}
.global_container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position:relative;
  width:80%;
  height: 100%;
}
.package_container {
  width: 98%;
  height: 90%;
  background-color:white;
  display : flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0.5rem
}
.container_title{
  width: 100%;
  text-align: center;
  font-size:3rem;
  color: black;
  padding-block: 0.5rem;
}
.container{
  width:100%;
  height: 100%;
  display: flex;
  justify-content:space-around;
}
.package.packActive{
  background-color:rgb(30, 49, 221);
  color: white;
  margin-top: 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.package.packActive .divider{
  background-color: white;;
}

.package{
  height: 95%;
  width: 18%;
  color: black;
  background-color: white;
  margin-top: 0.5rem;
  padding-top: 1rem;

  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15); /* Ajout de l'ombre ici */
}
.package_title{
  color: #2D739E;
  font-size:1.5rem;
  font-weight: bold;
}
.divider{
 margin-top: 20px;
}
.divActive{
  background-color:white;
}

.categories_box{
  width: 100%;
  height:15vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.balance_box{
  width:100%;
  height:7vh;
  
  padding-top: 1vh;
}
.placeholder_box{
  width:100%;
  height:15vh;

  padding-top: 1vh;
}
.categories_box label{
  font-size: 1.2rem;
  font-weight: bold;
  padding-bottom: 1rem;
}
.categories_box-title{
  display: flex;
  width:100%;
  color: #2D739E;
  justify-content:space-around;
  font-size: 1.2rem;
  font-weight: bold;
}
#arrow1, #arrow2, #arrow3{
  height:1rem
}
.rotate{
  transform: rotate(0.5turn);
}
.themes_box{
  display: flex;
  flex-direction: column;
  justify-content:center;
}
.themes{
  display: flex;
  justify-content:space-between;
  align-items:center;
  background-color:#2D739E;
  color:white;
  margin-left: 0.3rem;
  padding: 0.3rem;
  border-radius: 0.2rem;
  margin-block: 0.3rem;
  width: 100%;
}
.themes span{
  display: block 
}
select{
  border-radius: 0.5rem;;
  border:1px solid #F0F1F1;
  color: black;
  font-size: 1rem;
  padding: 0.3rem;
  width: 100%;
  text-align: center;
}
.heroPrice{
  font-size: 1.5rem;
  font-weight: bold;
}
.package_description{
  min-height: 15%;
  padding-inline: 0.5rem;
  text-align:center;
  display: flex;
  align-items: center;
  font-size:1rem;
}

.price{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top:1rem;
}
.price span{
  font-size: 1.5rem;
  font-weight: bold;
  padding-block: 0.5rem;
}

button{
  width: 80%;
  height: 2.5rem;
  border: solid 2px black;
  margin-bottom: 1rem;
  background-color:black;
  color: white;
  cursor: pointer
}
button:hover{
  background-color: white;
  color: black;
}
.categories_box-container{
  position: absolute;
  background-color:black;
  height:50vh;
  width: 80vw;
  bottom: -5vh;
  display: flex;flex-direction: column;
  align-items: center;
}
.categories_box-input{
  width: 240px;

  display: flex;
  justify-content:space-between;
  padding: 1rem 2rem 0 2rem;;
}

.subtitle{
  text-align: center;
  margin-block: 0.2rem 0.5rem;
  font-weight: bold;
  font-size: 1rem;
  color: black
}
.total_price{
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: #2D739E
}
.infos_input{
  display: flex;
  flex-direction: column;
  justify-content:center;
  align-items:center;
  width: 240px;
}
input[type="date"]{
  border-radius: 0.5rem;
  border: 1px solid #F0F1F1;
  padding:0.3rem;
  width: 240px;
}
.diff_duration{
  font-size:1.2rem;
  padding:0.5rem
}
.date_box{
  min-height:6rem;
  max-height: 7rem;
  overflow-y: scroll;
}
.selectDate{
  background-color:var(--primary);
  color: white;
  margin-block:0.3rem;
  padding:0.2rem;
  border-radius: 0.5rem
}
.subtitle_banner{
  width: 60%;

  color: white;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.subtitle_banner div{
  padding:0.3rem;

}
.sub_fr{
  padding-block: 1rem;
}
.error_input{
  color: red;
  text-align: center;
}
.red{
  color: black;
}
.deleteBox{
  width: 1rem;
}
@media screen and (max-width: 1000px) {
  .container_title{
    padding-top: 1rem;
    margin-bottom: 5vh;
  }
  .global_container{
    height: 70vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .package_container{
    height: auto;
    width:90%;
    
  }

}
</style>