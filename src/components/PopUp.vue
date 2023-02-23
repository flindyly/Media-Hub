<template>
  <!-- Pop up box for successful entry in db -->
  <transition name="modal">
    <!-- Pop up background -->
    <div class="fixed z-50 inset-0 w-full h-full flex justify-center items-center overflow-x-hidden overflow-y-auto bg-gray-800 bg-opacity-80 ">
      <!-- Pop up content -->
      <div class="bg-white w-fit mx-auto p-8 border border-gray rounded-sm">
        <!-- Header -->
        <div class="mb-4 flex justify-center items-center">
          <h3 class="text-2xl font-semibold">Upload Successful!</h3>
        </div>
        <!-- Buttons -->
        <div class="flex justify-center items-center">
          <button onclick="location.reload()" class="adx-button primary">
            Upload another item
          </button>
          <router-link to="/">
            <button class="adx-button accent">
              Back to Home
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped>

</style>