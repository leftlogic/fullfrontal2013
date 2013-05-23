// var random = function (min, max) {
//   var generator = function () {
//     var mean = (min + max) / 2,
//         deviation = max - mean,
//         randomNumber = (Math.random() * mean) + deviation;

//     randomNumber = Math.floor(randomNumber);

//     if (randomNumber < min || randomNumber > max) {
//       randomNumber = random(min, max);
//     }

//     return randomNumber;
//   };
//   return generator();
// };

// i = 0;
// while (i <= 100) {
//   console.log(random(1, 10));
//   i++;
// }

// var skylineContainer = (function (element) {
//   var $ = jQuery(element);
//   return {
//     $: $,
//     element: $[0],
//     width: $.width(),
//     height: $.height()
//   }
// })('#skyline');

// var skyline = Raphael(skylineContainer.element, skylineContainer.width, skylineContainer.height);






