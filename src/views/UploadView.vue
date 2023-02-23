<template>
  <div class="flex flex-col upload-view">
    <div class="flex flex-1 overflow-y-auto">
      <div class="mx-auto px-8 w-3/4">
        <h1 class="text-center">
          UPLOAD A MEDIA ITEM
        </h1>
        <br>

        <!-- Steps Banner (slightly tweaked from Media Budget Calculator) -->
        <div id="steps">
          <ol class="grid grid-cols-3 overflow-hidden border border-gray-100 text-gray-500">
            <li class="stageItem flex items-center justify-center p-4"
                :class="stage == 1 ? 'activeStage' : stage > 1 ? 'completeStage' : ''"
                @click="stage = 1"
            >
              <!-- alternative: make banner steps unclickable unless current section is filled out - use checkStage()-->
              <p class="block text-xl">
                1. Create a Folder
              </p>
            </li>
            <li class="stageItem relative flex items-center justify-center p-4"
                :class="stage == 2 ? 'activeStage' : stage > 2 ? 'completeStage' : ''"
                @click="stage = 2"
            >
              <!-- Arrows -->
              <span class="absolute -left-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border border-b-0 border-l-0 border-gray-100 bg-white sm:block"
                    :class="stage == 1? 'activeStage': stage >= 2? 'completeStage': ''">
              </span>
              <span class="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border border-b-0 border-l-0 border-gray-100 bg-white sm:block"
                    :class="stage == 2? 'activeStage': stage >= 3? 'completeStage': ''">
              </span>

              <p class="block text-xl">
                2. Fill in Metadata
              </p>
            </li>

            <li class="stageItem flex items-center justify-center p-4"
                :class="stage == 3 ? 'activeStage' : stage > 3 ? 'completeStage' : ''"
                @click="stage = 3"
            >
              <p class="block text-xl">
                3. Upload Item to Box
              </p>
            </li>
          </ol>
        </div>

        <!--Sections/Slides-->
        <transition name="slide-fade"
                    mode="out-in"
        >

          <!-- 1. Getting the folder ID -->
          <div class="border-gray-100 border shadow-lg rounded p-8 mb-4"
               id="1"
               v-if="stage == 1"
          >
            <p>
              Please ensure you are logged into your
              <a href="https://universityofadelaide.box.com"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="text-blue-600 underline decoration-solid"
              >
                Box account
              </a>
              before proceeding.
            </p>
            <br>
            <p>
              1. If you have not yet been invited to the Media Hub Box folder, or have not yet stored any assets, please go to the
              <a href="https://universityofadelaide.box.com/v/media-hub-testing"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="text-blue-600 underline decoration-solid"
              >
                Media Hub
              </a>
              folder and click <strong>'Join Account'</strong>.
            </p>
            <br>
            <p>
              2. Inside the Media Hub folder, create another folder to store your media item and any supporting assets.
            </p>
            <br>
            <p>
              3. Navigate to your newly created folder. Copy the folder ID from the URL and paste it below:
            </p>
            <div class="flex flex-wrap">
              <p class="mr-2">
                https://universityofadelaide.app.box.com/folder/
              </p>
              <input type="text"
                     v-model="mediaId"
                     class="text-gray-700 border border-gray-300 rounded px-2 w-48 focus:bg-white"
                     placeholder="ID"
              />
            </div>
            <br>
            <div class="flex flex-wrap">
              <p class="mr-2">
                4. Copy and paste the <strong>shared link</strong> of your newly created folder here:
              </p>
              <input type="text"
                     v-model="uploadLink"
                     class="text-gray-700 border border-gray-300 rounded px-2 w-96 focus:bg-white"
                     placeholder="e.g https://universityofadelaide.box.com/s/hf64ts246ygp2qcv37tztkn3hn4zcl7z"
              />
            </div>
          </div>

          <!-- 2. Metadata form -->
          <div class="border-gray-100 border shadow-md rounded p-10 mb-4"
               id="2"
               v-else-if="stage == 2"
          >
            <form class="w-full">

              <!-- Title field -->
              <label class="block uppercase tracking-wide text-gray-700 text-xl font-bold mb-2"
                     for="title"
              >
                Title
              </label>
              <input v-model="title"
                     class="block w-full mb-4 border border-gray-300 text-gray-700 rounded py-1 px-2 focus:bg-white"
                     id="title"
                     type="text"
              >
              <!--Keywords field-->
              <label class="block uppercase tracking-wide text-gray-700 text-xl font-bold mb-2"
                     for="keywords"
              >
                Keywords
              </label>
              <p>
                Separate each keyword using commas
              </p>
              <input v-model="keywords"
                     class="block w-full border border-gray-300 text-gray-700 rounded py-1 px-2 mb-4 focus:bg-white"
                     id="keywords"
                     type="text"
              >
              <!-- Type+Tags Selections -->
              <label for="media-type"
                     class="block uppercase tracking-wide text-gray-700 text-xl font-bold mb-2"
              >
                Select a Media Type
              </label>
              <select id="media-type"
                      v-model="selectedType"
                      class="flow-root w-48 rounded border border-gray-300 focus:border-blue-500 px-4 py-2 font-medium mb-4"
              >
                <option disabled
                        value="">
                  Select a type
                </option>
                <option v-for="option in Object.keys(mediaTypes)"
                        :value="option"
                >
                  {{option}}
                </option>
              </select>

              <!-- Sub-types (ie. tags) -->
              <p class="block uppercase tracking-wide text-gray-700 text-l font-bold mb-2"
                 v-if="selectedType"
              >
                Select Tags
              </p>
              <div class="grid grid-cols-2 w-fit mb-2">
                <div v-for="[shortcode, tag] in mediaTypes[selectedType]"
                     class="flex items-center mb-2 px-1"
                >
                  <input type="checkbox"
                         v-model="checkedTags"
                         :value="shortcode"
                         :id="shortcode" class="w-4 h-4"
                  >
                  <label for="tags.shortcode"
                         class="ml-2"
                  >
                    {{tag}}
                  </label>
                </div>
              </div>

              <!-- Schools -->
              <p class="block uppercase tracking-wide text-gray-700 text-xl font-bold mb-2">
                Select Schools/Departments
              </p>
              <p class="block uppercase tracking-wide text-gray-700 text-l font-bold mb-2">
                Schools
              </p>
              <div class="grid grid-cols-3 w-full mb-2">
                <div v-for="school in schools"
                     class="flex items-center"
                >
                  <input type="checkbox"
                         v-model="checkedSchools"
                         :id="school"
                         :value="school"
                         class="flex-none w-4 h-4 accent-red-600"
                  >
                  <label for="school"
                         class="ml-2 mr-2"
                  >
                    {{school}}
                  </label>
                </div>
              </div>

              <!-- Departments -->
              <p class="block uppercase tracking-wide text-gray-700 text-l font-bold mb-2">
                Departments
              </p>
              <div class="grid grid-cols-3 w-full mb-2">
                <div v-for="department in departments"
                     class="flex items-center"
                >
                  <input type="checkbox"
                         v-model="checkedDepartments"
                         :id="department"
                         :value="department"
                         class="flex-none w-4 h-4 accent-red-600"
                  >
                  <label for="department"
                         class="ml-2 mr-2"
                  >
                    {{department}}
                  </label>
                </div>
              </div>

              <!--Email field-->
              <label class="block uppercase tracking-wide text-gray-700 text-xl font-bold mb-2"
                     for="keywords">
                Email
              </label>
              <div class="flex flex-wrap">
                <input v-model="email"
                       type="text"
                       class="border border-gray-300 text-gray-700 rounded py-1 px-2 focus:bg-white"
                       placeholder="e.g. Jane.Doe"
                />
                <p class="bg-white text-gray-700 py-1 px-4">
                  @adelaide.edu.au
                </p>
              </div>

              <!--Thumbnail Uploads -->
              <p class="block uppercase tracking-wide text-gray-700 text-xl font-bold mb-2 mt-6">
                Upload a Thumbnail
              </p>
              <!-- Youtube Link -->
              <div v-if="selectedType === 'Video'|| selectedType === 'Animation'"
                   class="flex flex-wrap"
              >
                <p class="bg-white text-gray-700 py-1 mr-4">
                  Youtube Link:
                </p>
                <input v-model="url"
                       type="text"
                       class="bg-gray-200 border border-gray-300 text-gray-700 rounded py-1 px-2 focus:bg-white w-full bg-white"
                       placeholder="https://youtu.be/ID"
                />
              </div>
              <div v-else>
                <!-- Image Upload -->
                <div class="flex items-center justify-center w-full"
                     v-if="!fileUploaded"
                >
                  <label for="file-upload"
                         class="flex flex-col items-center justify-center h-48"
                  >
                    <div class="flex flex-col items-center justify-center pt-5 pb-6 p-8 bg-gray-100 hover:bg-gray-200 w-full cursor-pointer border-2 border-dashed rounded-lg">
                      <svg aria-hidden="true"
                           class="w-10 h-10 mb-3 text-gray-400"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                           xmlns="http://www.w3.org/2000/svg"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p class="mb-2">
                        Select a File
                      </p>
                      <p class="text-xs text-gray-500">
                        SVG, PNG, JPG or GIF (MAX. 500 KB)
                      </p>
                    </div>
                  </label>
                </div>
                <input type="file"
                       id="file-upload"
                       accept=".jpg, .jpeg, .png, .svg, .gif"
                       @change="previewUpload"
                       :class="fileUploaded ? 'block' : 'hidden'"
                       class="w-full"
                >
                <img v-if="url"
                     :src="url"
                     width="300"
                     height="300"
                     class="mt-6"
                >
              </div>
            </form>
          </div>

          <!-- 3. Uploading to Box -->
          <div class="border-gray-100 border shadow-lg rounded p-8 mb-4"
               id="3"
               v-else-if="stage == 3"
          >
            <h3>
              Showing Box uploader for folder with ID: {{mediaId}}
            </h3>
            <br>
            <div class="flex justify-center">
              <iframe :src="embedLink"
                      width="600"
                      height="400"
                      allowfullscreen webkitallowfullscreen msallowfullscreen
              >
              </iframe>
            </div>
          </div>
        </transition>

        <!-- Button to go to next stages -->
        <div v-if="stage != 3"
             class="pb-20 w-full h-fit"
        >
          <button
              class="adx-button primary float-right"
              @click="nextStage"
          >
            Next Step
          </button>
        </div>

        <!-- Button to indicate end of upload-->
        <div v-else-if="stage == 3"
             class="pb-20 w-full h-fit"
        >
          <button
              class="adx-button primary float-right"
              @click="checkFields"
          >
            Finish
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- Pop up after upload is successful -->
  <PopUp v-if="showPopup" />

</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import PopUp from "@/components/PopUp.vue";
import {mediaTypes} from "@/predefined/MediaTypes";
import {schools} from "@/predefined/SchoolsList";
import type {MediaItem} from "@/interfaces/MediaItem";
import storageRef from "@/storageConfig";
import dbRef from "@/firestoreConfig";
import {ref as firebaseStorageRef, uploadBytes, getDownloadURL, ref as reference} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import {departments} from "@/predefined/DepartmentsList";

const mediaId: Ref<string> = ref('');
const uploadLink: Ref<string> = ref('');
const stage: Ref<number> = ref(1);
const stage1Filled: Ref<boolean> = ref(false);
const stage2Filled: Ref<boolean> = ref(false);
const title: Ref<string> = ref('');
const keywords: Ref<string> = ref('');
const email: Ref<string> = ref('');
const selectedType: Ref<string> = ref('');
const checkedTags: Ref<Array<string>> = ref([]);
const checkedSchools: Ref<Array<string>> = ref([]);
const checkedDepartments: Ref<Array<string>> = ref([]);
const fileUploaded: Ref<boolean> = ref(false);
let url = ref(''); // for youtube link and 'downloaded' url of image uploaded
let thumbnail: Blob = new Blob(); // for uploading to cloud storage
const showPopup: Ref<boolean> = ref(false);
const thumbnailLink: Ref<string> = ref("");

// Link to embed box uploader using shared link of created folder
const embedLink = computed( () => {
  return `https://universityofadelaide.app.box.com/embed/s/${uploadLink.value.trim().slice(39)}?sortColumn=date&view=list`;
});

// set url to be url of uploaded image for preview
function previewUpload(event: Event) {
  thumbnail = event.target.files[0];
  url.value = URL.createObjectURL(thumbnail); // for preview
  console.log(`URL: ${url.value.trim()}`);
  fileUploaded.value = true;
}

// check that fields from step 1 and 2 are filled
function nextStage() {
  if (mediaId.value != "") {
    stage1Filled.value = true;
  }
  if (title.value != "" && keywords.value != "" && selectedType.value != "" && checkedTags.value != [] && checkedSchools.value != [] && email.value != "" && url.value != "") {
    stage2Filled.value = true;
  }
  stage.value++;
}

function checkFields() {
  if (!stage1Filled.value && !stage2Filled.value) {
    alert("Not all fields have been filled. Please go back and check.");
  }
  else {
    storeData();
  }
}

// write data to firestore
async function storeData() {
  /* Note that the thumbnail link refers to either a download URL from Cloud Storage (for image/interactive)
  or a Youtube ID (for vid/animation)
   */

  // upload 'static' thumbnails to cloud storage then get their download URL to store in db
  if (selectedType.value == 'Image' || selectedType.value == 'Interactive') {
    const pathRef = firebaseStorageRef(storageRef, `images/${mediaId.value.trim()}`);
    await uploadBytes(pathRef, thumbnail).then( (snapshot) => {
      console.log('Uploaded a blob!')
    });
    thumbnailLink.value = await getDownloadURL(pathRef).then( (url) => {
      return url;
    });
    console.log(`Thumbnail link is ${thumbnailLink.value}`);
  }
  // get Youtube ID
  else {
    // youtube link in form https://youtu.be/ID
    thumbnailLink.value = url.value.trim().slice(17);
    //thumbnailLink.value = `https://www.youtube.com/embed/${youtubeId}`;
  }

  const data: MediaItem = {
    uid: mediaId.value.trim(),
    type: checkedTags.value,
    title: title.value,
    keywords: getKeywords(keywords.value),
    contributor: email.value,
    school: checkedSchools.value,
    department: checkedDepartments.value,
    thumbnail: thumbnailLink.value,
    thumbnailType: (selectedType.value == 'Video' || selectedType.value == 'Animation') ? 'Video' : 'Static',
    visitCount: 0,
    date: new Date(),
    published: false
  }

  const docRef = doc(dbRef, 'MediaItems', mediaId.value.trim());
  await setDoc(docRef, data);

  // trigger pop-up
  showPopup.value = true;
}

function getKeywords(words: string) {
  let keywordsArr: Array<string> = words.split(',');
  let trimmedWords: Array<string> = [];

  keywordsArr.forEach( (word) => {
    trimmedWords.push(word.trim().toLowerCase());
  });
  return trimmedWords;
}

</script>

<style>

.upload-view {
  height: calc(100vh - 130px);
  margin-top: 130px;
  overflow-y: auto;
}

.activeStage {
  background: #005a9c !important;
  color: #fff;
}

.completeStage {
  background: #a7d5b9 !important;
  color: #22964f;
}

.stageItem {
  cursor: pointer;
}

/* gray when hovering over stages */
.stageItem:hover {
  background: #ececec;
  transition: all 0.5s ease-in-out;
}

/* hover transition for stages */
.stageItem:hover span {
  background: #ececec;
  transition: all 0.5s ease-in-out;
}
</style>
