const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "alive",
    alias: ["status", "runtime", "uptime"],
    desc: "Check uptime and system status",
    category: "main",
    react: "👨🏻‍💻",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // 1. බොට්ගේ විස්තර ටික ලෑස්ති කරගන්නවා
        const status = `┏━❮  𝗧𝗛𝗘𝗡𝗨𝗟𝗪𝗔 𝗫𝗠𝗗 〽️𝗗 ❯━
┃◈┃🤖 ʙᴏᴛ ɴᴀᴍᴇ :𝚃𝙷𝙴𝙽𝚄𝚆𝙰 𝚇𝙼𝙳 𝚅1
┃◈┃🔖 ᴠᴇʀsɪᴏɴ : 1.0.0 𝙱𝙴𝚃𝙰
┃◈┃📟 ᴘʟᴀᴛғᴏʀᴍ : 𝚁𝙴𝙿𝙻𝙸𝚃
┃◈┃👨‍💻ᴏᴡɴᴇʀ: 𝙲𝚈𝙱𝙴𝚁 𝚇 𝚃𝙷𝙴𝙽𝚄𝙻𝙰
┃◈┃📆 ʀᴜɴᴛɪᴍᴇ : ${runtime(process.uptime())} 
┃◈┃📈ʀᴀᴍ ᴜsᴀɢᴇ: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
┃◈┗━━━━━━━━━━━━━━𖣔𖣔
╰──────────────┈⊷`;

        // 🌟 2. මැසේජ් එකට යටින් වැටෙන්න ඕනේ බටන් ටික මෙතන ලියනවා 🌟
        // 'id' එකට දෙන්න ඕනේ ඒ බටන් එක එබුවම රන් වෙන්න ඕන කමාන්ඩ් එක (.menu වගේ)
        let buttons = [
            { displayText: "📜 MAIN MENU", id: ".menu" },
            { displayText: "⚡ PING STATUS", id: ".ping" }
        ];

        // 🌟 3. අපි index.js එකේ හැදූ බටන් function එක හරහා මැසේජ් එක යවනවා 🌟
        await conn.sendButtonMessage(
            from, 
            buttons, 
            status, 
            "© 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗧𝗛𝗘𝗡𝗨𝗪𝗔 𝗫𝗠𝗗 〽️𝗗", // Footer එක
            "𝗧𝗛𝗘𝗡𝗨𝗟𝗪𝗔 𝗫𝗠𝗗 STATUS", // Title එක
            mek // Quoted මැසේජ් එක
        );

    } catch (e) {
        console.error("Error in alive command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
