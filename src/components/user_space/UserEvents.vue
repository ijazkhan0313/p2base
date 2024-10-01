<script>
  import { useEventStore } from "@/stores/events";

export default {
  setup(){
    const eventStore = useEventStore();
    const api = eventStore.getImgApi;
    return {eventStore, api }
  },
  data(){
    return{
      deletePopUp: false,
      searchFilter: "",
      events: [],
      eventId:"",
      updatePopUp: false,
      event:{},
      eventData:null
    }
  },
  async mounted() {
    const userMail = localStorage.getItem("userEmail")
    if(userMail){
      this.events = await this.eventStore.fetchUserEvents(userMail);
    }
    this.events = await this.eventStore.getUserEvents
    console.log(this.events)
  },
  methods: {

    search() {
      console.log('search method called');
      this.filteredEvents = this.getFilteredEvents(this.searchFilter);
    },

  getFilteredEvents(searchFilter) {


  },
    async getEventStats(event, identifier){
      const eventclass = document.getElementsByClassName("event_item");
      for (let i = 0; i < eventclass.length; i++) {
      const item = eventclass[i];
      item.classList.remove("activeItem");
      }
      event.currentTarget.classList.add("activeItem");

      this.eventData = await this.eventStore.getOneEvent(identifier);
    },
    deleteEvent(id){
      this.deletePopUp = true
      this.eventId = id
    },
    async updateEvent(identifier){
      await this.eventStore.setEventStatus("update");
      await this.eventStore.getOneEvent(identifier);
      this.$emit("activeId",{activeId:0})
    },
    async delConfirmation(){
      const userMail = localStorage.getItem("userEmail")
      await this.eventStore.delete(this.eventId)
      this.deletePopUp = false
      await this.eventStore.fetchUserEvents(userMail);
      this.events = this.eventStore.getUserEvents
    },
    isImage(filename) {
     
      return /\.(jpg|jpeg|png|gif|bmp)$/i.test(filename);
    },
    isVideo(filename) {
    
      return /\.(mp4|mpeg|mp3)$/i.test(filename);
    },
    async goToDiffPage(event){
      await this.eventStore.getOneEvent(event);
      this.$emit("activeId",{activeId:4})
    }
  },
  computed: {
    filteredevents() {
      return this.events.filter((event) => {
      return event.eventNameFr.toLowerCase().includes(searchFilter.toLowerCase());
    });

    }
  }
  
}
</script>

<template>
   <div v-if="deletePopUp === true || updatePopUp === true" class="container" ></div>
  <div class="allevents_container">
    <div class="event_container">

      <div class="event_title">Mes Évènements</div>
      <div class="searchBar">
        <input type="text" v-model="searchFilter" placeholder="Rechercher un événement ">
     
        <button @click="search">&#x1F50E; Rechercher</button>
      </div>
      <div class="events">
        <div class="event_item" v-for="(eventItem, index , filteredEvents) in events" :key="index" @click="getEventStats($event, eventItem.identifier)">
          <img class="event_pict" v-if="isImage(eventItem.eventFile)" :src=" api + eventItem.eventFile"/>
          <video class="event_pict" v-if="isVideo(eventItem.eventFile)" :src=" api + eventItem.eventFile"/>
          <iframe class="event_pict" v-if="eventItem.videoLink && !isImage(eventItem.eventFile) && !isVideo(eventItem.eventFile) " :src="eventItem.videoLink"></iframe>
          <div class="event_description-container">
            <div class="event_description-infos">
              <div class="event_description-title">{{ eventItem.eventNameFr }}</div>
              <div class="event_diff-status">
                <span v-if="eventItem.active === true && eventItem.pending === false" >Actif</span>
                <span v-if="eventItem.active === false && eventItem.pending === true">En attente de diffusion</span>
                <span v-if="eventItem.active === true && eventItem.pending === true">En attente de validation</span>
              </div>
              <div class="event_description-location">
                <span class="zip">{{ eventItem.zip }}</span>
                <span class="city">{{ eventItem.city }}</span>
              </div>
            </div>
            <div class="event_description-actions">
              <div class="action-btn" @click="updateEvent(eventItem.identifier)">Modifier</div>
              <div v-if=" eventItem.active === false" class="action-btn" @click="goToDiffPage(eventItem.identifier)">Diffuser</div>
              <div class="action-btn" @click="deleteEvent(eventItem._id)">Supprimer</div>
            </div> 
          </div>
        </div>
      </div>
    </div>
    <div class="stats_container">
      <div class="stats-title">Statistiques</div>
      <div class="block_div"></div>
      <div class="stats">
        <div class="divider">
          <div class="stats_bloc">
            <div class="stat_title">Affichages</div>
            <div v-if="!eventData" class="stat">0</div>
            <div v-else class="stat">{{ eventData.view }}</div>
          </div>
          <div class="stats_bloc">
            <div class="stat_title">Clics</div>
            <div v-if="!eventData" class="stat">0</div>
            <div v-else class="stat">{{ eventData.clickView }}</div>
          </div>
        </div>
        <div class="divider">
          <div class="stats_bloc">
            <div class="stat_title">Partages</div>
            <div v-if="!eventData" class="stat">0</div>
            <div v-else class="stat">{{ eventData.share }}</div>
          </div>
          <div class="stats_bloc">
            <div class="stat_title">Appels</div>
            <div v-if="!eventData" class="stat">0</div>
            <div v-else class="stat">{{ eventData.callClick }}</div>
          </div>
        </div>
        <div class="divider">
          <div class="stats_bloc">
            <div class="stat_title">Likes</div>
            <div v-if="!eventData" class="stat">0</div>
            <div v-else class="stat">{{ eventData.likes }}</div>
          </div>
          <div class="stats_bloc">
            <div class="stat_title">Sites</div>
            <div v-if="!eventData" class="stat">0</div>
            <div v-else class="stat">{{ eventData.webClick }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="deletePopUp === true" >
    <div class="deletePopUp_container">
      <div class="deletePopUp_title">Êtes vous sur de vouloir effectuer cette suppression</div>
      <div class="deletePopUp-buttons">
        <button class="deletePopupBtn" @click="delConfirmation()">Oui</button>
        <button class="deletePopupBtn" @click="deletePopUp = false">Retour</button>
      </div>
    </div>
  </div>
  <div class="update_popUp" v-if="updatePopUp === true" >
    <div class="update_container">
      <div class="update_title">Modification d'Évènement</div>
      <div class="update_title">{{ event.eventNameFr }}</div>
      <div class="mobile_body-img_box">
          <!-- <img class="event_image" v-if="!eventImg || !eventVideo " src="@/assets/placeholder.jpg" /> -->
          <img class="event_image" v-if="isImage(event.eventFile)" :src=" api + event.eventFile"/>
          <video class="event_pict" v-if="isVideo(event.eventFile)" :src=" api + event.eventFile"/>
          <iframe v-if="event.videoLink && !isImage(event.eventFile) && !isVideo(event.eventFile) " :src="event.videoLink"></iframe>
      </div>
      <div class="mobile_body-date_box">
            <div class="mobile_body-date_start">
              {{ event.startDate }}
            </div>
            <span class="date-link "> > </span>
            <div class="mobile_body-date_start" v-if="!event.endDate">
              ( date de fin )
            </div>
            <div class="mobile_body-date_end">{{ event.endDate }}</div>
       </div>
       <div class="mobile_body-location">
          <div class="mobile_body-location_box">
            <div class="mobile_body-adress blue">{{ event.addresses }}</div>
            <div class="mobile_body-adress">
              <span class="mobile_body-adress">{{ event.zip }}</span>
              <span class="mobile_body-adress">{{ event.city }}</span>
            </div>
          </div>
        </div>
        <div class="mobile_body-description black" v-if="!event.descriptionFr">
          Description de l'évènement
        </div>
        <div class="mobile_body-description black" v-else>
          {{ event.descriptionFr }}
        </div>
        <div class="mobile_body-condition black" v-else>
          {{ event.conditionsFr }}
        </div>
          <div class="mobile_body-time">
            <div class="mobile_body-time_box">
              <div class="mobile_body-time_start black"> {{ event.startTime }} </div>
              <span class="divider">-</span>
              <div class="mobile_body-time_end black">  {{ event.endTime }} </div>
            </div>
          </div>
          <div class="mobile_body-price">
            
            <div v-if="event.isFree === true" class="mobile_body-isfree blue">Gratuit</div>
            <div class="mobile_body-price_box">
              <div class="mobile_body-price_min black" v-if="event.minPrice.length === 0 && event.isFree == false"> Prix enfant</div>
              <div class="mobile_body-price_min black" v-if="event.minPrice.length >0  && event.isFree == false"> {{event.minPrice }} </div>
              <span v-if="event.isFree === false" class="blue">-</span>
              <div class="mobile_body-price_min black" v-if="!event.maxPrice.length === 0 && event.isFree == false"> Prix adulte</div>
              <div class="mobile_body-price_max black" v-if="event.maxPrice.length > 0 && event.isFree == false">  {{ event.maxPrice }} </div>
            </div>
          </div>
    </div>
  </div>
</template>



<style scoped>
.allevents_container{
  margin-left: 1rem;
  width: 78%;
  height: 95%;

  border-radius: 0.5rem;
  display: flex;
  justify-content:space-around;
  
}
.event_container, .stats_container{
  display: flex;
  flex-direction: column;
  align-items: center;

}
.event_title, .stats-title{
  margin-top: 1rem;
  font-size:2rem;
  font-weight: bold;
  color: black;
}
.events{
  margin-top: 0.8rem;
  padding-inline: 1rem;
  width: 100%;
  height: 85%;
  background-color: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  overflow-y: scroll;
  scrollbar-width: thin;
}
.stats{

  padding: 10px;
  width: 100%;
  height: 85%;
  background-color: white;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;

  
}
.events{
  padding-top: 0.5rem;
  flex-direction: column;
}
.event_item{
  width: 937px;
  height: 186px;
  top: 191px;
  left: 615px;
  margin-bottom: 2rem;
  background-color: #2E739D;
  color: white;
  display: flex;
  justify-content: start;
  align-items: center;
  border-radius: 0.5rem;
  cursor: pointer;
}
.activeItem{
  border: 3px solid grey;
}
.event_description-container{
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.event_description-infos{
  padding-inline: 0.5rem;
}
.stats_bloc{
  width: 10rem;
  height: 10rem;
  background-color: #2E739D;
  color: white;
  display: flex;
  flex-direction: column;
  align-items:center;
  border-radius: 0.5rem;
}
.stat_title{
  padding: 1rem 0 2rem 0;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;;
}
.stat{
  color: white;
  font-weight: bold;
  font-size: 2.5rem;;
}
.event_pict{
  width: 25%;
  height: 90%;
  background-color: white;
  margin: 0.5rem;
  border-radius: 0.5rem;
  object-fit: cover;
}
.city, .zip, .event_description-title, .event_description-text{
  color: white;
}
.event_description-title{
  height: 2rem;
  font-size: 1.2rem;
  font-weight: bold;
}
.event_description-location{
  margin-block: 0.5rem;
  display: flex;
}
.city, .zip {
  display: block;
}
.zip{
  margin-right: 1rem
}
.event_description-actions{
  
  display: flex;
  justify-content: flex-end;
}

.searchBar{
  display: flex;
  width: 100%;
 height: 2rem;	
 margin-top: 0.5rem;
}
.searchBar input{
  width:75%;
  background-color:white;
  color: var(--primary);
  border: none;
  outline: none;
  border-top-left-radius:0.5rem;
  border-bottom-left-radius:0.5rem;
  text-indent: 1rem;
}
::placeholder{
  color:var(--primary);
}
.searchBar button{
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size:0.8rem;
  width: 28%;
  margin: 0;
  color:white;
  border-top-right-radius:0.5rem;
  border-bottom-right-radius:0.5rem;
  background-color: var(--primary);
  border: 2px solid white;
 
}
.container{
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: black;
  z-index: 0;
  opacity: 0.8;
  overflow: hidden;
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
.action-btn{
  background-color:white;
  color: var(--primary);
  width: 5rem;
  display: flex;
  justify-content: center;
  border: none;
  padding: 0.4rem;  
  margin: 0 0.5rem 0 0.5rem;
  cursor: pointer;
  border-radius: 0.5rem;
}
.divider{
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.block_div{
  margin-top:0.5rem;
  height:2rem
}
.update_popUp{
  width: 60vw;
  height: 85vh;
  background-color: white;
  color: black;
  text-align: left;
  align-items: center;
  font-size: 1.2rem;
}

.mobile_body-date_box{
  display: flex;
}
.event_image, .event_video, .event_videoLink{
  width: 60%;
  object-fit: cover;
  display: block;
}
@media screen and (max-width: 1000px) {
  .allevents_container{
    flex-direction: column;
    align-items: center;
    width: 90%;
    height: 100%;
    margin-bottom: 5rem;
  }
  .event_container{
  width: 90%;
  margin-inline: 1rem;
  min-height: 55vh;
  max-height: 55vh;
}
.stats_container{
  width: 90%;
}
.stats{
  height: 65vh;
}

.stats_bloc{
  width: 28vw;
  height: 28vw;
}
.searchBar{
    height: 10vw;
  }
}
</style>