import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // 추가

import "./assets/base.css";
import "./assets/global.css";

const app = createApp(App);

app.use(router);
app.mount("#app");
