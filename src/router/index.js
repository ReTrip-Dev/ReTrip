import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Main from "../views/Main.vue";
import SignupForm from '../components/SignupForm.vue'; // SignupForm 컴포넌트 임포트

const routes = [
  { 
    path: "/", 
    name: "Home", 
    component: Home 
  },
  { 
    path: "/main", 
    name: "Main", 
    component: Main 
  },
  {
    path: "/signup", // 회원가입 페이지 경로
    name: "Signup",
    component: SignupForm, // SignupForm 컴포넌트 연결
  },
  // 선택 사항: '/' 경로로 접속 시 '/signup'으로 리다이렉트
  // 만약 초기 접속 시 바로 회원가입 페이지를 보여주고 싶다면 아래 주석을 해제하세요.
  // {
  //   path: '/',
  //   redirect: '/signup'
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;