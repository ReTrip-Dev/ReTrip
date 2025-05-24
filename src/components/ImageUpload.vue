<attachment id="file:image-upload-webapp/src/components/ImageUpload.vue">
<content>
<template>
  <div class="image-upload">
    <h2>Upload Images</h2>
    <input type="file" multiple @change="onFileChange" />
    <button @click="uploadImages">Upload</button>
    <div v-if="uploadStatus">{{ uploadStatus }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedFiles: null,
      uploadStatus: ''
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFiles = event.target.files;
    },
    async uploadImages() {
      if (!this.selectedFiles) {
        this.uploadStatus = 'Please select images to upload.';
        return;
      }

      const formData = new FormData();
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('files', this.selectedFiles[i]);
      }

      try {
        const response = await fetch('/api/images/uploads', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          this.uploadStatus = 'Images uploaded successfully!';
        } else {
          this.uploadStatus = 'Failed to upload images.';
        }
      } catch (error) {
        this.uploadStatus = 'Error uploading images: ' + error.message;
      }
    }
  }
};
</script>

<style scoped>
.image-upload {
  margin: 20px;
}
</style>
</content>
</attachment>