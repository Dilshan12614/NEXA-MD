const config = require('../config');
const { cmd, commands } = require('../command');

// ============================================
// 🖼️ MENU IMAGE
// ============================================
const MENU_IMAGE =
    'https://i.postimg.cc/Y9VQtfYS/file-000000006b04821189e40920bd7a1471.png';

let AIRich = null;

// ============================================
// 🤖 LOAD AIRich
// ============================================
try {
    const udmodz = require('baileys-pro');

    if (udmodz && udmodz.AIRich) {
        AIRich = udmodz.AIRich;
        console.log('✅ AIRich loaded via baileys-pro');
    }
} catch (_) {
    try {
        const udmodz = require('amiudmodz');

        if (udmodz && udmodz.AIRich) {
            AIRich = udmodz.AIRich;
            console.log('✅ AIRich loaded via amiudmodz');
        }
    } catch (_) {}
}

if (!AIRich) {
    console.warn('⚠️ AIRich module not found. Using normal menu.');
}


// ============================================
// 📋 MENU COMMAND
// ============================================
cmd({
    pattern: "menu",
    alias: ["help", "commands", "allmenu"],
    desc: "Show interactive bot menu",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {

    try {

        const botName = config.BOT_NAME || "DILA-MD";

        // ============================================
        // 🔥 AIRICH MENU
        // ============================================
        if (AIRich && typeof conn.menurich === 'function') {

            const rich = new AIRich(conn)
                .setTitle(`🤖 ${botName}`)
                .addImage(MENU_IMAGE, {
                    status: 'LOADING',
                    update_text: '🖼️ Loading Menu...',
                    id: 'menuimg'
                })
                .addText(
                    `✨ *Welcome to ${botName}*\n\n` +
                    `⚡ Select a category below to control the bot.`,
                    {
                        id: 'menutext'
                    }
                )
                .setFooter('🚀 Powered by ' + botName);

            await rich.send(from);

            await new Promise(resolve => setTimeout(resolve, 1000));

            rich.addImage(MENU_IMAGE, {
                replace: 'menuimg'
            });

            rich.addText(
                `╭━━━〔 *${botName} CONTROL PANEL* 〕━━━╮\n` +
                `┃\n` +
                `┃ ⚡ *Fast & Powerful WhatsApp Bot*\n` +
                `┃ 🛡️ Easy interactive controls\n` +
                `┃ 🎯 Choose a category below\n` +
                `┃\n` +
                `╰━━━━━━━━━━━━━━━━━━━━━━━━╯`,
                {
                    replace: 'menutext'
                }
            );

            await rich.sendEdit();

            // ============================================
            // 🎛️ CONTROL PANEL
            // ============================================
            await conn.menurich(from, {

                title: `🤖 *${botName} CONTROL PANEL*`,

                imageUrl: MENU_IMAGE,

                menus: [

                    // ====================================
                    // ⚡ MAIN
                    // ====================================
                    {
                        title: "⚡ MAIN MENU",

                        buttons: [
                            {
                                label: "🏓 Ping",
                                id: ".ping",
                                toast: "🏓 Checking bot latency..."
                            },
                            {
                                label: "🤖 Alive",
                                id: ".alive",
                                toast: "🤖 Checking system status..."
                            },
                            {
                                label: "👤 Owner",
                                id: ".owner",
                                toast: "👤 Opening owner info..."
                            }
                        ]
                    },

                    // ====================================
                    // 📥 DOWNLOAD
                    // ====================================
                    {
                        title: "📥 DOWNLOAD",

                        buttons: [
                            {
                                label: "🎵 Song",
                                id: ".song",
                                toast: "🎵 Song downloader selected"
                            },
                            {
                                label: "🎬 Video",
                                id: ".video",
                                toast: "🎬 Video downloader selected"
                            },
                            {
                                label: "📷 Image",
                                id: ".img",
                                toast: "📷 Image downloader selected"
                            },
                            {
                                label: "📱 TikTok",
                                id: ".tt",
                                toast: "📱 TikTok downloader selected"
                            }
                        ]
                    },

                    // ====================================
                    // 🔍 SEARCH
                    // ====================================
                    {
                        title: "🔍 SEARCH",

                        buttons: [
                            {
                                label: "🎬 YouTube",
                                id: ".yts",
                                toast: "🔍 YouTube search selected"
                            },
                            {
                                label: "🌐 Google",
                                id: ".google",
                                toast: "🌐 Google search selected"
                            },
                            {
                                label: "📷 Pinterest",
                                id: ".pinterest",
                                toast: "📷 Pinterest search selected"
                            }
                        ]
                    },

                    // ====================================
                    // 👥 GROUP
                    // ====================================
                    {
                        title: "👥 GROUP",

                        buttons: [
                            {
                                label: "👥 Group Info",
                                id: ".groupinfo",
                                toast: "👥 Group information"
                            },
                            {
                                label: "🔗 Link",
                                id: ".link",
                                toast: "🔗 Getting group link..."
                            },
                            {
                                label: "🔒 Lock",
                                id: ".lock",
                                toast: "🔒 Group control"
                            },
                            {
                                label: "🔓 Unlock",
                                id: ".unlock",
                                toast: "🔓 Group control"
                            }
                        ]
                    },

                    // ====================================
                    // 🛠️ TOOLS
                    // ====================================
                    {
                        title: "🛠️ TOOLS",

                        buttons: [
                            {
                                label: "🖼️ Sticker",
                                id: ".sticker",
                                toast: "🖼️ Sticker maker selected"
                            },
                            {
                                label: "🎙️ To Voice",
                                id: ".tovoice",
                                toast: "🎙️ Voice converter selected"
                            },
                            {
                                label: "📄 To PDF",
                                id: ".topdf",
                                toast: "📄 PDF converter selected"
                            }
                        ]
                    },

                    // ====================================
                    // 👑 OWNER
                    // ====================================
                    {
                        title: "👑 OWNER",

                        buttons: [
                            {
                                label: "👤 Owner",
                                id: ".owner",
                                toast: "👤 Owner information"
                            },
                            {
                                label: "📊 Status",
                                id: ".alive",
                                toast: "📊 System status"
                            }
                        ]
                    }
                ],

                // ============================================
                // 🔗 FOOTER LINKS
                // ============================================
                footerLinks: [
                    {
                        label: "💻 GitHub",
                        url: "https://github.com/",
                    },
                    {
                        label: "📢 Channel",
                        url: "https://whatsapp.com/",
                    }
                ]
            });

            return;
        }


        // ============================================
        // 📱 FALLBACK MENU
        // ============================================
        const menuText = `
╭━━━〔 *${botName}* 〕━━━╮
┃
┃ ⚡ *CONTROL PANEL*
┃
┃ 📌 *MAIN*
┃ • .alive
┃ • .ping
┃ • .owner
┃
┃ 📥 *DOWNLOAD*
┃ • .song
┃ • .video
┃ • .img
┃ • .tt
┃
┃ 🔍 *SEARCH*
┃ • .yts
┃ • .google
┃ • .pinterest
┃
┃ 👥 *GROUP*
┃ • .groupinfo
┃ • .link
┃ • .lock
┃ • .unlock
┃
┃ 🛠️ *TOOLS*
┃ • .sticker
┃ • .tovoice
┃ • .topdf
┃
╰━━━━━━━━━━━━━━━━━━╯

> ✨ ${botName} is online
`;

        await conn.sendMessage(
            from,
            {
                image: { url: MENU_IMAGE },
                caption: menuText
            },
            { quoted: mek }
        );

    } catch (e) {

        console.error("❌ Menu Error:", e);

        await reply(
            `❌ *Menu Error*\n\n${e.message}`
        );
    }
});
