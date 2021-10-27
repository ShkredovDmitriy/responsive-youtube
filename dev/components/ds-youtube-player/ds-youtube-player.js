if (document.querySelector(".ds-youtube-player__wrapper")) {
  const clickArea = document.querySelector(".ds-youtube-player__click-area");
  const videoPoster = document.querySelector(".ds-youtube-player__poster");

  // ADD YOUTUBE API
  var tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // CREATE IFRAME
  window.youtubePlayer;
  let videoIDMobile = "VNtxeYPAh30";
  let videoIDDesktop = "WLNX3jQkFek";
  let videoEnd = 6 * 60 + 51;
  let playingVideoID = videoIDDesktop;
  let switchToMobileView = true;
  let isMobileVideoPlaying = null;
  let timeUpdater = null;
  let videoTime = 0;

  if (window.innerWidth <= 500 && switchToMobileView) {
    playingVideoID = videoIDMobile;
    isMobileVideoPlaying = true;
  } else {
    playingVideoID = videoIDDesktop;
    isMobileVideoPlaying = false;
  }

  if (switchToMobileView) {
    window.addEventListener("resize", adjustVideoPlayerSize);
  }

  function adjustVideoPlayerSize() {
    if (window.innerWidth <= 500 && isMobileVideoPlaying === false) {
      window.youtubePlayer.loadVideoById(videoIDMobile, videoTime);
      isMobileVideoPlaying = true;
    } else if (window.innerWidth > 500 && isMobileVideoPlaying === true) {
      window.youtubePlayer.loadVideoById(videoIDDesktop, videoTime);
      isMobileVideoPlaying = false;
    }
  }

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

  function updateTime() {
    if (window.youtubePlayer && window.youtubePlayer.getCurrentTime) {
      videoTime = window.youtubePlayer.getCurrentTime();
    }
    if (videoTime > 210) {
      // $(".button-green-lander").removeClass("d-none");
    }
    if (videoTime > videoEnd) {
      videoTime = 0;
      window.youtubePlayer.pauseVideo();
      window.youtubePlayer.seekTo(0);
    }
    document.cookie = "watvideotime=" + window.youtubePlayer.getCurrentTime();
  }

  window.onYouTubeIframeAPIReady = function() {
    window.youtubePlayer = new YT.Player("youtubeVideoIframe", {
      videoId: playingVideoID,
      playerVars: {
        autoplay: 0,
        controls: 0,
        iv_load_policy: 3,
        modestbranding: 1
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  };

  window.onPlayerReady = function(event) {
    window.youtubePlayer.loadVideoById(playingVideoID, getVideoStartTime());
    timeUpdater = setInterval(updateTime, 1000);
  };

  window.onPlayerStateChange = function(event) {
    const state = window.youtubePlayer.getPlayerState();
    if (state === 1) {
      window.youtubePlayer.playVideo();
    }
  };

  // PLAY START/STOP
  $(clickArea).on("click", () => {
    const state = window.youtubePlayer.getPlayerState();
    if (state === 1) {
      window.youtubePlayer.pauseVideo();
    } else {
      window.youtubePlayer.playVideo();
    }
  });
}
