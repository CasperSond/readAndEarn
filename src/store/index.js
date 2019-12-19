import Vue from "vue";
import Vuex from "vuex";
import Cognito from "./cognito";
import Reading from "./appStore";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    Cognito,
    Reading
  }
});
