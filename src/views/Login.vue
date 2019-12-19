<template>
  <v-row align="center" justify="center">
    <v-card width="500">
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-text-field prepend-icon="mdi-account-circle" label="Brugernavn" v-model="Username" />
        <v-text-field
          prepend-icon="mdi-lock"
          :type="showPassword ? 'password' : 'text'"
          label="Password"
          v-model="Password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn link text small to="/new-user">Ny användare</v-btn>

        <v-btn color="primary" @click="login">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-row>
</template>

<script>
import router from "../router";
export default {
  data() {
    return {
      Username: "",
      Password: "",
      showPassword: false
    };
  },
  async created() {
    try {
      const validSession = await this.$store.dispatch("getSession");
      this.navToLogin();
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    async login() {
      const { Password, Username } = this;
      const user = await this.$store.dispatch("login", { Password, Username });

      this.navToLogin();
    },
    async navToLogin() {
      try {
        const session = await this.$store.dispatch("getSession");
        const attributes = await this.$store.dispatch("getUserAttributes");
        router.push({ name: "readingStatus" });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style></style>
