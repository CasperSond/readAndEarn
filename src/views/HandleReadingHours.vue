<template>
  <div>
    <h1 class="display-1">Registerede timer</h1>

    <template v-if="readingSessions.length > 0">
      <v-card v-for="(item, index) in readingSessions" :key="item.date" class="my-5">
        <v-card-title>
          {{index + 1}}. læsning - {{item.reading.date | check}}
          <v-spacer />
          <v-btn fab x-small @click="removeItem(item.date)">
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          {{item.reading.hours}} timer och {{item.reading.minutes}} minuter
          <span
            v-if="item.reading.book"
          >läst i {{item.reading.book}}</span>
        </v-card-text>
      </v-card>
    </template>

    <v-dialog v-model="dialog" max-width="600">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" fab dark v-on="on" bottom fixed right>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Lägg till</v-card-title>
        <v-card-text>
          <v-text-field v-model.number="hours" label="Timer" />
          <v-text-field v-model.number="minutes" label="Minuter" />
          <v-text-field v-model="book" label="Bok" />
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field v-model="readDate" label="Läst datum" readonly v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="readDate" @input="menu = false"></v-date-picker>
          </v-menu>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Avbryt</v-btn>
          <v-btn color="primary" @click="addReadingPeriod">Lägg till</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      menu: false,
      readingSessions: [],
      hours: null,
      minutes: null,
      book: "",
      readDate: "",
      dialog: false
    };
  },
  created() {
    this.updateReading();
  },
  filters: {
    date(value) {
      const d = new Date(+value);
      return d.toDateString();
    },
    check(value) {
      return value.length > 0 ? value : "Ukändt";
    }
  },

  methods: {
    async removeItem(date) {
      const data = await this.$store.dispatch("deleteItem", date);
      this.updateReading();
    },
    async updateReading() {
      const list = await this.$store.dispatch("getReadingSessions");

      this.readingSessions = list;
    },
    async addReadingPeriod() {
      const { hours, minutes, book, readDate } = this;

      try {
        const data = await this.$store.dispatch("reportReadTime", {
          hours,
          minutes,
          book,
          readDate
        });
        this.updateReading();
      } catch (error) {
        console.log(error);
      } finally {
        this.dialog = false;
      }
    }
  }
};
</script>

<style>
</style>