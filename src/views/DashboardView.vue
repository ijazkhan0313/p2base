<script>
import { ref, onBeforeMount, onMounted } from 'vue';
import { useUserStore } from '@/stores/users';
import { useEventStore } from '@/stores/events';
import { useRoute } from 'vue-router';

import Menu from '@/components/SideBarMenu.vue';
import AddEvent from '@/components/creation_step/AddEvent.vue';
import RecapEvent from '@/components/creation_step/RecapEvent.vue';
import MarketingSettings from '@/components/creation_step/Marketing_events.vue';
import UsersBoard from '@/components/admin_space/UsersBoard.vue';
import Account from '@/components/user_space/Account.vue';
import Administration from '@/components/admin_space/Administration.vue';
import UserEvent from '@/components/user_space/UserEvents.vue';
import GlobalEvents from '@/components/admin_space/GlobalEvents.vue';
import OrderEvent from '@/components/creation_step/OrderEvent.vue';

export default {
  components: {
    Menu,
    Account,
    Administration,
    UserEvent,
    AddEvent,
    GlobalEvents,
    RecapEvent,
    MarketingSettings,
    UsersBoard,
    OrderEvent,
  },
  data() {
    return {
      userStore: {},
      eventStore: {},
      route: {},
      activeIdLink: 1,
      eventCase: 0,
    };
  },
  beforeCreate() {
    this.userStore = useUserStore();
    this.eventStore = useEventStore();
    this.route = useRoute();
    this.userStore.checkValidatedAccount();
  },
  created() {
    this.fetchUser();
  },
  async mounted() {
    await this.fetchUser();
    if (this.$route.query.activeId) {
      this.activeIdLink = parseInt(this.route.query.activeId);
    }
  },
  computed: {
    activeIdLinkProp() {
      return this.activeIdLink;
    },
  },
  methods: {
    async fetchUser() {
      const email = localStorage.getItem('userEmail');
      const adminMail = localStorage.getItem('accountMail');
      if (adminMail) {
        await this.userStore.fetchUserInfos(adminMail);
        this.activeIdLink = 3;
        await this.userStore.fetchUserInfos(email);
      } else {
        this.activeIdLink = 1;
      }
    },
    activeValue(link) {
      this.activeIdLink = link.activeId;
      this.eventCase = 1;
    },
    eventStepValue(step) {
      console.log(step);
      if (step.value === 3) {
        this.eventCase = 3;
      }
      if (step.value === 4) {
        this.eventCase = 4;
      }
      if (step.value === 0) {
        this.activeIdLink = 1;
      }
      if (step.value === 6) {
        this.eventCase = 4;
        this.activeIdLink = 0;
      }
    },
    addEventStep() {
      this.eventCase = 5;
    },
    modifEvent(id) {
      console.log(id.activeId);
      if (id.activeId === 0) {
        this.eventCase = 1;
        this.activeIdLink = 0;
      }
      if (id.activeId === 4) {
        this.eventCase = 4;
        this.activeIdLink = 0;
      }
      if (id.activeId === 5) {
        id.eventCase = 0;
        id.activeIdLink = 5;
      }
      if (id.activeId === 1) {
        this.eventCase = 0;
        this.activeIdLink = 1;
      }
    },
    openUserEvents() {
      console.log(this.activeIdLink);
      this.activeIdLink = 1;
    },
    closeOrder() {
      this.activeIdLink = 1;
    },
  },
};
</script>






<template>
<div class="div">
  <div class="dashboard_header">
    <img class="logo" src="@/assets/logo_place2be.jpg" alt="logo place2be">
  </div>
  <div class="dashboard_container">
    <Menu @activeId="activeValue" :activeIdLink="activeIdLinkProp" />
    <AddEvent v-if="(activeIdLink === 0 && eventCase === 1)" @eventStep="eventStepValue" />
    <RecapEvent v-if="(activeIdLink === 0 && eventCase === 3)" @activeId="modifEvent" />
    <MarketingSettings v-if="(eventCase === 4 && activeIdLink === 0)" @closeMarketing="addEventStep" />
    <OrderEvent v-if="(eventCase === 5)" @orderState="eventStepValue" />
    <UserEvent v-if="(activeIdLink === 1)" @activeId="modifEvent" />
    <GlobalEvents v-if="(activeIdLink === 3)" @activeId="modifEvent" />
    <UsersBoard v-if="(activeIdLink === 4)" @toUserEvents="openUserEvents" />
    <Account v-if="(activeIdLink === 5)" />
    <Administration v-if="(activeIdLink === 6)" />
    <div class="utils_links">
      <a href="www.place2be.fr/policy">politique de confidentialité</a>
    </div>
  </div>
  </div>
</template>



<style>
.dashboard_container {
  display: flex;

}

.dashboard_header {
  display: none;
}

.utils_links {
  display: none;
}

@media screen and (max-width: 1000px) {
  .dashboard_header {
    display: block;
    display: flex;
    justify-content: center;
    height: 12vh;
  }

  .dashboard_container {
    flex-direction: column;
    padding-bottom: 0.5rem;
  }

  .utils_links {
    display: block;
    text-align: center;
  }

  .utils_links a {
    color: white;
  }
}
</style>
