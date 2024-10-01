<script>
export default {
  data() {
    return {
      banner: true, 
      bannerVisible: false, 
    };
  },
  mounted() {
    setTimeout(() => {
      this.bannerVisible = true; 
    }, 2000);
  },
};
</script>

<template>
  <div class="mobile_container">
    <!-- <div class="banner" v-if="banner" :class="{ 'slide-down': bannerVisible }">
     
    </div> -->
    <div class="logo_container">
      <img class= "logo" src="@/assets/logo_place2be.jpg" alt="logo place2be">
    </div>
    <div class="container_infos">
      <div class="banner-title"> Télécharger l'application</div>
      <div class="banner-links">
        <div class="banner-links--google">
          <a href="https://play.google.com/store/apps/details?id=com.mw.p2b_mobile">
            <img class="banner-logo" src="../assets/apple-store.png" alt="">
          </a>
        </div>
        <div class="banner-links--apple">
          <a href="https://apps.apple.com/fr/app/place2be/id6447436464">
            <img  class="banner-logo" src="../assets/google-play.png" alt="">
          </a>
        </div>
      </div>
    </div>
  </div>

</template>

<style lang="css" scoped>
 .mobile_container{
  display: none
 }

@media screen and (max-width: 700px) {
  .mobile_container{
    display: block;
    position: absolute;
    top:0;
    left:0;
    width: 100vw;
    height: 100vh;

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
p{
  color: black;
  padding-block: 1rem;
}
.container_infos{
  display: flex;
  flex-direction: column;
  padding-inline: 2rem;
  font-size: 1.2rem;
  justify-content: center;
}
}
.banner{
  width: 100%;
  background-color: black;
  padding-block: 1rem;
  transform: translateY(-100%);
  transition: transform 2s ease-out; 
}
.banner-title{
  font-size: 1.2rem;
  width: 100%;
  text-align: center;
  padding-block: 0.7rem;
  color: black;
}
.banner-links{
  text-align: center;
}
.banner-logo{
  width: 50%;
  padding-top: 3rem;
}
.banner-links--google, banner-links--apple{
  cursor: pointer;
}
.slide-down {
  transform: translateY(0); /* Position finale de l'animation */
}
</style>