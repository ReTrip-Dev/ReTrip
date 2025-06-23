<template>
  <div class="country-flag-wrapper">
    <!-- Fallback emoji flag in case SVG fails -->
    <div v-if="flagLoadError" class="emoji-flag">
      {{ countryFlagEmoji }}
    </div>
    
    <!-- Main flag approach using img tag instead of background -->
    <img 
      v-else
      :src="flagUrl" 
      :alt="`Flag of ${props.country}`"
      @error="handleFlagError"
      class="flag-image"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  country: {
    type: String,
    required: true
  }
});

const flagLoadError = ref(false);

const countryCodeLower = computed(() => {
  return props.country.toLowerCase();
});

// Map of country codes to emoji flags (fallback)
const emojiMap = {
  'kr': '🇰🇷',
  'us': '🇺🇸',
  'jp': '🇯🇵',
  'cn': '🇨🇳',
  'gb': '🇬🇧',
  'fr': '🇫🇷',
  'it': '🇮🇹',
  'de': '🇩🇪',
};

const countryFlagEmoji = computed(() => {
  return emojiMap[countryCodeLower.value] || '🏳️';
});

// Try multiple flag sources for better compatibility
const flagUrl = computed(() => {
  // First option: FlagCDN
  return `https://flagcdn.com/w80/${countryCodeLower.value}.png`;
  
  // Alternative sources if needed:
  // return `https://flagsapi.com/${props.country.toUpperCase()}/flat/64.png`;
  // return `https://cdn.jsdelivr.net/npm/flag-icons@6.11.0/flags/4x3/${countryCodeLower.value}.svg`;
});

const handleFlagError = () => {
  console.error(`Failed to load flag for country code: ${props.country}`);
  flagLoadError.value = true;
};
</script>

<style>
.country-flag-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px; /* Reduced slightly for better fit in tag */
  height: 20px; /* Better aspect ratio for flags */
  border-radius: 6px; /* Smaller radius for better fit in tag */
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.05);
  margin: 0;
  background-color: #f5f5f5;
  position: relative;
}

/* Make sure flag completely fills the space without distortion */
.flag-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.emoji-flag {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 18px;
  line-height: 1;
}

.country-flag-wrapper:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  transition: all 0.2s ease;
}
</style>
