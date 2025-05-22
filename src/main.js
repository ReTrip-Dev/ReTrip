import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // 추가

createApp(App)
  .use(router) // 라우터 등록
  .mount("#app");
