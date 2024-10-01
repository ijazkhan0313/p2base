<script>
import { useUserStore } from '@/stores/users';
import InvoiceModel from '@/components/user_space/Invoice.vue';
import moment from 'moment';

  export default{
    components:{
      InvoiceModel
    },
    props:{ userAccount: Object},
    setup(){
      const userStore = useUserStore();
      const store =  userStore.getStatus

      return { store, userStore }
    },
    data() {
  return {
    accountMessage: false,
    brandName: '',
    firstname: '',
    lastname: '',
    siret: '',
    phone: '',
    streetAddress: '',
    city: '',
    zip: '',
    webSite: '',
    invoicesBox: false,
    invoiceDetails: false,
    invoices:null,
    invoiceInfos: null,
    }
  },
    async mounted() {
        const userEmail = localStorage.getItem('userEmail');
         const userInfos = await this.userStore.fetchUserAccount(userEmail);
        this.invoices = await this.userStore.getUserInvoices(userEmail);
  if (userInfos) {
    this.brandName = userInfos.user.brandName;
    this.firstname = userInfos.user.firstname;
    this.lastname = userInfos.user.lastname;
    this.siret = userInfos.user.siret;
    this.phone = userInfos.user.phoneNumber;
    this.streetAddress = userInfos.user.streetAddress;
    this.city = userInfos.user.city;
    this.zip = userInfos.user.zipCode;
    this.webSite = userInfos.user.webSite;
    this.phone = userInfos.user.phoneNumber;
  } else {
    this.brandName = this.userAccount.user.brandName;
    this.firstname = this.userAccount.user.firstname;
    this.lastname = this.userAccount.user.lastname;
    this.siret = this.userAccount.user.siret;
    this.phone = this.userAccount.user.phoneNumber;
    this.streetAddress = this.userAccount.user.streetAddress;
    this.city = this.userAccount.user.city;
    this.zip = this.userAccount.user.zipCode;
    this.phone = this.userAccount.user.phoneNumber;
    this.webSite = this.userAccount.user.webSite;
  }
},
    methods: {
      formatOrderDate(date) {
      return moment(date).format('DD-MM-YYYY');
    },
      closeWindow(){
        this.$emit("closeWin", {toClose:false})
      },
      async updateUser() {
        let user;
        const userEmail = localStorage.getItem("userEmail")
        const userData = await this.userStore.fetchUserAccount(userEmail);
        user = {
          brandName: this.brandName,
          firstname: this.firstname,
          lastname: this.lastname,
          phone: this.phone,
          adress: this.streetAddress,
          city: this.city,
          zip: this.zip,
          webSite: this.webSite,
        };
        if (this.store !== null) {
          await this.userStore.updateUser(this.userAccount.user._id, user);
          this.accountMessage = true;
          this.$emit("closeWin", { toClose: false });
        } else {
          await this.userStore.updateUser(userData.user._id, user);
        
        }
          this.brandName = user.brandName;
          this.firstname = user.firstname;
          this.lastname = user.lastname;
          this.siret = user.siret;
          this.phone = user.phone;
          this.streetAddress = user.adress;
          this.city = user.city;
          this.zip = user.zip;
          this.webSite = user.webSite;
          this.accountMessage = true;
      },
      invoiceDisplay(invoiceData){
        this.invoiceDetails = true
        const userData = {
          brandName : this.brandName,
          adress: this.streetAddress,
          zip: this.zip,
          city: this.city,
        }
        this.invoiceInfos =[ invoiceData, userData]
      }
    },
   
  }
</script>

<template>
     <img class="arrow" src="@/assets/left_arrow.png" alt="" v-if="invoiceDetails === true "  @click="invoiceDetails = false">
   <div class="account_container" v-if="invoiceDetails === false">
    <div class="account_infos-container" v-if="invoicesBox === false">
      <div class="account_infos-title" v-if="!this.store"> Mes coordonnées de facturation</div>
      <div class="account_infos-title" v-else> Modifications de compte utilisateurs</div>
      <div v-if="accountMessage === true" class="updateAccountConf">Compte mise à jour avec succès</div>
      <div class="account_infos-field-container">
        <div class="account_infos-field-box">
        <div v-if="userStore.type === 2" class="account_infos-field">Dénominations social</div>
        <div v-else class="account_infos-field">Identification de la structure / société, assocaition ou autre</div>
      <input type="text" v-model="brandName">
      </div>
      
      <div class="account_infos-field-box">
        <div class="account_infos-field">Nom</div>
        <input  type="text" v-model="lastname">
        
      </div>
      <div class="account_infos-field-box">
        <div class="account_infos-field">Prénom</div>
        <input  type="text" v-model="firstname">
       
      </div>
      <div class="account_infos-field-box">
        <div class="account_infos-field">Adresse 🏠</div>
        <input type="text" v-model="streetAddress">
      </div>
      <div class="account_infos-field-box">
        <div class="account_infos-field">Code postal 🔍</div>
        <input  type="text" v-model="zip">
      </div>
      <div class="account_infos-field-box">
        <div class="account_infos-field">Ville</div>
        <input  type="text" v-model="city">
      </div>
      <div class="account_infos-field-box">
        <div class="account_infos-field">Téléphone 📱 </div>
        <input  type="text" v-model="phone">
      </div>
      <div class="account_infos-field-box">
        <div class="account_infos-field">Site Web (facultatif) 🌐</div>
        <input type="text" v-model="webSite">
      </div>
      </div>
      <div class="btn_container">
        <button @click="invoicesBox = true">Mes factures 🗂</button>
        <div>
          <button @click="updateUser">Valider</button>
          <button @click="closeWindow" class="undo">Annuler</button>
        </div>
      </div>
    </div> 
    <div class="invoice_container" v-if="invoicesBox === true && invoiceDetails ===  false ">
      <div class="invoice_title">
        <img class="arrow_blue" src="@/assets/left_arrow_blue.png" alt=""  @click="invoicesBox = false">
        <span>Mes factures</span>
        <span></span>
        </div>
      <div class="invoice_subs">
        <span class="inv_subtitle" >Numéro</span>
        <span class="inv_subtitle" >Date</span>
        <span class="inv_subtitle" >Objet</span>
        <span class="inv_subtitle" >Montant</span>
        <span class="inv_subtitle" >Visualiser</span>
      </div>
      <div class="invoice_box" v-if="invoiceDetails === false">
        <div class="invoice" v-for="invoice in invoices" :key="invoice.id">
            <span class="invoice_infos">{{ invoice.invoiceNbre }}</span>
            <span class="invoice_infos">{{ formatOrderDate(invoice.orderDate) }}</span>
            <span class="invoice_infos">{{ invoice.invoiceObject }}</span>
            <span class="invoice_infos">{{ invoice.amountOrderWT }}</span>
            <span class="invoice_infos">
              <img class="download" src="@/assets/eye.png" alt="" @click="invoiceDisplay(invoice)">
            </span>
        </div>
      </div>

  </div>
     <InvoiceModel :invoiceData="invoiceInfos" v-if="invoiceDetails === true"/>
  </div>


</template>

<style lang="css" scoped>

.account_container{
  width: 79%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center
}
.account_infos-container, .invoice_container{
  margin-left: 1rem;
  width: 100%;
  height: 95%;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;


  border-radius: 0.5rem;
}
.account_infos-field-container{
  border-radius: 0.5rem;
  padding: 1rem;
  width: 95%;
  background-color: #efefef;
}
.account_infos-title, .invoice_title{
  padding:1rem;
  font-size:2rem;
  font-weight: bold;
  color: #2D739E;
}
.invoice_title{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.account_infos-field-box{
  padding-left: 1rem;
  padding-block: 0.9rem;
  display: flex;
  justify-content: space-between;
}
.account_infos-field{
  color: black;
  font-size: 18px;

  text-transform: uppercase;
}
.btn_container{
  padding-inline:1rem;
  height: 3rem;
  width: 95%;
  display: flex;
  justify-content:space-between;
  align-items: center;
}
.undo{
  margin-left: 1rem;
}
button{
  padding-inline: 2rem;
  padding-block: 0.5rem;
  color: white;
  background-color:#2D739E;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

input{
  text-align: end;
  padding: 0.3rem;
  width: 15rem;
  background-color:white;
  color: lightgrey;
  border: 1px solid gray;
  border-radius: 0.5rem;
  font-size: 1.2rem;
}
.updateAccountConf{
  color: lightgreen;
  font-size: 1.2rem;
}
.invoice_box{
  width: 90%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
  margin-top: 0.5rem;
}
.invoice_subs{
  width: 90%;
  color: #2D739E;
  display: flex;
  justify-content:space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid #2D739E;
}
.inv_subtitle{
  text-align: center;
  width: 20%;
}
.invoice{
  color: black;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block: 0.5rem;
  border-bottom: 1px solid #2D739E;
  padding-block: 0.5rem;

}
.download{
  width: 1.5rem;
  cursor: pointer;
}
.invoice_infos{
  text-align: center;
  width: 20%;
}
.arrow{
    width:2rem;
    cursor: pointer;
    margin-left:10rem
}
.arrow_blue{
  height:1.5rem;
  margin-left: 3rem;
  cursor: pointer;
}
@media screen and (max-width: 1000px) {
  .account_container{
    width: 90%;
    height: 65vh;
    padding-bottom: 3rem;
    background-color: #2D739E;
  }
  .account_infos-container{
    height: auto;
    padding-bottom: 3rem;
    margin: 0;
  }
  button{
    color:white;
  background-color:#2D739E;
  }
}
</style>