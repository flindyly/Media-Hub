<template>
  <!-- SEARCH BAR -->
  <div class="fixed top-[120px] z-40 bg-white w-full pt-4">
    <div class="w-[80%] mx-auto p-2 flex items-center">

      <!-- search field -->
      <div class="relative w-full">
        <button class="absolute top-4 left-4"
                title="Search"
        >
          <svg class="w-6 h-6 text-gray-400 hover:text-gray-700"
               fill="currentColor"
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 512 512"
          ><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
          </svg>
        </button>
        <input @keyup.enter="submit"
               v-model="searchInput"
               class="bg-gray-100 text-xl w-full h-14 px-12 rounded-lg focus:bg-white text-gray-700 placeholder:text-xl"
               type="text"
               :placeholder="`Search ${showAlbumItems ? `in ${albums.get(selectedAlbum).title}` : 'for a media item'}`"
        />
      </div>

      <!-- filter button -->
      <button @click="filterOpen = !filterOpen"
              type="button"
              class="adx-button primary flex h-14 items-center justify-center"
      >
        <span>
          <svg :class="{'text-green-500': hasFilters}"
               class="block w-5 h-5 mr-4 text-gray-400"
               fill="currentColor"
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"/>
          </svg>
        </span>
        <p class="text-lg">
          Filters
        </p>
      </button>
    </div>
  </div>

  <!-- Filters, Search and Gallery Display -->
  <div class="flex flex-col h-[calc(100vh_-_225px)] mt-[225px] overflow-y-auto">
    <div class="relative">

      <!-- ALBUM GALLERY DISPLAY -->
      <div v-if="showAlbumItems"
           class="absolute fixed left-0 top-0 w-full h-[calc(100vh_-_225px)] bg-white overflow-y-auto overscroll-y-none pb-10"
      >
          <div class="mx-auto max-w-[80%] mt-4 items-center justify-center bg-white">

            <!-- back to home view -->
            <button @click="closeAlbum"
                    class="adx-brand-midblue-dark font-[600] pt-2"
            >
              &lt;
              <span class="underline">
                Back to Search
              </span>
            </button>

            <!-- Album name -->
            <div class="text-center">
              <h1>{{ albums.get(selectedAlbum).title }}</h1>
              <p v-if="numResults >= 0"
                 class="text-lg my-4"
              >
                {{ numResults }} items
              </p>
            </div>

            <!-- Album items -->
            <div class="px-20">
              <div :class="`columns-${numCols}`"
                   class="gap-8"
              >
                <div v-for="item in reorderedIds"
                     :key="item"
                     :class="{'break-after-column': columnBreaks.has(item)}"
                >
                  <ImageCard :key="item"
                             :data="searchItems.get(item)"
                             @show-preview="showModal"
                  />
                </div>
              </div>
            </div>

            <!-- Pagination and Display limit -->
            <div v-if="showMore && currentItems.size < searchItems.size" class="flex justify-center items-center py-8">
              <button @click="loadMore" type="button" class="adx-button primary">Show More</button>
            </div>

          </div>
      </div>

      <!-- FILTER SIDEBAR -->
      <Transition name="slide" mode="out-in">
        <aside v-if="filterOpen" class="right-0 w-full md:w-[400px] flex flex-col fixed top-[120px] h-full z-50 p-[2em] text-gray-500 border-l border-brand-darkblue-lighter bg-[#f1f1f1]">
          <!-- Filter header -->
          <header class="sticky top-0 left-0 flex items-center w-full bg-[#f1f1f1] border-b-2 border-solid border-grey-300">

            <!-- collapse icon -->
            <button type="button"
                    @click="filterOpen = false"
                    class="mt-2 mr-4 text-sm text-gray-400 bg-[#f1f1f1] hover:text-slate-900 rounded-lg"
            >
              <svg class="w-7 h-7" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
            </button>

            <!-- header -->
            <div>
              <h3 class="font-semibold text-2xl mb-2">
                Filters
              </h3>
            </div>
          </header>

          <!-- Main filters -->
          <main class="flex-1 overflow-y-auto h-auto">

            <!-- Sort options -->
            <div v-if="!showAlbumItems" class="border-b-2">
              <p>Sort By:</p>
              <!-- Sort by recently added (default) -->
              <div class="flex items-center mb-2">
                <input checked type="radio"
                       v-model="filterSort"
                       id="sortRecent"
                       value="date"
                       class="mr-2 w-4 h-4 accent-red-600"
                >
                <label for="sortRecent">
                  Recently Added
                </label>
                <br>
              </div>
              <!-- Sort by most viewed -->
              <div class="flex items-center mb-2">
                <input type="radio"
                       v-model="filterSort"
                       id="sortPopular"
                       value="visitCount"
                       class="mr-2 w-4 h-4 accent-red-600"
                >
                <label for="sortPopular">
                  Most Viewed
                </label>
                <br>
              </div>
            </div>

            <!-- accordion -->
            <vue-collapsible-panel-group accordion>

              <!-- School filters - default expanded -->
              <vue-collapsible-panel :expanded="true"
                                     class="overflow-x-hidden"
              >
                <template #title>
                  <svg v-if="filterSchools.length > 0"
                       class="w-3 h-3 mr-4 text-green-400"
                       fill="currentColor"
                       xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 512 512"
                  ><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512z"/>
                  </svg>
                  <span class="mr-4">
                    <svg class="w-8 h-8"
                         fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 640 512"
                    ><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                      <path d="M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9v28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5V291.9c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z"/>
                    </svg>
                  </span>
                  <p> School </p>
                </template>
                <template #content class="active_pane">
                  <div class="w-fit mt-2 mb-4">
                    <div v-for="school in schools">
                      <label :for="school"
                             class="flex items-center mb-4"
                      >
                          <input type="checkbox"
                                 v-model="filterSchools"
                                 :id="school"
                                 :value="school"
                                 class="w-4 h-4 mr-2 accent-red-600 flex-none"
                          >
                          {{school}}
                      </label>
                    </div>
                  </div>
                </template>
              </vue-collapsible-panel>

              <!-- Department filters -->
              <vue-collapsible-panel :expanded="false"
                                     class="overflow-x-hidden"
              >
                <template #title>
                  <svg v-if="filterDepartments.length > 0"
                       class="w-3 h-3 mr-4 text-green-400"
                       fill="currentColor"
                       xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 512 512"
                  ><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512z"/>
                  </svg>
                  <span class="mr-4">
                    <svg class="w-8 h-8"
                         fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 384 512"
                    ><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                      <path d="M48 0C21.5 0 0 21.5 0 48V464c0 26.5 21.5 48 48 48h96V432c0-26.5 21.5-48 48-48s48 21.5 48 48v80h96c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H48zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V240zM80 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V112zM272 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16z"/>
                    </svg>
                  </span>
                  <p>Department</p>
                </template>
                <template #content>
                  <div class="w-fit mt-2 mb-4">
                    <div v-for="department in departments">
                      <label :for="department"
                             class="flex items-center mb-4"
                      >
                        <input type="checkbox"
                               v-model="filterDepartments"
                               :id="department"
                               :value="department"
                               class="w-4 h-4 mr-2 accent-red-600 flex-none"
                        >
                        {{department}}
                      </label>
                    </div>
                  </div>
                </template>
              </vue-collapsible-panel>

              <!-- Image filters -->
              <vue-collapsible-panel :expanded="false"
                                     class="overflow-x-hidden"
              >
                <template #title>
                  <svg v-if=" filterImages.length > 0"
                       class="w-3 h-3 mr-4 text-green-400"
                       fill="currentColor"
                       xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 512 512"
                  ><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512z"/>
                  </svg>
                  <span class="mr-4">
                    <svg class="w-8 h-8"
                         fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 576 512"
                    ><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                      <path d="M160 32c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160zM396 138.7l96 144c4.9 7.4 5.4 16.8 1.2 24.6S480.9 320 472 320H328 280 200c-9.2 0-17.6-5.3-21.6-13.6s-2.9-18.2 2.9-25.4l64-80c4.6-5.7 11.4-9 18.7-9s14.2 3.3 18.7 9l17.3 21.6 56-84C360.5 132 368 128 376 128s15.5 4 20 10.7zM192 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V344c0 75.1 60.9 136 136 136H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120z"/>
                    </svg>
                  </span>
                  <p>Image</p>
                </template>
                <template #content>
                  <div v-for="[shortcode, tag] in mediaTypes['Image']">
                    <label :for="shortcode"
                           class="flex items-center mb-4"
                    >
                      <input type="checkbox"
                             v-model="filterImages"
                             :id="shortcode"
                             :value="shortcode"
                             class="w-4 h-4 accent-red-600 mr-2 flex-none"
                      >
                      {{ tag }}
                    </label>
                  </div>
                </template>
              </vue-collapsible-panel>

              <!-- Animation filters -->
              <vue-collapsible-panel :expanded="false"
                                     class="overflow-x-hidden"
              >
                <template #title>
                  <svg v-if="filterAnimations.length > 0"
                       class="w-3 h-3 mr-4 text-green-400"
                       fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 512 512"
                  ><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512z"/>
                  </svg>
                  <span class="mr-4">
                    <svg class="w-8 h-8"
                         fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 448 512"
                    ><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                      <path d="M370.7 96.1C346.1 39.5 289.7 0 224 0S101.9 39.5 77.3 96.1C60.9 97.5 48 111.2 48 128v64c0 16.8 12.9 30.5 29.3 31.9C101.9 280.5 158.3 320 224 320s122.1-39.5 146.7-96.1c16.4-1.4 29.3-15.1 29.3-31.9V128c0-16.8-12.9-30.5-29.3-31.9zM336 144v16c0 53-43 96-96 96H208c-53 0-96-43-96-96V144c0-26.5 21.5-48 48-48H288c26.5 0 48 21.5 48 48zM189.3 162.7l-6-21.2c-.9-3.3-3.9-5.5-7.3-5.5s-6.4 2.2-7.3 5.5l-6 21.2-21.2 6c-3.3 .9-5.5 3.9-5.5 7.3s2.2 6.4 5.5 7.3l21.2 6 6 21.2c.9 3.3 3.9 5.5 7.3 5.5s6.4-2.2 7.3-5.5l6-21.2 21.2-6c3.3-.9 5.5-3.9 5.5-7.3s-2.2-6.4-5.5-7.3l-21.2-6zM112.7 316.5C46.7 342.6 0 407 0 482.3C0 498.7 13.3 512 29.7 512H128V448c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64l98.3 0c16.4 0 29.7-13.3 29.7-29.7c0-75.3-46.7-139.7-112.7-165.8C303.9 338.8 265.5 352 224 352s-79.9-13.2-111.3-35.5zM176 448c-8.8 0-16 7.2-16 16v48h32V464c0-8.8-7.2-16-16-16zm96 32a16 16 0 1 0 0-32 16 16 0 1 0 0 32z"/>
                    </svg>
                  </span>
                  <p>Animation</p>
                </template>
                <template #content>
                  <div v-for="[shortcode, tag] in mediaTypes['Animation']">
                    <label :for="shortcode"
                           class="flex items-center mb-4"
                    >
                      <input type="checkbox"
                             v-model="filterAnimations"
                             :id="shortcode"
                             :value="shortcode"
                             class="w-4 h-4 accent-red-600 mr-2 flex-none"
                      >
                      {{ tag }}
                    </label>
                  </div>
                </template>
              </vue-collapsible-panel>

              <!-- Video filters -->
              <vue-collapsible-panel :expanded="false"
                                     class="overflow-x-hidden"
              >
                <template #title>
                  <svg v-if="filterVideos.length > 0"
                       class="w-3 h-3 mr-4 text-green-400"
                       fill="currentColor"
                       xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 512 512"
                  ><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512z"/>
                  </svg>
                  <span class="mr-4">
                    <svg class="w-8 h-8"
                         fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 576 512"
                    ><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                      <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/>
                    </svg>
                  </span>
                  <p>Video</p>
                </template>
                <template #content>
                  <div v-for="[shortcode, tag] in mediaTypes['Video']">
                    <label :for="shortcode"
                           class="flex items-center mb-4"
                    >
                      <input type="checkbox"
                             v-model="filterVideos"
                             :id="shortcode"
                             :value="shortcode"
                             class="w-4 h-4 accent-red-600 mr-2 flex-none"
                      >
                      {{ tag }}
                    </label>
                  </div>
                </template>
              </vue-collapsible-panel>

              <!-- Interactive filters -->
              <vue-collapsible-panel :expanded="false"
                                     class="overflow-x-hidden"
              >
                <template #title>
                  <svg v-if="filterInteractives.length > 0"
                       class="w-3 h-3 mr-4 text-green-400"
                       fill="currentColor"
                       xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 512 512"
                  ><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512z"/>
                  </svg>
                  <span class="mr-4">
                    <svg class="w-8 h-8"
                         fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 320 512"
                    ><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                      <path d="M0 55.2V426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320H297.9c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"/>
                    </svg>
                  </span>
                  <p>Interactive</p>
                </template>
                <template #content>
                  <div v-for="[shortcode, tag] in mediaTypes['Interactive']">
                    <label :for="shortcode"
                           class="flex items-center mb-4"
                    >
                      <input type="checkbox"
                             v-model="filterInteractives"
                             :id="shortcode"
                             :value="shortcode"
                             class="w-4 h-4 accent-red-600 mr-2 flex-none"
                      >
                      {{ tag }}
                    </label>
                  </div>
                </template>
              </vue-collapsible-panel>

            </vue-collapsible-panel-group>
          </main>

          <footer class="sticky bottom-0 flex justify-center items-center py-2 w-full border-t-2 border-solid border-grey-300 bg-[#f1f1f1]">
            <button type="button"
                    @click="clearFilters"
                    class="adx-button"
            >
              Clear All
            </button>
            <button type="button"
                    :class="hasFilters ? activeApply : disableApply"
                    :disabled="!hasFilters"
                    @click="submit"
            >
              APPLY
            </button>
          </footer>



        </aside>
      </Transition>

      <!-- GALLERY DISPLAY -->
      <div v-if="!showAlbumItems" class="flex flex-col bg-white">
        <main class="flex flex-1 pb-4 bg-white relative">
          <div class="mx-auto max-w-[80%] items-center justify-center bg-white">

            <!-- Search results -->
            <p v-if="numResults >= 0 && showResults"
               class="text-md text-right mb-4"
            >
              {{ numResults }} items found.
            </p>
            <div>
              <div v-if="showResults"
                   :class="`columns-${numCols}`"
                   class="gap-12">
                <div v-for="item in reorderedIds"
                     :key="item"
                     :class="{'break-after-column': columnBreaks.has(item)}"
                >
                  <ImageCard :key="item"
                             :data="searchItems.get(item)"
                             @show-preview="showModal"
                  />
                </div>
              </div>
            </div>

            <!-- Pagination and Display limit -->
            <div v-if="showMore && currentItems.size < searchItems.size"
                 class="flex justify-center items-center py-8"
            >
              <button @click="loadMore"
                      type="button"
                      class="adx-button primary"
              >
                Show More
              </button>
            </div>

            <!-- Albums display -->
            <div v-if="showAlbums"
                 class="max-w-3xl mx-auto"
            >
              <h3 class="font-semibold text-2xl mb-4 mt-8">
                Browse Albums
              </h3>
              <div class="grid grid-cols-4 gap-8 pb-8">
                <div v-for="[id, data] in albums"
                     class="rounded-lg border border-2 relative h-full w-full cursor-pointer hover:ring-2 hover:ring-brand-darkblue-light"
                     @click="getAlbumItems(id)"
                >
                  <img :src="albumThumbnails.get(id)"
                       class="rounded-md object-cover w-full h-full"
                  >
                  <div class="absolute w-full rounded-bl-md rounded-br-md bg-gray-900 bg-opacity-60 bottom-0 inset-x-0 text-center text-lg text-white">
                    {{ data.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>

  <!-- Modal preview -->
  <PreviewModal v-if="toggleModal"
                :current-item="searchItems.get(currentId)"
                @close-modal="toggleModal = false"
  />

</template>

<script setup lang="ts">
import '@dafcoe/vue-collapsible-panel/dist/vue-collapsible-panel.css';

import {schools} from "@/predefined/SchoolsList";
import {mediaTypes} from "@/predefined/MediaTypes";
import {departments} from "@/predefined/DepartmentsList";
import { ref, onMounted, computed, watch } from 'vue';
import type { Ref } from 'vue';
import db from '@/firestoreConfig';
import { collection, doc, getDoc, getDocs, query, where, orderBy} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import ImageCard from "@/components/ImageCard.vue";
import PreviewModal from "@/components/PreviewModal.vue";
import {getDownloadURL, ref as firebaseStorageRef} from "firebase/storage";
import storageRef from "@/storageConfig";

// search and filter variables
const filterOpen: Ref<boolean> = ref(false);
const searchInput: Ref<string> = ref('');
const filterSchools: Ref<Array<string>> = ref([]);
const filterDepartments: Ref<Array<string>> = ref([]);
const filterImages: Ref<Array<string>> = ref([]);
const filterVideos: Ref<Array<string>> = ref([]);
const filterAnimations: Ref<Array<string>> = ref([]);
const filterInteractives: Ref<Array<string>> = ref([]);
const filterSort: Ref<"date" | "visitCount"> = ref("date");
const activeApply: Ref<string> = ref("adx-button brand-red");
const disableApply: Ref<string> = ref("adx-button complimentary disabled");
const filterTypes = computed( () => {
  return filterImages.value.concat(filterVideos.value, filterAnimations.value).concat(filterInteractives.value);
});
const hasFilters = computed( () => {
  return (filterSchools.value.length > 0 || filterDepartments.value.length > 0 || filterImages.value.length > 0 || filterVideos.value.length > 0 || filterAnimations.value.length > 0 || filterInteractives.value.length > 0);
});

// results variables
let searchItems: Ref<Map<string, DocumentData>> = ref(new Map<string, DocumentData>()); // stores retrieved items from firestore in order of sort
const numResults: Ref<number> = ref(0);
const showResults: Ref<boolean> = ref(false);

// masonry grid display variables
let currentItems: Ref<Map<string, DocumentData>> = ref(new Map<string, DocumentData>()); // limits display
let reorderedIds: Ref<Array<string>> = ref([]); // stores reordered items for display
let columnBreaks: Ref<Map<string, boolean>> = ref(new Map<string, boolean>); // stores ID of items that require column break after
let retrievedIds: Array<string> = [];
let cursor: number = 0; // for pagination
let numCols: Ref<number> = ref(3);
let limit: Ref<number> = ref(3);

// album display
const showAlbums: Ref<boolean> = ref(true);
const showAlbumItems: Ref<boolean> = ref(false);
let albumItems: Ref<Map<string, DocumentData>> = ref(new Map<string, DocumentData>()); // stores retrieved album items from firestore in order of sort
const albums: Ref<Map<string, DocumentData>> = ref(new Map<string, DocumentData>()); // stores all albums from firestore (albumId : album data)
const albumThumbnails: Ref<Map<string, string>> = ref(new Map<string, string>); // stores album ID and the thumbnail filename from cloud storage
const selectedAlbum: Ref<string> = ref("");

const mediaRef = collection(db, "MediaItems");
const albumRef = collection(db, "Albums");
const currentId: Ref<string> = ref(""); // to provide as prop to preview modal
const toggleModal: Ref<boolean> = ref(false);
const showMore: Ref<boolean> = ref(false); // toggles the show more button


function resize() {
  if (window.innerWidth < 640) {
    numCols.value = 1;
  }
  else if (window.innerWidth < 1024) {
    numCols.value = 2;
  }
  else  {
    numCols.value = 3;
  }
  // else if (window.innerWidth >= 1280)  {
  //   numCols.value = 4;
  // } // doesnt work if 4 columns?
}

// change masonry columns when browser resizes
window.onresize = () => { resize(); }

// change sort when option changes
watch(filterSort, () => { submit(); });

function clearFilters() {
  filterSort.value = "date";
  filterSchools.value = [];
  filterDepartments.value = [];
  filterImages.value = [];
  filterVideos.value = [];
  filterAnimations.value = [];
  filterInteractives.value = [];
}

// display albums
onMounted( async () => {
  const albumSnapshot = await getDocs(albumRef); // get all docs - to get specific albums (ie. Course/Group types), use
  albumSnapshot.forEach(async (doc) => {
    albums.value.set(doc.id, doc.data());
    const pathRef = firebaseStorageRef(storageRef, `album_thumbnails/${doc.data().thumbnail}`);
    const thumbnailUrl = await getDownloadURL(pathRef).then( (url) => {
      return url;
    });
    albumThumbnails.value.set(doc.id, thumbnailUrl);
  });
  resize();
});

// get and display all media items of an album
async function getAlbumItems(albumId: string) {
  showAlbumItems.value = true;
  selectedAlbum.value = albumId;
  showAlbums.value = false;

  // get array of mediaItem IDs
  const mediaIds: Array<string> = albums.value.get(albumId)!.items;

  // get data corresponding to each id and store them
  let id: string;
  for (id of mediaIds) {  // can't use forEach due to async callback
    const docRef = doc(db, `MediaItems/${id}`);
    const snapshot = await getDoc(docRef);
    albumItems.value.set(id, snapshot.data()!);
    searchItems.value.set(id, snapshot.data()!);
    reorderedIds.value.push(id); // display all album items
    retrievedIds.push(id);
  }
  numResults.value = albumItems.value.size;
}

function closeAlbum() {
  showAlbumItems.value = false;
  showResults.value = false;
  showAlbums.value = true;
  albumItems.value.clear();
  clearResults();
  searchInput.value = "";
  filterOpen.value = false;
  clearFilters();
}

function clearResults() {
  searchItems.value.clear();
  currentItems.value.clear();
  columnBreaks.value.clear();
  retrievedIds = [];
  reorderedIds.value = [];
  limit.value = 3; /** RESET LIMIT HERE **/
  cursor = 0;
}

// main function for search, filter and sort (runs when Search/Apply is clicked)
async function submit() {
  showAlbums.value = false;
  filterOpen.value = false;

  clearResults();
  // limit.value = 3; /** RESET LIMIT HERE **/
  // cursor = 0;

  if (searchInput.value != "") {
    console.log("searching")
    await search();
  }
  if (filterSchools.value.length != 0) {
    console.log("school")
    await filterBySchools();
  }
  if (filterTypes.value.length != 0) {
    console.log("types")
    await filterByTypes();
  }
  if (filterDepartments.value.length != 0) {
    console.log("depts")
    await filterByDepartments();
  }
  if (showAlbumItems.value) {
    console.log("albums")
    filterByAlbum();
  }
  displayResults();
  numResults.value = searchItems.value.size;
  showResults.value = true;
}

// search for media items with matching keywords
async function search() {
  let tempDocs: Map<string, DocumentData> = new Map(); // temp map
  let tempIds: Array<string> = [];
  let searchQuery = query(mediaRef, where("keywords", "array-contains-any", searchInput.value.toLowerCase().split(' ')), orderBy(filterSort.value, "desc"));
  const resultSnapshot = await getDocs(searchQuery);

  resultSnapshot.forEach((doc) => {
    tempDocs.set(doc.id, doc.data());
    tempIds.push(doc.id);
  });
  searchItems.value = tempDocs; // replace for next comparison
  retrievedIds = tempIds;
}

// filter by schools
async function filterBySchools() {
  let tempDocs: Map<string, DocumentData> = new Map(); // temp map
  let tempIds: Array<string> = [];
  let initialSize = searchItems.value.size;
  let schoolQuery = query(mediaRef, where("school", "array-contains-any", filterSchools.value), orderBy(filterSort.value, "desc"));
  const schoolSnapshot = await getDocs(schoolQuery);
  schoolSnapshot.forEach((doc) => {
    // no keywords entered
    if (initialSize == 0) {
      tempDocs.set(doc.id, doc.data());
      tempIds.push(doc.id);
    }
    else {
      // item with school filter matches user keyword input
      if (searchItems.value.has(doc.id)) {
        tempDocs.set(doc.id, doc.data());
        tempIds.push(doc.id);
      }
    }
  });
  searchItems.value = tempDocs; // replace for next comparison
  retrievedIds = tempIds;
}

// filter by departments
async function filterByDepartments() {
  let tempDocs: Map<string, DocumentData> = new Map(); // temp map
  let tempIds: Array<string> = [];
  let initialSize = searchItems.value.size;
  let schoolQuery = query(mediaRef, where("department", "array-contains-any", filterDepartments.value), orderBy(filterSort.value, "desc"));
  const schoolSnapshot = await getDocs(schoolQuery);
  schoolSnapshot.forEach((doc) => {
    // no schools selected
    if (initialSize == 0) {
      tempDocs.set(doc.id, doc.data());
      tempIds.push(doc.id);
    }
    else {
      // item with school filter matches user keyword input
      if (searchItems.value.has(doc.id)) {
        tempDocs.set(doc.id, doc.data());
        tempIds.push(doc.id);
      }
    }
  });
  searchItems.value = tempDocs; // replace for next comparison
  retrievedIds = tempIds;
}

// filter by type
async function filterByTypes() {
  let tempDocs: Map<string, DocumentData> = new Map(); // temp map
  let tempIds: Array<string> = [];
  let initialSize = searchItems.value.size;
  let typeQuery = query(mediaRef, where("type", "array-contains-any", filterTypes.value), orderBy(filterSort.value, "desc"));
  const typeSnapshot = await getDocs(typeQuery);
  typeSnapshot.forEach((doc) => {
    // no filter by schools and no keywords
    if (initialSize == 0) {
      tempDocs.set(doc.id, doc.data());
      tempIds.push(doc.id);
    }
    else {
      // item with school filter matches user keyword input
      if (searchItems.value.has(doc.id)) {
        tempDocs.set(doc.id, doc.data());
        tempIds.push(doc.id);
      }
    }
  });
  searchItems.value = tempDocs; // replace for next comparison
  retrievedIds = tempIds;
}

function filterByAlbum() {
  let tempDocs: Map<string, DocumentData> = new Map(); // temp map
  let tempIds: Array<string> = [];

  albumItems.value.forEach( (value, key) => {
    // compare and only get the retrieved data that match ids in album
    if (searchItems.value.has(key)) {
      tempDocs.set(key, value);
      tempIds.push(key);
    }
  });
  searchItems.value = tempDocs; // replace for next comparison
  retrievedIds = tempIds;
}

// Toggle modal to display metadata
function showModal(mediaId: string) {
  toggleModal.value = true;
  currentId.value = mediaId;
}

// display limit and pagination
function displayResults() {

  // two cases:
  // Case 1 - number of search items is less than or equal to limit so return all
  if (searchItems.value.size <= limit.value) {
    currentItems.value = searchItems.value;
    reorderItems();
    showMore.value = false;
  }
  // Case 2 - number of search items is greater than limit so do pagination/limit
  else {
    if (cursor < searchItems.value.size){
      for (let i = cursor; i < cursor + limit.value; i++) {
        if (i != searchItems.value.size) {
          let currentId = retrievedIds[i];
          currentItems.value.set(currentId, searchItems.value.get(currentId)!);
        }
      }
      reorderItems();
      cursor = cursor + limit.value;
      showMore.value = true;
    }
  }
}

function loadMore() {
  reorderedIds.value = [];
  columnBreaks.value.clear();
  displayResults();
}

// reorder order of items retrieved from db to display as masonry
// note: columns add items in vertical order, not horizontal (which is required for viewing by a specific sort order)
function reorderItems() {
  let index = 0;
  if (currentItems.value.size <= numCols.value) {
    currentItems.value.forEach((data, uid) => {
      reorderedIds.value.push(uid);
    });
  }
  else {
    for (let col = 0; col < numCols.value; col++) {
      index = col;
      let currentId = retrievedIds[index];
      while (index < currentItems.value.size) {
        reorderedIds.value.push(currentId);
        index = index + numCols.value;
        currentId = retrievedIds[index];
      }
      if (index >= currentItems.value.size) {
        currentId = retrievedIds[index - numCols.value];
        columnBreaks.value.set(currentId, true);
      }
    }
  }
}

// reorder masonry items according to size of browser
watch(numCols, () => {
  cursor = 0;
  reorderedIds.value = [];
  columnBreaks.value.clear();
  displayResults();
});



</script>

<style>
.slide-enter-active, .slide-leave-active {
  transition: 0.5s ease-in-out;

}

/* filter right transition */
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}

/* vue collapsible panel */
.vcp__header {
  height: 5em !important;
  background: #f1f1f1 !important;
  border-bottom: 1px solid #f1f1f1 !important;
}

.vcp__header-title {
  font-size: large;
}

.vcp__header-title:hover {
  text-decoration: underline;
}

.vcp__body {
  background: none !important;
}

.vcp__body .active_pane {
  background: red !important;
}

.vcpg {
  /*border-bottom: 1px solid !important;*/
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
}

/*.search-view {*/
/*  height: calc(100vh - 225px);*/
/*  margin-top: 225px;*/
/*  overflow-y: auto;*/
/*}*/


</style>
