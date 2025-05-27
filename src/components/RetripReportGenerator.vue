<template>
    <div class="photo-upload-page">
        <header class="header">
            <div class="logo-area">
                <a href="/photo">
                    <img src="/src/assets/logo(1).png" alt="ReTrip Logo" class="retrip-logo-icon">
                </a>
            </div>
            <a href="/history" class="nav-link">히스토리</a>
        </header>

        <div class="container">
            <h1 class="main-title">
                뚝딱! <strong>여행 리포트</strong> 만들기! <br>
                소중한 추억을 특별하게 기록해요
            </h1>

            <div class="upload-area" id="uploadArea" @click="triggerFileInput" @dragover.prevent="handleDragOver"
                @dragleave="handleDragLeave" @drop.prevent="handleDrop" :class="{ 'dragover': isDraggingOver }">
                <input type="file" id="fileInput" multiple accept="image/jpeg, image/png" @change="handleFileChange"
                    ref="fileInput">

                <div class="default-content" v-if="uploadedFiles.length === 0">
                    <div class="icon-wrapper">
                        <span class="material-icons">cloud_upload</span>
                    </div>
                    <p class="upload-text">사진을 끌어다 놓거나 클릭하여 추가해보세요!</p>
                    <p class="upload-hint">(최대 10장, JPG/PNG 형식)</p>
                </div>

                <div class="uploaded-files-display" v-else>
                    <p class="file-info-text">
                        <i class="fas fa-check-circle"></i> <span>{{ uploadedFiles.length }}개의 파일이 선택되었습니다.</span>
                    </p>
                    <div :class="['uploaded-thumbnails-container', { 'empty': uploadedFiles.length === 0 }]">
                        <h3>업로드된 사진</h3>
                        <ul class="uploaded-thumbnails-list">
                            <li v-for="(file, index) in uploadedFiles" :key="file.name + file.size">
                                <img :src="file.objectURL" :alt="`Uploaded Thumbnail ${index + 1}`"
                                    :title="file.name" />
                                <button class="thumbnail-remove-button" @click.stop="removeFile(index)">&times;</button>
                            </li>
                        </ul>
                    </div>
                </div>
                <p class="upload-hint">최소 5장 ~ 최대 20장, JPG/PNG 형식</p>
            </div>

            <button type="button" class="generate-button" @click="generateReport" :disabled="isGenerating"
                :class="{ 'loading': isGenerating }">
                {{ isGenerating ? '생성 중...' : '나만의 리포트 생성하기' }}
                <i class="fas fa-spinner spinner" v-if="isGenerating"></i>
            </button>

            <div class="results-preview-section">
                <h2>어떤 여행 리포트를 얻을 수 있나요?</h2>
                <div class="results-grid">
                    <div class="result-item">
                        <div class="icon-wrapper"><i class="fas fa-chart-pie"></i></div>
                        <div class="text-content">
                            <h3>여행 무드 분석</h3>
                            <p>AI가 분석한 이번 여행의 핵심 분위기를 한눈에!</p>
                        </div>
                    </div>
                    <div class="result-item">
                        <div class="icon-wrapper"><i class="fas fa-camera-retro"></i></div>
                        <div class="text-content">
                            <h3>피사체 TOP 3</h3>
                            <p>가장 많이 담은 풍경, 음식, 인물 등 테마별 분석.</p>
                        </div>
                    </div>
                    <div class="result-item">
                        <div class="icon-wrapper"><i class="fas fa-route"></i></div>
                        <div class="text-content">
                            <h3>총 이동 거리 & 경로</h3>
                            <p>이번 여행에서 이동한 총 거리와 경로를 시각화.</p>
                        </div>
                    </div>
                    <div class="result-item">
                        <div class="icon-wrapper"><i class="fas fa-clock"></i></div>
                        <div class="text-content">
                            <h3>사진 촬영 시간대 분석</h3>
                            <p>어떤 시간대에 주로 사진을 찍었는지 알려드려요.</p>
                        </div>
                    </div>
                    <div class="result-item">
                        <div class="icon-wrapper"><i class="fas fa-map-marker-alt"></i></div>
                        <div class="text-content">
                            <h3>가장 많이 찍은 장소 TOP 5</h3>
                            <p>여행 중 가장 기억에 남는 장소들을 순위로 확인!</p>
                        </div>
                    </div>
                    <div class="result-item">
                        <div class="icon-wrapper"><i class="fas fa-plane"></i></div>
                        <div class="text-content">
                            <h3>AI 추천 다음 여행지</h3>
                            <p>당신의 취향을 분석하여 다음 여행지를 추천합니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <p class="subtle-text-element">© 2024 ReTrip. All rights reserved. Made with ❤️ and AI.</p>
    </div>
</template>

<script>
import axios from 'axios'; // Import axios

export default {
    name: 'PhotoUpload',
    data() {
        return {
            uploadedFiles: [],
            maxFiles: 20,
            minFiles: 5, // Minimum number of files required
            isDraggingOver: false,
            isGenerating: false,
        };
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleDragOver() {
            this.isDraggingOver = true;
        },
        handleDragLeave() {
            this.isDraggingOver = false;
        },
        handleDrop(event) {
            this.isDraggingOver = false;
            const files = event.dataTransfer.files;
            this.addFiles(files);
        },
        handleFileChange(event) {
            const files = event.target.files;
            this.addFiles(files);
            // Reset the file input to allow selecting the same file again
            // (이전에 선택한 파일과 동일한 파일을 다시 선택했을 때 change 이벤트가 발생하도록)
            event.target.value = '';
        },
        addFiles(newlySelectedFiles) {
            const validNewFiles = Array.from(newlySelectedFiles).filter(file => file.type.startsWith('image/'));
            const invalidNewFiles = Array.from(newlySelectedFiles).filter(file => !file.type.startsWith('image/'));

            if (invalidNewFiles.length > 0) {
                alert(`이미지 파일만 업로드할 수 있습니다.\n다음 파일들은 제외되었습니다: ${invalidNewFiles.map(f => f.name).join(', ')}`);
            }

            validNewFiles.forEach(newFile => {
                const isDuplicate = this.uploadedFiles.some(existingFile =>
                    existingFile.name === newFile.name && existingFile.size === newFile.size
                );
                if (!isDuplicate) {
                    // Create an object URL for the image preview
                    newFile.objectURL = URL.createObjectURL(newFile);
                    this.uploadedFiles.push(newFile);
                }
            });

            // 파일 개수 제한 (최대 20장)
            if (this.uploadedFiles.length > this.maxFiles) {
                alert(`최대 ${this.maxFiles}장까지만 업로드할 수 있습니다. 가장 먼저 추가된 파일부터 초과된 파일은 제외됩니다.`);
                // Remove files from the beginning if the limit is exceeded
                this.uploadedFiles = this.uploadedFiles.slice(this.uploadedFiles.length - this.maxFiles);
            }
        },
        removeFile(indexToRemove) {
            if (indexToRemove > -1 && indexToRemove < this.uploadedFiles.length) {
                // Revoke the object URL to free up memory
                URL.revokeObjectURL(this.uploadedFiles[indexToRemove].objectURL);
                this.uploadedFiles.splice(indexToRemove, 1);
            }
        },
        async generateReport() { // Make the method async
            if (this.isGenerating) {
                return;
            }

            if (this.uploadedFiles.length === 0) {
                alert('먼저 이미지를 선택해주세요.');
                return;
            }

            if (this.uploadedFiles.length < this.minFiles) {
                alert(`최소 ${this.minFiles}장 이상의 이미지를 선택해주세요.`);
                return;
            }

            if (this.uploadedFiles.length > this.maxFiles) {
                alert(`최대 ${this.maxFiles}장까지만 이미지를 선택할 수 있습니다.`);
                return;
            }

            this.isGenerating = true;

            const formData = new FormData();
            this.uploadedFiles.forEach(file => {
                formData.append('images', file); // Key 'images' as expected by backend
            });

            try {
                const response = await axios.post('http://localhost:8080/api/images/uploads', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                console.log('Report generation successful, server response:', response.data);

                // Navigate to Retrip.vue with the response data in history.state
                this.$router.push({
                    name: 'retrip', // Use route name for clarity if available
                    // path: '/retrip', // Or path
                    state: { reportData: response.data } // Pass data in history.state
                });
                
                this.resetUploadArea();

            } catch (error) {
                alert('여행 리포트 생성에 실패했습니다. 다시 시도해주세요.');
                console.error('Error uploading images:', error);
                if (error.response) {
                    console.error('Error response data:', error.response.data);
                    console.error('Error response status:', error.response.status);
                } else if (error.request) {
                    console.error('Error request:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
            } finally {
                this.isGenerating = false;
            }
        },
        resetUploadArea() {
            // Revoke all existing object URLs before clearing the array
            this.uploadedFiles.forEach(file => {
                URL.revokeObjectURL(file.objectURL);
            });
            this.uploadedFiles = [];
            // fileInput.value는 handleFileChange에서 이미 ''로 초기화됩니다.
        },
    },
    mounted() {
        // 컴포넌트 마운트 시 초기화 로직 (필요하다면)
        // this.resetUploadArea(); // 필요에 따라 초기화
    },
    beforeUnmount() {
        // 컴포넌트가 파괴되기 전에 생성된 Object URL들을 해제하여 메모리 누수 방지
        this.uploadedFiles.forEach(file => {
            URL.revokeObjectURL(file.objectURL);
        });
    }
};
</script>

<style scoped>
/*
    주의: 아래 CSS 코드는 photo.html에서 복사한 것이므로,
    Vue.js 프로젝트의 전역 스타일(예: index.css, main.css)과 중복될 수 있습니다.
    필요에 따라 전역으로 옮기거나, 중복을 제거해야 합니다.
    또한, :root 변수는 Vue 컴포넌트 스코프 내에서 작동하지 않을 수 있으므로,
    Vue의 스타일 변수 (CSS Modules 또는 SCSS 변수) 또는 직접 값을 사용하는 것을 고려하세요.
    현재는 <style scoped> 내에 그대로 두어 컴포넌트에 한정적으로 적용되도록 합니다.
*/

/* 변수 설정 (새로운 메인 주황색 #FF5D00 기반) */
/* :root는 scoped CSS에서 직접 작동하지 않으므로, 변수들을 직접 사용하거나,
   변수를 정의하는 별도의 전역 CSS 파일로 분리하는 것이 좋습니다.
   여기서는 편의상 그대로 두지만, 실제 프로젝트에서는 재고가 필요합니다. */
:root {
    --primary-orange: #FF5D00;
    /* 새로운 메인 색상 */
    --light-orange: #FF8F40;
    /* 메인 색상보다 약간 밝게 */
    --pale-orange: #FFE6CC;
    /* 메인 색상 기반 아주 연한 색 (배경/태그) */
    --off-white: #FFFFFF;
    /* 이제 body 배경색이 흰색이 되므로, off-white도 흰색으로 통일 */
    --white: #FFFFFF;
    /* 흰색 카드 배경 (변화 없음) */
    --dark-gray: #333333;
    /* 주요 텍스트 색상 */
    --medium-gray: #666666;
    /* 보조 텍스트 색상 */
    --light-border: #EEEEEE;
    /* 연한 테두리 */
    --shadow-subtle: 0 4px 10px rgba(0, 0, 0, 0.05);
    /* 은은한 그림자 */
    --border-radius-card: 16px;
    /* 카드 둥근 모서리 */
    --border-radius-tag: 8px;
    /* 태그 둥근 모서리 */
    --border-radius-button: 12px;
    /* 버튼 둥근 모서리 */
    --thumbnail-size: 60px;
    /* 썸네일 기본 크기 */
    --thumbnail-gap: 8px;
    /* 썸네일 간 간격 */
}

body {
    font-family: 'Pretendard', sans-serif;
    background-color: var(--white);
    /* body 배경색을 흰색으로 변경하여 헤더와의 경계를 없앰 */
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    color: var(--dark-gray);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
    line-height: 1.6;
    overflow-x: hidden;
    /* 헤더가 fixed 되면서 가려지는 부분을 위해 상단에 패딩 추가 */
    padding-top: 65px;
    /* 헤더의 실제 높이(약 60px)에 맞게 조정 (반응형 고려) */
}

/* 스크롤바 커스터마이징 (웹킷 브라우저) */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb {
    background: #a0a0a0;
    border-radius: 10px;
    border: 2px solid #f1f1f1;
}

::-webkit-scrollbar-thumb:hover {
    background: #808080;
}

.container {
    width: 100%;
    max-width: 768px;
    /* 앱 화면 너비에 맞춤 */
    padding: 0 20px;
    /* 좌우 패딩만 유지 */
    box-sizing: border-box;
}

/* 헤더 */
.header {
    display: flex;
    justify-content: space-between;
    /* 로고와 메뉴를 양쪽 끝으로 */
    align-items: center;
    width: 100%;
    /* 화면 전체 너비 차지 */
    padding: 15px 20px;
    /* 내부 패딩 */
    box-sizing: border-box;
    background-color: var(--white);
    /* body 배경색과 동일하게 */
    position: fixed;
    /* 화면 상단에 고정 */
    top: 0;
    left: 0;
    /* 완전 왼쪽으로 */
    right: 0;
    /* 완전 오른쪽으로 */
    z-index: 100;
    box-shadow: none;
    /* 그림자 제거하여 body와의 경계 없앰 */
    border-radius: 0;
    /* 둥근 모서리 제거하여 완전 직사각형 */
    animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
    0% {
        opacity: 0;
        transform: translateY(-20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.logo-area {
    display: flex;
    align-items: center;
    /* 기존 font-size, font-weight 제거 */
    color: var(--primary-orange);
    height: 50px;
    /* Adjust as needed */
}

.logo-area a {
    display: block;
    /* 또는 inline-block, flex */
    width: auto;
    /* 또는 특정 px 값, 예: 150px */
    height: 100%;
    /* 부모의 높이를 따르도록 */
    text-decoration: none;
    /* 필요하다면 링크 밑줄 제거 */
}

.logo-area img {
    max-height: 100%;
    width: auto;
    /* 원본 비율 유지 */
    display: block;
    /* 이미지가 부모 a 태그 안에 딱 맞게 정렬되도록 */
}

.nav-link {
    color: var(--medium-gray);
    text-decoration: none;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: var(--border-radius-button);
    transition: background-color 0.3s ease, color 0.3s ease;
    /* "서비스 소개" 스타일 */
    font-size: 1em;
    /* Adjust as needed */
    color: var(--primary-orange);
    /* Or any color you prefer */
    border: 2px solid var(--primary-orange);
    /* Added border */
}

.nav-link:hover {
    background-color: var(--pale-orange);
    color: var(--primary-orange);
}

/* 메인 제목 */
.main-title {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 25px;
    font-size: 2em;
    font-weight: 700;
    color: var(--dark-gray);
    animation: fadeIn 1s ease-out 0.2s backwards;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.main-title strong {
    color: var(--primary-orange);
}

/* 기본 스타일 (모든 예시에 공통 적용될 수 있는) */
.upload-area {
    border: 2px dashed #ccc;
    border-radius: 10px;
    padding: 30px;
    text-align: center;
    position: relative;
    /* width: 400px; */
    width: 100%;
    margin: 50px auto;
    font-family: sans-serif;
    color: #555;
    background-color: #f9f9f9;
    box-sizing: border-box;
}

.upload-area input[type="file"] {
    display: none;
    /* 실제 파일 입력 필드는 숨김 */
}

.default-content .upload-text {
    font-size: 1.1em;
    margin-top: 15px;
}

.upload-hint {
    font-size: 0.9em;
    color: #888;
    margin-top: 5px;
}

/* 겹쳐진 카드 효과 */
.initial-image-stack.overlapping-cards {
    position: relative;
    width: 180px;
    /* 이미지 너비 조절 */
    height: 120px;
    /* 이미지 높이 조절 */
    margin: 20px auto;
    display: block;
    /* 기본 아이콘 숨김 */
}

.overlapping-cards img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 이미지가 잘리지 않고 채워지도록 */
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

@keyframes popInScale {
    0% {
        opacity: 0;
        transform: scale(0.9);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.upload-area:hover {
    background-color: var(--off-white);
    border-color: var(--primary-orange);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.upload-area.dragover {
    background-color: var(--pale-orange);
    border-color: var(--primary-orange);
    box-shadow: 0 6px 15px rgba(255, 93, 0, 0.2);
}

.upload-area input[type="file"] {
    display: none;
}

.upload-area .default-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--medium-gray);
    transition: opacity 0.3s ease, transform 0.3s ease;
    position: relative;
    /* 자식 요소의 z-index를 위해 */
    z-index: 2;
    /* 이미지 스택 위에 오도록 */
}

.upload-area .icon-wrapper {
    margin-bottom: 15px;
}

.upload-area .material-icons {
    font-size: 3em;
    color: var(--light-orange);
    transition: color 0.3s ease;
}

.upload-area:hover .material-icons {
    color: var(--primary-orange);
}

.upload-area .upload-text {
    font-size: 1.1em;
    margin-bottom: 8px;
    color: var(--dark-gray);
}

.upload-area .upload-hint {
    font-size: 0.9em;
}

/* 업로드된 썸네일 컨테이너 */
.upload-area .uploaded-thumbnails-container {
    background-color: var(--white);
    border-radius: var(--border-radius-card);
    box-shadow: var(--shadow-subtle);
    padding: 5px;
    margin-top: 10px;
    margin-bottom: 10px;
    overflow-x: auto;
    white-space: nowrap;
    /* 썸네일들을 한 줄에 표시 */
    -webkit-overflow-scrolling: touch;
    /* iOS 부드러운 스크롤 */
    animation: fadeIn 1s ease-out 0.8s backwards;
    position: relative;
    z-index: 4;
    width: 100%;
    /* Add width to container */
    box-sizing: border-box;
    /* Ensure padding is inside the width */
}

.upload-area .uploaded-thumbnails-container h3 {
    font-size: 1.1em;
    font-weight: 600;
    color: var(--primary-orange);
    margin-top: 0;
    margin-bottom: 10px;
    padding-left: 10px;
}

.upload-area .uploaded-thumbnails-list {
    display: flex;
    /* Change to flex for horizontal layout */
    flex-direction: row;
    /* Ensure horizontal layout */
    align-items: center;
    padding: 10px;
    list-style: none;
    /* ul의 기본 점 제거 */
    margin: 0;
    position: relative;
    /* 자식 요소 z-index를 위해 */
    overflow-x: auto;
    /* Enable horizontal scrolling if needed */
    white-space: nowrap;
    /* Prevent wrapping */
}

.upload-area .uploaded-thumbnails-list li {
    display: inline-block;
    /* li 요소들을 인라인 블록으로 */
    position: relative;
    /* z-index를 위해 */
    margin-right: 5px;
    /* 썸네일 크기의 30%만큼 겹치도록 (조절 가능) */
    transition: transform 0.3s ease, z-index 0.3s ease;
    /* transition 추가 */
    transform-origin: center bottom;
    /* 회전 기준점 설정 */
}

/* 첫 번째 썸네일은 마이너스 마진을 주지 않아 시작 위치 고정 */
.upload-area .uploaded-thumbnails-list li:first-child {
    margin-left: 0;
}

/* 마지막 썸네일은 오른쪽 마진 제거 */
.upload-area .uploaded-thumbnails-list li:last-child {
    margin-right: 0;
}

.upload-area .uploaded-thumbnails-list img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--light-border);
    cursor: pointer;
    display: block;
    /* 이미지 하단 여백 제거 */
    transition: transform 0.2s ease-in-out;
    /* hover 시 부드러운 전환 */
    /* 초기 변형은 JS에서 설정 (쌓이는 효과) */
}

.upload-area .uploaded-thumbnails-list li:hover img {
    transform: translateY(-10px) scale(1.1) !important;
    /* 위로 살짝 올라오면서 확대, !important로 기본 transform 오버라이드 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
    /* 호버 시 가장 위에 오도록 z-index 높임 */
}

.upload-area .uploaded-thumbnails-list li:hover {
    z-index: 10;
    /* li 자체의 z-index도 높여서 삭제 버튼도 앞으로 오게 */
}

.upload-area .uploaded-thumbnails-container.empty {
    padding: 20px;
    text-align: center;
    color: var(--medium-gray);
}

.upload-area .uploaded-thumbnails-container.empty h3 {
    color: var(--medium-gray);
}

/* 초기 이미지 스택 (업로드 전 보이는 겹쳐진 이미지) */
.initial-image-stack {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* 중앙 정렬 */
    width: 150px;
    /* 스택 전체 너비 */
    height: 150px;
    /* 스택 전체 높이 */
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    /* 클릭 이벤트 방지 (아래 upload-area 클릭을 위함) */
    opacity: 1;
    transition: opacity 0.3s ease;
}

.initial-image-stack img {
    position: absolute;
    width: 120px;
    /* 개별 이미지 크기 */
    height: 120px;
    /* 개별 이미지 크기 */
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.5s ease;
    /* 부드러운 전환 */
    background-color: var(--white);
    /* 흰색 배경으로 투명도 강조 */
    border: 1px solid rgba(255, 93, 0, 0.1);
}

.initial-image-stack img:nth-child(1) {
    transform: rotate(-10deg) translateX(-20px) translateY(-10px);
    z-index: 1;
    opacity: 0.6;
}

.initial-image-stack img:nth-child(2) {
    transform: rotate(5deg) translateX(15px) translateY(5px);
    z-index: 2;
    opacity: 0.7;
}

.initial-image-stack img:nth-child(3) {
    transform: rotate(-3deg) translateX(-5px) translateY(15px);
    z-index: 3;
    opacity: 0.8;
}

.initial-image-stack img:nth-child(4) {
    transform: rotate(10deg) translateX(25px) translateY(-15px);
    z-index: 4;
    opacity: 0.9;
}

.initial-image-stack img:nth-child(5) {
    transform: rotate(-7deg) translateX(-10px) translateY(-20px);
    z-index: 5;
    opacity: 1;
}

/* 파일 미리보기 */
.upload-area .file-preview-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border-radius: var(--border-radius-card);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    opacity: 0;
    transform: scale(0.95);
    transition: all 0.3s ease-out;
    pointer-events: none;
    z-index: 1;
    /* 초기 스택 아래에 위치 */
}

.upload-area .file-preview-container.active {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
    z-index: 3;
    /* 파일 업로드 시 가장 위에 오도록 */
}

.file-preview-container .main-thumbnail {
    max-width: 90%;
    max-height: 120px;
    object-fit: contain;
    border-radius: var(--border-radius-button);
    margin-bottom: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.file-preview-container .file-info-text {
    font-size: 0.95em;
    color: var(--dark-gray);
    margin-top: 15px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.file-preview-container .file-info-text i {
    color: var(--primary-orange);
    font-size: 1.1em;
}

/* 업로드된 썸네일 컨테이너 */
.uploaded-thumbnails-container {
    background-color: var(--white);
    border-radius: var(--border-radius-card);
    box-shadow: var(--shadow-subtle);
    padding: 15px;
    margin-bottom: 30px;
    overflow-x: auto;
    white-space: nowrap;
    /* 썸네일들을 한 줄에 표시 */
    -webkit-overflow-scrolling: touch;
    /* iOS 부드러운 스크롤 */
    animation: fadeIn 1s ease-out 0.8s backwards;
}

.uploaded-thumbnails-container h3 {
    font-size: 1.1em;
    font-weight: 600;
    color: var(--primary-orange);
    margin-top: 0;
    margin-bottom: 10px;
    padding-left: 10px;
}

.uploaded-thumbnails-list {
    display: flex;
    /* 가로로 나란히 배치 */
    flex-direction: row;
    /* Ensure horizontal layout */
    align-items: center;
    padding: 5px;
    list-style: none;
    /* ul의 기본 점 제거 */
    margin: 0;
    position: relative;
    /* 자식 요소 z-index를 위해 */
    overflow-x: auto;
    /* Enable horizontal scrolling if needed */
    white-space: nowrap;
    /* Prevent wrapping */
}

.uploaded-thumbnails-list li {
    display: inline-block;
    /* li 요소들을 인라인 블록으로 */
    position: relative;
    /* z-index를 위해 */
    margin-right: calc(var(--thumbnail-size) * -0.3);
    /* 썸네일 크기의 30%만큼 겹치도록 (조절 가능) */
    transition: transform 0.3s ease, z-index 0.3s ease;
    /* transition 추가 */
    transform-origin: center bottom;
    /* 회전 기준점 설정 */
}

/* 첫 번째 썸네일은 마이너스 마진을 주지 않아 시작 위치 고정 */
.uploaded-thumbnails-list li:first-child {
    margin-left: 0;
}

/* 마지막 썸네일은 오른쪽 마진 제거 */
.uploaded-thumbnails-list li:last-child {
    margin-right: 0;
}

.uploaded-thumbnails-list img {
    width: var(--thumbnail-size);
    height: var(--thumbnail-size);
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--light-border);
    cursor: pointer;
    display: block;
    /* 이미지 하단 여백 제거 */
    transition: transform 0.2s ease-in-out;
    /* hover 시 부드러운 전환 */
    /* 초기 변형은 JS에서 설정 (쌓이는 효과) */
}

.uploaded-thumbnails-list li:hover img {
    transform: translateY(-10px) scale(1.1) !important;
    /* 위로 살짝 올라오면서 확대, !important로 기본 transform 오버라이드 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
    /* 호버 시 가장 위에 오도록 z-index 높임 */
}

.uploaded-thumbnails-list li:hover {
    z-index: 10;
    /* li 자체의 z-index도 높여서 삭제 버튼도 앞으로 오게 */
}

.uploaded-thumbnails-container.empty {
    padding: 20px;
    text-align: center;
    color: var(--medium-gray);
}

.uploaded-thumbnails-container.empty h3 {
    color: var(--medium-gray);
}

/* 썸네일 개별 삭제 버튼 */
.thumbnail-remove-button {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #f44336;
    /* 빨간색 */
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8em;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: background-color 0.2s ease;
    z-index: 10;
    /* 썸네일 위에 표시 (호버 시 더 높게) */
}

.thumbnail-remove-button:hover {
    background-color: #d32f2f;
}


/* 결과 미리보기 섹션 */
.results-preview-section {
    background-color: var(--white);
    border-radius: var(--border-radius-card);
    box-shadow: var(--shadow-subtle);
    padding: 30px;
    margin-bottom: 40px;
    animation: fadeIn 1s ease-out 0.6s backwards;
}

.results-preview-section h2 {
    text-align: center;
    font-size: 1.8em;
    font-weight: 700;
    color: var(--primary-orange);
    margin-bottom: 25px;
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.result-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    background-color: var(--off-white);
    border-radius: var(--border-radius-button);
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    opacity: 0;
    /* 애니메이션 시작 전 숨김 */
    animation: slideInUp 0.6s ease-out forwards;
}

.result-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.08);
}

/* 각 아이템에 애니메이션 지연시간 부여 */
.result-item:nth-child(1) {
    animation-delay: 0.2s;
}

.result-item:nth-child(2) {
    animation-delay: 0.3s;
}

.result-item:nth-child(3) {
    animation-delay: 0.4s;
}

.result-item:nth-child(4) {
    animation-delay: 0.5s;
}

.result-item:nth-child(5) {
    animation-delay: 0.6s;
}

.result-item:nth-child(6) {
    animation-delay: 0.7s;
}

@keyframes slideInUp {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.result-item .icon-wrapper {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    background-color: var(--light-orange);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5em;
    color: var(--white);
    box-shadow: 0 2px 5px rgba(255, 93, 0, 0.2);
}

.result-item .text-content {
    flex-grow: 1;
}

.result-item h3 {
    font-size: 1.1em;
    font-weight: 600;
    color: var(--dark-gray);
    margin-top: 0;
    margin-bottom: 5px;
}

.result-item p {
    font-size: 0.9em;
    color: var(--medium-gray);
    margin: 0;
}


/* 생성하기 버튼 */
.generate-button {
    display: block;
    width: 100%;
    padding: 15px 20px;
    margin: 40px auto 30px auto;
    /* 위아래 간격 조정 */
    background-color: var(--primary-orange);
    color: var(--white);
    border: none;
    border-radius: var(--border-radius-button);
    font-size: 1.1em;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px 10px rgba(255, 93, 0, 0.2);
    animation: fadeIn 1s ease-out 1.2s backwards;
}

.generate-button:hover {
    background-color: var(--light-orange);
    box-shadow: 0 6px 15px rgba(255, 93, 0, 0.3);
    transform: translateY(-2px);
}

.generate-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(255, 93, 0, 0.2);
}

.generate-button.loading {
    background-color: var(--pale-orange);
    /* 로딩 중 배경색 변경 */
    color: var(--medium-gray);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}

/* 점선 동그라미 스피너만 보이도록 CSS 수정 */
.generate-button .spinner {
    display: none;
    /* 기본적으로는 숨겨져 있음 */
    margin-left: 10px;
    /* 기존 border 속성 제거 (Font Awesome 스피너가 그려지도록) */
    /* border: 2px solid var(--primary-orange); */
    /* border-top: 2px solid transparent; */
    /* border-radius: 50%; */
    /* width: 16px; */
    /* height: 16px; */
    vertical-align: middle;
    /* Font Awesome 스피너도 자체 애니메이션을 가지고 있으므로,
        이 animation 속성은 제거하거나 필요에 따라 조절하세요.
        여기서는 Font Awesome의 기본 애니메이션을 방해하지 않도록 제거합니다. */
    animation: spin 1s linear infinite;
}

.generate-button.loading .spinner {
    display: inline-block;
}

/* @keyframes spin은 Font Awesome 스피너의 기본 애니메이션과 겹칠 수 있으므로 제거하거나,
    Font Awesome의 기본 애니메이션을 오버라이드할 때만 사용합니다.
   여기서는 Font Awesome의 기본 스피너를 가정하고 제거합니다. */

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}


/* 푸터 */
.subtle-text-element {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 20px;
    color: var(--medium-gray);
    font-size: 0.8em;
    animation: fadeIn 1s ease-out 1.6s backwards;
}

/* 반응형 디자인 */
@media (max-width: 600px) {
    body {
        padding-top: 60px;
        /* 모바일 헤더 높이에 맞게 조정 */
    }

    .container {
        padding: 0 15px;
        /* 좌우 패딩 */
    }

    .main-title {
        font-size: 1.8em;
    }

    .header {
        padding: 12px 15px;
    }

    .nav-link {
        padding: 6px 10px;
        font-size: 0.9em;
    }

    .upload-area {
        padding: 20px;
        margin-bottom: 15px;
    }

    .upload-area .material-icons {
        font-size: 2.5em;
    }

    .upload-area .upload-text {
        font-size: 1em;
    }

    .initial-image-stack {
        width: 120px;
        height: 120px;
    }

    .initial-image-stack img {
        width: 100px;
        height: 100px;
    }

    .file-preview-container .main-thumbnail {
        max-height: 100px;
    }

    .file-preview-container .file-info-text {
        font-size: 0.9em;
    }

    .uploaded-thumbnails-container {
        padding: 10px;
        margin-bottom: 20px;
    }

    .uploaded-thumbnails-container h3 {
        font-size: 1em;
        padding-left: 5px;
        margin-bottom: 8px;
    }

    .uploaded-thumbnails-list {
        padding: 0;
    }

    .uploaded-thumbnails-list li {
        margin-right: calc(var(--thumbnail-size) * -0.35);
    }

    .uploaded-thumbnails-list img {
        width: calc(var(--thumbnail-size) * 0.8);
        height: calc(var(--thumbnail-size) * 0.8);
    }

    .uploaded-thumbnails-list li:hover img {
        transform: translateY(-8px) scale(1.1) !important;
    }

    .results-preview-section {
        padding: 20px;
        margin-top: 20px;
        margin-bottom: 30px;
    }

    .results-preview-section h2 {
        font-size: 1.5em;
        margin-bottom: 20px;
    }

    .results-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }

    .result-item {
        padding: 15px;
    }

    .result-item .icon-wrapper {
        width: 35px;
        height: 35px;
        font-size: 1.3em;
    }

    .result-item h3 {
        font-size: 1em;
    }

    .result-item p {
        font-size: 0.85em;
    }

    .generate-button {
        padding: 12px 15px;
        font-size: 1em;
        margin: 30px auto 20px auto;
    }

    .subtle-text-element {
        margin-top: 20px;
        margin-bottom: 15px;
    }


    /* 스크롤바 커스터마이징 (웹킷 브라우저) */
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background: #a0a0a0;
        border-radius: 10px;
        border: 2px solid #f1f1f1;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #808080;
    }


    /* 이미지 개수에 따라 추가 또는 조정 */
}

.photo-upload-page {
    padding-top: 65px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>