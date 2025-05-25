import { createRouter, createWebHistory } from "vue-router";
import RetripReportGenerator from "../components/RetripReportGenerator.vue";
import LoginPage from "../components/LoginPage.vue";
import SignUpForm from "../components/SignUpForm.vue";

const routes = [
  {
    path: "/", // 루트 경로 (예: http://localhost:8080/)
    name: "Login",
    component: LoginPage, // 이 경로로 접속하면 LoginPage 컴포넌트가 렌더링됩니다.
  },
  {
    path: "/signup", // 회원가입 페이지 경로
    name: "Signup",
    component: SignUpForm, // SignUpForm 컴포넌트 연결
  },
  {
    path: "/photo", // 회원가입 페이지 경로
    name: "photo",
    component: RetripReportGenerator, // SignupForm 컴포넌트 연결
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
