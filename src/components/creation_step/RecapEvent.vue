<script>
import { useEventStore } from '@/stores/events';
import { useCouponStore } from '@/stores/coupon';
import { useUserStore } from '@/stores/users';
import localforage from "localforage";

export default {
  emits: ['active-id'],
  setup() {
    const eventStore = useEventStore();
    const couponStore = useCouponStore();
    const userStore = useUserStore();
    const user = userStore.getUser;
    const event = eventStore.event;
    const eventInfos = eventStore.getEvent;
    const api = eventStore.getImgApi;
    let eventImg;
    let eventBaseImg;
    let eventVideo;
    let videoLink = event.videoLink;
    if (event.file && typeof event.file !== 'string') {
        if (event.file.type.startsWith('image/')) {
          eventImg = URL.createObjectURL(event.file)
        }
        if (event.file.type.startsWith('video/')) {
          eventVideo = URL.createObjectURL(event.file)
        }
    }else{
      if( event.file && event.file.includes('file')){ 
        eventBaseImg = event.file 
      }else{
        eventBaseImg = "" 
      }
    }
    return {
      eventStore,
      couponStore,
      event,
      eventImg,
      eventBaseImg,
      eventVideo,
      user,
      eventInfos,
      api,
      videoLink
    };
  },
  methods:{
      async sendEvent(eventCase){
        let event = new FormData();
        event.append("author", this.event.author )
        event.append("categories", "" )
        event.append("themes", [] )
        event.append("isAds", true)
        event.append("tags", this.event.tags)
        event.append("title", this.event.eventNameFr)
        event.append("file", this.event.file ?? '')
        event.append("videoLink", this.event.videoLink )
        event.append("startDate", this.event.startDate )
        event.append("endDate",this.event.endDate )
        event.append("duration",this.event.duration)
        event.append("startTime",this. event.startTime)
        event.append("endTime", this.event.endTime)
        event.append("addresses", this.event.addresses)
        event.append("city", this.event.city)
        event.append("zip", this.event.zip)
        event.append("lat", this.event.lat)
        event.append("lng", this.event.lng)
        event.append("tels", this.event.tels)
        event.append("web", this.event.web)
        event.append("minPrice", this.event.minPrice)
        event.append("maxPrice", this.event.maxPrice)
        event.append("descriptionFr", this.event.descriptionFr)
        event.append("descriptionEn",this. event.descriptionEn)
        event.append("conditionsFr",this.event.conditionsFr)
        event.append("conditionsEn", this.event.conditionsEn)
        event.append("isFree",this.event.isFree)
        event.append("status","pending")
        event.append("active", false)
        event.append("forfait",0)
        const eventObj = {}
         for (const [key, value] of event.entries()) {
          eventObj[key] = value;
        }
        await this.eventStore. setEvent(eventObj);
        if(eventCase === 1){
          await this.eventStore.addEvent(event);
        }
        if(eventCase === 2){
          const id = this.event.identifier;
          await this.eventStore.eventUpdate(event, id );
        }
        localforage.clear();
      },
     
      closeEventCase(step) {
      if(step === 0){this.$emit("activeId",{activeId:0})}
      if(step === 1){
        this.sendEvent(1)
        this.$emit("activeId",{activeId:1});}
      if(step === 2){
        this.sendEvent(2)
        this.$emit("activeId",{activeId:1});}
      if(step === 3){
        this.sendEvent(2)
        this.$emit("activeId",{activeId:4});
      }
      if(step === 4){
        this.sendEvent(1)
        this.$emit("activeId",{activeId:4})}
     }
    }
};
</script>

<template>
  
  <div class="container">
      <div class="container_title">Récapitulatif de mon évènement</div>
      <div class="container_event">
        <div class="exemple_event-container">
          <div class="event_display">
            <div class="mobile_body-title" v-if="!event.eventNameFr">
              Titre de l'évènement
            </div>
            <div class="mobile_body-title" v-else>{{ event.eventNameFr  }} </div>
            <div class="mobile_body-img_box">

            
                  <video controls class="event_video" :src="eventVideo" v-if="eventVideo && !eventImg && !videoLink" ></video>
                  <iframe class="event_videoLink"  :src="videoLink" v-if="videoLink && !eventImg && !eventVideo" frameborder="0"></iframe>
            </div>
            <div class="mobile_body-date">
              <img class="iconw iconSize" src="@/assets/calendar.jpg" alt="" />
              <div class="mobile_body-date_box">
                <div class="mobile_body-date_start" v-if="!event.startDate">
                  (date de début)
                </div>
                <div class="mobile_body-date_start" v-else>
                  {{ event.startDate }}
                </div>
                <span class="date-link "> > </span>
                <div class="mobile_body-date_start" v-if="!event.endDate">
                  ( date de fin )
                </div>
                <div class="mobile_body-date_end">{{ event.endDate }}</div>
              </div>
            </div>
            <div class="mobile_body-location">
              <img class="iconw iconSize" src="@/assets/compass.jpg" alt="" />
              <div class="mobile_body-location_box">
                <div class="mobile_body-adress blue" v-if="!event.addresses.length">
                  Adresse de l'évènement
                </div>
                <div class="mobile_body-adress blue">{{ event.addresses }}</div>
                <div class="mobile_body-adress">
                  <span class="mobile_body-adress" v-if="!event.zip">Code postal</span>
                  <span class="mobile_body-adress">{{ event.zip }}</span>
                  <span class="mobile_body-adress" > - </span>
                  <span class="mobile_body-adress">{{ event.city }}</span>
                </div>
              </div>
            </div>
            <div class="mobile_body-icons_box">
              <img class="iconw heart" src="@/assets/favorite.png" alt="favoris" />
              <img class="iconw iconSize " src="@/assets/phone.jpg" alt="telephone" />
              <img  class="iconSize" src="@/assets/share.jpg" alt="partager" />
              <img class="iconw iconSize" src="@/assets/globe.jpg" alt="lien web" />
            </div>
            <div class="desc_divider"></div>
            <div class="mobile_body-description black" v-if="!event.descriptionFr">
              Description de l'évènement
            </div>
            <div class="mobile_body-description black" v-else>
              {{ event.descriptionFr }}
            </div>
            <div class="desc_divider"></div>
            <div class="mobile_body-description black" v-if="!event.conditionsFr">
              Condition de l'évènement
            </div>
            <div class="mobile_body-condition black" v-else>
              {{ event.conditionsFr }}
            </div>
            <div class="desc_divider"></div>
            <div class="mobile_body-time">
              <img class="iconw iconSize" src="@/assets/time.jpg" alt="">
              <div class="mobile_body-time_box">
                <div class="mobile_body-time_start black" v-if="!event.startTime"> Heure de début </div>
                <div class="mobile_body-time_start black"> {{ event.startTime }} </div>
                <span class="divider">-</span>
                <div class="mobile_body-time_start black" v-if="!event.startTime"> Heure de fin </div>
                <div class="mobile_body-time_end black">  {{ event.endTime }} </div>
              </div>
            </div>
            <div class="mobile_body-price">
              
              <div v-if="event.isFree === true" class="mobile_body-isfree blue">Gratuit</div>
              <div class="mobile_body-price_box" v-if="event.minPrice[0] != '' && event.maxPrice[0] != '' " >
                <img class="iconw iconSize" src="@/assets/price.png" alt="prix" v-if="event.minPrice[0] != ''  && event.isFree == false"> {{event.minPrice[0] }} />
                <div class="mobile_body-price_min black" v-if="event.minPrice[0] != ''  && event.isFree == false"> {{ event.minPrice[0] }} € </div>
                <span v-if="event.isFree === false && event.minPrice[0] != '' " class="divider" > - </span>
                <div class="mobile_body-price_max black" v-if="event.maxPrice[0] != '' && event.isFree == false">  {{ event.maxPrice[0] }} € </div>
              </div>
            </div>
          </div>
          <button @click="closeEventCase(0)" >Modifier</button>
        </div>
        <div class="event_recap">
          <div class="order_container">
          <div class="order_infos">
            <div class="categories_infos-box">
          <div class="infos_field">Mots clés:</div>
          <div class="infos_box-themes">
            <div class="infos-themes" v-for="tags in event.tags" index="tags">
              <span class="theme">{{ tags }}</span> 
            </div>
          </div>
            </div>
          <div class="order_infos-box">
              <div class="infos_field">Date de l'évènement</div>
              <div class="infos_data">{{ event.startDate }}  > {{ event.endDate }}</div>
          </div>
          <!-- <div class="order_infos-box " v-if="event.forfait">
            <div class="infos_field" >Forfait</div>
            <div class="infos_data">Du {{event.forfait }}</div>
          </div> -->
          <div class="order_infos-box" v-if="event.tels.length > 0">
            <div class="infos_field">Numéro de téléphone</div>
            <div class="infos_data">{{ event.tels }}</div>
          </div>
          <div class="order_infos-box" v-if="event.web">
            <div class="infos_field">Site web</div>
            <div class="infos_data">{{event.web }}</div>
          </div>
          <div class="order_infos-box" v-if="event.startTime" >
            <div class="infos_field">Horaires</div>
            <div class="infos_data">{{ event.startTime }}  > {{ event.endTime }}</div>
          </div>
          <div class="order_infos-box" v-if="event.minPrice != '' ">
            <div class="infos_field">Tarifs enfants</div>
            <div  class="infos_data">{{event.minPrice[0] }} €</div>
          </div>
          <div v-if="event.maxPrice != '' " class="order_infos-box">
            <div class="infos_field">Tarifs adultes</div>
            <div  class="infos_data">{{ event.maxPrice[0] }} €</div>
          </div>
          <div v-else class="order_infos-box">
            <div class="infos_field">Tarifs</div>
            <div  class="infos_data">Gratuit</div>
          </div>
        </div>
        </div>
        <div class="order_actions">
          
            <button v-if="event.active === false && this.eventStore.eventStatus !== 'update'" @click="closeEventCase(4)">Enregistrer et diffuser</button>
            <!-- <button  @click="orderPopUp = true" >Diffuser</button> -->
        </div>
        </div>
       
      </div>
    </div>
 
</template>


<style lang="css" scoped>

.container{
  width: 80%;
  height: 100%;
  background-color:var(--primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0.5rem;
}
.divider{
  padding-inline: 0.5rem;
  color: black;
}
.container_title{
  padding-block: 1.5rem;
  font-size:2rem;
  font-weight: bold;
  color: white;
}
.container_event {
  width: 95%;
  height: 85%;
  background-color:white;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 0.5rem;
}

.event_recap{
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
}
.container_infos, .container_appRender{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 48%;
  height: 95%;
  background-color:var(--primary);
  border-radius: 0.5rem;
}

.exemple_event-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45%;
  height: 100%;
}
.container_appRender{
  align-items: center;
  background-color:var(--primary);
  margin-left: 2rem;
}
.container_appRender-title{
  font-size:2rem;
  margin-bottom: 1rem;
}
.container_appRender-list{
  width: 20%;
  height: 10rem;
  background-color:white;
  margin-bottom: 1rem;
}
.container_appRender-details{
  width: 40%;
  height: 23rem;
  background-color:white;
}
button{
  width: 12rem;
  height: 2rem;
  border-radius: 0.5rem;
  background-color:var(--primary);
  border: none;
  color: white;
  margin-block: 0.5rem;
  cursor: pointer;
}

.event_display{
  margin-top: 1rem;;
  background-color:white;
  width:60%;
  border: 1px solid var(--primary);
  border-radius: 0.5rem;
}
.mobile_body-title{
  color:black;
  font-weight: bold;
  font-size:1rem;
  margin: 1rem 0 1rem 1rem;
}
.mobile_body-date_start, .mobile_body-date_end {
  color: black
}
.mobile_body-img,  .event_video, .event_videoLink{
  width: 100%;
  object-fit: cover;
}
.mobile_body-img{
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
  color: black;
  margin-inline: 1rem;
}
.mobile_body-icons_box{
  display:flex;
  justify-content: space-around;
  align-items: center;
  padding-block: 0.5rem;
}
.mobile_body-price_box{
  display:flex;
  align-items: center;
}

.schedule_container{
  display:flex;
}
.event_image{
  width: 100%;
  height:100%;
  object-fit: cover;
}
.iconw{
  display: block;
  padding-inline: 0.5rem;
}
.heart{
  width: 3.8vh
}
.iconSize{
  width: 3.1vh;
}
.blue{
  color:var(--primary);
}
.black{
  color:black;
}
.order_container{
  margin-top: 1rem;;
  height: 100%;
  width: 100%;
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid var(--primary)
}
.order_infos{
  height: 88%
}

.order_actions{
  display: flex;
  justify-content:space-between
}
.infos_field{
  padding: 1rem;
  font-size:1.2rem;
}
.infos_data{
  padding: 1rem;
}
.order_infos-box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: black;
  padding-block: 0.5rem
}
.promo_field{
  padding:0.3rem;
  margin-right: 1rem;
  border: 1px solid black;
  color: black;
  text-align: end;
  border-radius: 0.2rem;
}


input:focus::placeholder {
  color:   transparent;
}

.theme{
  background-color: var(--primary);
  color: white;
  padding: 0.3rem;
  border-radius: 0.5rem;
  margin-right: 1rem;
}
.infos_box-themes{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.categories_infos-box{
  padding-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  color:black;
  height:5rem;
}
.order_infos-box--container{
  width: 40%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn_promo{
  color: black;
  border:1px solid black;
  width: 25%;
  height:95%;
  border-radius: 0.5rem;
  margin-right: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.3rem;
  cursor: pointer;

}
.mobile_body-description, .mobile_body-condition{
  margin-block: 1rem;
  padding-left: 1rem;
}

.mobile_body-adress{
  color: black;
  padding-top: 0.5rem;
}
.desc_divider{
    margin-top: 1rem;;
    margin-left:2rem;
    width:80%;
    border-bottom: 1px solid grey;
  }

  .mobile_body-isfree{

    margin-left: 1rem;
  }
@media screen and (max-width: 1000px) {

  .container{
    height: auto;
  }
  .container_event{
    height: auto;
    flex-direction: column;
  }
  .event_display{
    width: 60vw
  }
  .order_container{
    height: 40vh;
    margin-bottom: 3rem;
    width: 95%;
  }
  .container_title{
    padding-block: 1.5rem;
  }
}
</style>