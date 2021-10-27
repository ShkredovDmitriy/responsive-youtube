// DEFAULT CONFIG
const defaultConfig = {
  containerId: "youtubeVideoIframe",
  videoHorisontalId: "WLNX3jQkFek",
  videoVerticalId: "VNtxeYPAh30",
  breakPoint: 500
};

// PLAYER CONFIG
const playerVars = {
  autoplay: 0,
  controls: 0,
  iv_load_policy: 3,
  modestbranding: 1
};

const youtubePlayer = config => {
  // VARIABLES
  let player;
  let containerId = defaultConfig.containerId;
  let videoHorisontalId = defaultConfig.videoHorisontalId;
  let videoVerticalId = defaultConfig.videoVerticalId;
  let breakPoint = defaultConfig.breakPoint;
  let videoEnd = 6 * 60 + 51;
  let playingVideoID = videoHorisontalId;
  let switchToMobileView = true;
  let isMobileVideoPlaying = null;
  let timeUpdater = null;
  let videoTime = 0;

  // JOIN CONFIGS
  if (config) {
    containerId = config.containerId || defaultConfig.containerId;
    videoHorisontalId =
      config.videoHorisontalId || defaultConfig.videoHorisontalId;
    videoVerticalId = config.videoVerticalId || defaultConfig.videoVerticalId;
    breakPoint = config.breakPoint || defaultConfig.breakPoint;
  }

  // GET VIDEO START TIME
  function getVideoStartTime() {
    const watchTime = document.cookie.split("watvideotime=");
    let startTime = 0;
    if (
      watchTime.length > 0 &&
      watchTime[1] != "" &&
      !isNaN(parseInt(watchTime[1]))
    ) {
      startTime = parseInt(watchTime[1]);

      if (startTime > videoEnd) {
        startTime = 0;
      }
    }
    return startTime;
  }

  // UPDATE TIME
  function updateTime() {
    if (player && player.getCurrentTime) {
      videoTime = player.getCurrentTime();
    }
    // if (videoTime > 210) {
    // $(".button-green-lander").removeClass("d-none");
    // }
    if (videoTime > videoEnd) {
      videoTime = 0;
      player.pauseVideo();
      player.seekTo(0);
    }
    document.cookie = "watvideotime=" + player.getCurrentTime();
  }

  // CHANGE VIDEO ROTATION
  function adjustVideoPlayerSize() {
    if (window.innerWidth <= breakPoint && isMobileVideoPlaying === false) {
      player.loadVideoById(videoVerticalId, videoTime);
      isMobileVideoPlaying = true;
    } else if (
      window.innerWidth > breakPoint &&
      isMobileVideoPlaying === true
    ) {
      player.loadVideoById(videoHorisontalId, videoTime);
      isMobileVideoPlaying = false;
    }
  }

  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player(containerId, {
      videoId: playingVideoID,
      playerVars: playerVars,
      events: {
        // onReady: onPlayerReady,
        // onStateChange: onPlayerStateChange
      }
    });
  };

  // ON PLAYER READY
  function onPlayerReady(event) {
    player.loadVideoById(playingVideoID, getVideoStartTime());
    timeUpdater = setInterval(updateTime, 1000);
  }

  // ON PLAYER CHANGE
  function onPlayerStateChange(event) {
    const state = player.getPlayerState();
    if (state === 1) {
      player.playVideo();
    }
  }

  if (document.querySelector(".ds-youtube-player__wrapper")) {
    const clickArea = document.querySelector(".ds-youtube-player__click-area");
    const videoPoster = document.querySelector(".ds-youtube-player__poster");

    // ADD YOUTUBE API TO HTML
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    if (window.innerWidth <= breakPoint && switchToMobileView) {
      playingVideoID = videoVerticalId;
      isMobileVideoPlaying = true;
    } else {
      playingVideoID = videoHorisontalId;
      isMobileVideoPlaying = false;
    }

    window.addEventListener("resize", adjustVideoPlayerSize);

    // PLAY START/STOP
    $(clickArea).on("click", () => {
      const state = player.getPlayerState();
      if (state === 1) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    });
  }
};

export default youtubePlayer;
