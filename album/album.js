const axios = require("axios");
const Link = require("./models/Link.js");

const albumCategories = [
    "funny", "romantic", "lofi", "sad", "horny", "football", "anime", "cricket",
    "flowers", "islamic", "cartoon", "couple", "random", "sigma", "asthetic",
    "girls", "friends", "ff", "18+", "lyrics", "photos", "cat", "meme", "caption", "love"
  ];

const album = {
     async upload(url, category) {
        if(!url || !category) {
          return "url and category are must be required";
        };
        if(!albumCategories.includes(category)) {
          return "Invalid categories...!! Available are: " + albumCategories.join(", ");
        };
        try {
          const { data } = await axios.get(`https://www.noobx-api.rf.gd/api/imgur?url=${encodeURIComponent(url)}`);
          const link = data.url;

          const newLink = new Link({ category, link });
          await newLink.save();

          const videoCount = (await Link.find({ category })).length;
          const count = await Link.countDocuments({});

         return `✅ Successfully saved the video to ${category} category.\n🔖 Total videos: ${count}\n🎓 Videos on this category: ${videoCount}`;
       } catch (error) {
          throw new Error(error);
         }
      },

     async get(category, type) {
        if (!category || !type) {
          return "Category and type are must be needed...!!"
        } else if (!albumCategories.includes(category)) {
          return "Invalid categories...!! Available are: " + albumCategories.join(", ");
        } else if (type !== "all" && type !== "random") {
          return "Type must be between to all and random";
        };
        try {
        const links = await Link.find({ category });

        if (links.length === 0) {
           return 'No links found in this category';
        }
        if(type.toLowerCase() === "random") {
          const randomLink = links[Math.floor(Math.random() * links.length)];
          return randomLink;
        }
          return links;
        } catch (e) {
          throw new Error(e)
        }
      },

    async categoryList(type) {
       if(!type || (type !== "all" && type !== "available")) {
         return "Type must be needed between all and available";
       }
       const available = await Link.distinct('category');
       if(type.toLowerCase() === "available") {
        return available;
       } else {
        return albumCategories;
      }
    }
};

module.exports = { album };
