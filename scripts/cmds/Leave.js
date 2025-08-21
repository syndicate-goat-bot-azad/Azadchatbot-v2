-cmd install leave.js const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
module.exports = {
	config: {
		name: "leave",
		aliases: ["out"],
		version: "1.0",
		author: "tom",
		countDown: 5,
		role: 2,
		shortDescription: "bot will leave gc",
		longDescription: "",
		category: "admin",
		guide: {
			vi: "{pn} [tid,blank]",
			en: "{pn} [tid,blank]"
		}
	},

	onStart: async function ({ api,event,args, message }) {
        const permission = ["61572065567071","61557606879019"];
        if (!permission.includes(event.senderID)) {
            api.sendMessage("only my Boss , will has right for this command 😒.", event.threadID, event.messageID);
            return;
        }
 var id;
 if (!args.join(" ")) {
 id = event.threadID;
 } else {
 id = parseInt(args.join(" "));
 }
 return api.sendMessage('goodbye friends of saturn', id, () => api.removeUserFromGroup(api.getCurrentUserID(), id))
		}
	};
