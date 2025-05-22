<template>
  <div class="main-container">
    <!-- 로고 -->
    <img src="@/assets/logo.png" alt="ReTrip Logo" class="logo" />

    <!-- 업로드 영역 -->
    <div
      class="upload-area"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
      :class="{ 'drag-over': isDragOver }"
    >
      <input type="file" ref="fileInput" multiple accept="image/*" @change="onFileChange" hidden />
      <p>이미지를 끌어다 놓거나 클릭하여 선택하세요</p>
      <p class="sub">(최대 10장, JPG/PNG)</p>
    </div>

    <!-- 미리보기 목록 -->
    <div class="preview-list" v-if="files.length">
      <div v-for="(file, idx) in files" :key="idx" class="preview-item">
        <img :src="file.preview" alt="preview" />
        <button class="remove-btn" @click="removeFile(idx)">✕</button>
      </div>
    </div>

    <!-- 업로드 버튼 -->
    <button class="upload-btn" :disabled="!files.length || isUploading" @click="upload">
      {{ isUploading ? "업로드 중..." : "업로드 시작" }}
    </button>

    <!-- 업로드 결과 메시지 -->
    <p v-if="uploadMessage" class="upload-message" :class="{ error: isUploadError }">
      {{ uploadMessage }}
    </p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Main",
  data() {
    return {
      files: [], // { file: File, preview: String }
      isDragOver: false,
      isUploading: false,
      uploadMessage: "",
      isUploadError: false,
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(e) {
      this.processFiles(e.target.files);
      e.target.value = null;
    },
    onDrop(e) {
      this.isDragOver = false;
      this.processFiles(e.dataTransfer.files);
    },
    processFiles(fileList) {
      const newFiles = Array.from(fileList).slice(0, 10 - this.files.length);
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          this.files.push({ file, preview: ev.target.result });
        };
        reader.readAsDataURL(file);
      });
    },
    removeFile(index) {
      this.files.splice(index, 1);
    },
    async upload() {
      if (!this.files.length) return;

      this.isUploading = true;
      this.uploadMessage = "";
      this.isUploadError = false;

      try {
        const formData = new FormData();
        this.files.forEach((fileObj) => {
          formData.append("images", fileObj.file);
        });

        // 기본 디렉토리 이름 설정 (원하는 경로로 변경 가능)
        formData.append("dirName", "retrip");

        const response = await axios.post("http://localhost:8080/api/images/uploads", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.uploadMessage = `${response.data.length}개 이미지가 성공적으로 업로드되었습니다.`;
        console.log("Upload success:", response.data);

        // 업로드 성공 후 파일 목록 초기화 (필요에 따라 주석 해제)
        // this.files = [];
      } catch (error) {
        console.error("Upload error:", error);
        this.isUploadError = true;
        this.uploadMessage = "업로드 중 오류가 발생했습니다. 다시 시도해주세요.";
      } finally {
        this.isUploading = false;
      }
    },
  },
};
</script>

<style scoped>
.main-container {
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
.logo {
  width: 120px;
  margin-bottom: 1.5rem;
}
.upload-area {
  border: 2px dashed #ffa500;
  border-radius: 8px;
  padding: 2.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.upload-area.drag-over {
  background-color: #fff3e0;
}
.upload-area p {
  margin: 0.5rem 0;
  color: #555;
}
.upload-area .sub {
  font-size: 0.85rem;
  color: #888;
}
.preview-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1.5rem;
}
.preview-item {
  position: relative;
  margin: 0.5rem;
}
.preview-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 0.8rem;
}
.upload-btn {
  margin-top: 2rem;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  background: #ffa500;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.upload-btn:disabled {
  background: #ffd099;
  cursor: not-allowed;
}
.upload-btn:not(:disabled):hover {
  background: #e59400;
}
.upload-message {
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  color: #4caf50;
}
.upload-message.error {
  color: #f44336;
}
</style>
