<template>
  <v-row align="center" justify="center">
    <v-stepper v-model="el" width="500">
      <v-stepper-header>
        <v-stepper-step step="1">Använder info</v-stepper-step>
        <v-stepper-step step="2">Bekräft använder</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card width="500">
            <v-card-title>Sign up</v-card-title>
            <v-card-text>
              <v-text-field prepend-icon="mdi-account-circle" label="Email" v-model="Username" />
              <v-text-field
                prepend-icon="mdi-lock"
                :type="!showPassword ? 'password' : 'text'"
                label="Password"
                v-model="Password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                autocomplete="new-password"
              />
              <v-text-field
                prepend-icon="mdi-lock"
                :type="!showPassword2 ? 'password' : 'text'"
                label="Gentag Password"
                v-model="password2"
                :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword2 = !showPassword2"
                autocomplete="new-password"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="createUser">Ok</v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-card width="500">
            <v-card-title>Verification code</v-card-title>
            <v-card-text>
              <v-text-field
                prepend-icon="mdi-account-circle"
                label="Bräftelse"
                v-model="confirmationCode"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="sendVerificationCode">Ok</v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-row>
</template>

<script>
import router from "../router";
export default {
  data() {
    return {
      Username: "casper.sndergaard@gmail.com",
      Password: "test1234",
      password2: "",
      showPassword: false,
      showPassword2: false,
      confirmationCode: "",
      el: 1
    };
  },
  methods: {
    async createUser() {
      const { Password, Username } = this;
      await this.$store.dispatch("registerUser", { Username, Password });
      this.el = 2;
    },
    async sendVerificationCode() {
      const { confirmationCode, Password, Username } = this;
      await this.$store.dispatch("confirmUserRegistration", {
        confirmationCode,
        Username
      });
      const user = await this.$store.dispatch("login", { Username, Password });

      router.push({ name: "readingStatus" });
    }
  }
};
</script>

<style></style>
