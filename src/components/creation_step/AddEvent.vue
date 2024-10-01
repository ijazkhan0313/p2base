<script>
import { useEventStore } from '@/stores/events';
import { useUserStore } from '@/stores/users';
import { useAdminStore } from '@/stores/admin';
import moment from 'moment';
import axios from 'axios';
import localforage from "localforage";
export default {
  setup(){
    const eventStore =  useEventStore();
    const userStore = useUserStore();
    const adminStore = useAdminStore();
    const eventInfos = eventStore.getEvent;
    const pricing = eventStore.getPricing;
    const store = userStore.getUser;
    const api = eventStore.getImgApi;
    return { eventStore, userStore, store, eventInfos, pricing, adminStore, api }
  },
  data(){
    return {
      fileSrc: null,
      settings:null,
      isAds:true,
      placeholder:"@/assets/img_placeholder.png",
      categories:  false,
      upArrow: false,
      downArrow: true,
      eventNameFr: this.eventInfos.eventNameFr ?? "",
      eventImage: this.eventInfos.file ? this.api + this.eventInfos.file : '',
      image: this.eventInfos.file  ? URL.createObjectURL(this.eventInfos.file) : '',
      video: this.eventInfos.file  ? URL.createObjectURL(this.eventInfos.file) : '',
      videoLink:this.eventInfos.videoLink ?? '',
      startDate:this.eventInfos.startDate ?? '',
      endDate: this.eventInfos.endDate ?? '',
      startTime: this.eventInfos.startTime ?? '',
      endTime:this.eventInfos.endTime ?? '',
      addresses:this.eventInfos.addresses ?? [],
      city: this.eventInfos.city ?? '',
      zip: this.eventInfos.zip ?? '',
      lat:this.eventInfos.lat ?? '',
      lng:this.eventInfos.lng ?? '',
      tels:this.eventInfos.tels ?? [],
      web:this.eventInfos.web ?? '',
      price:this.eventInfos.price ?? '',
      minPrice:this.eventInfos.minPrice ?? '',
      maxPrice:this.eventInfos.maxPrice ?? '',
      descriptionFr: this.eventInfos.descriptionFr ?? '',
      descriptionEn:this.eventInfos.descriptionEn ?? '',
      conditionsFr: this.eventInfos.conditionsFr ?? '',
      conditionsEn:this.eventInfos.conditionsEn ?? '',
      isFree:this.eventInfos.isFree ?? false,
      file:this.fileSrc ? this.fileSrc : {},
      finalPrice:0,
      days:1,
      adsDist: 0,
      tags:this.eventInfos.tags ? Object.values(this.eventInfos.tags).join(', ') : [],
      eventImg:'',
      tagsError:false,
      latLngError:false,
      titleError:false,
      dateError:false,
      adressError:false,
      cityError: false,
      zipError: false,
      deletePopUp: false
     }
  },
  async mounted(){
    this.eventImg = this.eventStore.getEvent.eventFile
    console.log(this.store?.user?.email)
    const savedImage = await localforage.getItem('tempFile');
      if (savedImage) {
        this.fileSrc = savedImage;
        this.createImage(this.file)
      }
  },
  computed : {
    embeddedYoutubeUrl() {
    return this.videoLink.replace('https://youtu.be/', 'https://www.youtube.com/embed/');
    }
  },
  methods:{
 
    formatDate(date){
      return moment(date).format("DD/MM/YYYY");
    },
    onFileChange(e){
      const files = e.target.files || e.dataTransfer.files;
      if(!files.length)return
      this.file = files[0];
      this.createImage(files[0]);
    },
    async createImage(file){
      this.eventImg = "";
      this.image = "";
      this.video = "";
      const type = file.type;
      const reader = new FileReader();
        reader.onload = async (e) => {
          if(type.startsWith("image/") )this.image = URL.createObjectURL(file);
          if(type.startsWith('video/') )this.video = URL.createObjectURL(file);
          await localforage.setItem("tempFile", e.target.result);
        };
        reader.readAsDataURL(file);
      },
    removeImage(e){
      this.image = "";
    },
    nextAddingPart(){
      if(this.eventNameFr === ""){
        this.titleError = true
        return
      } 
      if(this.tags.length === 0){
        this.tagsError = true
        return
      } 
      if(this.lat === "" || this.lon === ""){
        this.latLngError = true
        return
      } 
      if(this.startDate === "" || this.endDate === ""){
        this.dateError = true
        return
      } 
      if(this.startDate === "" || this.endDate === ""){
        this.dateError = true
        return
      } 
      if(this.addresses === "" ){
        this.adressError = true
        return
      } 
      if(this.city === "" ){
        this.cityError = true
        return
      } 
      if(this.zip === "" ){
        this.zipError = true
        return
      } 
        let days = moment(this.endDate).diff(moment(this.startDate), 'days');
        let tagsArray = [];
        if(this.tags.length > 0){
          tagsArray = this.tags.trim().split(',');
        }
        let event = {

          "identifier": this.eventStore.getEvent.identifier ?? "",
          "author": this.store?.user?.email ?? this.eventInfos.author,
          "isAds": this.isAds,
          "adsDist": this.adsDist,
          "tags": tagsArray,
          "eventNameFr": this.eventNameFr,
          "eventImg": this.file.size ? this.file : this.eventImg,
          "videoLink":this.embeddedYoutubeUrl, 
          "startDate": this.startDate,
          "endDate":this.endDate,
          "duration": days,
          "startTime": this.startTime,
          "endTime": this.endTime,
          "addresses":this.addresses,
          "city": this.city,
          "zip": this.zip,
          "lat": this.lat,
          "lng": this.lng,
          "tels": this.tels,
          "web": this.web,
          "minPrice": this.minPrice,
          "maxPrice": this.maxPrice,
          "descriptionFr": this.descriptionFr,
          "descriptionEn": this.descriptionEn,
          "conditionsFr": this.conditionsFr,
          "conditionsEn": this.conditionsEn,
          "isFree": this.isFree,
          "active": false   
        }
        console.log(event)
        this.$emit("eventStep", {value: 3})
       
      this.eventStore.setEvent(event);
      
    },
    goBack(){
      this.$emit("eventStep", {value: 0})
    },
    async searchGeo(){
        await axios.get(import.meta.env.VITE_GEO_API + `${this.addresses}&postcode=${Number(this.zip)}`).then(result => {
          this.lng = result.data.features[0]['geometry']['coordinates'][0],
            this.lat = result.data.features[0]['geometry']['coordinates'][1]
        });
  }
  }
}
</script>

<template>
    <div class="container">
        <div class="container_title">
          <img class="left_arrow" src="@/assets/left_arrow.png" alt="" @click="deletePopUp = true">
          <span v-if="eventStore.eventStatus === 'update' "  class="pageTitle">Modification d'un Évènement</span>
          <span v-else class="pageTitle">Création d'un Évènement</span>
        </div>
        <div class="event_container">
          <div class="event_container-infos">
            <div class="infos_input">
              
              <label class="event_title" for="title">Titre de l'évènement * </label>
              <input type="text" v-model="eventNameFr">
              <span v-if="titleError === true" class="required_input">Champs obligatoire</span>
            </div>
            <div class="event_picture">
              <img class="event_image" v-if="eventImg && !image && !video && !videoLink" :src="api + eventImg" alt="">
              <img class="event_image" :src="image" v-if="image && !video && !videoLink && !eventImg" >
              <video controls class="event_video" :src="video" v-if="video && !image && !videoLink" ></video>
              <iframe class="event_videoLink"  :src="embeddedYoutubeUrl" v-if="videoLink" frameborder="0"></iframe>
            </div>
            <div class="file_input-box" v-if="!image && !video && !videoLink && eventStore.eventStatus !== 'update'">
              
              <label class="file_input">
                <input type="file" @change="onFileChange" />
                  Cliquez ici pour importer une image ou une vidéo
              </label>
            </div>
            <div class="file_change-input" v-if="image || video ">
              <label class="file_input-change">
                <input class="cursor" type="file" @change="onFileChange" />
                  Changer d'image ou de video
              </label>
            </div>
            <div class="infos_input">
            <label for="youtube">Lien video:</label><br>
            <input type="text" v-model="videoLink" name="youtube" >
            </div>
            <div class="box_moment">
              <div class="infos_input">
                <label for="startDate">Date de début  de l'évènement</label>
                <input type="date" v-model="startDate">
              </div>
              <div class="infos_input">
              <label for="endDate">Date de fin de l'évènement</label>
              <input type="date" v-model="endDate">
              </div>
            </div>
            <span v-if="dateError === true" class="required_input">Merci de renseigner les dates de début et fin d'évènement </span>
            <div class="infos_input">
              <label for="adress">Adresse *</label>
              <input type="text" v-model="addresses">
              <span v-if="adressError === true" class="required_input">Champs obligatoire</span>
            </div>
            <div class="infos_input">
              <label for="city">Ville *</label>
              <input type="text" v-model="city">
              <span v-if="cityError === true" class="required_input">Champs obligatoire</span>
            </div> 
            <div class="infos_input">
              <label for="zip">Code Postal *</label>
              <input type="text" v-model="zip">
              <span v-if="zipError === true" class="required_input">Champs obligatoire</span>
            </div>
            <div class="latLng_btn-box">
              <div class="geoTitle">Générer lattitude et longitude</div>
              <button @click="searchGeo()" class="">Générer</button>
            </div>
            <div class="geolocate_inputs">
              <div class="infos_input">
                <label for="lat">Lattitude *</label>
                <input type="text" v-model="lat" >
              </div>
              <div class="infos_input">
                <label for="lng">Longitude *</label>
                <input type="text" v-model="lng">
              </div> 
            </div>
            <span v-if="latLngError === true" class="required_input">Merci d'ajouter ou générer la lattitude et longitude </span>
           
            <div class="infos_input">
              <label for="tel">Téléphone</label>
              <input type="tel" v-model="tels">
            </div>
            <div class="infos_input">
              <label for="web">Site web (exemple: https://www.place2be.fr)</label>
              <input type="text" v-model="web">
            </div>
            <div class="infos_input">
              <label for="descriptionFr">Description</label>
              <textarea rows="7" v-model="descriptionFr"></textarea>
            </div>
            <div class="infos_input">
              <label for="conditionsFr">Conditions</label>
              <textarea rows="5" v-model="conditionsFr"></textarea>
            </div>
            <div class="box_moment"> 
              <div class="infos_input">
                <label for="startTime">Heure de début</label>
                <input type="time" v-model="startTime" placeholder="16:00">
              </div>
              <div class="infos_input">
                <label for="endTime">Heure de fin</label>
                <input type="time" v-model="endTime" placeholder="22:00">
              </div>
            </div>
            <div class="prices_box" v-if="isFree === false">
              <div class="price_input">
                <label for="minPrice">Prix enfant</label>
                <div class="price_container">
                  <input class="prices" type="text" v-model="minPrice" placeholder="--,--">
                  <span class="euro">€</span>
                </div>
              </div>
              <div class="price_input">
                <label for="maxPrice">Prix adulte</label>
                <div class="price_container">
                  <input class="prices" type="text" v-model="maxPrice" placeholder="--,--">
                  <span class="euro">€</span>
                </div> 
              </div>
            </div>
            <div class="eventFree">
              <input type="checkbox" value="eventFree" v-model="isFree">
              <label for="coeventFreemmemoration">Entrée Gratuite</label>  
            </div>
            <div class="infos_input">
              <label for="conditionsFr">Mots clés (séparés par des virgules, mots susceptibles d'être demandés):</label>
              <textarea class="keywords_area" rows="5" v-model="tags"></textarea>
              <span v-if="tagsError === true" class="required_input">Mots clés obligatoires</span>
            </div>
          </div>
          <div class="exemple_event-container">
            <div class="event_display">
              
              <div class="mobile_body-title " v-if="!title">{{eventNameFr}} </div>
              <div class="mobile_body-title" v-if="title">{{ title }}</div>
              <div class="mobile_body-img_box">
                <img class="event_image" v-if="{eventImg} && !image" :src="api + eventImg" alt=""/>
                  <img class="event_image" v-if="!image && !video && !videoLink && !eventImg" src="@/assets/placeholder.jpg"/>
                  <img class="event_image" :src="image" v-if="image && !video && !videoLink && !eventImg" />
                  <video controls class="event_video" :src="video" v-if="video && !image && !videoLink" ></video>
                  <iframe class="event_videoLink"  :src="embeddedYoutubeUrl" v-if="videoLink && !image && !video" frameborder="0"></iframe>
              </div>
              <div class="mobile_body-date">
                  <img class="iconw iconSize " src="@/assets/calendar.jpg" alt="">
                  <div class="mobile_body-date_box">
                      <div class="mobile_body-date_start placeholderSize" v-if="!startDate">(date de début)</div>
                      <div class="mobile_body-date_start"  v-if="startDate"> {{ formatDate(startDate) }} </div>
                      <span class="date-link"> > </span>
                      <div class="mobile_body-date_start placeholderSize" v-if="!endDate">(date de fin)</div>
                      <div class="mobile_body-date_end" v-if="endDate">  {{ formatDate(endDate) }} </div>
                  </div>
                </div>
              <div class="mobile_body-location">
                <img  class="iconw iconSize" src="@/assets/compass.jpg" alt="">
                <div class="mobile_body-location_box">
                  <div class="mobile_body-adress " v-if="addresses.length == 0">Adresse de l'évènement</div>
                  <div class="mobile_body-adress " v-if="addresses.length != 0">{{ addresses[0] }}</div>
                  <div class="mobile_body-adress">
                  <span class="mobile_body-adress" v-if="!zip">Code postal</span>
                  <span class="mobile_body-adress">{{ zip }}</span>
                  <span> - </span>
                  <span class="mobile_body-adress" v-if="!city">Ville</span>
                  <span class="mobile_body-adress">{{ city}}</span>
                  </div>
                </div>
              </div>
              <div class="mobile_body-icons_box" :style="{'justify-content': (tels.length > 0 || web) ? 'space-around' : 'flex-start', }">
                <img  class="heart" :style="{'margin-inline': (tels.length > 0 || web) ? '0' : '1rem'}" src="@/assets/favorite.png" alt="favoris">
                <img  class="iconSize" src="@/assets/phone.jpg" alt="telephone" v-if="tels.length > 0">
                <img  class="iconSize" src="@/assets/share.jpg" alt="partager">
                <img  class="iconSize" src="@/assets/globe.jpg" alt="lien web" v-if="web">
              </div>
              <div class="desc_divider"></div>
              <div class="mobile_body-description black placeholderSize" v-if="!descriptionFr">Description de l'évènement</div>
              <div class="mobile_body-description black" v-if="descriptionFr">{{ descriptionFr }}</div>
              <div class="desc_divider"></div>
              <div class="mobile_body-description black placeholderSize" v-if="!conditionsFr">Condition de l'évènement</div>
              <div class="mobile_body-condition black"  v-if="conditionsFr">{{ conditionsFr }}</div>
              <div class="desc_divider"></div>
              <div class="mobile_body-time">
                  <img class="iconw iconSize" src="@/assets/time.jpg" alt="">
                  <div class="mobile_body-time_box">
                      <div class="mobile_body-time_start black placeholderSize" v-if="!startTime"> Début </div>
                      <div class="mobile_body-time_start black " > {{ startTime }} </div>
                      <span class=" divider"> - </span>
                      <div class="mobile_body-time_start black placeholderSize" v-if="!endTime"> Fin </div>
                      <div class="mobile_body-time_end black">  {{ endTime }} </div>
                  </div>
              </div>
              <div class="mobile_body-price">
                 
                  <div v-if="isFree === true" class="mobile_body-isfree blue">Gratuit</div>

                    <img class="iconw iconSize" src="@/assets/price.png" alt="prix" v-if=" minPrice != ''  && isFree == false"> {{ minPrice }} />

                      <div class="mobile_body-price_min black" v-if="minPrice.length > 0 && isFree == false"> {{ minPrice }} </div>
                      <span v-if="isFree === false" class="divider"> - </span>
                      <div class="mobile_body-price_max black placeholderSize" v-if="maxPrice.length == 0 && isFree == false"> Prix adulte</div>
                      <div class="mobile_body-price_max black" v-if="maxPrice.length > 0 && isFree == false">  {{ maxPrice }} </div>

            </div>
          </div>
      <!-- <img  class="device" src="@/assets/device_frame.png" alt=""> -->
          <button class="btn-w" @click="nextAddingPart()">Continuer &#8594;</button>
          </div>
        </div>
    </div>
    <div v-if="deletePopUp === true || updatePopUp === true" class="popContainer" ></div>
    <div v-if="deletePopUp === true" >
        <div class="deletePopUp_container">
            <div class="deletePopUp_title">Êtes vous sur de vouloir effectuer cette suppression</div>
            <div class="deletePopUp-buttons">
            <button class="deletePopupBtn" @click="goBack">Oui</button>
            <button class="deletePopupBtn" @click="deletePopUp = false">Retour</button>
        </div>
    </div>
 </div>
  </template>
  
  
  <style lang="css" scoped>
  .container {
    margin-left: 1rem;
    width: 80%;
    height: 95vh;
  
    
    border-left: solid #2E739D 13px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
  }
  .event_container{
    display: flex;
    justify-content:space-between;
    align-items: center;
    width: 100%;
    height: 87%;
    background-color: var(--primary);
    margin-top: 1rem;
    border-radius: 0.5rem;
  }
  .container_title{
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pageTitle{
    text-align: center;
    width: 100%;
    margin-block: 1rem;
    color:  white;
    font-size:2rem;
    font-weight:bold;
   
  }
  
  .event_title{
    font-size:1.2rem;
    padding-block: 0.5rem;;
  }
  .event_container-infos{
    position: relative;
    display: flex;
    background-color:white;
    flex-direction: column;
    align-items: center;
    width: 60%;
    height: 100%;
    overflow: scroll;
    border-radius: 0.5rem;
  }
  .exemple_event-container{
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #2E739D;
    width:40%;
    padding: 94px;
    height: 100%;
    border-radius: 0.5rem;
  
  }
  
  .rotate{
    transform: rotate(0.5turn);
  }
  .categories_box-container--input{
    position: absolute;
    margin:2.5rem 0 0 0.5rem;
    width: 90%;
    background-color: white;;
    border: 1px solid  var(--primary);;
    color: black;
    text-indent: 0.5rem;
    z-index: 1
  }

  
  label{
    color: black;
    margin: 0 0 0.2rem 0.5rem;
  }
  input, textarea{
    margin-left: 0.5rem;
    color: black;
    border: 1px solid var(--primary);
    border-radius: 0.5rem;
    text-indent: 1rem;
    height: 5vh;
    font-size: 1rem;;
   
  }
  
  
  textarea{
    resize:none;
    overflow: scroll;
    height: 15vh;
    padding-block: 1rem;
  }
  .latLng_btn-box{
    width:90%;
    display: flex;
    align-items: center;
  }
  .latLng_btn-box button {
    width: 8rem;
    margin-top: 0;
    height: 1.5rem;
  }
  .infos_input, .price_input{
    display: flex;
    flex-direction: column;
    justify-content:space-between;
    width: 90%;
    padding-block: 0.3rem;
    margin-block: 0.5rem;;
  }
  
  .prices{
    text-align: end;
    width:100%
  }
  .box_moment, .box_startEnding, .geolocate_inputs, .prices_box{
    width: 90%;
    display: flex;
    align-items:center;
    margin-block: 0.5rem
  }
  .eventFree{
    display: flex;
    justify-content:flex-start;
    width: 90%;
    align-items: center;
  }
  .event_picture{
    margin: 0 1rem 0.2rem;
    width:55%;

    height: auto;
    background-color:white;
  
  }
  .event_image, .event_video, .event_videoLink{
    width: 100%;
    height:100%;
    object-fit: cover;
  }
  .file_input-box{
    width: 90%;
    display: flex;
    justify-content: flex-end;
    cursor: pointer;
    text-align: center;
  }
  input[type="file"] {
      display: none;
  }
  input[type="time"] {
      width: 90%
  }
  .file_input {
    display: block;
    width: 100%;
    height: 15vw;
    cursor: pointer;
    color: black;
    display: flex;
    justify-content:center;
    align-items: center;
    background-color: lightgrey;
    /* background-image:url("@/assets/img_placeholder.png");
    background-repeat: no-repeat;
    object-fit: cover; */
  }
  
  button{
    margin-top: 1.5rem;
    width: 60%;
    height: 2rem;
    color: black;
    background-color:white;
    border: 1px solid var(--primary);
    border-radius: 0.5rem;
    cursor: pointer;
  }
  .btn-w{
    width: 80%;
    padding: 1rem;
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center
  }
  button:hover{
    background-color:var(--primary);
    color: white;
    border: 1px solid white;
  }
  .location{
    margin-left: 0.3rem;
    cursor: pointer;
    display: block;
  }
  .icon{
    height: 1.5rem;
  }
  .price_container{
    display: flex;
    align-items: center;
  }
  .euro{
    margin-left: 0.5rem;
  }
  .file_change-input{
    width: 85%;
    text-align: center; 
    padding-block: 0.3rem;
    border: 1px solid white;
    cursor: pointer;
    margin-bottom: 0.5rem;
  }
  .cursor{
    cursor: pointer;
  }
  .device{
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20vw;
  }
  .event_display{
    background-color:white;
    width: 80%;

    border-radius: 0.5rem;
  }
  .mobile_body-title{
    color:black;
    font-weight: bold;
    font-size:1.2rem;
    padding: 0.5rem 0 0.5rem 0.5rem;
  }
  .mobile_body-date_start, .mobile_body-date_end {
    color: black;
  }
  .blue{
    color:var(--primary);
  }
  .mobile_body-adress{
    color: black;
  }
  .iconw{
    display: block;
    padding-inline: 0.5rem;}
  .iconSize{
    width: 3.1vh
  }
  .heart{
    width: 3.8vh
  }
  
  .black{
    color:black;
  }
  .mobile_body-img{
    width: 100%;
    object-fit: cover;
  }

  .mobile_body-date,
  .mobile_body-date_box, 
  .mobile_body-location,
  .mobile_body-time,
  .mobile_body-price,
  .mobile_body-time_box{
    display: flex;
    align-items: center;
    margin-block: 0.5rem; 
  }
  .date-link{
    margin-inline: 0.2rem;
    color: black;
  }
  .mobile_body-icons_box{
    display:flex;
    justify-content: space-around;
    align-items: center;
  }
  .start_display{
    justify-content:flex-start
  }

  .mobile_body-price_box{
    display:flex;
    align-items: center;
  }
  
  .schedule_container{
    display:flex;
  }
  .mobile_body-location_box{
    margin-block: 0.5rem;
  }
  .mobile_body-description, .mobile_body-condition{
    margin-block: 1.5rem;
    padding-inline: 2rem;
  }
  .placeholderSize{
    font-size:1rem
  }
  .divider{
    padding-inline: 0.5rem;
    color: black;
  }
  .price_container, .total_price_container{
  
    background-color: white;
    color: var(--primary);
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    font-weight: bold;
  
  }
  .total_price_container{
    width: 60%;
    height: 5vh;
    align-items: center;
  }
  .keywords_area{
    height: 15vh
  }
  .mobile_body-isfree{
    margin-left: 3.4vw;
  }
  .desc_divider{
    margin-top: 1rem;;
    margin-left:2rem;
    width:80%;
    border-bottom: 1px solid grey;
  }
  .left_arrow{
    width: 2rem;
    cursor:pointer;
  }
  .required_input{
    color: red;
    padding:0.5rem;
  }
  @media screen and (max-width: 1000px) {
    .container{
      height: auto;
      width: 90%;
      margin: 0
    
    }
    .event_container{
      flex-direction: column;
      height: auto;
      
    }
    
    .event_container-infos{
      width:100%;
    }
    .event_display{
      width: 60vw;
      margin-top: 2rem;
    }
    .price_container{
      margin-block: 2rem;
    }
    .btn-w{
      margin-block: 1rem;
    }
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
.popContainer{
  position: absolute;
 width: 100vw;
 height: 100vh;
 background-color: black;
 z-index: 0;
 opacity: 0.8;
 overflow: hidden;
}
.geoTitle{
  color: var(--primary);
  padding-inline: 0.5rem;
}
  </style>