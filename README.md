# Media Hub
Media Hub is a 7-week internship project I undertook at the University of Adelaide that involved developing a searchable and navigable repository of reusable media assets that are created and sourced by the [Media Production team](https://www.adelaide.edu.au/learning-enhancement-innovation/our-services/media-production) within [Learning Enhancement and Innovation (LEI)](https://www.adelaide.edu.au/learning-enhancement-innovation/). The tool is aimed to be used by professional and academic staff at the University of Adelaide to find material to use and re-use within their own courses. 

The Media Hub contains two main features:
1. An interface to search and filter through the Media Hub collection
2. An upload tool for adding metadata to the database and uploading the asset to Box

To be a supported and maintained product, the prototype utilises technology and frameworks already supported by the Media Production team:
* coded using Vue3 (Composition API and Single File Components), TypeScript and Tailwind CSS
* data stored on the Media Production team’s Google Firebase instance (Cloud Firestore)
* utilised Github and the mediaproduction.adelaide.edu.au domain for delivery of the tool
* used the UoA Box license to store large media assets
* utilised existing styles and aligned to the Media Production team standards
 

Live Demo: https://flindyly.github.io/Media-Hub

For more details on the project including project specifications, wireframes and technical processes, see the [wiki](https://github.com/flindyly/Media-Hub/wiki).

## How to run

1. Clone this repository
2. [Install NPM](https://nodejs.org/en/download/) if not already installed
3. Using Command Line or Terminal, navigate to the cloned folder
4. Inside your terminal, run `npm install` or `npm i` to install any dependencies
5. Then type ```npm run dev``` to get things up and running locally. This will spool up a local server running the site at localhost
