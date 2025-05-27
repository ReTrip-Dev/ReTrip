<template>
    <div class="retrip-history-page">
        <header class="rhp-header">
            <div class="rhp-logo-area">
                <a href="/photo">
                    <img src="/src/assets/logo(1).png" alt="ReTrip Logo" class="rhp-retrip-logo-icon">
                </a>
            </div>
            <a href="/history" class="rhp-nav-link rhp-current-page-link">히스토리</a>
        </header>

        <div class="rhp-history-content-container">
            <div class="rhp-page-title-section">
                <h1 class="rhp-main-title-history">My Retrip Library</h1>
                <p class="rhp-subtitle-history">당신이 저장한 아름다운 순간들을 다시 만나보세요.</p>
            </div>

            <div v-if="loading" class="rhp-loading-container">
                <div class="rhp-spinner"></div>
                <p>히스토리를 불러오는 중...</p>
            </div>

            <div v-else-if="error" class="rhp-message-container rhp-error-message-box">
                <i class="fas fa-exclamation-triangle rhp-error-icon"></i>
                <p><strong>오류가 발생했습니다</strong></p>
                <p>{{ error }}</p>
                <button @click="fetchRetripHistory" class="rhp-retry-button">다시 시도</button>
            </div>

            <div v-else-if="retripImages.length === 0" class="rhp-message-container rhp-no-history-box">
                <i class="fas fa-images rhp-no-history-icon"></i>
                <p><strong>아직 저장된 리트립 이미지가 없습니다.</strong></p>
                <p>새로운 리트립을 추가하여 추억을 만들어보세요!</p>
                <router-link to="/photo" class="rhp-add-retrip-button">리트립 만들러 가기</router-link>
            </div>

            <div v-else class="rhp-image-grid">
                <div v-for="image in retripImages" :key="image.id || image.imageUrl" class="rhp-image-card">
                    <img :src="image.imageUrl" :alt="image.description || 'Retrip Image'" class="rhp-retrip-image"
                        loading="lazy">
                    <div class="rhp-image-overlay">
                        <p class="rhp-image-description">{{ image.description || '여행의 순간' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'RetripHistoryPage',
    data() {
        return {
            retripImages: [],
            loading: true,
            error: null,
            // API_BASE_URL은 실제 백엔드 API의 기본 URL로 설정해야 합니다.
            API_BASE_URL: 'http://localhost:8080' // 실제 백엔드 주소로 변경해주세요!
        };
    },
    created() {
        this.fetchRetripHistory();
    },
    methods: {
        async fetchRetripHistory() {
            this.loading = true;
            this.error = null;
            try {
                // memberId 없이 직접 /api/members/history 엔드포인트 호출
                const response = await axios.get(
                    `${this.API_BASE_URL}/api/members/history`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            // 'Authorization': `Bearer ${localStorage.getItem('token')}` // 예시: 토큰이 있다면 헤더에 추가
                        }
                    }
                );
                // 백엔드 응답이 객체 배열이고, 각 객체가 imageUrl, description, id 등을 포함한다고 가정
                this.retripImages = response.data.map(item => ({
                    id: item.retripId || item.id, // retripId 또는 id 필드 사용
                    imageUrl: item.s3Url || item.imageUrl, // s3Url 또는 imageUrl 필드 사용
                    description: item.description || `리트립 ID: ${item.retripId || item.id}` // 설명이 없으면 ID 기반으로 생성
                }));
            } catch (err) {
                console.error('리트립 히스토리 조회 중 오류 발생:', err);
                this.error = '리트립 히스토리를 불러오는데 실패했습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.';
                if (err.response && err.response.data) {
                    this.error = err.response.data.message || this.error;
                }
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<style scoped>
/* Google Fonts import for Noto Sans KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap');

/* CSS Variables for consistent styling */
:root {
    /* Colors */
    --color-primary-orange: #FF6F00;
    --color-secondary-yellow: #FFD700;
    --color-background-light: #F7F7F7;
    --color-white: #FFFFFF;
    --color-dark-gray: #333333;
    --color-medium-gray: #666666;
    --color-light-gray: #EEEEEE;
    --color-blue-100: #E0F2F7;
    --color-blue-800: #1E40AF;
    --color-blue-500: #3B82F6;
    --color-red-error: #e74c3c;
    /* Added for error messages */
    --color-darker-blue: #2563EB;
    /* For share button hover */
    --color-pale-orange: #FFE6CC;
    /* From previous RetripHistoryPage */
    --color-light-orange: #FF8C4A;
    /* From previous RetripHistoryPage */


    /* Spacing */
    --spacing-1: 4px;
    --spacing-2: 8px;
    --spacing-3: 12px;
    --spacing-4: 16px;
    --spacing-5: 20px;
    --spacing-6: 24px;
    --spacing-8: 32px;
    --spacing-10: 40px;


    /* Border Radii */
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    --border-radius-xl: 16px;
    --border-radius-2xl: 20px;
    --border-radius-3xl: 24px;
    --border-radius-full: 9999px;
    --border-radius-button: var(--border-radius-lg);
    /* Using existing variable */

    /* Font Sizes */
    --font-size-xs: 0.75rem;
    /* 12px */
    --font-size-sm: 0.875rem;
    /* 14px */
    --font-size-base: 1rem;
    /* 16px */
    --font-size-lg: 1.125rem;
    /* 18px */
    --font-size-xl: 1.25rem;
    /* 20px */
    --font-size-2xl: 1.5rem;
    /* 24px */
    --font-size-3xl: 1.875rem;
    /* 30px */

    /* Font Weights */
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --font-weight-extrabold: 800;
}

/* Base styles for the component's root element */
.retrip-history-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background-color: var(--color-background-light);
    padding-top: 85px;
    /* Space for fixed header (65px header + 20px margin) */
    box-sizing: border-box;
    font-family: 'Noto Sans KR', sans-serif;
}

/* Header styles */
.rhp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 15px 20px;
    box-sizing: border-box;
    background-color: var(--color-white);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    /* Consistent with .travel-summary-wrapper header */
}

.rhp-logo-area {
    display: flex;
    align-items: center;
    height: 50px;
}

.rhp-logo-area a {
    display: block;
    height: 100%;
    text-decoration: none;
}

.rhp-logo-area img.rhp-retrip-logo-icon {
    max-height: 100%;
    width: auto;
    display: block;
}

.rhp-nav-link {
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    padding: var(--spacing-2) var(--spacing-3);
    border-radius: var(--border-radius-button);
    transition: background-color 0.3s ease, color 0.3s ease;
    font-size: var(--font-size-base);
    color: var(--color-primary-orange);
    border: 2px solid var(--color-primary-orange);
}

.rhp-nav-link:hover,
.rhp-nav-link.rhp-current-page-link {
    background-color: var(--color-pale-orange);
    color: var(--color-primary-orange);
}

.rhp-nav-link.rhp-current-page-link {
    font-weight: var(--font-weight-bold);
}


/* Content Container */
.rhp-history-content-container {
    width: 100%;
    max-width: 1200px;
    padding: var(--spacing-6) var(--spacing-5);
    box-sizing: border-box;
}

/* Title Section */
.rhp-page-title-section {
    text-align: center;
    margin-bottom: var(--spacing-8);
    padding-bottom: var(--spacing-4);
    border-bottom: 1px solid var(--color-light-gray);
}

.rhp-main-title-history {
    font-size: var(--font-size-3xl);
    color: var(--color-dark-gray);
    margin-bottom: var(--spacing-2);
    font-weight: var(--font-weight-bold);
}

.rhp-subtitle-history {
    font-size: var(--font-size-lg);
    color: var(--color-medium-gray);
}

/* Loading State */
.rhp-loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    font-size: var(--font-size-lg);
    color: var(--color-medium-gray);
}

.rhp-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: var(--color-primary-orange);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: var(--spacing-4);
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Message Containers (Error/No History) */
.rhp-message-container {
    text-align: center;
    padding: var(--spacing-6) var(--spacing-5);
    background-color: var(--color-white);
    border: 1px solid var(--color-light-gray);
    color: var(--color-medium-gray);
    border-radius: var(--border-radius-lg);
    margin-top: var(--spacing-8);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.rhp-message-container p {
    margin-bottom: var(--spacing-2);
    line-height: 1.6;
}

.rhp-message-container strong {
    color: var(--color-dark-gray);
    font-size: var(--font-size-xl);
    display: block;
    margin-bottom: var(--spacing-1);
}

.rhp-error-message-box {
    border-left: 5px solid var(--color-red-error);
}

.rhp-error-icon {
    font-size: 2.5em;
    color: var(--color-red-error);
    margin-bottom: var(--spacing-3);
}

.rhp-no-history-box {
    border-left: 5px solid var(--color-primary-orange);
}

.rhp-no-history-icon {
    font-size: 2.5em;
    color: var(--color-primary-orange);
    margin-bottom: var(--spacing-3);
}

/* Buttons */
.rhp-retry-button,
.rhp-add-retrip-button {
    background-color: var(--color-primary-orange);
    color: var(--color-white);
    border: none;
    padding: 10px 20px;
    border-radius: var(--border-radius-button);
    cursor: pointer;
    margin-top: var(--spacing-4);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    transition: background-color 0.3s ease, transform 0.2s ease;
    text-decoration: none;
    display: inline-block;
}

.rhp-retry-button:hover,
.rhp-add-retrip-button:hover {
    background-color: var(--color-light-orange);
    transform: translateY(-1px);
}

.rhp-add-retrip-button {
    background-color: var(--color-blue-500);
}

.rhp-add-retrip-button:hover {
    background-color: var(--color-darker-blue);
}


/* Image Grid */
.rhp-image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-6);
    margin-top: var(--spacing-6);
}

.rhp-image-card {
    background-color: var(--color-white);
    border-radius: var(--border-radius-lg);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.07);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    cursor: pointer;
}

.rhp-image-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.rhp-retrip-image {
    width: 100%;
    object-fit: cover;
    display: block;
    border-bottom: 1px solid var(--color-light-gray);
}

.rhp-image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
    color: var(--color-white);
    padding: var(--spacing-4);
    box-sizing: border-box;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    min-height: 30%;
    display: flex;
    align-items: flex-end;
}

.rhp-image-card:hover .rhp-image-overlay {
    opacity: 1;
    transform: translateY(0);
}

.rhp-image-description {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    margin: 0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .rhp-main-title-history {
        font-size: var(--font-size-2xl);
    }

    .rhp-subtitle-history {
        font-size: var(--font-size-base);
    }

    .rhp-image-grid {
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: var(--spacing-5);
    }

    .rhp-history-content-container {
        padding: var(--spacing-5) var(--spacing-4);
    }

    .rhp-retrip-image {
        height: 240px;
    }
}

@media (max-width: 480px) {
    .rhp-image-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-4);
    }

    .rhp-retrip-image {
        height: 220px;
    }

    .rhp-page-title-section {
        margin-bottom: var(--spacing-6);
    }

    .rhp-main-title-history {
        font-size: var(--font-size-xl);
    }

    .rhp-subtitle-history {
        font-size: var(--font-size-sm);
    }
}
</style>