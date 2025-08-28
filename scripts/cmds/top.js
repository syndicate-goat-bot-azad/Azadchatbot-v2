module.exports = {
  config: {
    name: "top",
    version: "2.5",
    author: "Shikaki",
    category: "economy",
    shortDescription: {
      vi: "Xem 15 người giàu nhất",
      en: "View the top 15 richest people",
    },
    longDescription: {
      vi: "Xem danh sách 15 người giàu nhất trong nhóm",
      en: "View the list of the top 15 richest people in the group",
    },
    guide: { en: "{pn} 1\n{pn} 50\n{pn} 100" },
    role: 0,
  },

  onStart: async function ({ message, usersData, args }) {
    const allUserData = await usersData.getAll();
    if (!allUserData || allUserData.length === 0) {
      return message.reply("⚠️ No users found.");
    }

    const sortedUsers = allUserData
      .filter((user) => !isNaN(user.money))
      .sort((a, b) => b.money - a.money);

    let topCount = parseInt(args[0]) || 15;
    topCount = Math.min(topCount, sortedUsers.length);

    let msg = "╔═══════════════════════════════╗\n";
    msg += "💎 🌟 𝗧𝗢𝗣 𝗥𝗜𝗖𝗛𝗘𝗦𝗧 𝗨𝗦𝗘𝗥𝗦 🌟 💎\n";
    msg += "╠═══════════════════════════════╣\n\n"; // extra line break after header

    sortedUsers.slice(0, topCount).forEach((user, index) => {
      const formattedBalance = formatNumberWithFullForm(user.money);

      // Top 3 icons
      let rankIcon = "⚜️";
      if (index === 0) rankIcon = "🥇";
      else if (index === 1) rankIcon = "🥈";
      else if (index === 2) rankIcon = "🥉";

      // Bold and clear name
      const nameStyled = `**${user.name}**`;

      // Add 2 line breaks after each user
      msg += `║ ${rankIcon} ${index + 1}. ${nameStyled} ➤ $${formattedBalance}\n\n`;
    });

    msg += "╠═══════════════════════════════╣\n\n";
    msg += "✨ 💰 Keep grinding and reach the top! 💰 ✨\n";
    msg += "╚═══════════════════════════════╝";

    message.reply(msg);
  },
};

// Number formatting function
function formatNumberWithFullForm(number) {
  const fullForms = ["", "K", "M", "B", "T", "Qa", "Qi", "Hx", "Hp", "Oc", "No", "Dc"];
  let i = 0;
  while (number >= 1000 && i < fullForms.length - 1) {
    number /= 1000;
    i++;
  }
  return `${number.toFixed(2)}${fullForms[i]}`;
      }
