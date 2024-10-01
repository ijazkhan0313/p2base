<script >
   import { useRouter } from 'vue-router';
   import { useUserStore } from '@/stores/users';
   import MobilePage from '@/components/MobilePage.vue';

  
  export default{
    name: "home",
    setup(){
      const userStore = useUserStore();
      const router = useRouter();
      return { userStore, router }
    },
    components:{
      MobilePage
    },
    data(){
      return{
        passwordFieldType: 'password',
        newPwd:"",
        newPwdConfirm:"",
        signupError: false,
        signupErrorMessage:"",
        signinError:false,
        signinErrorMessage:"",
        token: "",
      }
    },
    mounted(){
        const urlParams = new URLSearchParams(window.location.search);
        this.token = urlParams.get('token') || '';
    },
    methods: {
        resetPwd(){
            if (this.newPwd !== this.newPwdConfirm) {
                this.signupError = true;
                this.signupErrorMessage = "Les mots de passe ne correspondent pas.";
                return;
             }
            this.userStore.resetPwd(this.newPwd, this.token)
            this.router.push('/')
        },
        showPassword () {
            this.isShowingPassword = true;
            this.passwordFieldType = 'text';
        },
        hidePassword(){
            this.isShowingPassword = false;
            this.passwordFieldType = 'password';
        } 
    }
}
</script>

<template>
  <main>
    <div class="container">
      <div class="logo_container">
        <img class= "logo" src="@/assets/logo_place2be.jpg" alt="logo place2be">
        <div class="form_input">
            <label for="password">Nouveau mot de passe</label>
            <input class="mdp_input"  :type="passwordFieldType"  v-model="newPwd">
            <img class="eye_icon" src="@/assets/eye.png" alt=""
                            @mousedown="showPassword" 
                            @mouseup="hidePassword" 
                            @mouseleave="hidePassword">
          </div>
          <div class="form_input">
            <label for="password-confirm">Confirmation de mot de passe</label>
            <input class="mdp_input"  :type="passwordFieldType" v-model="newPwdConfirm" >
            <img class="eye_icon" src="@/assets/eye.png" alt=""
                            @mousedown="showPassword" 
                            @mouseup="hidePassword" 
                            @mouseleave="hidePassword">
          </div>
          <div v-if="signupError" class="error_message">{{ signupErrorMessage }}</div>
          <button class="btn_signup" @click.prevent="resetPwd">Enregistrer</button>
            <div class="utils_links">
            <a href="www.place2be.fr/policy">politique de confidentialité</a>
            </div>
        </div>
    </div>
  </main>
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
.btn_signup{ 
  height: 8vh;
  align-self: center;
  color: #FFFF;
  font-family: 'roboto', sans-serif;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
}
.btn_signup{
  margin-top: 2rem;
  width: 15vw;
  background-color: var(--primary);
  font-size:1.2rem;
}
.eye_icon{
    position: absolute;
    top:50%;
    right: 0.8vw;
    width: 2rem;
    cursor: pointer;
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
.login_form{
  width: 100%;
  display: block;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem;
}

.form_input{
    position: relative;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: start;
}
label{ 
  padding-block: 0.5rem;
  color: black;
  
}
 .mdp_input {
  width: 85%;
  height: 3rem;
  border:1px solid var(--primary);
  border-radius: 0.5rem;
  text-indent: 0.5rem;
  color: black;
  font-size: 1.5rem;
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


@media screen and (max-width: 700px) {
  .container{
    display: none;
  }
}
</style>
