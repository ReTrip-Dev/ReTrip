import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // 추가
import SignupForm from './components/SignUpForm.vue'; // SignupForm 컴포넌트 임포트

const app = createApp(App);
app.component('SignupForm', SignupForm); // SignupForm 컴포넌트 등록
// Vue 애플리케이션 생성 및 라우터 등록

createApp(App)
  .use(router) // 라우터 등록
  .mount("#app");
