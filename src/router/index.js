import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import NewUser from "../views/NewUser.vue";
import Reading from "../views/HandleReadingHours.vue";

import Earnings from "../views/MoneyEarned.vue";
import store from "../store";
import Timer from "../views/ReadingTimer.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/new-user",
    name: "newUser",
    component: NewUser
  },
  {
    path: "/reading",
    name: "readingStatus",
    component: Reading
  },
  {
    path: "/earnings",
    name: "earning",
    component: Earnings
  },
  {
    path: "/timer",
    name: "timer",
    component: Timer
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path === "/") {
    if (store.state.Cognito.sessionValid) {
      console.log("A");
    }
  }

  next();
});

export default router;
