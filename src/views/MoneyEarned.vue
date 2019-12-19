<template>
  <div v-if="readingSessions.length > 0">
    <h1 class="display-1 mb-5">Penge tjent</h1>

    <v-card>
      <v-card-title>Tjent til nu</v-card-title>
      <v-card-text>
        <div class="display-1">{{income | int}} kr.</div>
      </v-card-text>
    </v-card>

    <v-card class="mt-5">
      <v-card-title>Forventet</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="3">
            <div class="display-1">{{projected | int}} kr.</div>
          </v-col>
          <v-col cols="2">
            <v-text-field
              outlined
              v-model.number="remaining"
              label="Fremtidige läsninger"
              type="number"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      readingSessions: [],
      remaining: 5
    };
  },
  filters: {
    int(val) {
      return Math.round(val).toLocaleString();
    }
  },
  async created() {
    const list = await this.$store.dispatch("getReadingSessions");
    this.readingSessions = list;
  },
  computed: {
    totalMinutes() {
      return this.readingSessions.reduce((acc, day) => {
        const minutesOnDay =
          typeof day.reading.hours === "number" &&
          typeof day.reading.minutes === "number"
            ? day.reading.hours * 60 + day.reading.minutes
            : 0;

        return acc + minutesOnDay;
      }, 0);
    },
    time() {
      const hours = Math.floor(this.totalMinutes / 60) || 0;
      return {
        hours,
        minutes: this.totalMinutes - hours * 60
      };
    },
    income() {
      return 13 * this.time.hours + Math.round((this.time.minutes / 60) * 13);
    },
    projected() {
      return (
        (this.income * (this.readingSessions.length + this.remaining)) /
        this.readingSessions.length
      );
    }
  }
};
</script>

<style>
</style>