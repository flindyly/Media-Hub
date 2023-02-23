<template>

  <div class="fixed z-50 inset-0 flex w-full h-full overflow-y-auto bg-gray-800 bg-opacity-90 overscroll-y-none" tabindex="-1" aria-hidden="true">

    <!-- Metadata content -->
    <div class="relative p-8 m-auto h-fit w-full max-w-screen-md flex flex-col items-center rounded-lg border bg-white z-50 overscroll-contain">
      <button class="absolute top-0 right-0 p-2 rounded-lg" @click="close">
        <svg aria-hidden="true" class="w-10 h-10 text-gray-400 hover:text-slate-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
      </button>
      <h1 class="tracking-wide text-3xl">{{currentItem.title}}</h1>
      <br>
      <img v-if="currentItem.thumbnailType == 'Static'" :src="currentItem.thumbnail" class="rounded-lg border border-gray-200">
      <iframe v-else class="w-full" height="315" :src="`https://www.youtube.com/embed/${currentItem.thumbnail}`"></iframe>
      <div class="columns-2 mt-4">
        <p class="break-inside-avoid-column"><span class="font-semibold">Contributor: </span>{{ currentItem.contributor + "@adelaide.edu.au" }}</p>
        <p class="break-inside-avoid-column"><span class="font-semibold">Type(s): </span>{{convertTypes(currentItem.type) }}</p>
        <p v-if="currentItem.hasOwnProperty('school')" class="break-inside-avoid-column"><span class="font-semibold">Schools: </span>{{ currentItem.school.join(", ") }}</p>
        <p class="break-inside-avoid-column"><span class="font-semibold">Views: </span>{{currentItem.visitCount }}</p>
        <p v-if="currentItem.hasOwnProperty('department')" class="break-inside-avoid-column"><span class="font-semibold">Department: </span>{{ currentItem.department }}</p>
        <p class="break-inside-avoid-column"><span class="font-semibold">Date Uploaded: </span>{{ currentItem.date.toDate().toLocaleDateString() }}</p>
      </div>
      <br>
      <a :href="`https://universityofadelaide.app.box.com/folder/${currentItem.uid}`" target="_blank" rel="noopener noreferrer">
        <button type="button" class="adx-button primary" @click="incrementViews(currentItem.uid)">Download From Box</button>
      </a>
    </div>
  </div>

</template>

<script setup lang="ts">
import type {DocumentData} from "firebase/firestore";
import {mediaTypes} from "@/predefined/MediaTypes";
import dbRef from "@/firestoreConfig";
import {doc, updateDoc, increment} from "firebase/firestore";

defineProps<{
  currentItem: DocumentData;
}>();

const emit = defineEmits(['closeModal']);

function convertTypes(types: Array<string>) {
  const typesArr: Array<string> = [];
  types.forEach( (type) => {
    if (type.substring(0, 3) == "vid") {
      typesArr.push(mediaTypes['Video'].get(type)!);
    }
    else if (type.substring(0, 3) == "img") {
      typesArr.push(mediaTypes['Image'].get(type)!);
    }
    else if (type.substring(0, 3) == "ani") {
      typesArr.push(mediaTypes['Animation'].get(type)!);
    }
    else {
      typesArr.push(mediaTypes['Interactive'].get(type)!);
    }
  });

  return typesArr.join(", ");
}

async function incrementViews(mediaId: string) {
  const docRef = doc(dbRef, `MediaItems/${mediaId}`);
  await updateDoc(docRef, {
    visitCount: increment(1)
  });
}

function close() {
  emit('closeModal');
}

</script>

<style scoped>

</style>