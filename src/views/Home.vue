<template>
  <div class="home">
    <img src="@/assets/logo.png" alt="ReTrip Logo" class="logo" />
    <button class="kakao-btn" @click="loginWithKakao">
      <img src="@/assets/kakao_login_large_wide.png" alt="카카오 로그인" />
    </button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    loginWithKakao() {
      // TODO: 카카오 OAuth 후
      this.$router.push("/main");
    },
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  margin: 0;
  background-color: #f5f5f5;
  padding: 16px;
  box-sizing: border-box;
}

.logo {
  width: 400px;
  max-width: 60%;
  height: auto;
  margin-bottom: 24px;
}

.kakao-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
}

.kakao-btn:focus {
  outline: none;
}

.kakao-btn img {
  width: 400px;
  max-width: 80%;
  height: auto;
}

@media (max-width: 480px) {
  .logo {
    width: 150px;
  }
  .kakao-btn img {
    width: 150px;
  }
}
</style>
