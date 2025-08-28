// Author: Azad

function roleTextToString(role) {
  switch (role) {
    case 0: return "🟢 Everyone";
    case 1: return "🟡 Group Admins";
    case 2: return "🔴 Bot Admins";
    default: return "❓ Unknown";
  }
}

// Category emoji map
const categoryIcons = {
  info: "📚",
  system: "⚙️",
  admin: "🛡️",
  fun: "🎮",
  games: "🎲",
  economy: "💰",
  media: "🎬",
  ai: "🤖",
  owner: "👑",
  misc: "✨",
  uncategorized: "📦"
};

module.exports = {
  config: {
    name: "help",
    aliases: ["use", "cmdl"],
    version: "2.0",
    author: "Azad",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Stylish command usage menu" },
    longDescription: { en: "Get command details, usage, and categories with style" },
    category: "info",
    guide: { en: "{pn} / help cmdName\n{pn} -c <categoryName>" },
    priority: 1,
  },

  onStart: async function ({ message, args, event, role }) {
    const { threadID } = event;

    // fallback prefix
    let prefix = "!";
    try {
      if (global.utils && typeof global.utils.getPrefix === "function") {
        prefix = global.utils.getPrefix(threadID) || "!";
      }
    } catch {
      prefix = "!";
    }

    const commands = global.GoatBot?.commands;
    const aliases = global.GoatBot?.aliases;

    if (!commands || !aliases) {
      return await message.reply("❌ Commands are not loaded yet.");
    }

    // ----- Full List -----
    if (!args.length) {
      let msg = `╔══════════════════════════════════╗
      ✨ 𝗔𝗭𝗔𝗗 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁 — 𝗛𝗘𝗟𝗣 𝗠𝗘𝗡𝗨 ✨
╚══════════════════════════════════╝\n`;

      const categories = {};
      for (const [name, cmd] of commands) {
        if (cmd.config.role > role) continue;
        const cat = (cmd.config.category || "Uncategorized").toLowerCase();
        categories[cat] = categories[cat] || [];
        categories[cat].push(name);
      }

      Object.keys(categories).forEach((cat) => {
        const icon = categoryIcons[cat] || "📦";
        msg += `\n╔─ ${icon} ${cat.toUpperCase()} ───────────────╗\n`;
        categories[cat].sort().forEach(c => msg += `│ 🔹 ${c}\n`);
        msg += `╚───────────────────────────────╯\n`;
      });

      msg += `

📌 Total Commands: ${commands.size}
💡 Use: ${prefix}help <command>
👑 Bot Owner: 🅰🆉🅰🅳
🔗 FB: facebook.com/profile.php?id=61578365162382
`;

      await message.reply({ body: msg });
    }

    // ----- Category List -----
    else if (args[0] === "-c") {
      if (!args[1]) return await message.reply("❗ Please specify a category name.");

      const categoryName = args[1].toLowerCase();
      const filtered = Array.from(commands.values()).filter(
        cmd => (cmd.config.category || "").toLowerCase() === categoryName
      );

      if (!filtered.length) return await message.reply(`❌ No commands found in "${categoryName}"`);

      const icon = categoryIcons[categoryName] || "📦";

      let msg = `╔════════════════════════╗
📂 ${icon} ${categoryName.toUpperCase()} COMMANDS
╚════════════════════════╝\n`;

      filtered.forEach(cmd => msg += `│ 🔹 ${cmd.config.name}\n`);
      msg += `╚────────────────────────╯`;

      await message.reply(msg);
    }

    // ----- Command Details -----
    else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) return await message.reply(`❌ Command "${commandName}" not found.`);

      const cfg = command.config;
      const usage = (cfg.guide?.en || "No guide")
        .replace(/{p}/g, prefix)
        .replace(/{n}/g, cfg.name);

      const msg = `╔══════════════════════════════════╗
      🌟 Command: ${cfg.name.toUpperCase()}
╚══════════════════════════════════╝

📌 Description: ${cfg.longDescription?.en || "No description"}
🛠 Aliases: ${cfg.aliases?.length ? cfg.aliases.join(", ") : "None"}
⚡ Version: ${cfg.version || "1.0"}
👤 Role: ${roleTextToString(cfg.role)}
⏱ Cooldown: ${cfg.countDown || 1}s
✍️ Author: ${cfg.author || "Unknown"}

📖 Usage:
${usage}

📝 Notes:
♡︎ 🅰🆉🅰🅳 ♡︎ content cannot be changed
♕︎ Owner: 🅰🆉🅰🅳 ♕

🔗 FB: facebook.com/profile.php?id=61578365162382`;

      await message.reply(msg);
    }
  },
};
