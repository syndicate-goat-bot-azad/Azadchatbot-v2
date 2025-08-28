module.exports = {
config: {
name: "prefix",
version: "1.7.0",
author: "Azad",
role: 0,
shortDescription: "Animated stylish prefix info card",
longDescription: "Replies with an animated style image showing prefix info, server time, user name and profile picture with glow, shadows, and abstract background patterns.",
category: "utility"
},

onStart: async function () {},

onChat: async function ({ api, event, message, threadsData, usersData }) {
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");

if (!event.body || event.body.toLowerCase().trim() !== "prefix") return;  

try {  
  const threadID = event.threadID;  
  const senderID = event.senderID;  

  // --- Get prefixes ---  
  const systemPrefix = (global.GoatBot?.config?.prefix) || "/";  
  let groupPrefix = systemPrefix;  
  try {  
    const tdata = await threadsData.get(threadID);  
    if (tdata?.data?.prefix) groupPrefix = tdata.data.prefix;  
  } catch (_) {}  

  // --- Get user info ---  
  const userInfo = await api.getUserInfo(senderID);  
  const userName = userInfo[senderID]?.name || "Unknown User";  

  // --- Get avatar ---  
  let avatar;  
  try {  
    const avatarUrl = await usersData.getAvatarUrl(senderID);  
    const avatarRes = await axios.get(avatarUrl, { responseType: "arraybuffer" });  
    avatar = await loadImage(Buffer.from(avatarRes.data, "binary"));  
  } catch (err) {  
    const fallbackURL = "https://i.imgur.com/0eg0aG3.png";  
    const fbRes = await axios.get(fallbackURL, { responseType: "arraybuffer" });  
    avatar = await loadImage(Buffer.from(fbRes.data, "binary"));  
  }  

  // --- Server Time ---  
  const serverTime = new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka", hour12: false });  

  // --- Canvas ---  
  const W = 1200, H = 700;  
  const canvas = createCanvas(W, H);  
  const ctx = canvas.getContext("2d");  

  // Background gradient  
  const bg = ctx.createLinearGradient(0, 0, W, H);  
  bg.addColorStop(0, "#0f172a");  
  bg.addColorStop(1, "#1e293b");  
  ctx.fillStyle = bg;  
  ctx.fillRect(0, 0, W, H);  

  // Abstract wave pattern  
  drawAbstractPattern(ctx, W, H);  

  // Rounded card  
  const pad = 40;  
  const cardW = W - pad * 2;  
  const cardH = H - pad * 2;  
  const radius = 40;  
  ctx.shadowColor = "rgba(0,0,0,0.35)";  
  ctx.shadowBlur = 25;  
  ctx.shadowOffsetX = 0;  
  ctx.shadowOffsetY = 10;  
  ctx.fillStyle = "rgba(255,255,255,0.08)";  
  roundedRect(ctx, pad, pad, cardW, cardH, radius);  
  ctx.fill();  
  ctx.shadowBlur = 0;  

  // Title  
  const titleGradient = ctx.createLinearGradient(W/2 - 250, 0, W/2 + 250, 0);  
  titleGradient.addColorStop(0, "#facc15");  
  titleGradient.addColorStop(1, "#38bdf8");  
  ctx.fillStyle = titleGradient;  
  ctx.font = "bold 75px sans-serif";  
  ctx.textAlign = "center";  
  ctx.shadowColor = "rgba(0,0,0,0.4)";  
  ctx.shadowBlur = 8;  
  ctx.fillText("Bot Prefix Info", W / 2, 100);  
  ctx.shadowBlur = 0;  

  // Info Text  
  ctx.font = "bold 48px sans-serif";  
  ctx.textAlign = "center";  
  ctx.shadowColor = "rgba(0,0,0,0.25)";  
  ctx.shadowBlur = 5;  

  ctx.fillStyle = "#38bdf8";  
  ctx.fillText(`System Prefix : ${systemPrefix}`, W / 2, 200);  

  ctx.fillStyle = "#22c55e";  
  ctx.fillText(`Your Group Prefix : ${groupPrefix}`, W / 2, 270);  

  ctx.fillStyle = "#f87171";  
  ctx.fillText(`Server Time : ${serverTime}`, W / 2, 340);  
  ctx.shadowBlur = 0;  

  ctx.font = "bold 55px sans-serif";  
  ctx.fillStyle = "#fff";  
  ctx.fillText(`User : ${userName}`, W / 2, 420);  

  // Profile picture with glow and border  
  const size = 160;  
  const x = W / 2 - size / 2;  
  const y = 450;  

  ctx.save();  
  ctx.shadowColor = "#38bdf8";  
  ctx.shadowBlur = 35;  
  ctx.shadowOffsetX = 0;  
  ctx.shadowOffsetY = 0;  
  ctx.beginPath();  
  ctx.arc(W / 2, y + size / 2, size / 2, 0, Math.PI * 2);  
  ctx.closePath();  
  ctx.fillStyle = "#00000000";  
  ctx.fill();  
  ctx.restore();  

  ctx.save();  
  ctx.beginPath();  
  ctx.arc(W / 2, y + size / 2, size / 2, 0, Math.PI * 2);  
  ctx.closePath();  
  ctx.clip();  
  ctx.drawImage(avatar, x, y, size, size);  
  ctx.restore();  

  ctx.beginPath();  
  ctx.arc(W / 2, y + size / 2, size / 2 + 4, 0, Math.PI * 2);  
  ctx.strokeStyle = "#38bdf8";  
  ctx.lineWidth = 4;  
  ctx.stroke();  

  // --- Save and send ---  
  const cacheDir = path.join(__dirname, "../cache");  
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });  
  const outPath = path.join(cacheDir, `prefix_${Date.now()}.png`);  
  fs.writeFileSync(outPath, canvas.toBuffer("image/png"));  

  await message.reply({  
    body: `✨ Azad chat bot Prefix Info ✅`,  
    attachment: fs.createReadStream(outPath)  
  });  

  setTimeout(() => fs.existsSync(outPath) && fs.unlinkSync(outPath), 60000);  

} catch (err) {  
  console.error(err);  
  return message.reply("দুঃখিত, ছবি বানাতে সমস্যা হয়েছে: " + err.message);  
}  

// Helper functions  
function roundedRect(ctx, x, y, w, h, r) {  
  ctx.beginPath();  
  ctx.moveTo(x + r, y);  
  ctx.arcTo(x + w, y, x + w, y + h, r);  
  ctx.arcTo(x + w, y + h, x, y + h, r);  
  ctx.arcTo(x, y + h, x, y, r);  
  ctx.arcTo(x, y, x + w, y, r);  
  ctx.closePath();  
}  

function drawAbstractPattern(ctx, W, H) {  
  for (let i = 0; i < 6; i++) {  
    const gradient = ctx.createRadialGradient(  
      Math.random() * W, Math.random() * H, 50,  
      Math.random() * W, Math.random() * H, 300  
    );  
    gradient.addColorStop(0, `rgba(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},0.05)`);  
    gradient.addColorStop(1, "rgba(0,0,0,0)");  
    ctx.fillStyle = gradient;  
    ctx.fillRect(0, 0, W, H);  
  }  
}

}
};
