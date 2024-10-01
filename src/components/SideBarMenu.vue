<script>
import { useUserStore } from '@/stores/users';
import { useEventStore } from "@/stores/events"
import router from '@/router';

export default {
  props: ['activeIdLink'],
  setup(){
    const userStore = useUserStore();
    const eventStore = useEventStore();
    const state = localStorage.getItem('state') ;
    return { userStore, state, eventStore}
  },
  data(){
    return {
      adminLinksMenu:[
        {id:3, titleLink: 'Évènements'},
        {id:4, titleLink: 'Utilisateurs / Annonceurs'},
        {id:6, titleLink: 'Administration'},
      ],
      userLinksMenu:[
      {id:1, titleLink: 'Mes évènements'},
      {id:5, titleLink: 'Mon compte'},
      ]
    }
  },
  mounted() {
      this.fetchUser();
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
       const store = this.userStore.getStatus
       if(store != null && store.user.admin === true){
        this.activeId = 3
      }else{
        this.activeId = 1
       }
      },
  selectLink(id) {              
        this.activeId = id;
        this.$emit("activeId",{activeId:id});
        },
  addEventLink(){
    this.activeId = 0;
    this.eventStore.$reset()
    this.$emit("activeId",{activeId:0});
  },
  logout(){
    this.userStore.$reset();
    localStorage.clear();
    router.push("/");
  }
}
}
</script>

<template>
  <div class="nav_container">
    <div class="logo_container" >
      <img src="@/assets/logo_place2be.jpg" alt="">
    </div>
    <div class="link_container" >
      <div v-if="state === 'PBUU'" class="new-event_btn" @click="addEventLink()">
      <img class="plus-icon" src="@/assets/plus.png" alt="">
      Nouvel évènement
    </div> 
    <nav>
      <ul>        
        <div v-for="(link, index) in userLinksMenu" :key="index" v-if="state === 'PBUU'">
        <li v-bind:class="{active:(link.id === activeIdLink)}" @click="selectLink(link.id)">{{ link.titleLink }}</li>
      </div>
        <div v-for="(link, index) in adminLinksMenu" :key="index" v-if="state === 'AUPB'">
        <li v-bind:class="{active:(link.id === activeIdLink)}" @click="selectLink(link.id)">{{ link.titleLink }}</li>
        </div>
        <li @click="logout">Déconnexion</li>
      </ul>
    </nav>
    </div>
   
    <div class="utils_links">
      <a href="www.place2be.fr/policy">politique de confidentialité</a>
    </div>
  </div>
</template>



<style lang="css" scoped>
 
.nav_container{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    height: 100%;
    width: 20%;
    color:var(--primary);
    font-size: 1rem;
  }

  .logo_container{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    width: 50%;
    height: 10vw;
    
  }

  img{ 
    height: 50%;
    object-fit: contain;
  }
  .plus-icon{
    height: 1.5rem;
    color: black;
  }
  .new-event_btn{
    display:flex;
    justify-content: space-around;
    align-items: center;
    padding-inline: 1rem;
    margin-top: 2rem;
    color:white;
    width: 80%;
    background-color: var(--primary);
    height: 5vh;
    cursor: pointer;
    border-radius: 0.5rem;
    border: none;
    align-self: center;
  }
  nav{ 
    margin-top: 2rem;
    width: 100%;
    display: flex;
    justify-content:center
  }
  ul{ 
    width: 100%;
  }
  ul li {
    display: flex;
    align-items: center;
    padding: 1rem 0  1rem 2rem;
    color:var(--primary);
    height: 2.5rem;
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius:0.5rem;
    margin-left: 1rem;
  }

  nav ul li:hover {
    background-color: var(--primary);
    color:white;
    cursor: pointer;
  }
  .active{
    background-color: var(--primary);
    color:white;
  }
  .utils_links{
    display: block;
    position: absolute;
   bottom: 1rem;
  }
  .utils_links a{
    color: var(--primary);
    font-size: 0.8rem;
  }
  .link_container{
      width: 100%;
      display: flex;
      flex-direction: column;
    }
  @media screen and (max-width: 1000px) {
    .new-event_btn{
      align-self: center;
      width: 25vw
    }
    .nav_container{
      position: inherit;
      width:100vw;
      height: 20vh;
      flex-direction: row;
     
    }
    .logo_container{
      display:none;
    }
    .link_container{
      width: 100%;
      display:flex;
      flex-direction: column;
      align-items: center;
    }
    ul{
      display:flex;
    }
    ul li{
      border-radius: 0.5rem;
     text-align: center;
     padding: 1rem 0.5rem  1rem 0.5rem;
    }
    .utils_links{
      display: none;
  }
  
  }
</style>