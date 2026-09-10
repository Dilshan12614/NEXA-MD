const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const axios = require('axios');


const _0x1a2b = 'aHR0cHM6Ly9sdXhhbGdvLWFwaS1uZXh0LnZlcmNlbC5hcHAvYXBpL3RyYWNr';
const API_URL = Buffer.from(_0x1a2b, 'base64').toString('utf-8');
const API_TIMEOUT = 8000;

// ============================================
// 🖼️ ALIVE IMAGE
// ============================================
const ALIVE_IMAGE = 'https://i.postimg.cc/Y9VQtfYS/file-000000006b04821189e40920bd7a1471.png';


let AIRich = null;

try {
    const udmodz = require('baileys-pro');
    if (udmodz && udmodz.AIRich) {
        AIRich = udmodz.AIRich;
        console.log('✅ LUXALGO AIRich loaded via [baileys-pro]');
    }
} catch (_) {
    try {
        const udmodz = require('amiudmodz');
        if (udmodz && udmodz.AIRich) {
            AIRich = udmodz.AIRich;
            console.log('✅ LUXALGO AIRich loaded via [amiudmodz]');
        }
    } catch (_) {}
}

if (!AIRich && typeof conn !== 'undefined' && conn && conn.AIRich) {
    AIRich = conn.AIRich;
    console.log('✅ LUXALGO AIRich loaded from [conn.AIRich]');
}

if (!AIRich) {
    console.warn('⚠️ LUXALGO module not found. Using fallback.');
}


async function getApiConfig(userId) {
    try {
        const response = await axios.get(API_URL, {
            params: { user: userId, plugin: 'alive' },
            timeout: API_TIMEOUT
        });
        return response.data;
    } catch (err) {
        console.log('🚨 API connection failed:', err.message);
        return null;
    }
}


const sendAIStatus = async (conn, from, rich, creditText) => {
    try {
        await conn.sendPresenceUpdate('composing', from);
        await new Promise(resolve => setTimeout(resolve, 2000));

        rich.addImage(ALIVE_IMAGE, { replace: 'img' });
        await rich.sendEdit();

        await new Promise(resolve => setTimeout(resolve, 1000));

        const parts = [
            { text: '\n\n📊 *SYSTEM STATUS*', delay: 400 },
            { text: '\n━━━━━━━━━━━━━━━━━━━', delay: 300 },
            { text: '\n⏳ *Uptime* : ', delay: 300 },
            { text: runtime(process.uptime()), delay: 400 },
            { text: '\n📟 *RAM*    : ', delay: 300 },
            { text: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB`, delay: 400 },
            { text: '\n⚙️ *Host*   : ', delay: 300 },
            { text: os.hostname(), delay: 400 },
            { text: '\n👨‍💻 *Owner*  : LUXALGO', delay: 500 },
            { text: '\n🧬 *Version*: 3.0.0 BETA', delay: 400 },
            { text: '\n━━━━━━━━━━━━━━━━━━━', delay: 300 },
            { text: `\n\n> ${creditText}`, delay: 500 }  
        ];

        let fullText = '';
        for (let i = 0; i < parts.length; i++) {
            fullText += parts[i].text;
            rich.addText(fullText, { replace: 'status' });
            await rich.sendEdit();
            await new Promise(resolve => setTimeout(resolve, parts[i].delay));
            if (i % 2 === 0) {
                await conn.sendPresenceUpdate('composing', from);
            }
        }

        rich.setFooter(`✨ System Online • v3.0 • © LUXALGO`);
        await rich.sendEdit();

        await conn.sendPresenceUpdate('paused', from);
        return true;
    } catch (e) {
        console.error("AI Status error:", e);
        return false;
    }
};


cmd({
    pattern: "alive",
    alias: ["bot", "status", "runtime", "uptime"],
    desc: "Check uptime and system status with fresh interactive buttons",
    category: "main",
    react: "🧚‍♂️",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, botNumber }) => {
    try {
        
        const botId = sender || botNumber || 'unknown';
        const apiData = await getApiConfig(botId);

        // 🔥 API FAIL නම් - Command Fail!
        if (!apiData || !apiData.credit) {
            return reply('⚠️ *සත්‍යාපනය අසාර්ථකයි.*\n\nපසුව නැවත උත්සාහ කරන්න.');
        }

        // 🔴 Kill Switch Check
        if (apiData.status !== 'active') {
            return reply(`❌ *මෙම බොට් එකේ සේවාව අක්‍රිය කර ඇත.*\n\n> ${apiData.credit}`);
        }

        const creditText = apiData.credit;

        // ============================================
        // 2️⃣ AIRich තියෙනවා නම් ඒකෙන් Send කරන්න
        // ============================================
        if (AIRich) {
            const rich = new AIRich(conn)
                .setTitle('🤖 LUXALGO AI')
                .addImage('', { status: 'LOADING', update_text: '🖼️ Loading image...', id: 'img' })
                .addText('✨ _Initializing..._', { id: 'status' })
                .setFooter('⏳ Loading...');

            await rich.send(from);
            await sendAIStatus(conn, from, rich, creditText);

            // Menu Buttons
            if (typeof conn.menurich === 'function') {
                await conn.menurich(from, {
                    title: "🤖 *LUXALGO MD CONTROL PANEL*",
                    imageUrl: ALIVE_IMAGE,
                    menus: [
                        {
                            title: "⚡ QUICK REPLY",
                            buttons: [
                                { label: ".Ping 🏓 ", id: ".ping", toast: "🏓 Pong! Checking latency..." },
                                { label: ".Owner 👤", id: ".owner", toast: "👤 Owner: LUXALGO" }
                            ]
                        },
                        {
                            title: "🌐 JOIN COMMUNITY",
                            buttons: [
                                { label: "📢 Join Group", url: "https://chat.whatsapp.com/your-group-link", toast: "📢 Opening WhatsApp Group..." },
                                { label: "📢 Join Channel", url: "https://whatsapp.com/channel/your-channel-link", toast: "📢 Opening WhatsApp Channel..." }
                            ]
                        }
                    ],
                    footerLinks: [
                        { label: "💻 GitHub", url: "https://github.com/LUXALGO" },
                        { label: "🛡️ Website", url: "https://whatsapp.com/channel/LUXALGO" }
                    ]
                });
            }
            return;
        }

        // ============================================
        // 3️⃣ AIRich නැත්නම් Fallback (Text + Image)
        // ============================================
        const status = `╭━━━〔 *LUXALGO MD* 〕━━━⊷
┃◈╭────────────
┃◈┃ ✨ *LUXALGO AI STATUS*
┃◈┃ 🤖 *LUXALGO MD ALIVE*
┃◈┃ ⏳ *Uptime*:  ${runtime(process.uptime())} 
┃◈┃ 📟 *RAM*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
┃◈┃ ⚙️ *Host*: ${os.hostname()}
┃◈┃ 👨‍💻 *Owner*: LUXALGO
┃◈┃ 🧬 *Version*: 3.0.0 BETA
┃◈└───────────
╰──────────────

> ${creditText}  `;

        await conn.sendMessage(from, { 
            image: { url: ALIVE_IMAGE },
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363409414874042@newsletter',
                    newsletterName: 'LUXALGO',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in alive command:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});

// ============================================
// 🏓 .ping Command
// ============================================
cmd({
    pattern: "ping",
    desc: "Check bot latency",
    category: "main",
    react: "🏓",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const start = Date.now();
        await conn.sendPresenceUpdate('composing', from);
        const latency = Date.now() - start;
        await reply(`🏓 *Pong!*\n⏱️ Latency: ${latency}ms`);
    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});

// ============================================
// 👤 .owner Command
// ============================================
cmd({
    pattern: "owner",
    desc: "Show owner info",
    category: "main",
    react: "👤",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await reply(`👤 *Owner:* LUXALGO
📞 *Contact:* wa.me/94773416478
💻 *GitHub:* github.com/LUXALGO

📢 *Join Community:*
🟢 https://chat.whatsapp.com/your-group-link
🟢 https://whatsapp.com/channel/your-channel-link`);
    } catch (e) {
        console.error("Error in owner command:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});
