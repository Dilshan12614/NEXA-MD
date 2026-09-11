const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
jidNormalizedUser,
getContentType,
fetchLatestBaileysVersion,
Browsers,
generateWAMessageFromContent
} = require("@whiskeysockets/baileys")

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const fs = require('fs')
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { sms, downloadMediaMessage } = require('./lib/msg')
const axios = require('axios')
const { commands } = require('./command')

const ownerNumber = ['94740534738']


//======= 🌟 NEW SECURE SESSION DECODER (FIXED ARRAY SPLIT) 🌟 =======
const authFolder = __dirname + '/auth_info_baileys/';
if (!fs.existsSync(authFolder)) {
    fs.mkdirSync(authFolder, { recursive: true });
}

if (!fs.existsSync(authFolder + 'creds.json')) {
    let sessionToUse = config.SESSION_ID;
    if (!sessionToUse) {
        console.log('❌ Please add your session to SESSION_ID env or config.js !!');
    } else {
        try {
            // DILSHAN-MD;;; හෝ වෙනත් prefix එකක් ඇත්නම් එය ඉවත් කර නියම base64 කෝඩ් එක පමණක් ගනී
            if (sessionToUse.includes(';;;')) {
                sessionToUse = sessionToUse.split(';;;')[1];
            } else if (sessionToUse.includes(';')) {
                sessionToUse = sessionToUse.split(';')[1];
            }
            
            const decodedData = Buffer.from(sessionToUse.trim(), 'base64').toString('utf-8');
            JSON.parse(decodedData); // කෝඩ් එක නිවැරදි JSON එකක්දැයි පරීක්ෂා කරයි
            fs.writeFileSync(authFolder + 'creds.json', decodedData);
            console.log("Session JSON extracted successfully ✅");
        } catch (e) {
            console.log("⚠️ Session ID format is raw or failed to parse. Error: " + e.message);
        }
    }
}
//======================================================================

//======================================================================

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

    const { state, saveCreds } = await useMultiFileAuthState(authFolder);
    const { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS('Safari'),
        syncFullHistory: false,
        auth: state,
        version
    });

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
                        nativeFlowMessage: { buttons: formattedButtons }
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
            console.log('Plugins installed successful ✅');
            console.log('DILSHAN-MD CONNECTED ✅');

            const up = `┏━━━━━━━━━━━━━━━━━━┓
┃ 🤖 BOT     : 𝗗𝗜𝗟𝗦𝗛𝗔𝗡-𝗠𝗗
┃ 👑 OWNER   : 𝗗𝗶𝗹𝘀𝗵𝗮𝗻
┃ ⚙️ VERSION : 1.0.0
┃ ✅ STATUS  : CONNECTED
┗━━━━━━━━━━━━━━━━━━┛`;

            try {
                await conn.sendMessage(ownerNumber + "@s.whatsapp.net", { text: up });
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

    conn.ev.on('messages.upsert', async (mek) => {
        try {
            mek = mek.messages[0];
            if (!mek || !mek.message) return;

            mek.message = getContentType(mek.message) === 'ephemeralMessage'
                ? mek.message.ephemeralMessage.message
                : mek.message;

            const m = sms(conn, mek);
            const type = getContentType(mek.message);
            const from = mek.key.remoteJid;

            const quoted = type === 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null
                ? mek.message.extendedTextMessage.contextInfo.quotedMessage || []
                : [];

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

            const reply = (text) => conn.sendMessage(from, { text: text }, { quoted: mek });

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
