<template>
  <router-view />
  <!-- 현재 라우트 컴포넌트 렌더링 -->
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* 전역 스타일 필요 시 추가 */
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
