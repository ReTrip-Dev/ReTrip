<template>
    <div class="signup-page-wrapper">
        <div class="container">
            <div class="left-panel">
                <div class="logo">
                    <img src="/src/assets/logo(1).png" alt="ReTrip Logo">
                </div>
                <form class="signup-form" @submit.prevent="handleSignup">
                    <div class="input-group">
                        <label for="username">아이디</label>
                        <div class="input-with-button">
                            <input type="text" id="username" v-model="form.username" placeholder="아이디를 입력하세요" required @input="resetUsernameStatus">
                            <button type="button" @click="checkUsernameDuplication" :disabled="!form.username.trim() || isCheckingUsername">
                                {{ isCheckingUsername ? '확인 중...' : '중복 체크' }}
                            </button>
                        </div>
                        <p v-if="usernameStatus" :style="{ color: usernameStatus.color }" class="status-message">
                            {{ usernameStatus.message }}
                        </p>
                    </div>

                    <div class="input-group">
                        <label for="password">비밀번호</label>
                        <input type="password" id="password" v-model="form.password" placeholder="비밀번호를 입력하세요 (8자 이상 20자 이하)" required minlength="8" maxlength="20">
                        <p v-if="passwordLengthStatus" :style="{ color: passwordLengthStatus.color }" class="status-message">
                            {{ passwordLengthStatus.message }}
                        </p>
                    </div>

                    <div class="input-group">
                        <label for="confirm-password">비밀번호 확인</label>
                        <input type="password" id="confirm-password" v-model="form.confirmPassword" placeholder="비밀번호를 다시 입력하세요" required>
                        <p v-if="(form.password.length > 0 || form.confirmPassword.length > 0) && passwordMatchStatus" :style="{ color: passwordMatchStatus.color }" class="status-message">
                            {{ passwordMatchStatus.message }}
                        </p>
                    </div>

                    <div class="input-group">
                        <label for="email">이메일</label>
                        <div class="input-with-button">
                            <input type="email" id="email" v-model="form.email" placeholder="이메일을 입력하세요" :disabled="isEmailVerified || isSendingCode || emailTimerRunning" required>
                            <button type="button" @click="sendVerificationCode" :disabled="isSendingCode || isEmailVerified || (emailTimerRunning && emailTimeLeft > 0)">
                                {{ isSendingCode ? '전송 중...' : (emailTimerRunning && emailTimeLeft > 0 ? '재전송' : '인증번호 발송') }}
                            </button>
                        </div>
                        <div class="input-group auth-code-input" v-if="showAuthCodeInput">
                            <label for="auth-code">인증번호</label>
                            <div class="input-with-button">
                                <input type="text" id="auth-code" v-model="form.authCode" placeholder="인증번호를 입력하세요" :disabled="isEmailVerified">
                                <button type="button" @click="verifyEmailCode" :disabled="isVerifyingCode || isEmailVerified || !emailTimerRunning">
                                    {{ isVerifyingCode ? '확인 중...' : '인증 확인' }}
                                </button>
                            </div>
                            <div class="timer-display" v-if="emailTimerRunning && !isEmailVerified">
                                {{ formattedTime }}
                            </div>
                            <div class="verification-status" v-if="isEmailVerified">
                                <span style="color: green; font-weight: bold;">✔ 이메일 인증 완료!</span>
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="signup-button" :disabled="!canSubmit">
                        {{ isSigningUp ? '가입 중...' : '회원 가입' }}
                    </button>
                </form>
            </div>
            <div class="right-panel">
                <img src="/src/assets/logo(2).png" alt="ReTrip Logo White">
                <h3>Remember Your Trip</h3>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
// Vue Router를 사용하는 경우 아래 주석을 해제하세요.
// import { useRouter } from 'vue-router';

export default {
    name: 'SignupForm',
    // setup() { // Vue 3 Composition API를 사용하는 경우
    //     const router = useRouter();
    //     return { router };
    // },
    data() {
        return {
            form: {
                username: '',
                password: '',
                confirmPassword: '',
                email: '',
                authCode: ''
            },
            showAuthCodeInput: false,
            isEmailVerified: false,   // 이메일 인증 완료 상태
            isSendingCode: false,     // 인증번호 발송 중 상태
            isVerifyingCode: false,   // 인증번호 확인 중 상태
            isSigningUp: false,       // 회원가입 처리 중 상태
            isCheckingUsername: false,// 아이디 중복 체크 중 상태

            usernameStatus: null,     // { message: '', color: '' }
            passwordMatchStatus: null, // { message: '', color: '' }
            passwordLengthStatus: null, // { message: '', color: '' } // 비밀번호 길이 상태 추가

            passwordLengthTimer: null, // 비밀번호 길이 메시지 지연을 위한 타이머 ID

            baseUrl: 'http://localhost:8080/api', // 기본 API URL

            // 타이머 관련 데이터
            emailTimer: null, // setInterval ID 저장
            emailTimeLeft: 0, // 남은 시간 (초)
            emailTimerRunning: false, // 타이머 작동 여부
            initialEmailTimerDuration: 3 * 60 // 3분 = 180초
        };
    },
    computed: {
        formattedTime() {
            const minutes = Math.floor(this.emailTimeLeft / 60);
            const seconds = this.emailTimeLeft % 60;
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        },
        passwordsMatch() {
            return this.form.password === this.form.confirmPassword;
        },
        isPasswordLengthValid() {
            const len = this.form.password.length;
            return len >= 8 && len <= 20;
        },
        canSubmit() {
            // 회원가입 버튼 활성화 조건
            return (
                this.form.username.trim() !== '' &&
                this.isPasswordLengthValid && // 비밀번호 길이 유효성 추가
                this.passwordsMatch && // 비밀번호 일치
                this.form.password.length > 0 && // 비밀번호가 실제로 입력되었는지 확인
                this.form.confirmPassword.length > 0 && // 비밀번호 확인도 실제로 입력되었는지 확인
                this.isEmailVerified &&
                !this.isSigningUp
            );
        }
    },
    watch: {
        'form.password': function() {
            // 비밀번호가 변경될 때마다 기존 타이머를 취소하고 새로운 타이머 설정
            if (this.passwordLengthTimer) {
                clearTimeout(this.passwordLengthTimer);
            }
            // 즉시 메시지 초기화하여 지연 시간 동안 이전 메시지가 보이지 않게 함
            this.passwordLengthStatus = null;

            // 비밀번호가 비어있지 않으면 0.5초 후 길이 검사 로직 실행
            if (this.form.password.length > 0) {
                this.passwordLengthTimer = setTimeout(() => {
                    this.checkPasswordLength();
                }, 500); // 0.5초 지연
            } else {
                // 비밀번호가 완전히 지워지면 즉시 메시지 숨김
                this.checkPasswordLength(); // 이 경우 메시지가 null로 설정됨
            }
            
            this.checkPasswordMatch();  // 비밀번호 일치 여부 검사 (지연 없음)
        },
        'form.confirmPassword': function() {
        // 비밀번호 일치 여부 검사 로직에 지연 적용
        // ✨ 변경: checkPasswordMatch() 호출 로직을 setTimeout으로 감싸기
        if (this.passwordMatchTimer) {
            clearTimeout(this.passwordMatchTimer);
        }
        this.passwordMatchStatus = null; // 즉시 메시지 초기화

        // 비밀번호 확인 필드에 입력이 있을 때만 지연 후 검사 실행
        if (this.form.password.length > 0 || this.form.confirmPassword.length > 0) {
            this.passwordMatchTimer = setTimeout(() => {
                this.checkPasswordMatch();
            }, 500); // 0.5초 지연
        } else {
            this.checkPasswordMatch(); // 둘 다 비어있을 때는 즉시 처리 (메시지 숨김)
        }
    }
    },
    methods: {
        // 아이디 입력 시 상태 초기화
        resetUsernameStatus() {
            this.usernameStatus = null;
        },
        // 아이디 중복 체크 로직
        async checkUsernameDuplication() {
            const username = this.form.username.trim();
            if (username === '') {
                this.usernameStatus = { message: '아이디를 입력해주세요.', color: 'red' };
                return;
            }

            this.isCheckingUsername = true;
            try {
                const response = await axios.get(`${this.baseUrl}/members/validate/nickname`, {
                    params: { nickname: username }
                });
                this.usernameStatus = { message: response.data, color: 'green' };

            } catch (error) {
                console.error('아이디 중복 체크 실패:', error.response ? error.response.data : error.message);
                if (error.response) {
                    if (error.response.status === 409) { // 닉네임 중복 시
                        this.usernameStatus = { message: error.response.data.message, color: 'red' };
                    } else if (error.response.status === 400) { // 다른 일반적인 IllegalArgumentException
                        this.usernameStatus = { message: error.response.data.message, color: 'red' };
                    } else {
                        this.usernameStatus = { message: '아이디 중복 체크 중 알 수 없는 오류가 발생했습니다.', color: 'red' };
                    }
                } else {
                    this.usernameStatus = { message: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.', color: 'red' };
                }
            } finally {
                this.isCheckingUsername = false;
            }
        },

        // 비밀번호 길이 유효성 검사 (이제 이 함수는 watch 내부 setTimeout에서 호출됨)
        checkPasswordLength() {
            const len = this.form.password.length;
            if (len === 0) {
                this.passwordLengthStatus = null; // 입력이 없으면 메시지 숨김
            } else if (len < 8) {
                this.passwordLengthStatus = { message: `비밀번호는 최소 8자 이상이어야 합니다. (현재 ${len}자)`, color: 'red' };
            } else if (len > 20) {
                this.passwordLengthStatus = { message: `비밀번호는 최대 20자 이하이어야 합니다. (현재 ${len}자)`, color: 'red' };
            } else {
                this.passwordLengthStatus = { message: '비밀번호 길이가 적절합니다.', color: 'green' };
            }
        },

        // 비밀번호 일치 여부 확인
        checkPasswordMatch() {
            // 두 필드 중 하나라도 비어있으면 메시지 숨김
            if (this.form.password.length === 0 || this.form.confirmPassword.length === 0) {
                this.passwordMatchStatus = null;
                return;
            }

            // 두 필드가 모두 채워져 있고 일치하는 경우
            if (this.form.password === this.form.confirmPassword) {
                this.passwordMatchStatus = { message: '비밀번호가 일치합니다.', color: 'green' };
            } else {
                // 두 필드가 모두 채워져 있지만 일치하지 않는 경우
                this.passwordMatchStatus = { message: '비밀번호가 일치하지 않습니다.', color: 'red' };
            }
        },


        // 인증번호 발송 로직
        async sendVerificationCode() {
            if (this.form.email.trim() === '' || !this.form.email.includes('@')) {
                alert('유효한 이메일 주소를 입력해주세요.');
                return;
            }

            this.isSendingCode = true;
            this.isEmailVerified = false; // 재전송 시 인증 상태 초기화
            this.stopEmailTimer(); // 기존 타이머 중지

            try {
                const response = await axios.post(`${this.baseUrl}/email`, {
                    email: this.form.email
                });
                alert('인증번호가 발송되었습니다: ' + response.data);
                this.showAuthCodeInput = true;
                this.startEmailTimer();
            } catch (error) {
                console.error('인증번호 발송 실패:', error.response ? error.response.data : error.message);
                alert(error.response ? error.response.data : '인증번호 발송에 실패했습니다. 다시 시도해주세요.');
                this.showAuthCodeInput = false;
            } finally {
                this.isSendingCode = false;
            }
        },

        startEmailTimer() {
            this.emailTimeLeft = this.initialEmailTimerDuration;
            this.emailTimerRunning = true;
            if (this.emailTimer) {
                clearInterval(this.emailTimer);
            }
            this.emailTimer = setInterval(() => {
                if (this.emailTimeLeft > 0) {
                    this.emailTimeLeft--;
                } else {
                    this.stopEmailTimer();
                    alert('인증번호 유효 시간이 만료되었습니다. 다시 발송해주세요.');
                }
            }, 1000);
        },

        stopEmailTimer() {
            if (this.emailTimer) {
                clearInterval(this.emailTimer);
                this.emailTimer = null;
            }
            this.emailTimerRunning = false;
        },

        // 인증번호 확인 로직
        async verifyEmailCode() {
            if (this.form.authCode.trim() === '') {
                alert('인증번호를 입력해주세요.');
                return;
            }
            if (!this.emailTimerRunning || this.emailTimeLeft <= 0) {
                alert('인증번호 유효 시간이 만료되었거나, 인증번호를 발송하지 않았습니다.');
                return;
            }

            this.isVerifyingCode = true;
            try {
                const response = await axios.post(`${this.baseUrl}/email/verify`, {
                    email: this.form.email,
                    code: this.form.authCode
                });
                alert('인증번호 확인: ' + response.data);
                this.isEmailVerified = true;
                this.stopEmailTimer();
            } catch (error) {
                console.error('인증번호 확인 실패:', error.response ? error.response.data : error.message);
                alert(error.response ? error.response.data : '인증번호 확인에 실패했습니다.');
                this.isEmailVerified = false;
            } finally {
                this.isVerifyingCode = false;
            }
        },

        // 회원가입 최종 처리 로직
        async handleSignup() {
            if (!this.canSubmit) {
                alert('필수 정보를 모두 올바르게 입력하고 이메일 인증을 완료해주세요.');
                return;
            }

            this.isSigningUp = true;
            try {
                const response = await axios.post(`${this.baseUrl}/members/signup`, {
                    userId: this.form.username,
                    password: this.form.password,
                    email: this.form.email
                });
                alert('회원가입이 성공적으로 완료되었습니다! ' + response.data);

                if (this.$router) {
                    this.$router.push('/'); 
                } else {
                    window.location.href = '/';
                }
            } catch (error) {
                console.error('회원가입 실패:', error.response ? error.response.data : error.message);
                alert(error.response ? error.response.data : '회원가입 중 오류가 발생했습니다.');
            } finally {
                this.isSigningUp = false;
            }
        }
    },
    // 컴포넌트가 파괴될 때 타이머를 정리하여 메모리 누수 방지
    beforeUnmount() {
        this.stopEmailTimer();
        if (this.passwordLengthTimer) { // 비밀번호 길이 타이머도 정리
            clearTimeout(this.passwordLengthTimer);
        }
    }
};
</script>

<style>
:root {
    --main-color: #FF5D00;
    --light-bg: #f9f9f9;
    --text-color: #333;
    --placeholder-color: #aaa;
    --border-color: #ddd;
    --focus-border-color: #FF7D33;
    --button-hover-color: #E65200;
}
</style>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap');

    .signup-page-wrapper {
        font-family: 'Noto Sans KR', sans-serif;
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
        min-height: 680px;
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
        padding: 50px;
        box-sizing: border-box;
        position: relative;
    }

    .logo {
        width: 160px;
        margin-bottom: 50px;
    }

    .logo img {
        width: 100%;
        height: auto;
    }

    .signup-form {
        width: 100%;
        max-width: 380px;
    }

    .input-group {
        margin-bottom: 25px;
        position: relative;
    }

    .input-group label {
        display: block;
        margin-bottom: 10px;
        font-size: 15px;
        font-weight: 500;
        color: var(--text-color);
    }

    .input-group input[type="text"],
    .input-group input[type="password"],
    .input-group input[type="email"] {
        width: calc(100% - 24px); /* 100%에서 좌우 패딩을 뺀 너비 */
        padding: 14px 12px;
        border: 1px solid var(--border-color); /* #ddd */
        border-radius: 6px;
        font-size: 17px;
        box-sizing: border-box;
        color: var(--text-color);
        transition: border-color 0.3s ease;
    }

    .input-group input::placeholder {
        color: var(--placeholder-color); /* #aaa */
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
        gap: 12px;
    }

    .input-with-button input {
        flex-grow: 1;
    }

    .input-with-button button {
        padding: 13px 18px;
        border: none;
        border-radius: 6px;
        background-color: var(--main-color);
        color: white;
        font-size: 15px;
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

    .input-with-button button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    .auth-code-input {
        margin-top: 15px;
    }

    .timer-display {
        margin-top: 8px;
        color: var(--main-color);
        font-size: 14px;
        font-weight: bold;
        text-align: right;
    }
    .verification-status {
        margin-top: 8px;
        font-size: 14px;
        font-weight: bold;
    }

    .status-message {
        font-size: 14px;
        margin-top: 8px;
        margin-left: 5px; /* 입력 필드와 간격 조절 */
        font-weight: bold;
    }

    .signup-button {
        width: 100%;
        padding: 16px;
        background-color: var(--main-color);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 19px;
        font-weight: 700;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        margin-top: 40px;
        box-shadow: 0 4px 10px rgba(255, 93, 0, 0.2);
    }

    .signup-button:hover {
        background-color: var(--button-hover-color);
        transform: translateY(-2px);
    }

    .signup-button:active {
        transform: translateY(0);
    }

    .signup-button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
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

    .right-panel h3 {
        font-size: 2.5em;
        margin-bottom: 25px;
        line-height: 1.3;
        font-weight: 700;
    }

    .right-panel img {
        width: 120px;
        margin-top: 40px;
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
            padding: 40px;
        }

        .right-panel {
            order: -1;
        }

        .right-panel h3 {
            font-size: 2.2em;
            margin-bottom: 20px;
        }

        .logo {
            margin-bottom: 30px;
        }

        .signup-form {
            max-width: 400px;
        }
    }

    @media (max-width: 576px) {
        .signup-page-wrapper {
            padding: 15px;
        }
        .left-panel,
        .right-panel {
            padding: 30px;
        }

        .right-panel h3 {
            font-size: 1.8em;
            margin-bottom: 15px;
        }

        .input-group label {
            font-size: 14px;
        }

        .input-group input,
        .input-with-button button,
        .signup-button {
            font-size: 15px;
            padding: 11px 10px;
        }

        .signup-button {
            margin-top: 30px;
            padding: 14px;
            font-size: 17px;
        }

        .logo {
            width: 140px;
            margin-bottom: 40px;
        }

        .right-panel img {
            width: 100px;
            margin-top: 30px;
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

        .signup-button {
            padding: 12px;
            font-size: 16px;
        }

        .left-panel,
        .right-panel {
            padding: 20px;
        }
    }
</style>