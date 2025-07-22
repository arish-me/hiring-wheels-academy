   // At the top of your tailwind.config.js or tailwind.config.ts
   const { fontFamily } = require("tailwindcss/defaultTheme");

   /** @type {import('tailwindcss').Config} */
   module.exports = {
     // ...your existing config,
     content: [
       // ...your existing content globs
     ],
     theme: {
       extend: {
         fontFamily: {
           // ...your font config
         },
       },
     },
     plugins: [
       require('@tailwindcss/typography'),
       // ...other plugins
     ],
   };