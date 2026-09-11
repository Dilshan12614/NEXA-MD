const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "menu",
    alias: ["help", "list"],
    desc: "Get bot command menu",
    category: "main",
    react: "📜",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, prefix, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, reply }) => {
    try {
        // 1. මේනුවේ උඩින්ම පේන ලස්සන විස්තර ටික (Header Text)
        const menuText = `👋 සාදරයෙන් පිළිගනිමු, *${pushname}*!

🤖 *ʙ0ᴛ ɴᴀᴍᴇ :* 𝗗𝗜𝗟𝗦𝗛𝗔𝗡-𝗠𝗗
⚙️ *ᴠᴇʀsɪ0ɴ :* 1.0.0
📆 *ʀᴜɴᴛɪᴍᴇ :* ${runtime(process.uptime())}
Prefix: [ ${prefix} ]

*පහත බොත්තම් (Buttons) භාවිතයෙන් ඔබට අවශ්‍ය කමාන්ඩ් මේනුව තෝරාගන්න. 👇*`;

        // 🌟 2. මැසේජ් එකට යටින් වැටෙන්න ඕනේ බටන් ලිස්ට් එක 🌟
        // 'id' එකට දීලා තියෙන්නේ ඒ බටන් එක එබුවම වැඩ කරන්න ඕන කමාන්ඩ් එකයි.
        let buttons = [
            { displayText: "📥 DOWNLOAD MENU", id: `${prefix}downmenu` },
            { displayText: "👥 GROUP MENU", id: `${prefix}groupmenu` },
            { displayText: "👑 OWNER MENU", id: `${prefix}ownermenu` },
            { displayText: "🤖 ALIVE STATUS", id: `${prefix}alive` }
        ];

        // 🌟 3. index.js එකේ අපි හදපු බටන් function එකෙන් මැසේජ් එක යවනවා
        await conn.sendButtonMessage(
            from,
            buttons,
            menuText,
            "© 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗗𝗜𝗟𝗦𝗛𝗔𝗡 𝗠𝗗", // Footer එක
            "𝗗𝗜𝗟𝗦𝗛𝗔𝗡-𝗠𝗗 𝗠𝗔𝗜𝗡 𝗠𝗘𝗡𝗨", // Title එක
            mek
        );

    } catch (e) {
        console.error("Error in menu command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
