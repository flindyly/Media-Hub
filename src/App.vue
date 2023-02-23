<template>
  <div id="app" class="w-full h-full flex flex-col">
    <!-- Header nav -->
    <header class="flex fixed w-full max-h-[120px] z-50">
      <div class="flex flex-col min-w-[50px]">
        <div class="bg-brand-darkblue min-h-[70px]"></div>
        <div class="bg-brand-midblue h-full"></div>
      </div>
      <div id="logo-section"
           class="bg-brand-darkblue p-[15px] min-w-fit cursor-pointer"
           @click="checkLocation()"
      >
        <div>
          <img src="./assets/uoa-logo.png"
               width="103"
               alt="UoA Logo"
          />
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div class="flex justify-between bg-brand-darkblue text-white align-middle px-6 min-h-[70px]">
          <h3>Media Hub</h3>
        </div>
        <!-- Search and Upload Links in navbar -->
        <div class="flex justify-end bg-brand-midblue min-h-[42px] text-white h-full">
          <RouterLink to="/"
                      class="header-nav"
          >
            <span class="text-2xl">
              Search
            </span>
          </RouterLink>
          <RouterLink to="/upload"
                      class="header-nav"
          >
            <span class="text-2xl">
              Upload
            </span>
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- Main views -->
      <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();

const currentPath = computed ( () => {
  return route.path
});

// refresh page
function checkLocation() {
  console.log(currentPath.value);
  if (currentPath.value == "/") {
    location.reload();
  }
  else {
    router.push("/");
  }
}

</script>

<style>
header h3 {
  font-size: 1.728rem;
  line-height: 1.05;
  margin: 1rem 0 0.694rem;
  letter-spacing: .02rem;
}

</style>