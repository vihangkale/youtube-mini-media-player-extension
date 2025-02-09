document.getElementById("playPauseBtn").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Send message to content script to toggle play/pause
    chrome.tabs.sendMessage(tabs[0].id, { action: "togglePlayPause" });
  });
  setTimeout(updatePlayPauseButton, 100);
});

// document.getElementById("muteBtn").addEventListener("click", function () {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     // Send message to content script to toggle mute
//     const muteBtn = document.querySelector(".ytp-mute-button");
//     const video = document.querySelector("video");
//     console.log(muteBtn, video, "videovideovideo");
//     if (video) {
//       video = !video.mute;
//     }
//     if (muteBtn) {
//       muteBtn.click();
//     }
//   });
// });
document.getElementById("nextBtn").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Send message to content script to toggle mute
    chrome.tabs.sendMessage(tabs[0].id, { action: "nextVideo" });
  });
});
// Get the volume slider element
const volumeSlider = document.getElementById("volume-slider");
const seekSlider = document.getElementById("seek-slider");
const qualitySelector = document.getElementById("quality-selector");
const speedSelector = document.getElementById("speed-selector");
const playPauseBtn = document.getElementById("playPauseBtn");
const currentTimeElement = document.getElementById("current-time");
const totalDurationElement = document.getElementById("total-duration");
const fullscreenBtn = document.getElementById("fullscreen-btn");
// Function to fetch and display the video title
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
// function fetchVideoTitle() {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const activeTab = tabs[0];
//     if (activeTab.url.includes("youtube.com/watch")) {
//       chrome.scripting.executeScript(
//         {
//           target: { tabId: activeTab.id },
//           func: () => {
//             // const titleElement = document.querySelector(
//             //   "h1.title yt-formatted-string"
//             // );
//             // return titleElement ? titleElement.innerText : "Title not found";
//             const checkTitle = () => {
//               const titleElement = document.querySelector(
//                 "div#title h1 yt-formatted-string"
//               );
//               if (titleElement) {
//                 return titleElement.innerText;
//               } else {
//                 // setTimeout(checkTitle, 100); // Retry after 100ms if title element not found yet
//               }
//             };
//             return checkTitle();
//           },
//         },
//         (results) => {
//           if (results && results[0] && results[0].result !== undefined) {
//             videoTitleElement.innerText = results[0].result;
//           }
//         }
//       );
//     }
//   });
// }

function updatePlayPauseButton() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab.url.includes("youtube.com/watch")) {
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          func: () => {
            const video = document.querySelector("video");
            return video ? video.paused : true;
          },
        },
        (results) => {
          if (results && results[0] && results[0].result !== undefined) {
            const img = playPauseBtn.getElementsByTagName("img")[0];
            img.src = results[0].result
              ? " ./assets/icons/play_circle.svg"
              : "./assets/icons/pause_circle.svg";
            // playPauseBtn.innerText = results[0].result ? "Play" : "Pause";
          }
        }
      );
    }
  });
}
// Function to set the volume of the YouTube video
function setVolume(volume) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab.url.includes("youtube.com/watch")) {
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: (volume) => {
          const video = document.querySelector("video");
          if (video) {
            video.volume = volume;
          }
        },
        args: [volume],
      });
    }
  });
}
// Function to update the seekbar
// function updateSeekbar() {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const activeTab = tabs[0];
//     if (activeTab.url.includes("youtube.com/watch")) {
//       chrome.scripting.executeScript(
//         {
//           target: { tabId: activeTab.id },
//           func: () => {
//             const video = document.querySelector("video");
//             if (video) {
//               const progress = (video.currentTime / video.duration) * 100;
//               return progress;
//             }
//             return 0;
//           },
//         },
//         (results) => {
//           if (results && results[0] && results[0].result !== undefined) {
//             seekSlider.value = results[0].result;
//           }
//         }
//       );
//     }
//   });
// }
function updateSeekbarAndTime() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab.url.includes("youtube.com/watch")) {
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          func: () => {
            const video = document.querySelector("video");
            if (video) {
              const progress = (video.currentTime / video.duration) * 100;
              return {
                progress,
                currentTime: video.currentTime,
                duration: video.duration,
              };
            }
            return null;
          },
        },
        (results) => {
          if (results && results[0] && results[0].result !== undefined) {
            const { progress, currentTime, duration } = results[0].result;
            seekSlider.value = progress;
            currentTimeElement.innerText = formatTime(currentTime);
            totalDurationElement.innerText = formatTime(duration);
          }
        }
      );
    }
  });
}

// Function to seek the video
function seekVideo(progress) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab.url.includes("youtube.com/watch")) {
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: (progress) => {
          const video = document.querySelector("video");
          if (video) {
            video.currentTime = (progress / 100) * video.duration;
          }
        },
        args: [progress],
      });
    }
  });
}
// Function to change the video quality
function changeQuality(quality) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab.url.includes("youtube.com/watch")) {
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: (quality) => {
          // Open the settings menu
          const settingsButton = document.querySelector(".ytp-settings-button");
          if (settingsButton) {
            settingsButton.click();
          }

          // Wait for the settings menu to open
          setTimeout(() => {
            // Find the quality menu item
            const qualityMenu = document.querySelector(
              ".ytp-settings-menu .ytp-menuitem:last-child"
            );
            if (qualityMenu) {
              qualityMenu.click();

              // Wait for the quality options to appear
              setTimeout(() => {
                // Find the desired quality option
                const qualityOptions = document.querySelectorAll(
                  ".ytp-quality-menu .ytp-menuitem"
                );
                qualityOptions.forEach((option) => {
                  if (option.innerText.toLowerCase().includes(quality)) {
                    option.click();
                  }
                });
              }, 100);
            }
          }, 100);
        },
        args: [quality],
      });
    }
  });
}
// Function to change the playback speed
function changePlaybackSpeed(speed) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab.url.includes("youtube.com/watch")) {
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: (speed) => {
          const video = document.querySelector("video");
          if (video) {
            video.playbackRate = parseFloat(speed);
          }
        },
        args: [speed],
      });
    }
  });
}
function toggleFullscreen() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab.url.includes("youtube.com/watch")) {
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => {
          const nextButton = document.querySelector(".ytp-fullscreen-button");
          if (nextButton) {
            nextButton.click();
          }
        },
      });
    }
  });
}
// Set the initial volume, seekbar, and video title when the popup loads
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const activeTab = tabs[0];
  if (activeTab.url.includes("youtube.com/watch")) {
    // Set initial volume
    chrome.scripting.executeScript(
      {
        target: { tabId: activeTab.id },
        func: () => {
          const video = document.querySelector("video");
          return video ? video.volume : 1;
        },
      },
      (results) => {
        if (results && results[0] && results[0].result !== undefined) {
          volumeSlider.value = results[0].result;
        }
      }
    );

    // Set initial seekbar position
    updateSeekbarAndTime();

    // Fetch and display the video title
    // fetchVideoTitle();
  }
});

// Set the initial volume when the popup loads
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const activeTab = tabs[0];
  if (activeTab.url.includes("youtube.com/watch")) {
    chrome.scripting.executeScript(
      {
        target: { tabId: activeTab.id },
        func: () => {
          const video = document.querySelector("video");
          return video ? video.volume : 1;
        },
      },
      (results) => {
        if (results && results[0] && results[0].result !== undefined) {
          volumeSlider.value = results[0].result;
        }
      }
    );
  }
});

// Add an event listener to the slider
volumeSlider.addEventListener("input", () => {
  const volume = parseFloat(volumeSlider.value);
  setVolume(volume);
});
seekSlider.addEventListener("input", () => {
  const progress = parseFloat(seekSlider.value);
  seekVideo(progress);
});
qualitySelector.addEventListener("change", () => {
  const quality = qualitySelector.value;
  changeQuality(quality);
});
speedSelector.addEventListener("change", () => {
  const speed = speedSelector.value;
  changePlaybackSpeed(speed);
});
fullscreenBtn.addEventListener("click", () => {
  toggleFullscreen();
});

// Update the seekbar and play/pause button every second
setInterval(() => {
  updateSeekbarAndTime();
  updatePlayPauseButton();
}, 1000);
