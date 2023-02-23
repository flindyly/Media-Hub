<template>
  <div class="h-fit break-inside-avoid mb-12 mx-2 ">
    <div class="relative group p-5 rounded-lg bg-gray-100 flex justify-center"> <!--border-2 drop-shadow-sm-->
      <img v-if="data.thumbnailType == 'Static'" :src="data.thumbnail" :id="data.uid" class="rounded-lg">
      <img v-else :src="`https://img.youtube.com/vi/${data.thumbnail}/mqdefault.jpg`" class="rounded-lg border border-gray-100 w-full">
      <!-- Preview Overlay -->
      <div @click="toggleModal(data.uid)" class="hidden group-hover:flex absolute z-30 p-4 rounded-lg inset-0 bg-gray-900 bg-opacity-70 text-white text-lg flex-wrap items-center justify-center cursor-zoom-in">
        <p>{{ data.title }}</p>
      </div>
<!--      <p>{{data.date.toDate().toLocaleString()}}</p>-->
    </div>
<!--    <p v-for="type in data.type" class="inline-block px-2 mr-2 my-2 bg-gray-200 rounded-lg text-gray-500"> {{ convertType(type) }}</p>-->
  </div>
</template>

<script setup lang="ts">
import {mediaTypes} from "@/predefined/MediaTypes";
import type {DocumentData} from "firebase/firestore";


defineProps<{
  data: DocumentData
}>();

const emit = defineEmits(['showPreview']);

//convert list of media type shortcodes to one readable string for display
function convertType(shortcode: string) {
  if (shortcode.substring(0, 3) == "vid") {
    return mediaTypes['Video'].get(shortcode);
  }
  else if (shortcode.substring(0, 3) == "img") {
    return mediaTypes['Image'].get(shortcode);
  }
  else if (shortcode.substring(0, 3) == "ani") {
    return mediaTypes['Animation'].get(shortcode);
  }
  else {
    return mediaTypes['Interactive'].get(shortcode);
  }
}

function toggleModal(mediaId: string) {
  emit('showPreview', mediaId);
}

</script>

<style scoped>

</style>