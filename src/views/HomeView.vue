<script >
   import router from '@/router';
   import { useUserStore } from '@/stores/users';
   import MobilePage from '@/components/MobilePage.vue';

  
  export default{
    name: "home",
    setup(){
      const userStore = useUserStore();
      return { userStore }
    },
    components:{
      MobilePage
    },
    data(){
      return{
        passwordFieldType: 'password',
        connexion_popUp: false,
        signupPage: false,
        loginPage: true,
        advertiser: false,
        diffuser: false,
        userProfilChoice: true,
        signupForm: false,
        signupDone: false,
        email:"",
        pwd:"",
        brandName:"",
        newEmail:"",
        newPwd:"",
        newPwdConfirm:"",
        siret:"",
        phone:"",
        adress:"",
        city:"",
        zip:"",
        userEmailField:"email",
        passwordField:"pwd",
        signupError: false,
        signupErrorMessage:"",
        signinError:false,
        signinErrorMessage:"",
        resetpwdinput: false,
        resetPwdConf: false

      }
    },
    methods: {
      showPassword () {
            this.isShowingPassword = true;
            this.passwordFieldType = 'text';
        },
        hidePassword(){
            this.isShowingPassword = false;
            this.passwordFieldType = 'password';
        }, 
      sendReset(){
        this.userStore.sendResetReq(this.email)
        this.resetPwdConf = true
      },
      openPopup(){
        this.connexion_popUp = true;
      },
      openChoicePage(){
        this.loginPage = false;
        this.userProfilChoice = true;
      },
      openSignupPage(choice){
        console.log(choice);
      let userType;
      if(choice == 1){
        this.diffuser = true;
        this.advertiser = false;
      }else{
        this.diffuser = false;
        this.advertiser = true;
      }
      this.userProfilChoice = false;
      this.signupPage = true;
      this.signupForm = true;
    },
    openLoginPage(){
      this.signupPage = false;
      this.loginPage = true;
    },
    // login(){
    //   router.push({name: "dashboard"});
    // },
    async signup(){
      if (this.newEmail === "" || this.newPwd === "" || this.newPwdConfirm === "") {
        this.signupError = true;
        this.signupErrorMessage = "Veuillez remplir tous les champs.";
        return;
      }
      if (this.newPwd !== this.newPwdConfirm) {
        this.signupError = true;
        this.signupErrorMessage = "Les mots de passe ne correspondent pas.";
        return;
      }
      const data = {
        diffuser:this.diffuser,
        advertiser: this.advertiser,
        brandName: this.brandName,
        email : this.newEmail, 
        pwd : this.newPwd,
        siret : this.siret,
        phone: this.phone,
        adress: this.adress,
        city: this.city,
        zip: this.zip
      }
      console.log(data);
      await this.userStore.signUp(data);
      this.connexion_popUp = false;
      this.signupDone = true;
    },
    toggleEntity(){
      const association = document.getElementById("association_link");
      const entreprise = document.getElementById("entreprise_link");
      if(this.isEntreprise == true){
        this.isEntreprise = false;
        this.isAssociation = true;
        association.classList.add("active");
        entreprise.classList.remove("active");
      }else{
        this.isEntreprise = true;
        this.isAssociation = false;
        entreprise.classList.add("active");
        association.classList.remove("active");
      }
    },
    async login() {
      if (this.email === "" || this.pwd === "") {
        this.signinError = true;
        this.signinErrorMessage = "Veuillez remplir tous les champs.";
        return;
      }
       await this.userStore.signIn(this.email, this.pwd);
       this.signinError = true;
       this.signinErrorMessage = await this.userStore.loginError
      }
    }
  }
</script>

<template>
  <main>
    <div class="container">
      <img class="connexion_icon" src="@/assets/account.png" alt="compte place2be" @click="openPopup">
      <div class="logo_container">
        <img class= "logo" src="@/assets/logo_place2be.jpg" alt="logo place2be">
        <div class="utils_links">
      <a href="www.place2be.fr/policy">politique de confidentialité</a>
    </div>
      </div>
    </div>
    <div id="popUp_container" v-if="connexion_popUp === true" >
      <div class="closeDiv">
        <img class="close_icon" src="@/assets/close.png" alt="compte place2be" @click="connexion_popUp = false" />
      </div>
      <img class="account_icon" src="@/assets/account.png" alt="compte place2be">
      <div v-if="signupPage == false && loginPage == true" class="login_container">
        <form class="login_form">
          <div class="form_input" v-if="resetpwdinput === false">
            <label for="email">Email</label>
            <input type="email" v-model="email" :name="email" :autocomplete="email" >
          </div>
          <div class="form_input" v-if="resetpwdinput === true">
            <label for="email">Renseigner votre email</label>
            <input type="email" v-model="email" :name="email" :autocomplete="email" >
          </div>
          <div class="form_input" v-if="resetpwdinput === false">
            <label for="password">Mot de passe</label>
            <input :type="passwordFieldType" v-model="pwd" :name="pwd" :autocomplete="pwd" >
            <img class="eye_icon" src="@/assets/eye.png" alt=""
                            @mousedown="showPassword" 
                            @mouseup="hidePassword" 
                            @mouseleave="hidePassword">
          </div>
          <div class="btn_box" v-if="resetpwdinput === false">
            <button class="btn_login" @click.prevent="login()">Connexion</button>
            <button class="btn_login" @click.prevent="openChoicePage()"> Créer un compte</button>
          </div>
          <div class="btn_box" v-else>
            <button class="btn_login" @click.prevent="resetpwdinput = false"> Retour</button>
            <button class="btn_login" @click.prevent="sendReset">Envoyer</button>
          </div>
          <div class="signup-link_container" v-if="resetpwdinput === false">
            <span class="signup_link" @click.prevent="resetpwdinput = true">Mot de passe oublié ?</span>
          </div>
          <div v-if="signinError" class="error_message">{{ signinErrorMessage }}</div>
        </form>
      </div>
      <div>
        <div class="entityChoice" v-if="userProfilChoice == true && loginPage == false">
          <div class="entityChoice_title">Je suis</div>
          <div class="entityChoice_btn">
            <div @click="openSignupPage(1)" class="btn_choice" >Annonceur</div>
            <div @click="openSignupPage(2)" class="btn_choice">Diffuseur</div>
          </div>
         
        </div>
      </div>
      <div v-if="signupPage == true" class="signup_container">
        <form class="signup_form" v-if="signupForm == true">
          <div v-if="diffuser == true" class="form_input">
              <label for="name">Email</label>
              <input class="com_input" type="email" v-model="newEmail" >
            </div>
            <div v-if="advertiser == true" class="form_input">
              <label for="email">Email</label>
              <input class="com_input" type="email" v-model="newEmail">
            </div>
          <div class="form_input">
            <label for="password">Mot de passe</label>
            <input class="mdp_input" :type="passwordFieldType" v-model="newPwd">
            <img class="eye_icon" src="@/assets/eye.png" alt=""
                            @mousedown="showPassword" 
                            @mouseup="hidePassword" 
                            @mouseleave="hidePassword">
          </div>
          <div class="form_input">
            <label for="password-confirm">Confirmation de mot de passe</label>
            <input class="mdp_input" :type="passwordFieldType" v-model="newPwdConfirm" >
            <img class="eye_icon" src="@/assets/eye.png" alt=""
                            @mousedown="showPassword" 
                            @mouseup="hidePassword" 
                            @mouseleave="hidePassword">
          </div>
          <button class="btn_signup" @click.prevent="signup()">Connexion</button>
          <div class="signup-link_container">
            <span> Déjà un compte ? </span>
            <span class="signup_link" @click.prevent="openLoginPage()"> Se connecter</span>
          </div>
          <div v-if="signupError" class="error_message">{{ signupErrorMessage }}</div>
        </form>
      </div>
    </div>
    <div v-if="signupDone == true" class="account_popUp">
      <span>Consulter vos emails pour valider votre compte</span>
      <button @click="signupDone = false" class="popUp_btn">Ok</button>
    </div>
    
  </main>
  <div v-if="resetPwdConf === true" class="container_popUp" ></div>
  <div v-if="resetPwdConf === true" >
   <div class="resetPwdPopUp_container">
     <div class="resetPwdPopUp_title">Une demande de renouvellement de mot de passe vous a été envoyée sur votre boîte mail</div>
     <div class="resetPwdPopUp-buttons">
       <button class="resetPwdPopUpBtn" @click="resetPwdConf = false">Retour</button>
     </div>
   </div>
 </div>
  <MobilePage/>
</template>

<style scoped>

main{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.container {
  position: relative;
  display: block;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width:100%;
  height: 100%;

}
.logo{
  display: block;
  object-fit: contain;
  width: 80vw;
  height: 20rem;

}
.logo_container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.home_btn, .btn_login, .btn_signup, .btn_choice { 
  height: 8vh;
  align-self: center;
  color: #FFFF;
  font-family: 'roboto', sans-serif;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;

}
.home_btn{
  margin-top: 5rem;
  padding-block: 1.5rem;
  padding-inline: 2rem;
  display: flex;
  justify-content:center;
  align-items: center;
  background-color: var(--primary);
  color:white;
  font-size: 1.5rem;
}

.btn_login, .btn_signup, .btn_choice{
  margin-top: 2rem;
  width: 15vw;
  background-color: var(--primary);
  font-size:1.2rem;
}

.btn_choice{
  width: 15vw;
  display: flex;
    justify-content: center;
    align-items: center;
}

#popUp_container{
  display:none;
  position: absolute;
  top:0;
  right: 0;
  width: 38vw;
  height:100vh;
  background-color:#FFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: black;
  border-left: 1px solid var(--primary);
}
.account_icon{
  padding-top: 5rem;
  width: 8.5rem;
}
.login_container, .signup_container{
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.entityChoice{
  margin-top: 10rem;
  height: 50vh;

}

.entityChoice_title{
  width: 100%;
  text-align: center;
  font-size: 1.2rem;
}


#entreprise_link, #association_link{
  cursor: pointer;
}
#entreprise_link:hover, #association_link:hover{
  color: var(--primary);
}
.active{
  color: var(--primary);
}


.login_form, .signup_form{
  width: 100%;
  display: block;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem;
}
.login_form{
  margin-top: 3rem;
}
.form_input{
  position: relative;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: start;
  
  
  
}
label{ 
  padding-block: 0.5rem;
  
}
.login_form input{
  width: 99%;
  height: 3rem;
  border:1px solid var(--primary);
  border-radius: 0.5rem;
  text-indent: 0.5rem;
  color: black;
  font-size: 1.2rem;
}
.com_input, .adresse_input, .siret_input, .mdp_input {
  width: 100%;
  height: 3rem;
  border:1px solid var(--primary);
  border-radius: 0.5rem;
  text-indent: 0.5rem;
  color: black;
}

.signup-link_container{
  margin-top: 1rem;
  font-size: 0.9rem;;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.city_input, .email_input{
  width: 90%;
  height: 1.5rem;
  border:1px solidvar(--primary);
  border-radius: 0.5rem;
  text-indent: 0.5rem;
  color: black;
}
.signup_link{
  color: var(--primary);
  text-decoration: underline;
  cursor: pointer;
  margin-left:0.5rem;
 
}
.signup-input_section{
  width: 90%;
  display: flex;
  
}
.tel, .zip{
  width: 100%;
  height: 1.5rem;
  border:1px solid var(--primary);
  border-radius: 0.5rem;
  text-indent: 0.5rem;
  color: var(--primary);
}
.account_popUp{
  position: absolute;
  width: 40rem;
  height: 25rem;
  background-color:var(--primary);
  top: 50%;
  left:50%;
  transform: translate(-50%, -50%);
  border-radius:0.5rem;
  display: flex;
  flex-direction: column;
  justify-content:center;
  align-items: center;
  font-size:1.5rem;
  text-align: center;
}
.popUp_btn{
  width: 10rem;
  height: 2rem;
  background-color:white;
  border: none;
  border-radius: 0.5rem;
  color: var(--primary);
  margin-top: 5rem;
}
.utils_links{
  display: block;
  position: absolute;
  bottom: 0.5rem;
}
.utils_links a{
    color: var(--primary);
    font-size: 0.8rem;
  }
.error_message{
  padding-top: 2rem;
  color: red;
}
.connexion_icon{
  position: absolute;
  right: 2rem;
  top:2rem;
  width: 3rem;
  cursor: pointer;
}
.closeDiv{
  padding-block: 1rem;
  display: flex;
  justify-content:flex-start;
  width: 100%;
}
.close_icon{
  width: 1.5rem;
  margin-left: 1rem;
  cursor: pointer;
}
.btn_box{
  display: flex;
  justify-content: space-between;
  width: 90%;
}
.eye_icon{
    position: absolute;
    top:50%;
    right: 0.8vw;
    width: 2rem;
    cursor: pointer;
    }
  .resetPwdPopUp_container{
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
.container_popUp{
 position: absolute;
 top:0;
 width: 100vw;
 height: 100vh;
 background-color: black;
 z-index: 0;
 opacity: 0.8;
 overflow: hidden;
}
.resetPwdPopUp-buttons{
 width: 30rem;
 display: flex;
 justify-content:space-around;
}
.resetPwdPopUpBtn{
 border-radius: 0.5rem;
 border:none;
 width: 10rem;
 height: 2rem;
 background-color:white;
 color:var(--primary);
 cursor: pointer;
}
.resetPwdPopUp_title{
  width: 80%;
}
@media screen and (max-width: 1000px) {
  #popUp_container{
    width:100vw;
  }
  .btn_choice{
    width: 18vw;
  }
  .entityChoice{
    width: 50vw
  }
  .entityChoice_btn{
    display: flex;
    justify-content: space-between;
  }
}
@media screen and (max-width: 700px) {
  .container{
    display: none;
  }
}
</style>
