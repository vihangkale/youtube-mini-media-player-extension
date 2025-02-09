// Play/Pause the video
function togglePlayPause() {
  const video = document.querySelector("video");
  if (video) {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
}

function nextVideo() {
  const nextButton = document.querySelector(".ytp-next-button");
  if (nextButton) {
    nextButton.click();
  }
}

function volumeSlider() {
  const video = document.querySelector("video");
  const volumeSliderEle = document.querySelector("volumeSlider");
  video.volume = volumeSliderEle.value;
}
// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "togglePlayPause") {
    togglePlayPause();
  } else if (request.action === "nextVideo") {
    nextVideo();
  } else if (request.action === "volumeSlider") {
    volumeSlider();
  }
});
