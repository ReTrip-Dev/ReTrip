<template>
  <div class="travel-summary-wrapper">
    <header class="header">
      <div class="logo-area">
        <a href="/">
          <img src="/src/assets/logo(1).png" alt="ReTrip Logo" class="retrip-logo-icon">
        </a>
      </div>
    </header>

    <div class="travel-summary-card" ref="travelSummaryCard">
      <div class="card-header">
        <div class="background-flag" :style="headerFlagStyle"></div>
        <div class="header-content">✈️ 여행 Recap</div>
      </div>

      <div class="profile-summary-section">
        <div class="user-info-row">
          <span class="username-tag">
            {{ userData.username }}
          </span>
        </div>
        <div class="keywords-mbti-row">
          <span class="keywords-tag">
            <span v-for="(keyword, idx) in userData.enhancedKeywords" :key="idx">
              {{ keyword }}
            </span>
          </span>
          <span class="mbti-tag">
            {{ userData.mbti }}
          </span>
        </div>
        <div class="summary-line">
          {{ userData.summaryLine }}
        </div>

        <div class="stats-grid">
          <div class="stat-box">
            <strong class="stat-title">내가 애정하는 피사체 TOP3</strong>
            <div class="favorite-subjects">
              <div v-for="(subject, index) in userData.favoriteSubjects" :key="index" class="subject-icon-wrapper">
                {{ subject }} </div>
            </div>
          </div>

          <div class="stat-box">
            <strong class="stat-title">나의 최애 포토 스팟</strong>
            <span class="stat-value">{{ userData.favoritePhotoSpot }}</span>
            <span class="stat-emoji">📷</span>
          </div>

          <div class="stat-box">
            <strong class="stat-title">이번 여행 이동 거리</strong>
            <span class="stat-value">{{ userData.travelDistance }}</span>
            <span class="stat-emoji">🗺️</span>
          </div>

          <div class="stat-box">
            <strong class="stat-title">이 시간에 사진을 찍는 걸 제일 좋아해요</strong>
            <span class="stat-value">{{ userData.favoritePhotoTime }}</span>
            <span class="stat-emoji">⏰</span>
          </div>

          <div class="stat-box span-two-columns">
            <strong class="stat-title">💫 못가봤다면 여기는 어때요?!</strong>
            <ul class="recommendation-list">
              <li v-for="(item, index) in userData.enhancedRecommendations" :key="index" class="recommendation-item">{{
                item }}</li>
            </ul>
          </div>
        </div>

        <div class="card-footer">
          <div class="trip-dates">
            🗓️ {{ userData.tripDates }}
          </div>
          <div class="hashtag">
            🔖 {{ userData.hashtag }}
          </div>
        </div>
      </div>
    </div>

    <div class="action-buttons-container">
      <button @click="captureAndSaveImage" class="action-button save-button">
        <i class="fas fa-save"></i> 이미지 저장
      </button>
      <button @click="captureAndShareImage" class="action-button share-button">
        <i class="fas fa-share-alt"></i> 공유하기
      </button>
    </div>

  </div>
</template>

<script setup>
import { reactive, computed, onMounted, ref, nextTick } from 'vue';
import html2canvas from 'html2canvas';

const userData = reactive({
  username: '여행자님',
  countryCode: 'KR',
  travelKeywords: ['#여행'],
  mbti: '#ISTJ',
  summaryLine: '멋진 여행이었어요!',
  favoriteSubjects: ['🏞️', '🍲', '🏙️'],
  favoritePhotoSpot: '알 수 없음',
  travelDistance: '0km',
  favoritePhotoTime: '알 수 없음',
  recommendations: ['새로운 곳을 탐험해보세요!'],
  tripDates: '미정',
  hashtag: '#ReTrip',

  get enhancedKeywords() {
    return Array.isArray(this.travelKeywords) ? this.travelKeywords.map(k => k.startsWith('#') ? k : `#${k}`) : [];
  },
  get enhancedRecommendations() {
    return Array.isArray(this.recommendations) ? this.recommendations.map(r => {
      if (typeof r === 'string' && (r.startsWith('• ') || /^[✨🍜🛍️💫🚲🌊🏊🌉⛺]/.test(r))) {
        return r;
      } else if (typeof r === 'string') {
        return `• ${r}`;
      }
      return r;
    }) : [];
  }
});

const travelSummaryCard = ref(null);

const headerFlagStyle = computed(() => {
  const code = userData.countryCode && userData.countryCode.length === 2 ? userData.countryCode.toLowerCase() : 'kr';
  return {
    backgroundImage: `url(https://flagcdn.com/w640/${code}.png)`
  };
});

onMounted(async () => {
  const reportDataString = localStorage.getItem('reportData');

  if (reportDataString) {
    try {
      const receivedData = JSON.parse(reportDataString);
      console.log('Retrip.vue: localStorage로부터 받은 원본 데이터:', receivedData);

      // Clean up localStorage after reading the data
      localStorage.removeItem('reportData');

      // userData 업데이트 로직은 기존과 동일
      if (receivedData.user) {
        userData.username = receivedData.user.username || userData.username;
        userData.countryCode = receivedData.user.countryCode || userData.countryCode;
        userData.mbti = receivedData.user.mbti ? (receivedData.user.mbti.startsWith('#') ? receivedData.user.mbti : `#${receivedData.user.mbti}`) : userData.mbti;
      }

      if (receivedData.tripSummary) {
        userData.summaryLine = receivedData.tripSummary.summaryLine || userData.summaryLine;
        userData.travelKeywords = Array.isArray(receivedData.tripSummary.keywords) ? [...receivedData.tripSummary.keywords] : userData.travelKeywords;
        userData.tripDates = receivedData.tripSummary.tripDates || userData.tripDates;
      }

      if (receivedData.photoStats) {
        userData.favoriteSubjects = Array.isArray(receivedData.photoStats.favoriteSubjects) ? [...receivedData.photoStats.favoriteSubjects] : userData.favoriteSubjects;
        userData.favoritePhotoSpot = receivedData.photoStats.favoritePhotoSpot || userData.favoritePhotoSpot;
        userData.favoritePhotoTime = receivedData.photoStats.favoritePhotoTime || userData.favoritePhotoTime;
      }

      if (receivedData.travelStats) {
        userData.travelDistance = receivedData.travelStats.travelDistance || userData.travelDistance;
      }

      if (Array.isArray(receivedData.recommendations)) {
        userData.recommendations = receivedData.recommendations.map(rec =>
          `${rec.emoji} ${rec.place}${rec.description ? ` (${rec.description})` : ''}`
        );
      }

      console.log('Retrip.vue: 처리된 reportData:', userData);

      await nextTick();

    } catch (error) {
      console.error('Retrip.vue: localStorage에서 리포트 데이터 처리 중 에러 발생:', error);
      alert('여행 리포트 데이터를 불러오는 데 실패했습니다.');
    }
  } else {
    console.log('Retrip.vue: localStorage에 reportData가 없어 기본 데이터를 사용합니다.');
    alert('이전 페이지에서 전달된 리포트 데이터가 없습니다. 기본 데이터를 표시합니다.');
  }
});

// 기존의 "이미지 저장" 버튼 클릭 시 동작 (사용자 다운로드)
const captureAndSaveImage = async () => {
  if (!travelSummaryCard.value) return;
  try {
    const canvas = await html2canvas(travelSummaryCard.value, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scale: 2,
    });
    const image = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.href = image;
    link.download = 'retrip-summary.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error capturing image for save:', error);
    alert('이미지 저장에 실패했습니다.');
  }
};

// 기존의 "공유하기" 버튼 클릭 시 동작 (웹 공유 API)
const captureAndShareImage = async () => {
  if (!travelSummaryCard.value) return;
  try {
    const canvas = await html2canvas(travelSummaryCard.value, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scale: 2,
    });
    canvas.toBlob(async (blob) => {
      if (navigator.share && blob) {
        const filesArray = [
          new File([blob], 'retrip-summary.png', {
            type: 'image/png',
            lastModified: new Date().getTime(),
          }),
        ];
        try {
          await navigator.share({
            title: '나의 ReTrip 여행 리포트',
            text: '내 여행 리포트를 확인해보세요!',
            files: filesArray,
          });
          console.log('Image shared successfully');
        } catch (shareError) {
          console.error('Error sharing image:', shareError);
        }
      } else {
        alert('브라우저가 공유 기능을 지원하지 않습니다. 이미지를 저장한 후 직접 공유해주세요.');
      }
    }, 'image/png');
  } catch (error) {
    console.error('Error capturing image for share:', error);
    alert('공유 이미지 생성에 실패했습니다.');
  }
};
</script>

<style>
/* ... (기존 스타일 코드 유지) ... */
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
  /* Approximate for Tailwind's blue-100 */
  --color-blue-800: #1E40AF;
  /* Approximate for Tailwind's blue-800 */
  --color-gray-50: #F9FAFB;
  /* Approximate for Tailwind's gray-50 */
  --color-gray-200: #E5E7EB;
  /* Approximate for Tailwind's gray-200 */
  --color-blue-500: #3B82F6;
  /* Approximate for Tailwind's blue-500 */

  /* Spacing */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;

  /* Border Radii */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  --border-radius-2xl: 20px;
  --border-radius-3xl: 24px;
  --border-radius-full: 9999px;

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
.travel-summary-wrapper {
  display: flex;
  flex-direction: column;
  /* Ensure header and card are stacked */
  align-items: center;
  /* Center the card horizontally */
  min-height: 100vh;
  /* full height */
  background-color: var(--color-background-light);
  padding: var(--spacing-5);
  padding-top: 85px;
  /* Added padding for fixed header (65px header + 20px original padding) */
  /* Add padding-bottom to make space for action buttons */
  padding-bottom: 100px;
  /* Adjust as needed */
  box-sizing: border-box;
  /* Include padding in element's total width and height */
  font-family: 'Noto Sans KR', sans-serif;
  /* Apply font globally to this component */
}

/* Header styles copied from RetripReportGenerator.vue - ensure variables are accessible or defined */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px 20px;
  box-sizing: border-box;
  background-color: var(--white);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: none;
  border-radius: 0;
}

.logo-area {
  display: flex;
  align-items: center;
  color: var(--primary-orange);
  height: 50px;
}

.logo-area a {
  display: block;
  width: auto;
  height: 100%;
  text-decoration: none;
}

.logo-area img.retrip-logo-icon {
  max-height: 100%;
  width: auto;
  display: block;
}

.nav-link {
  color: var(--medium-gray);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: var(--border-radius-button);
  transition: background-color 0.3s ease, color 0.3s ease;
  font-size: 1em;
  color: var(--primary-orange);
  border: 2px solid var(--primary-orange);
}

.nav-link:hover {
  background-color: var(--pale-orange);
  color: var(--primary-orange);
}


.action-buttons-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
  max-width: 448px;
  padding: 0 var(--spacing-4);
  box-sizing: border-box;
}

.action-button {
  flex-grow: 1;
  padding: 12px 20px;
  border: none;
  border-radius: var(--border-radius-button);
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.action-button .fas {
  font-size: 1.1em;
}

.save-button {
  background-color: var(--color-primary-orange);
  color: var(--color-white);
  box-shadow: 0 4px 10px rgba(255, 93, 0, 0.2);
}

.save-button:hover {
  background-color: var(--light-orange);
  box-shadow: 0 6px 15px rgba(255, 93, 0, 0.3);
  transform: translateY(-2px);
}

.share-button {
  background-color: var(--color-blue-500);
  color: var(--color-white);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
}

.share-button:hover {
  background-color: #2563EB;
  box-shadow: 0 6px 15px rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
}


/* Main card container */
.travel-summary-card {
  width: 100%;
  max-width: 448px;
  background-color: var(--color-white);
  border-radius: var(--border-radius-3xl);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  text-align: center;
  position: relative;
  padding-bottom: var(--spacing-8);
}

/* Header section with "여행 Recap" */
.card-header {
  background-color: transparent;
  padding-top: var(--spacing-8);
  padding-bottom: var(--spacing-16);
  color: var(--color-white);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-extrabold);
  border-top-left-radius: var(--border-radius-3xl);
  border-top-right-radius: var(--border-radius-3xl);
  position: relative;
  overflow: hidden;
}

/* Full opacity background flag */
.background-flag {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 1;
  z-index: 1;
}

/* Ensure header text remains readable against any flag */
.header-content {
  position: relative;
  z-index: 2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 0, 0, 0.5);
  background-color: rgba(0, 0, 0, 0.3);
  display: inline-block;
  padding: var(--spacing-2) var(--spacing-6);
  border-radius: var(--border-radius-xl);
}

/* Profile and main summary section with updated text contrast */
.profile-summary-section {
  background-color: #ffe6cc;
  padding-top: var(--spacing-10);
  padding-left: var(--spacing-6);
  padding-right: var(--spacing-6);
  padding-bottom: var(--spacing-6);
  border-radius: var(--border-radius-2xl);
  margin-left: var(--spacing-4);
  margin-right: var(--spacing-4);
  margin-top: calc(-1 * var(--spacing-12));
  position: relative;
  z-index: 10;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* User info row */
.user-info-row,
.keywords-mbti-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-2);
  flex-wrap: wrap;
}

.username-tag {
  background-color: var(--color-primary-orange);
  color: var(--color-white);
  padding: var(--spacing-2) var(--spacing-5);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

.flag-tag {
  display: flex;
  align-items: center;
  background-color: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

.flag-in-tag {
  margin-right: var(--spacing-2);
}

.country-code {
  color: #999;
  font-size: 0.7em;
  margin-left: 2px;
}

.keywords-tag {
  background-color: #E0F2F7;
  color: #00549E;
  padding: var(--spacing-2) var(--spacing-5);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
  border: 1px solid #BFD3E1;
}

.mbti-tag {
  background-color: var(--color-secondary-yellow);
  color: #664400;
  padding: var(--spacing-2) var(--spacing-5);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-extrabold);
  white-space: nowrap;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Summary line - improved contrast */
.summary-line {
  color: #994400;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-top: var(--spacing-5);
  padding-bottom: var(--spacing-5);
  border-bottom: 2px dashed #ffb366;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
}

/* Main statistics grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-4);
  margin-top: var(--spacing-8);
}

.stat-box {
  background-color: white;
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-4);
  text-align: left;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 120px;
}

.stat-box.yellow-bg {
  background-color: var(--color-secondary-yellow);
  justify-content: center;
  align-items: center;
  text-align: center;
}

.stat-box.span-two-columns {
  grid-column: span 2 / span 2;
}

.stat-title {
  display: block;
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-1);
  color: #664400;
  font-weight: var(--font-weight-bold);
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-dark-gray);
}

.stat-emoji {
  font-size: var(--font-size-3xl);
  margin-top: var(--spacing-2);
  align-self: flex-end;
  color: var(--color-gray-700);
}

.stat-box.yellow-bg .stat-title,
.stat-box.yellow-bg .stat-value,
.stat-box.yellow-bg .stat-emoji {
  color: var(--color-dark-gray);
}

/* Specific emoji color overrides for consistency with previous Tailwind */
.stat-box:nth-child(2) .stat-emoji {
  color: #4B5563;
}

.stat-box:nth-child(3) .stat-emoji {
  color: var(--color-blue-500);
}

.stat-box:nth-child(4) .stat-emoji {
  color: #6B7280;
}


/* Favorite subjects icons */
.favorite-subjects {
  display: flex;
  gap: var(--spacing-2);
  margin-top: var(--spacing-2);
}

.subject-icon-wrapper {
  width: var(--spacing-10);
  height: var(--spacing-10);
  background-color: var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
  color: var(--color-medium-gray);
  transition: transform 0.2s ease;
}

.subject-icon-wrapper:hover {
  transform: scale(1.1);
}

/* Recommendation list */
.recommendation-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: var(--font-size-sm);
  color: #333333;
  font-weight: var(--font-weight-bold);
  text-align: left;
  line-height: 1.4;
}

.recommendation-list li {
  margin-bottom: 2px;
}

.recommendation-list li:last-child {
  margin-bottom: 0;
}

/* Date and Hashtag Footer */
.card-footer {
  margin-top: var(--spacing-8);
  padding-top: var(--spacing-5);
  border-top: 2px dashed #ffb366;
}

.trip-dates {
  color: var(--color-medium-gray);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.hashtag {
  color: var(--color-primary-orange);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-extrabold);
  margin-top: var(--spacing-2);
  position: relative;
  display: inline-block;
  animation: pulse 2s infinite;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}
</style>