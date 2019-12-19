<template>
  <div>
    <v-row justify="center">
      <counter-view :ms="total"></counter-view>
    </v-row>
    <v-row justify="center">
      <v-btn text x-large @click="counterAction">
        <v-icon x-large>{{togglePlayIcon}}</v-icon>
      </v-btn>
      <v-btn text x-large @click="dialog = true">
        <v-icon x-large>mdi-cloud-upload-outline</v-icon>
      </v-btn>
    </v-row>
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>Upload</v-card-title>
        <v-card-text>
          <v-text-field outlined label="Tid læst" disabled :value="timeRead" />
          <v-text-field v-model="book" outlined label="Bog/blad læst" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small text @click="dialog = false">Avbryt</v-btn>
          <v-btn @click="upload">Upload</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CounterView from "./CounterView";
import router from "../router";
export default {
  components: {
    CounterView
  },
  data() {
    return {
      init: 0,
      total: 0,
      running: false,
      refInt: null,
      dialog: false,
      book: "",
      date: "",

      readDate: ""
    };
  },
  methods: {
    update() {
      this.total += this.count;
    },
    start() {
      this.init = new Date().getTime();
      this.running = true;
      this.refInt = setInterval(this.update, 1000);
    },
    pause() {
      this.total += this.count;
      clearInterval(this.refInt);
      this.running = false;
    },
    stop() {},
    async upload() {
      const t = this.getTime,
        hours = t.hours,
        minutes = t.minutes,
        book = this.book,
        readDate = new Date().toISOString().slice(0, 10);

      await this.$store.dispatch("reportReadTime", {
        hours,
        minutes,
        book,
        readDate
      });

      this.dialog = false;
      router.push({ name: "earning" });
    },

    counterAction() {
      this.running ? this.pause() : this.start();
    }
  },
  computed: {
    getTime() {
      const ms = this.total,
        sec = ms / 1000,
        seconds = Math.floor(sec % 60),
        minutes = Math.floor((sec / 60) % 60),
        hours = Math.floor((sec / 3600) % 60);

      return {
        hours,
        minutes,
        seconds
      };
    },
    timeRead() {
      const t = this.getTime;
      return `${t.hours} timer og ${
        t.minutes
      } min den ${new Date().toUTCString()}`;
    },
    count() {
      return new Date().getTime() - this.init;
    },
    togglePlayIcon() {
      return !this.running
        ? "mdi-play-circle-outline"
        : "mdi-pause-circle-outline";
    }
  }
};
</script>

<style>
</style>