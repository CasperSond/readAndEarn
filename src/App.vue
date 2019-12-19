<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link :to="{name: 'readingStatus'}">
          <v-list-item-action>
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Gemte læsninger</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{name: 'earning'}">
          <v-list-item-action>
            <v-icon>mdi-cash-100</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Penge tjent</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{name: 'timer'}">
          <v-list-item-action>
            <v-icon>mdi-timer</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Læse timer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Läs MER</v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="mr-4">{{$store.getters.getEmail}}</div>
      <v-btn v-if="!$store.state.Cognito.sessionValid" link to="/login">
        Log på
        <v-icon>mdi-lock-outline</v-icon>
      </v-btn>
      <v-btn v-else @click="signOut">
        Log ud
        <v-icon>mdi-lock-open-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container>
        <router-view />
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import router from "./router";
export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null
  }),
  async created() {
    this.$vuetify.theme.dark = true;
    try {
      const session = await this.$store.dispatch("getSession");
      const attributes = await this.$store.dispatch("getUserAttributes");
      if (router.currentRoute.path === "/") {
        router.push({ name: "readingStatus" });
      }
    } catch (err) {
      console.log(err);
      router.push({ name: "login" });
    }
  },
  methods: {
    signOut() {
      this.$store.dispatch("signout");
      router.push({ name: "login" });
    }
  }
};
</script>
