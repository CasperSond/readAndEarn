<template>
  <div class="display-3">{{ presenter(ms) }}</div>
</template>

<script>
export default {
  props: ["ms"],
  methods: {
    presenter(ms) {
      const sec = ms / 1000,
        secMargin = Math.floor(sec % 60),
        minMargin = Math.floor((sec / 60) % 60),
        hoursMargin = Math.floor((sec / 3600) % 60);

      return `${this.zeroAdd(hoursMargin)}:${this.zeroAdd(
        minMargin
      )}:${this.zeroAdd(secMargin)}`;
    },
    zeroAdd(value) {
      return value < 10 ? `0${value}` : value;
    }
  }
};
</script>

<style>
</style>