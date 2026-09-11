const { cmd, commands } = require('../command');

cmd({
    pattern: "menu2",
    alias: ["allmenu", "menu"],
    desc: "Show DILA-MD menu",
    category: "main",
    react: "📂",
    filename: __filename
},
async (conn, mek, m, {
    from,
    reply,
    args
}) => {

    try {

        const option = args[0]?.toLowerCase();

        // ================= MAIN MENU =================

        if (!option) {

            let menu = `
╭━━━〔 🤖 𝐃𝐈𝐋𝐀-𝐌𝐃 〕━━━╮
┃
┃ 👋 𝐖𝐄𝐋𝐂𝐎𝐌𝐄
┃
┃ 1️⃣ 📥 DOWNLOAD
┃ 2️⃣ 🔎 SEARCH
┃ 3️⃣ 🤖 AI
┃ 4️⃣ 👑 OWNER
┃ 5️⃣ 👥 GROUP
┃ 6️⃣ ℹ️ INFO
┃ 7️⃣ 🔄 CONVERTER
┃ 8️⃣ 🎲 RANDOM
┃ 9️⃣ 🌐 OTHER
┃
╰━━━━━━━━━━━━━━━━━━━━╯

💡 Use:
.menu 1
.menu 2
.menu 3

⚡ 𝐃𝐈𝐋𝐀-𝐌𝐃
👑 𝐎𝐖𝐍𝐄𝐑 : Dilshan
`;

            return await conn.sendMessage(
                from,
                {
                    image: {
                        url: "https://files.catbox.moe/jgnhg4.jpg"
                    },
                    caption: menu
                },
                {
                    quoted: mek
                }
            );
        }


        // ================= DOWNLOAD =================

        if (option === "1" || option === "download") {

            return await reply(`
╭━━〔 📥 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 〕━━╮

┃ • .fb <url>
┃ • .insta <url>
┃ • .video <url>
┃ • .gdrive <url>
┃ • .twitter <url>
┃ • .tt <url>
┃ • .mediafire <url>
┃ • .song <query>
┃ • .play <query>
┃ • .video <query>
┃ • .img <query>
┃ • .apk <name>

╰━━━━━━━━━━━━━━━━━━━━╯

↩️ .menu
`);
        }


        // ================= SEARCH =================

        if (option === "2" || option === "search") {

            return await reply(`
╭━━〔 🔎 𝐒𝐄𝐀𝐑𝐂𝐇 〕━━╮

┃ • .yts <text>
┃ • .yts1 <text>
┃ • .movie <text>
┃ • .img <text>

╰━━━━━━━━━━━━━━━━━━━━╯

↩️ .menu
`);
        }


        // ================= AI =================

        if (option === "3" || option === "ai") {

            return await reply(`
╭━━〔 🤖 𝐀𝐑𝐓𝐈𝐅𝐈𝐂𝐈𝐀𝐋 𝐈𝐍𝐓𝐄𝐋𝐋𝐈𝐆𝐄𝐍𝐂𝐄 〕━━╮

┃ • .gpt <text>
┃ • .ai <text>

╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

↩️ .menu
`);
        }


        // ================= OWNER =================

        if (option === "4" || option === "owner") {

            return await reply(`
╭━━〔 👑 𝐎𝐖𝐍𝐄𝐑 〕━━╮

┃ • .support
┃ • .setautobio
┃ • .mute
┃ • .unmute
┃ • .owner
┃ • .repo
┃ • .system
┃ • .status
┃ • .botinfo
┃ • .restart

╰━━━━━━━━━━━━━━━━━━━━━━╯

↩️ .menu
`);
        }


        // ================= GROUP =================

        if (option === "5" || option === "group") {

            return await reply(`
╭━━〔 👥 𝐆𝐑𝐎𝐔𝐏 〕━━╮

┃ • .remove
┃ • .delete
┃ • .add
┃ • .kick
┃ • .setgoodbye
┃ • .setwelcome
┃ • .promote
┃ • .demote
┃ • .support
┃ • .getpic
┃ • .link

╰━━━━━━━━━━━━━━━━━━━━╯

↩️ .menu
`);
        }


        // ================= INFO =================

        if (option === "6" || option === "info") {

            return await reply(`
╭━━〔 ℹ️ 𝐈𝐍𝐅𝐎 〕━━╮

┃ • .menu
┃ • .alive
┃ • .rebot
┃ • .restart
┃ • .botinfo
┃ • .status
┃ • .support
┃ • .ping
┃ • .system

╰━━━━━━━━━━━━━━━━━━━━━━╯

↩️ .menu
`);
        }


        // ================= CONVERTER =================

        if (option === "7" || option === "converter") {

            return await reply(`
╭━━〔 🔄 𝐂𝐎𝐍𝐕𝐄𝐑𝐓𝐄𝐑 〕━━╮

┃ • .sticker

╰━━━━━━━━━━━━━━━━━━━━━━━━╯

↩️ .menu
`);
        }


        // ================= RANDOM =================

        if (option === "8" || option === "random") {

            return await reply(`
╭━━〔 🎲 𝐑𝐀𝐍𝐃𝐎𝐌 〕━━╮

┃ • .king
┃ • .dog
┃ • .anime
┃ • .animegirl
┃ • .animegirl1
┃ • .animegirl2
┃ • .animegirl3
┃ • .animegirl4
┃ • .animegirl5

╰━━━━━━━━━━━━━━━━━━━━━━╯

↩️ .menu
`);
        }


        // ================= OTHER =================

        if (option === "9" || option === "other") {

            return await reply(`
╭━━〔 🌐 𝐎𝐓𝐇𝐄𝐑 〕━━╮

┃ • .news
┃ • .weather
┃ • .trt
┃ • .movie
┃ • .fact
┃ • .githubstalk
┃ • .gpass
┃ • .hack
┃ • .quote
┃ • .srepo
┃ • .define

╰━━━━━━━━━━━━━━━━━━━━╯

↩️ .menu
`);
        }


        return await reply(`
❌ Invalid option.

Use:

.menu

or

.menu 1
.menu 2
.menu 3
.menu 4
.menu 5
.menu 6
.menu 7
.menu 8
.menu 9
`);

    } catch (e) {

        console.error("Menu Error:", e);

        return await reply(
            "❌ Menu error: " + e.message
        );
    }
});
