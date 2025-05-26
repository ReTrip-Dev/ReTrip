<template>
    <div id="app" class="body-wrapper">
        <div class="container">
            <div class="left-panel">
                <div class="logo">
                    <img src="/src/assets/logo(1).png" alt="ReTrip Logo">
                </div>
                <div class="form-container">
                    <div class="tab-buttons">
                        <button :class="['tab-button', { active: currentForm === 'find-id' }]"
                            @click="showForm('find-id')">
                            아이디 찾기
                        </button>
                        <button :class="['tab-button', { active: currentForm === 'find-password' }]"
                            @click="showForm('find-password')">
                            비밀번호 찾기
                        </button>
                    </div>

                    <form class="form-section" :class="{ active: currentForm === 'find-id' }" @submit.prevent>
                        <div class="input-group">
                            <label for="id-email">이메일</label>
                            <div class="input-with-button">
                                <input type="email" id="id-email" v-model="idForm.email"
                                    placeholder="가입 시 등록한 이메일을 입력하세요" required>
                                <button type="button" @click="sendIdVerificationCode">인증번호 발송</button>
                            </div>
                        </div>
                        <div class="input-group auth-code-input" v-show="idForm.showAuthInput">
                            <label for="id-auth-code">인증번호</label>
                            <div class="input-with-button">
                                <input type="text" id="id-auth-code" v-model="idForm.authCode"
                                    placeholder="인증번호를 입력하세요">
                                <button type="button" @click="verifyIdEmailCode">인증 확인</button>
                            </div>
                        </div>
                        <div v-show="idForm.message" :class="['result-display', { error: idForm.isError }]"
                            v-html="idForm.message"></div>
                    </form>

                    <form class="form-section" :class="{ active: currentForm === 'find-password' }" @submit.prevent>
                        <div class="input-group">
                            <label for="pw-username">아이디</label>
                            <input type="text" id="pw-username" v-model="pwForm.username" placeholder="아이디를 입력하세요"
                                required>
                        </div>
                        <div class="input-group">
                            <label for="pw-email">이메일</label>
                            <div class="input-with-button">
                                <input type="email" id="pw-email" v-model="pwForm.email" placeholder="가입 시 등록한 이메일을 입력하세요" required>
                                <button type="button" @click="sendPasswordVerificationCode">인증번호 발송</button>
                            </div>
                        </div>
                        <div class="input-group auth-code-input" v-show="pwForm.showAuthInput">
                            <label for="pw-auth-code">인증번호</label>
                            <div class="input-with-button">
                                <input type="text" id="pw-auth-code" v-model="pwForm.authCode"
                                    placeholder="인증번호를 입력하세요">
                                <button type="button" @click="verifyPasswordEmailCode">인증 확인</button>
                            </div>
                        </div>

                        <div id="new-password-section" v-show="pwForm.showNewPasswordSection">
                            <div class="input-group">
                                <label for="new-password">새 비밀번호</label>
                                <input type="password" id="new-password" v-model="pwForm.newPassword"
                                    placeholder="새 비밀번호 (8자 이상)" required minlength="8">
                            </div>
                            <div class="input-group">
                                <label for="confirm-new-password">새 비밀번호 확인</label>
                                <input type="password" id="confirm-new-password" v-model="pwForm.confirmNewPassword"
                                    placeholder="새 비밀번호 다시 입력" required>
                            </div>
                            <button type="button" class="action-button" @click="handleChangePassword">비밀번호 변경</button>
                        </div>
                        <div v-show="pwForm.message" :class="['result-display', { error: pwForm.isError }]"
                            v-html="pwForm.message"></div>
                    </form>
                </div>
            </div>
            <div class="right-panel">
                <img src="/src/assets/logo(2).png" alt="ReTrip Logo White" style="border-radius: 20%;">
                <h2>여행의 모든 순간,<br>ReTrip과 함께</h2>
                <p>소중한 추억을 되짚어보세요.</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ReTripAuth',
    data() {
        return {
            currentForm: 'find-id',
            idForm: {
                email: '',
                authCode: '',
                showAuthInput: false,
                message: '',
                isError: false,
            },
            pwForm: {
                username: '',
                email: '',
                authCode: '',
                showAuthInput: false,
                showNewPasswordSection: false,
                newPassword: '',
                confirmNewPassword: '',
                message: '',
                isError: false,
            },
            baseUrl: 'http://localhost:8080/api', // Spring Boot 서버 URL
        };
    },
    methods: {
        showForm(formId) {
            this.currentForm = formId;
            this.hideAllResultMessages();
            this.resetForms();
        },
        hideAllResultMessages() {
            this.idForm.message = '';
            this.idForm.isError = false;
            this.pwForm.message = '';
            this.pwForm.isError = false;
        },
        resetForms() {
            this.idForm.email = '';
            this.idForm.authCode = '';
            this.idForm.showAuthInput = false;

            this.pwForm.username = '';
            this.pwForm.email = '';
            this.pwForm.authCode = '';
            this.pwForm.showAuthInput = false;
            this.pwForm.showNewPasswordSection = false;
            this.pwForm.newPassword = '';
            this.pwForm.confirmNewPassword = '';
        },
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        displayMessage(formType, message, isError = false) {
            const form = formType === 'id' ? this.idForm : this.pwForm;
            form.message = message;
            form.isError = isError;
        },

        // --- 아이디 찾기 로직 ---
        async sendIdVerificationCode() {
            if (!this.isValidEmail(this.idForm.email)) {
                this.displayMessage('id', '유효한 이메일 주소를 입력해주세요.', true);
                return;
            }

            try {
                const response = await axios.post(`${this.baseUrl}/members/send-verification-code`, {
                    email: this.idForm.email
                });

                console.log('아이디 찾기: 인증번호 발송 성공', response.data);
                alert('인증번호가 발송되었습니다. 이메일을 확인해주세요.');
                this.idForm.showAuthInput = true;
                this.displayMessage('id', '인증번호가 발송되었습니다. 이메일을 확인해주세요.', false);
            } catch (error) {
                console.error('아이디 찾기: 인증번호 발송 실패', error.response ? error.response.data : error.message);
                this.displayMessage('id', '인증번호 발송에 실패했습니다. 다시 시도해주세요.', true);
            }
        },
        async verifyIdEmailCode() {
            if (this.idForm.authCode.trim() === '') {
                this.displayMessage('id', '인증번호를 입력해주세요.', true);
                return;
            }

            try {
                const response = await axios.post(`${this.baseUrl}/members/find-id`, {
                    email: this.idForm.email,
                    code: this.idForm.authCode
                });

                console.log('아이디 찾기: 인증번호 확인 성공', response.data);
                this.displayMessage('id', `회원님의 아이디는 <strong>${response.data}</strong> 입니다.`, false);
                this.idForm.showAuthInput = false; // 인증 성공 후 인증번호 입력칸 숨김
                // Add a button to navigate to the home screen
                this.idForm.message += `<br><button style="background-color: #4090e9; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;" onclick="window.location.href='/'">홈으로 돌아가기</button>`;
            } catch (error) {
                console.error('아이디 찾기: 인증번호 확인 실패', error.response ? error.response.data : error.message);
                this.displayMessage('id', '인증번호가 올바르지 않습니다.', true);
            }
        },

        // --- 비밀번호 찾기 로직 ---
        async sendPasswordVerificationCode() {
            if (this.pwForm.username.trim() === '') {
                this.displayMessage('pw', '아이디를 입력해주세요.', true);
                return;
            }
            if (!this.isValidEmail(this.pwForm.email)) {
                this.displayMessage('pw', '유효한 이메일 주소를 입력해주세요.', true);
                return;
            }

            try {
                const response = await axios.post(`${this.baseUrl}/members/send-verification-code`, {
                    email: this.pwForm.email
                });

                console.log('비밀번호 찾기: 인증번호 발송 성공', response.data);
                alert('인증번호가 발송되었습니다. 이메일을 확인해주세요.');
                this.pwForm.showAuthInput = true;
                this.displayMessage('pw', '인증번호가 발송되었습니다. 이메일을 확인해주세요.', false);
            } catch (error) {
                console.error('비밀번호 찾기: 인증번호 발송 실패', error.response ? error.response.data : error.message);
                this.displayMessage('pw', '인증번호 발송에 실패했습니다. 다시 시도해주세요.', true);
            }
        },
        async verifyPasswordEmailCode() {
            if (this.pwForm.authCode.trim() === '') {
                this.displayMessage('pw', '인증번호를 입력해주세요.', true);
                return;
            }

            try {
                const response = await axios.post(`${this.baseUrl}/members/password/verify-credentials`, {
                    userId: this.pwForm.username,
                    email: this.pwForm.email,
                    code: this.pwForm.authCode
                });

                console.log('비밀번호 찾기: 인증 성공', response.data);
                this.pwForm.showNewPasswordSection = true;
                this.displayMessage('pw', '인증되었습니다. 새 비밀번호를 설정해주세요.', false);
                this.pwForm.showAuthInput = false; // 인증 성공 후 인증번호 입력칸 숨김
            } catch (error) {
                console.error('비밀번호 찾기: 인증 실패', error.response ? error.response.data : error.message);
                this.displayMessage('pw', '인증에 실패했습니다. 아이디, 이메일, 인증번호를 확인해주세요.', true);
            }
        },
        async handleChangePassword() {
            if (this.pwForm.newPassword.length < 8) {
                this.displayMessage('pw', '새 비밀번호는 8자 이상이어야 합니다.', true);
                return;
            }
            if (this.pwForm.newPassword !== this.pwForm.confirmNewPassword) {
                this.displayMessage('pw', '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.', true);
                return;
            }

            try {
                const response = await axios.post(`${this.baseUrl}/members/password/reset`, {
                    email: this.pwForm.email,
                    newPassword: this.pwForm.newPassword
                });

                console.log('비밀번호 변경 성공', response.data);
                alert('비밀번호가 성공적으로 변경되었습니다.');
                this.displayMessage('pw', '비밀번호가 성공적으로 변경되었습니다.', false);
                this.pwForm.showNewPasswordSection = false; // 변경 후 새 비밀번호 입력칸 숨김
                this.resetForms(); // 폼 초기화
                this.$router.push('/'); // 홈 화면으로 이동
            } catch (error) {
                console.error('비밀번호 변경 실패', error.response ? error.response.data : error.message);
                this.displayMessage('pw', '비밀번호 변경에 실패했습니다.', true);
            }
        },
    },
    mounted() {
        this.showForm('find-id'); // Initial form display
    },
};
</script>

<style scoped>
/* 기본 색상 변수 정의 (이 컴포넌트 내에서만 유효) */
:root {
    --main-color: #FF5D00;
    /* ReTrip 메인 오렌지 색상 */
    --light-bg: #f9f9f9;
    /* 밝은 배경색 */
    --text-color: #333;
    --placeholder-color: #aaa;
    --border-color: #ddd;
    --focus-border-color: #FF7D33;
    /* 메인 색상보다 살짝 밝게 */
    --button-hover-color: #E65200;
    /* 메인 색상보다 살짝 어둡게 */
    --success-color: #28a745;
    --error-color: #dc3545;
}

/* body, html, #app 선택자는 전역 스타일이므로 여기서 제거하거나,
   해당 컴포넌트의 최상위 요소인 .body-wrapper에 적용하도록 변경합니다. */

/* 기존 body 스타일을 .body-wrapper에 적용 */
.body-wrapper {
    font-family: 'Noto Sans KR', sans-serif;
    /* Noto Sans KR 폰트가 필요하다면 여기서 직접 임포트하거나 전역 CSS에서 정의 */
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    background-color: var(--light-bg);
    color: var(--text-color);
    overflow-y: auto;
    padding: 20px;
    box-sizing: border-box;
}

.container {
    display: flex;
    width: 100%;
    max-width: 1000px;
    min-height: 734.3px;
    /* 높이 증가 */
    background-color: #fff;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    overflow: hidden;
    flex-wrap: wrap;
}

.left-panel {
    flex: 1;
    min-width: 380px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
    /* 패딩 조정 */
    box-sizing: border-box;
    position: relative;
}

.logo {
    width: 150px;
    /* 로고 크기 조정 */
    margin-bottom: 30px;
    /* 마진 조정 */
}

.logo img {
    width: 100%;
    height: auto;
}

.form-container {
    width: 100%;
    max-width: 400px;
    /* 폼 최대 너비 증가 */
}

.tab-buttons {
    display: flex;
    margin-bottom: 30px;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid var(--border-color);
}

.tab-button {
    flex: 1;
    padding: 12px;
    background-color: #f0f0f0;
    color: var(--text-color);
    border: none;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    transition: background-color 0.3s, color 0.3s;
    text-align: center;
}

.tab-button:not(:last-child) {
    border-right: 1px solid var(--border-color);
}

.tab-button.active {
    background-color: var(--main-color);
    color: white;
}

.tab-button:hover:not(.active) {
    background-color: #e0e0e0;
}

.form-section {
    display: none;
    /* 기본적으로 숨김 */
}

.form-section.active {
    display: block;
    /* 활성화된 탭의 내용만 표시 */
}

.input-group {
    margin-bottom: 20px;
    /* 마진 조정 */
    position: relative;
}

.input-group label {
    display: block;
    margin-bottom: 8px;
    /* 마진 조정 */
    font-size: 14px;
    /* 폰트 크기 조정 */
    font-weight: 500;
    color: var(--text-color);
}

.input-group input[type="text"],
.input-group input[type="password"],
.input-group input[type="email"] {
    width: calc(100% - 24px);
    padding: 12px 12px;
    /* 패딩 조정 */
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 16px;
    /* 폰트 크기 조정 */
    box-sizing: border-box;
    color: var(--text-color);
    transition: border-color 0.3s ease;
}

.input-group input::placeholder {
    color: var(--placeholder-color);
}

.input-group input[type="text"]:focus,
.input-group input[type="password"]:focus,
.input-group input[type="email"]:focus {
    outline: none;
    border-color: var(--focus-border-color);
    box-shadow: 0 0 0 3px rgba(255, 93, 0, 0.15);
}

.input-with-button {
    display: flex;
    align-items: center;
    gap: 10px;
    /* 간격 조정 */
}

.input-with-button input {
    flex-grow: 1;
}

.input-with-button button {
    padding: 11px 16px;
    /* 패딩 조정 */
    border: none;
    border-radius: 6px;
    background-color: var(--main-color);
    color: white;
    font-size: 14px;
    /* 폰트 크기 조정 */
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.input-with-button button:hover {
    background-color: var(--button-hover-color);
    transform: translateY(-1px);
}

.input-with-button button:active {
    transform: translateY(0);
}

.auth-code-input {
    margin-top: 12px;
    /* 마진 조정 */
}

.action-button {
    width: 100%;
    padding: 14px;
    /* 패딩 조정 */
    background-color: var(--main-color);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 17px;
    /* 폰트 크기 조정 */
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    margin-top: 25px;
    /* 마진 조정 */
    box-shadow: 0 4px 10px rgba(255, 93, 0, 0.2);
}

.action-button:hover {
    background-color: var(--button-hover-color);
    transform: translateY(-2px);
}

.action-button:active {
    transform: translateY(0);
}

.result-display {
    margin-top: 20px;
    padding: 15px;
    background-color: #e9f5ff;
    border: 1px solid #b3d7ff;
    border-radius: 6px;
    color: #00529B;
    font-size: 15px;
    text-align: center;
}

.result-display.error {
    background-color: #ffebee;
    border-color: #ffcdd2;
    color: var(--error-color);
}

.right-panel {
    flex: 1.2;
    min-width: 380px;
    background-color: var(--main-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    padding: 50px;
    box-sizing: border-box;
    text-align: center;
}

.right-panel h2 {
    font-size: 2.5em;
    /* 폰트 크기 조정 */
    margin-bottom: 20px;
    /* 마진 조정 */
    line-height: 1.3;
    font-weight: 700;
}

.right-panel p {
    font-size: 1.2em;
    /* 폰트 크기 조정 */
    margin-bottom: 30px;
    /* 마진 조정 */
    opacity: 0.9;
}

.right-panel img {
    width: 110px;
    /* 이미지 크기 조정 */
    margin-top: 35px;
    /* 마진 조정 */
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

/* 반응형 디자인 */
@media (max-width: 992px) {
    .container {
        flex-direction: column;
        min-height: auto;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .left-panel,
    .right-panel {
        min-width: unset;
        width: 100%;
        padding: 35px;
        /* 패딩 조정 */
    }

    .right-panel {
        order: -1;
    }

    .right-panel h2 {
        font-size: 2em;
        /* 폰트 크기 조정 */
    }

    .right-panel p {
        font-size: 1.1em;
    }

    .logo {
        margin-bottom: 25px;
        /* 마진 조정 */
    }

    .form-container {
        max-width: 100%;
    }
}

@media (max-width: 576px) {

    /* body 선택자 대신 .body-wrapper에 적용 */
    .body-wrapper {
        padding: 15px;
    }

    .left-panel,
    .right-panel {
        padding: 25px;
        /* 패딩 조정 */
    }

    .right-panel h2 {
        font-size: 1.8em;
    }

    .right-panel p {
        font-size: 1em;
    }

    .tab-button {
        font-size: 15px;
    }

    .input-group label {
        font-size: 13px;
        /* 폰트 크기 조정 */
    }

    .input-group input,
    .input-with-button button,
    .action-button {
        font-size: 14px;
        /* 폰트 크기 조정 */
        padding: 10px 10px;
        /* 패딩 조정 */
    }

    .action-button {
        padding: 12px;
        /* 패딩 조정 */
        font-size: 16px;
        /* 폰트 크기 조정 */
    }

    .logo {
        width: 120px;
        /* 로고 크기 조정 */
        margin-bottom: 30px;
        /* 마진 조정 */
    }

    .right-panel img {
        width: 90px;
        /* 이미지 크기 조정 */
        margin-top: 25px;
        /* 마진 조정 */
    }
}

@media (max-width: 400px) {
    .input-with-button {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
    }

    .input-with-button button {
        width: 100%;
    }

    .left-panel,
    .right-panel {
        padding: 20px;
    }
}
</style>