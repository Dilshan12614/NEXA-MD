const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
jidNormalizedUser,
getContentType,
fetchLatestBaileysVersion,
Browsers,
generateWAMessageFromContent // 🌟 බටන් නිර්මාණය සඳහා අත්‍යවශ්‍යයි
} = require("@whiskeysockets/baileys")

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const fs = require('fs')
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { sms, downloadMediaMessage } = require('./lib/msg')
const axios = require('axios')
const { File } = require('megajs')
const { commands } = require('./command') // 🌟 ප්ලගින්ස් රන් කිරීමට command.js සම්බන්ධ කිරීම

const ownerNumber = ['94740534738']

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
if(!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!')
const sessdata = config.SESSION_ID
const filer = File.fromURL(`https://mega.nz{sessdata}`)
filer.download((err, data) => {
if(err) throw err
fs.writeFile(__dirname + '/auth_info_baileys/creds.json', data, () => {
console.log("Session downloaded ✅")
})})}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

async function connectToWA() {

    const connectDB = require('./lib/mongodb');
    await connectDB().catch(e => console.log("MongoDB connect skipped or error:", e));

    const { readEnv } = require('./lib/database');
    const envConfig = await readEnv().catch(() => ({}));
    const prefix = envConfig.PREFIX || config.PREFIX || '.';

    console.log("Connecting 🧬...");

    const { state, saveCreds } = await useMultiFileAuthState(
        __dirname + '/auth_info_baileys/'
    );

    const { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS('Safari'),
        syncFullHistory: false,
        auth: state,
        version
    });

    // 🌟 GLOBAL BUTTON FUNCTION: ඕනෑම ප්ලගින් එකක සිට එක පේළියෙන් බටන් යැවීමට 🌟
    conn.sendButtonMessage = async (jid, buttons = [], text = '', footer = '', title = '', quoted = '') => {
        const formattedButtons = buttons.map((btn, index) => ({
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
                display_text: btn.displayText,
                id: btn.id || `btn_${index}`
            })
        }));

        const messageContent = {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        header: { title: title, hasMediaAttachment: false },
                        body: { text: text },
                        footer: { text: footer },
                        nativeFlowMessage: {
                            buttons: formattedButtons
                        }
                    }
                }
            }
        };

        const msg = generateWAMessageFromContent(jid, messageContent, { quoted });
        await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
        return msg;
    };

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            console.log('💫 Installing...');
            const path = require('path');
            if (fs.existsSync('./plugins/')) {
                fs.readdirSync('./plugins/').forEach((plugin) => {
                    if (path.extname(plugin).toLowerCase() === '.js') {
                        try {
                            require('./plugins/' + plugin);
                        } catch (e) {
                            console.error(`❌ Plugin error: ${plugin}`, e);
                        }
                    }
                });
            }

            console.log('Plugins installed successful ✅');
            console.log('DILSHAN-MD CONNECTED ✅');

            const up = `┏━━━━━━━━━━━━━━━━━━┓
┃ 🤖 BOT     : 𝗗𝗜𝗟𝗦𝗛𝗔𝗡-𝗠𝗗
┃ 👑 OWNER   : 𝗗𝗶𝗹𝘀𝗵𝗮𝗻
┃ ⚙️ VERSION : 1.0.0
┃ ✅ STATUS  : CONNECTED
┗━━━━━━━━━━━━━━━━━━┛

★ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗗𝗜𝗟𝗦𝗛𝗔𝗡-𝗠𝗗 👋

𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗗𝗜𝗟𝗦𝗛𝗔𝗡 〽️`;

            try {
                await conn.sendMessage(ownerNumber[0] + "@s.whatsapp.net", {
                    image: { url: 'https://catbox.moe' },
                    caption: up
                });
            } catch (e) {
                console.log('Owner notification failed:', e.message);
            }
        }

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            console.log(`❌ WhatsApp connection closed. Status: ${statusCode || 'unknown'}`);
            if (statusCode !== DisconnectReason.loggedOut) {
                console.log('🔄 Reconnecting in 5 seconds...');
                setTimeout(() => { connectToWA(); }, 5000);
            } else {
                console.log('🚪 WhatsApp logged out. Please create a new session.');
            }
        }
    });

    // ================= MESSAGES UPSERT =================
    conn.ev.on('messages.upsert', async (mek) => {
        try {
            mek = mek.messages[0];
            if (!mek || !mek.message) return;

            mek.message = getContentType(mek.message) === 'ephemeralMessage'
                ? mek.message.ephemeralMessage.message
                : mek.message;

            if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS === "true") {
                await conn.readMessages([mek.key]);
            }

            const m = sms(conn, mek);
            const type = getContentType(mek.message);
            const from = mek.key.remoteJid;

            const quoted = type === 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null
                ? mek.message.extendedTextMessage.contextInfo.quotedMessage || []
                : [];

            // 🌟 බටන් ප්‍රේරකයින් හඳුනාගැනීම සඳහා BODY එක සකස් කිරීම 🌟
            const body =
                type === 'conversation'
                    ? mek.message.conversation
                    : type === 'extendedTextMessage'
                    ? mek.message.extendedTextMessage.text
                    : type === 'imageMessage' && mek.message.imageMessage.caption
                    ? mek.message.imageMessage.caption
                    : type === 'videoMessage' && mek.message.videoMessage.caption
                    ? mek.message.videoMessage.caption
                    : type === 'buttonsResponseMessage'
                    ? mek.message.buttonsResponseMessage.selectedButtonId
                    : type === 'templateButtonReplyMessage'
                    ? mek.message.templateButtonReplyMessage.selectedId
                    : type === 'interactiveResponseMessage'
                    ? JSON.parse(mek.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id
                    : '';

            const isCmd = body.startsWith(prefix);
            const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
            const args = body.trim().split(/ +/).slice(1);
            const q = args.join(' ');

            const isGroup = from.endsWith('@g.us');
            const sender = mek.key.fromMe ? conn.user.id.split(':')[0] + '@s.whatsapp.net' : mek.key.participant || mek.key.remoteJid;
            const senderNumber = sender.split('@')[0];
            const botNumber = conn.user.id.split(':')[0];
            const pushname = mek.pushName || 'Sin Nombre';
            const isMe = botNumber.includes(senderNumber);
            const isOwner = ownerNumber.includes(senderNumber) || isMe;

            const botNumber2 = await jidNormalizedUser(conn.user.id);
            const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(() => null) : null;
            const groupName = isGroup && groupMetadata ? groupMetadata.subject : '';
            const participants = isGroup && groupMetadata ? groupMetadata.participants : [];
            const groupAdmins = isGroup ? await getGroupAdmins(participants) : [];
            const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
            const isAdmins = isGroup ? groupAdmins.includes(sender) : false;

            // 🌟 සරල REPLY FUNCTION එකක් ප්ලගින් වලට ලබාදීම
            const reply = (text) => conn.sendMessage(from, { text: text }, { quoted: mek });

            // 🌟 ප්ලගින්ස් මැච් කර රන් කරන කොටස 🌟
            const cmdMatch = commands.find((c) => c.pattern === command) || commands.find((c) => c.alias && c.alias.includes(command));

            if (cmdMatch) {
                if (cmdMatch.react) await conn.sendMessage(from, { react: { text: cmdMatch.react, key: mek.key } });
                
                await cmdMatch.function(conn, mek, m, {
                    from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply
                });
            }

        } catch (e) {
            console.error("Handler error:", e);
        }
    });
}

app.listen(port, () => console.log(`Server running on port ${port}`));
setTimeout(() => { connectToWA(); }, 2000);
