<script>
import Account from '@/components/user_space/Account.vue';
import { useUserStore } from "@/stores/users";

export default {
  components: { Account},
  emits: [
    'toUserEvents'
  ],
  setup(){
    const userStore = useUserStore();

    return { userStore }
  },
  data(){
    return{
      deletePopUp: false,
      modifAccount:false,
      userFilter: "",
      proFilter:"",
      difFilter:"",
      mobUsers:[],
      proUsers: [],
      userAccount:{}
    }
  },
  async mounted(){
    const accountMail = localStorage.getItem("accountMail")
    await this.userStore.getProUsers(accountMail);
    await this.userStore.getMobUsers(accountMail);
    this.proUsers = this.userStore.getPros;
    this.mobUsers = this.userStore.getMobs;
    console.log(mobUsers)
  },
  computed(){
    this.proUsers = this.userStore.getPros;
    this.mobUsers = this.userStore.getMobs;
  },
  methods:{
    async visitUser(email){
      localStorage.setItem("userEmail",email );
      this.$emit("toUserEvents", {closeAccount: true})
      
    },
    async modifUserAccount(email){
      await this.userStore.fetchUserAccount(email)
      this.userAccount = this.userStore.getAccount;
      this.modifAccount = true;
    },
    async closingModal(isTrue){
      this.deletePopUp = isTrue.toClose
      const email = localStorage.getItem("accountMail")
      await this.userStore.getProUsers(email);
      await this.userStore.getMobUsers(email);
      this.proUsers = this.userStore.getPros;
      this.mobUsers = this.userStore.getMobs;
    },
    async closeWindow(isTrue){
      const email = localStorage.getItem("accountMail")
      this.modifAccount = isTrue.toClose
      await this.userStore.getProUsers(email);
      await this.userStore.getMobUsers(email);
      this.proUsers = this.userStore.getPros;
      this.mobUsers = this.userStore.getMobs;
    },
    async setDeleteUser(email){
      await this.userStore.fetchUserAccount(email)
      this.userAccount = this.userStore.getAccount;
      this.deletePopUp = true
      },
      async deleteUser(){
        const email = localStorage.getItem("accountMail")
        await this.userStore.deleteUser(this.userAccount.user._id);
        await this.userStore.getProUsers(email);
        await this.userStore.getMobUsers(email);
        this.proUsers = this.userStore.getPros;
        this.mobUsers = this.userStore.getMobs;
        this.deletePopUp = false
      },
      async datafilter(){
        
      }

  }
  
}
</script>

<template>
  <div v-if="deletePopUp === true" class="container" ></div>
  <div v-if="modifAccount === false" class="allUsers_container">
    <div class="users_container">
      <div class="users_title">Diffuseurs / Annonceurs</div>
      <div class="searchBar">
        <input type="text" v-model="difFilter" placeholder="Rechercher un événements ">
        <button>&#x1F50E; Rechercher </button>
      </div>
      <div class="mobile_users">

   

        <div class="user_item" v-for="proUser in proUsers" :key="proUser">
          <div class="user_description-container">
            <div class="user_description-infos">
              <div class="user_id_box">
                <div class="user_id">id : {{ proUser._id }}</div>
                <div class="account_admin-img_box">
                  <img class="account_admin-img" src="@/assets/admin-visit.png" alt="" @click="visitUser(proUser.email)">
                </div>
               
              </div>
              <div class="user_names-box">
                <div class="user_Lastname">Nom: {{ proUser.brandName}}</div>
              <div class="username">Prénom: {{ proUser.firstname}}</div>
              </div>
              <div class="user_adress">addresse: {{ proUser.streetAddress }}</div>
              <div class="user_adress-infos">
                <span class="zip">CP: {{ proUser.city }}</span>
                <span class="city">Ville: {{ proUser.zip }}</span>
              </div>
            </div>
           
            <div class="user_description-actions">
              <div class="user_tel">Tel: {{ proUser.tel }}</div>
              <div class="button-box">
                <div class="action-btn" @click="modifUserAccount(proUser.email)">Modifier</div>
                <div class="action-btn" @click="setDeleteUser(proUser.email)">Supprimer</div>
              </div>
            </div> 
          </div>
        </div>
      </div>
      
    </div>
    <div class="users_container">
      <div class="users_title">Utilisateurs mobile enregistrés</div>
      <div class="searchBar">
        <input type="text" v-model="userFilter" placeholder="Rechercher un événements ">
        <button>&#x1F50E; Rechercher </button>
      </div>
      <div class="mobile_users">
        <div class="user_item" v-for="mobuser in mobUsers" :key="mobuser" >
          <div class="user_description-container" v-if="mobuser.admin === false">
            <div class="user_description-infos">
              <div class="user_id_box">
                <div class="user_id">id : {{ mobuser._id }}</div>
                <div class="account_admin-img_box">
                  <img class="account_admin-img" src="@/assets/admin-visit.png" alt="" @click="visitUser(mobuser.email)">
                </div>
               
              </div>
              <div class="user_names-box">
                <div class="user_Lastname">Nom: {{ mobuser.lastname }}</div>
              <div class="username">Prénom: {{ mobuser.firstname }}</div>
              </div>
              <div class="user_adress">addresse: {{mobuser.streetAddress}}</div>
              <div class="user_adress-infos">
                <span class="zip">CP: {{mobuser.zip}}</span>
                <span class="city">Ville: {{ mobuser.city }}</span>
              </div>
            </div>
           
            <div class="user_description-actions">
              <div class="user_tel">Tel: {{ mobuser.phoneNumber }}</div>
              <div class="button-box">
                <div class="action-btn" @click="modifUserAccount(mobuser.email)">Modifier</div>
                <div class="action-btn" @click="setDeleteUser(mobuser.email)">Supprimer</div>
              </div>
            </div> 
          </div>
        </div>
      </div>
    </div>
   
  </div>
  <div v-if="deletePopUp === true" >
    <div class="deletePopUp_container">
      <div class="deletePopUp_title">Êtes vous sur de vouloir effectuer cette suppression</div>
      <div class="deletePopUp-buttons">
        <button class="deletePopupBtn" @click="deleteUser()">Oui</button>
        <button class="deletePopupBtn" @click="deletePopUp = false">Retour</button>
      </div>
    </div>
  </div>
 <Account @closeWin="closeWindow" v-if="(modifAccount == true)" :user-account="userAccount"  />
</template>"



<style lang="css" scoped>
.allUsers_container{
  margin-left: 1rem;
  width: 78%;
  height: 95vh;

  border-radius: 0.5rem;
  display: flex;
  justify-content:space-around;
  
}
.users_container, .stats_container{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 45%;
  margin-inline: 1rem
}
.user_description-container{
  width: 100%;
}
.users_title, .stats-title{
  margin-top: 1rem;
  font-size:1.5rem;
  font-weight: bold;
  color: black;
}
.mobile_users, .stats{
  margin-top: 0.8rem;
  padding-top: 0.8rem;
  width: 100%;
  height: 95%;
  background-color: white;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  scrollbar-width: thin;
}
.users{
  padding-top: 0.5rem;
  flex-direction: column;
  justify-content: space-around;
 
}
.stats{
  height: 85%;
  margin-top: 1rem;
  justify-content:space-around;
  flex-wrap: wrap;
}
.user_item{
  height: 10vw;
  width: 95%;
  margin-bottom: 0.5rem;
  background-color: #2D739E;
  display: flex;
  justify-content: start;
  align-items:center;
  padding-left: 0.5rem;
  border-radius:0.5rem;
}

.stats_bloc{
  width: 13rem;
  height: 13rem;
  background-color: var(--primary);
  display: flex;
  flex-direction: column;
  align-items:center;
}
.stat_title{
  padding: 1rem 0 3rem 0;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;;
}
.user_names-box{
  display: flex;
}
.username{
  margin-left: 1rem;
}
.stat{
 
  color: white;
  font-weight: bold;
  font-size: 2.5rem;;
}
.city, .zip, .user_description-title, .user_description-text{
  color: white;
}
.user_description-title{
  height: 2rem;
  font-size: 1.2rem;
  font-weight: bold;
}
.user_adress-infos{
  display: flex;
}
.city, .zip {
  display: block;
}
.zip{
  margin-right: 1rem
}
.user_description-actions{
  width: 100%;
  display: flex;
  justify-content:space-between;
  align-items:center;
  margin-top:0.3rem;
  margin-bottom: 1rem;
}
.button-box{
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
input:focus::placeholder {
  color:   transparent;
}
.searchBar button{
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size:0.8rem;
  width: 25%;
  margin: 0;
  border-top-right-radius:0.5rem;
  border-bottom-right-radius:0.5rem;
  background-color: var(--primary);
  border: 2px solid white;
  color: white;
 
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
.container{
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: black;
  z-index: 0;
  opacity: 0.8;
  overflow: hidden;
}
.deletePopUp_container{
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
.account_admin-img{
  width: 1.8vw;
  display: block;
  padding-right:0.5vw;
  cursor: pointer;
}

.user_id_box{
  display: flex;
  justify-content:space-between;
  align-items: center;
  padding-top:1.5vw;
}
@media screen and (max-width: 1000px) {
  .allUsers_container{
    flex-direction: column;
    height: auto;
    width: 90%;
    margin:0
  }
  .users_container{
    width: 100%;
    margin:0
  }
  .mobile_users{
    margin-bottom:1rem;
  }
  .searchBar{
    height: 3rem
  }
}

</style>