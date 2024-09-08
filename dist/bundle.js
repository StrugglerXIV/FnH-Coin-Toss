/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/chatCommands.js":
/*!*****************************!*\
  !*** ./src/chatCommands.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addChatCommand: () => (/* binding */ addChatCommand)\n/* harmony export */ });\n/* harmony import */ var _media_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./media.js */ \"./src/media.js\");\n\nHooks.once('ready', () => {\n  addChatCommand();\n});\nfunction addChatCommand() {\n  Hooks.on('chatMessage', (chatLog, messageText) => {\n    if (messageText === \"/coinflip\") {\n      (0,_media_js__WEBPACK_IMPORTED_MODULE_0__.showCoinChoiceDialog)();\n      return false; // Prevents the message from being sent to chat\n    }\n  });\n}\n\n//# sourceURL=webpack://gear-slot/./src/chatCommands.js?");

/***/ }),

/***/ "./src/coinFlip.js":
/*!*************************!*\
  !*** ./src/coinFlip.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   coinFlip: () => (/* binding */ coinFlip)\n/* harmony export */ });\n/* harmony import */ var _media_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./media.js */ \"./src/media.js\");\n\nasync function coinFlip(playerChoice) {\n  try {\n    // Roll a die to simulate coin flip (1d2)\n    let roll = await new Roll('1d2').evaluate({\n      async: true\n    });\n    let resultTotal = roll.total;\n\n    // Send the result to all players to show the video\n    game.socket.emit(\"module.FnH-Coin-Toss\", {\n      type: \"playCoinFlipVideo\",\n      resultTotal: resultTotal,\n      senderId: game.user.id,\n      playerChoice: playerChoice\n    });\n\n    // Show the video for the local player immediately\n    (0,_media_js__WEBPACK_IMPORTED_MODULE_0__.playCoinFlipVideo)(resultTotal, game.user.id, playerChoice, false);\n  } catch (error) {\n    console.error(\"Error during coin flip:\", error);\n  }\n}\n\n//# sourceURL=webpack://gear-slot/./src/coinFlip.js?");

/***/ }),

/***/ "./src/hpMonitor.js":
/*!**************************!*\
  !*** ./src/hpMonitor.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   monitorActorHP: () => (/* binding */ monitorActorHP),\n/* harmony export */   monitorAllPlayerActors: () => (/* binding */ monitorAllPlayerActors)\n/* harmony export */ });\nfunction monitorActorHP(actor) {\n  let previousHp = actor.system.attributes.hp.value;\n  Hooks.on('updateActor', (actorDoc, updateData) => {\n    let newHp = getProperty(updateData, \"system.attributes.hp.value\");\n    if (newHp !== undefined) {\n      if (newHp === 0 && previousHp > 0) {\n        console.log(`${actor.name} has reached 0 HP.`);\n        let user = game.users.find(u => u.character?.id === actor.id);\n        if (user && user.active) {\n          game.socket.emit(\"module.FnH-Coin-Toss\", {\n            type: \"showCoinChoiceDialog\",\n            userId: user.id\n          });\n        }\n      }\n      previousHp = newHp;\n    }\n  });\n}\nfunction monitorAllPlayerActors() {\n  game.actors.forEach(actor => {\n    if (actor.hasPlayerOwner) {\n      monitorActorHP(actor);\n    }\n  });\n}\n\n//# sourceURL=webpack://gear-slot/./src/hpMonitor.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _coinFlip_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./coinFlip.js */ \"./src/coinFlip.js\");\n/* harmony import */ var _chatCommands_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chatCommands.js */ \"./src/chatCommands.js\");\n/* harmony import */ var _hpMonitor_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./hpMonitor.js */ \"./src/hpMonitor.js\");\n/* harmony import */ var _media_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./media.js */ \"./src/media.js\");\n/* harmony import */ var _socketListeners_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./socketListeners.js */ \"./src/socketListeners.js\");\n/* harmony import */ var _main_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./main.js */ \"./src/main.js\");\n// Import all necessary scripts\n\n\n\n\n\n\n\n//# sourceURL=webpack://gear-slot/./src/index.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _hpMonitor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hpMonitor.js */ \"./src/hpMonitor.js\");\n/* harmony import */ var _socketListeners_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./socketListeners.js */ \"./src/socketListeners.js\");\n/* harmony import */ var _chatCommands_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chatCommands.js */ \"./src/chatCommands.js\");\n\n\n\nHooks.once('ready', () => {\n  console.log(\"FnH Coin Toss Module Loaded!\");\n\n  // Initialize various parts of the module\n  (0,_hpMonitor_js__WEBPACK_IMPORTED_MODULE_0__.monitorAllPlayerActors)();\n  (0,_socketListeners_js__WEBPACK_IMPORTED_MODULE_1__.setupSocketListeners)();\n  (0,_chatCommands_js__WEBPACK_IMPORTED_MODULE_2__.addChatCommand)();\n});\n\n//# sourceURL=webpack://gear-slot/./src/main.js?");

/***/ }),

/***/ "./src/media.js":
/*!**********************!*\
  !*** ./src/media.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   closeDialog: () => (/* binding */ closeDialog),\n/* harmony export */   playCoinFlipVideo: () => (/* binding */ playCoinFlipVideo),\n/* harmony export */   removeOverlay: () => (/* binding */ removeOverlay),\n/* harmony export */   showCoinChoiceDialog: () => (/* binding */ showCoinChoiceDialog)\n/* harmony export */ });\n/* harmony import */ var _coinFlip_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./coinFlip.js */ \"./src/coinFlip.js\");\n\nfunction showCoinChoiceDialog() {\n  console.log(\"FnHCoinToss: Coin flip function is loaded\");\n  new Dialog({\n    title: \"Choose Heads or Tails\",\n    content: `\n          <div class=\"dialog-size\">\n            <div style=\"display: flex; justify-content: space-around;\">\n              <img src=\"modules/FnH-Coin-Toss/assets/Heads.png\" id=\"heads-choice\" class=\"cursor-pointer\" />\n              <img src=\"modules/FnH-Coin-Toss/assets/Tails.png\" id=\"tails-choice\" class=\"cursor-pointer\" />\n            </div>\n          </div>\n        `,\n    buttons: {},\n    render: html => {\n      html.find(\"#heads-choice\").click(() => {\n        (0,_coinFlip_js__WEBPACK_IMPORTED_MODULE_0__.coinFlip)(\"heads\");\n        ui.notifications.info(\"You chose Heads.\");\n        closeDialog();\n      });\n      html.find(\"#tails-choice\").click(() => {\n        (0,_coinFlip_js__WEBPACK_IMPORTED_MODULE_0__.coinFlip)(\"tails\");\n        ui.notifications.info(\"You chose Tails.\");\n        closeDialog();\n      });\n    }\n  }).render(true);\n}\nfunction playCoinFlipVideo(resultTotal, senderId, playerChoice, isGlobal) {\n  const videoHeads = \"modules/FnH-Coin-Toss/assets/Heads.mp4\";\n  const videoTails = \"modules/FnH-Coin-Toss/assets/Tails.mp4\";\n  const videoToPlay = resultTotal === 1 ? videoHeads : videoTails;\n  const resultText = resultTotal === 1 ? \"Heads\" : \"Tails\";\n  const guessedCorrectly = resultText.toLowerCase() === playerChoice.toLowerCase();\n  console.log(`Video to play: ${videoToPlay}`);\n  console.log(`Guessed correctly: ${guessedCorrectly}`);\n  const overlay = document.createElement(\"div\");\n  overlay.classList.add(\"overlay\");\n  const videoElement = document.createElement(\"video\");\n  videoElement.src = videoToPlay;\n  videoElement.autoplay = true;\n  videoElement.classList.add(\"videoElement\");\n  overlay.appendChild(videoElement);\n  document.body.appendChild(overlay);\n  function sendChatMessage() {\n    const message = guessedCorrectly ? \"Your body surges in adrenaline, you are now hasted.\" : \"Your mind cannot handle this much terror.\";\n    ChatMessage.create({\n      speaker: ChatMessage.getSpeaker(),\n      content: message\n    });\n  }\n  videoElement.addEventListener(\"ended\", () => {\n    sendChatMessage();\n    removeOverlay();\n    game.socket.emit(\"module.FnH-Coin-Toss\", {\n      type: \"removeOverlay\"\n    });\n  });\n  videoElement.addEventListener(\"error\", () => {\n    console.error(\"Error playing video:\", videoElement.src);\n    removeOverlay();\n  });\n}\nfunction removeOverlay() {\n  const existingOverlay = document.querySelector('.overlay');\n  if (existingOverlay) {\n    existingOverlay.remove();\n  }\n}\nfunction closeDialog() {\n  const dialog = document.querySelector(\".dialog\");\n  if (dialog) {\n    dialog.remove();\n  }\n}\n\n//# sourceURL=webpack://gear-slot/./src/media.js?");

/***/ }),

/***/ "./src/socketListeners.js":
/*!********************************!*\
  !*** ./src/socketListeners.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   setupSocketListeners: () => (/* binding */ setupSocketListeners)\n/* harmony export */ });\n/* harmony import */ var _media_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./media.js */ \"./src/media.js\");\n\n\nfunction setupSocketListeners() {\n  game.socket.on(\"module.FnH-Coin-Toss\", data => {\n    console.log(\"Received socket event:\", data);\n    if (data.type === \"showCoinChoiceDialog\" && game.user.id === data.userId) {\n      (0,_media_js__WEBPACK_IMPORTED_MODULE_0__.showCoinChoiceDialog)();\n    } else if (data.type === \"playCoinFlipVideo\") {\n      (0,_media_js__WEBPACK_IMPORTED_MODULE_0__.playCoinFlipVideo)(data.resultTotal, data.senderId, data.playerChoice, true);\n    } else if (data.type === \"removeOverlay\") {\n      (0,_media_js__WEBPACK_IMPORTED_MODULE_0__.removeOverlay)();\n    }\n  });\n}\n\n//# sourceURL=webpack://gear-slot/./src/socketListeners.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;