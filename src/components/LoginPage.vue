<template>
    <div class="home-container">
        <div class="left-section">
            <div class="logo"></div>
            <div class="login-box-container">
                <div class="input-group">
                    <div class="input-field">
                        <input type="text" placeholder="아이디" v-model="userId" @keyup.enter="handleLogin" />
                    </div>
                </div>
                <div class="input-group">
                    <div class="input-field password">
                        <input type="password" placeholder="비밀번호" v-model="password" @keyup.enter="handleLogin" />
                    </div>
                </div>
                <button class="login-button" @click="handleLogin">로그인</button>
                <label class="keep-login">
                    <input type="checkbox" v-model="keepLoggedIn" />
                    <span class="checkbox"></span>
                    <span>로그인 상태 유지</span>
                </label>
            </div>

            <button class="kakao-login-button" @click="handleKakaoLogin">
                <div class="kakao-logo"></div>
                <div class="large-container">
                    <span class="label">카카오 로그인</span>
                </div>
            </button>

            <div class="link-section">
                <span @click="goToFindId">아이디 찾기</span>
                <div class="divider"></div>
                <span @click="goToFindPassword">비밀번호 찾기</span>
                <div class="divider"></div>
                <span @click="goToSignUp">회원가입</span>
            </div>
        </div>

        <div class="right-image-section">
            </div>
    </div>
</template>

<script>
import axios from "axios"; // npm install axios 필요

export default {
    name: "LoginPage",
    data() {
        return {
            userId: "",
            password: "",
            keepLoggedIn: false, // 로그인 상태 유지 체크박스 상태
        };
    },
    methods: {
        async handleLogin() {
            if (!this.userId || !this.password) {
                alert("아이디와 비밀번호를 입력해주세요.");
                return;
            }

            try {
                const response = await axios.post(
                    "http://localhost:8080/api/members/signin",
                    {
                        userId: this.userId,
                        password: this.password,
                    }
                );

                console.log("로그인 성공:", response.data);
                // 로그인 성공 후 처리 (예: 메인 페이지로 리다이렉트, 사용자 정보 저장)
                alert("로그인 성공!");
                // 예시: 라우터로 페이지 이동 (Vue Router 설정 필요)
                this.$router.push('/photo'); // 로그인 성공 후 사진 업로드 페이지로 이동
            } catch (error) {
                console.error(
                    "로그인 실패:",
                    error.response ? error.response.data : error.message
                );
                alert(
                    "로그인 실패: " +
                    (error.response
                        ? error.response.data.message ||
                        "아이디 또는 비밀번호가 올바르지 않습니다."
                        : "서버와 통신할 수 없습니다.")
                );
            }
        },
        handleKakaoLogin() {
            window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
        },
        goToSignUp() {
            // 회원가입 페이지로 이동 (Vue Router 설정 필요)
            this.$router.push("/signup");
        },
        goToFindId() {
            // alert("아이디 찾기 페이지로 이동합니다.");
            this.$router.push('/credential');
        },
        goToFindPassword() {
            // alert("비밀번호 찾기 페이지로 이동합니다.");
            this.$router.push('/credential');
        },
    },
};
</script>

<style>
/*
 * 이 <style> 블록에는 'scoped' 속성이 없습니다.
 * base.css에 폰트 정의와 body 기본 스타일이 있으므로 여기서는 삭제합니다.
 * 이 블록은 비워두거나, 정말 전역적으로 모든 컴포넌트에 영향을 줘야 하는
 * 아주 특수한 경우에만 사용합니다. (권장하지 않음)
 */

/*
@font-face { // base.css에 있으므로 삭제
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-ExtraLight.woff2') format('woff2');
    font-weight: 200;
    font-display: swap;
}
@font-face { // base.css에 있으므로 삭제
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-Light.woff2') format('woff2');
    font-weight: 300;
    font-display: swap;
}
@font-face { // base.css에 있으므로 삭제
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-Regular.woff2') format('woff2');
    font-weight: 400;
    font-display: swap;
}
@font-face { // base.css에 있으므로 삭제
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-Medium.woff2') format('woff2');
    font-weight: 500;
    font-display: swap;
}
@font-face { // base.css에 있으므로 삭제
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-SemiBold.woff2') format('woff2');
    font-weight: 600;
    font-display: swap;
}
@font-face { // base.css에 있으므로 삭제
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-Bold.woff2') format('woff2');
    font-weight: 700;
    font-display: swap;
}
@font-face { // base.css에 있으므로 삭제
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-ExtraBold.woff2') format('woff2');
    font-weight: 800;
    font-display: swap;
}
@font-face { // base.css에 있으므로 삭제
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-Black.woff2') format('woff2');
    font-weight: 900;
    font-display: swap;
}
@font-face { // base.css에 있으므로 삭제
    font-family: 'Apple SD Gothic Neo';
    src: local('Apple SD Gothic Neo');
    font-weight: 600;
}
*/

/*
body { // base.css에 있으므로 삭제
    margin: 0;
    font-family: 'Pretendard', sans-serif;
    overflow: hidden;
}
*/
</style>

<style scoped>
/*
 * 이 <style scoped> 블록 내의 CSS는 오직 이 LoginPage 컴포넌트 내에서만 유효합니다.
 * Vue의 스코프드 CSS 기능 덕분에 다른 컴포넌트에 영향을 주지 않습니다.
 */

/* Slide 16:9 - 1 */
.home-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #FFFFFF;
    display: flex;
    /* font-family는 base.css에서 body에 설정했으므로 여기서 다시 설정할 필요 없음 */
    /* overflow: hidden; // base.css의 body에 overflow:hidden이 있다면 제거, 없다면 여기에 유지 */
}

/* 왼쪽 로그인 섹션 */
.left-section {
    width: 700px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    top: -20px; /* 20px 위로 올림 */
}

.left-section .logo {
    position: absolute;
    width: 300px;
    height: 300px;
    top: 140px;
    background: url('/src/assets/logo(2).png') no-repeat center center / contain;
    z-index: 10;
}

/* orange_bg (오른쪽 이미지 영역) */
.right-image-section {
    position: relative;
    width: calc(100vw - 700px); /* 오른쪽 영역이 자동으로 남은 공간을 차지하도록 */
    height: 100%;
    background: #FF7322;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    flex-grow: 1;
}

/* image (8) 2 - background image */
.right-image-section::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: url('/src/assets/home.png') no-repeat center center / cover;
    filter: drop-shadow(0px 4.05943px 50.7429px rgba(63, 9, 9, 0.1));
    z-index: 1;
}

/* Login Box and Kakao Login */
.login-box-container {
    position: absolute;
    width: 335px; /* 363px → 335px */
    height: 192px;
    left: calc(50% - 335px / 2);
    top: 497px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.input-group {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0px;
    gap: 8px;
    width: 100%;
    height: 48px;
}

.input-field {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    gap: 10px;
    width: 100%;
    height: 48px;
    background: #FFFFFF;
    border: 1px solid #A9A9A9;
    border-radius: 4px;
}

.input-field input {
    border: none;
    outline: none;
    width: 100%;
    /* font-family는 base.css에서 상속받거나 여기에서 재정의할 수 있습니다. */
    font-family: 'Pretendard', sans-serif; /* 명시적으로 Pretendard 지정 */
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 140%;
    color: #1a1818;
}

.input-field input::placeholder {
    color: #ddd;
}

.input-field.password {
    border: 1px solid #A9A9A9;
}

.login-button {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px;
    gap: 10px;
    width: 100%;
    height: 48px;
    background: #232323;
    border: 1px solid #232323;
    border-radius: 4px;
    color: #FFFFFF;
    font-family: 'Pretendard', sans-serif; /* 명시적으로 Pretendard 지정 */
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 140%;
    cursor: pointer;
}

.keep-login {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 4px;
    width: auto;
    height: 24px;
    cursor: pointer;
    margin-top: 8px;
}

.keep-login .checkbox {
    width: 24px;
    height: 24px;
    border: 1px solid #232323;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    transition: background-color 0.2s ease;
    flex-shrink: 0;
}

.keep-login input[type="checkbox"] {
    display: none;
}

.keep-login input[type="checkbox"]:checked+.checkbox {
    background-color: #232323;
}

.keep-login input[type="checkbox"]:checked+.checkbox::after {
    content: '✔';
    color: white;
    font-size: 16px;
    line-height: 1;
}

.keep-login span {
    font-family: 'Pretendard', sans-serif; /* 명시적으로 Pretendard 지정 */
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 140%;
    color: #717171;
    white-space: nowrap;
}

.kakao-login-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px 13.7717px;
    position: absolute;
    width: 335px; /* 로그인 컨테이너와 동일하게 */
    height: 44px;
    left: calc(50% - 335px / 2);
    top: 737px;
    background: #FEE500;
    border-radius: 100px;
    cursor: pointer;
    border: none;
}

.kakao-login-button .kakao-logo {
    width: 17.71px;
    height: 17.71px;
    background: url('https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png') no-repeat center center / contain;
    margin-right: 7.87px;
    flex-shrink: 0;
}

.kakao-login-button .large-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px;
    gap: 7.87px;
    flex-grow: 1;
}

.kakao-login-button .label {
    font-family: 'Apple SD Gothic Neo', 'Pretendard', sans-serif; /* 명시적으로 폰트 지정 */
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 150%;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.85);
    white-space: nowrap;
}

/* Link section (아이디 찾기, 비밀번호 찾기, 회원가입) */
.link-section {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 12px;
    position: absolute;
    height: 18px;
    left: 50%;
    transform: translateX(-50%);
    top: 805px;
    justify-content: center;
    width: auto;
}

.link-section span {
    font-family: 'Pretendard', sans-serif; /* 명시적으로 Pretendard 지정 */
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 140%;
    display: flex;
    align-items: center;
    color: #717171;
    cursor: pointer;
    white-space: nowrap;
}

.link-section .divider {
    width: 12px;
    height: 0px;
    border: 1px solid #717171;
    transform: rotate(90deg);
    flex-shrink: 0;
}
</style>