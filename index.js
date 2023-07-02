const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const videoList = [];
const playlistIdsList = [
  { id: "PL_dirAhLkFruHqCglkSdxPq54wR9vvgAY", category: "Agências" },
  { id: "PL_dirAhLkFrvUz1Ml31VcRFdUXm5vgUiB", category: "Geração de Leads" },
  { id: "PL_dirAhLkFrvxKRfOP6WN2DQrFKmoI3l6", category: "Mídia Paga" },
  { id: "PL_dirAhLkFrvB5KbzDA0wPqXiUhlehTRF", category: "Marketing Digital" },
  { id: "PL_dirAhLkFrtwwLCyI3nltoIc5TSKGHKM", category: "Chatbot" },
];

async function loopRequest() {
  for (const playlist of playlistIdsList) {
    await getVideosDataFromYoutubeApi(playlist);
  }
  setTimeout(() => {
    convertVideoListToJson(videoList);
  }, 6000);
}

async function getVideosDataFromYoutubeApi(playlist) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlist["id"]}&maxResults=50&key=${apiKey}`;
  axios.get(youtubeApiUrl).then((data) => {
    const videos = data.data.items;
    console.log(videos);
    videos.forEach((video) => {
      buildVideoObject(video["snippet"], playlist["category"]);
    });
  });
}

function convertVideoListToJson(videos) {
  fs.writeFileSync(
    `data.json`,
    JSON.stringify(videos, null, 4),
    "utf-8",
    (err) => {
      if (err) console.log(err);
    }
  );
}

function buildVideoObject(video, category) {
  const videoId = video["resourceId"]["videoId"];
  const newVideoObject = {
    id: videoId,
    video_url: `https://www.youtube.com/watch?v=${videoId}&ab_channel=Leadster-MarketingConversacional`,
    thumb: video["thumbnails"]["standard"]["url"],
    publishedAt: video["publishedAt"],
    title: video["title"],
    description: video["description"],
    category: category,
  };
  videoList.push(newVideoObject);
}

loopRequest();
