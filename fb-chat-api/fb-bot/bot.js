const login = require("facebook-chat-api");
const fs = require("fs");
const config = require("./config.json");

function randomDelay(min = 3000, max = 8000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function processQueue(api, messageQueue) {
  if (messageQueue.length === 0) return;
  const { threadID, text } = messageQueue.shift();
  api.sendMessage(text, threadID, (err) => {
    if (err) console.error("Send message error:", err);
  });
  if (messageQueue.length > 0) setTimeout(() => processQueue(api, messageQueue), randomDelay());
}

function startBot(account) {
  let messageQueue = [];
  const loginCallback = (err, api) => {
    if (err) {
      console.error(`Login error:`, err);
      setTimeout(() => startBot(account), 10000);
      return;
    }
    console.log(`✅ Logged in: ${account.email}`);
    fs.writeFileSync(account.sessionFile, JSON.stringify(api.getAppState()));
    api.listenMqtt((err, message) => {
      if (err) {
        console.error("Listen error:", err);
        if (err.error && err.error.includes("login")) startBot(account);
        return;
      }
      console.log(`[${account.email}] 📩 New message:`, message.body);
      messageQueue.push({ threadID: message.threadID, text: `Auto reply: ${message.body}` });
      if (messageQueue.length === 1) setTimeout(() => processQueue(api, messageQueue), randomDelay());
    });
  };

  if (fs.existsSync(account.sessionFile)) {
    const appState = JSON.parse(fs.readFileSync(account.sessionFile, "utf8"));
    login({ appState }, loginCallback);
  } else {
    login({ email: account.email, password: account.password }, loginCallback);
  }
}

startBot(config.facebookAccount);
