const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
jidNormalizedUser,
getContentType,
fetchLatestBaileysVersion,
Browsers
} = require("@whiskeysockets/baileys")

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const fs = require('fs')
const P = require('pino')
const config = require('./config')
const qrcode = require('qrcode-terminal')
const util = require('util')
const { sms,downloadMediaMessage } = require('./lib/msg')
const axios = require('axios')
const { File } = require('megajs')

const ownerNumber = ['94740534738']

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
if(!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!')
const sessdata = config.SESSION_ID
const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
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
    await connectDB();

    const { readEnv } = require('./lib/database');
    const envConfig = await readEnv();
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
                            console.error(
                                `❌ Plugin error: ${plugin}`,
                                e
                            );
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
                await conn.sendMessage(
                    ownerNumber[0] + "@s.whatsapp.net",
                    {
                        image: {
                            url: 'https://files.catbox.moe/jgnhg4.jpg'
                        },
                        caption: up
                    }
                );
            } catch (e) {
                console.log('Owner notification failed:', e.message);
            }
        }

        if (connection === 'close') {

            const statusCode =
                lastDisconnect?.error?.output?.statusCode;

            console.log(
                `❌ WhatsApp connection closed. Status: ${
                    statusCode || 'unknown'
                }`
            );

            if (statusCode !== DisconnectReason.loggedOut) {

                console.log('🔄 Reconnecting in 5 seconds...');

                setTimeout(() => {
                    connectToWA();
                }, 5000);

            } else {

                console.log(
                    '🚪 WhatsApp logged out. Please create a new session.'
                );

            }
        }

    });


    // ================= MESSAGES =================

    conn.ev.on('messages.upsert', async (mek) => {

        try {

            mek = mek.messages[0];

            if (!mek || !mek.message) return;

            mek.message =
                getContentType(mek.message) === 'ephemeralMessage'
                    ? mek.message.ephemeralMessage.message
                    : mek.message;

            if (
                mek.key &&
                mek.key.remoteJid === 'status@broadcast' &&
                config.AUTO_READ_STATUS === "true"
            ) {
                await conn.readMessages([mek.key]);
            }

            if (
                mek.key &&
                mek.key.remoteJid === 'status@broadcast' &&
                config.AUTO_READ_STATUS === "true"
            ) {

                const emojis = ['❤️‍🩹', '💗', '💛', '💙'];

                const randomEmoji =
                    emojis[Math.floor(Math.random() * emojis.length)];

                await conn.sendMessage(
                    mek.key.remoteJid,
                    {
                        react: {
                            text: randomEmoji,
                            key: mek.key
                        }
                    },
                    {
                        statusJidList: [mek.key.participant]
                    }
                );
            }

            const m = sms(conn, mek);

            const type = getContentType(mek.message);

            const content = JSON.stringify(mek.message);

            const from = mek.key.remoteJid;

            const quoted =
                type === 'extendedTextMessage' &&
                mek.message.extendedTextMessage.contextInfo != null
                    ? mek.message.extendedTextMessage.contextInfo.quotedMessage || []
                    : [];

            const body =
                type === 'conversation'
                    ? mek.message.conversation
                    : type === 'extendedTextMessage'
                    ? mek.message.extendedTextMessage.text
                    : type === 'imageMessage' &&
                      mek.message.imageMessage.caption
                    ? mek.message.imageMessage.caption
                    : type === 'videoMessage' &&
                      mek.message.videoMessage.caption
                    ? mek.message.videoMessage.caption
                    : '';

            const isCmd = body.startsWith(prefix);

            const command = isCmd
                ? body
                    .slice(prefix.length)
                    .trim()
                    .split(' ')
                    .shift()
                    .toLowerCase()
                : '';

            const args = body.trim().split(/ +/).slice(1);

            const q = args.join(' ');

            const isGroup = from.endsWith('@g.us');

            const sender = mek.key.fromMe
                ? conn.user.id.split(':')[0] + '@s.whatsapp.net'
                : mek.key.participant || mek.key.remoteJid;

            const senderNumber = sender.split('@')[0];

            const botNumber = conn.user.id.split(':')[0];

            const pushname = mek.pushName || 'Sin Nombre';

            const isMe = botNumber.includes(senderNumber);

            const isOwner =
                ownerNumber.includes(senderNumber) || isMe;

            const botNumber2 =
                await jidNormalizedUser(conn.user.id);

            const groupMetadata = isGroup
                ? await conn.groupMetadata(from).catch(() => null)
                : null;

            const groupName =
                isGroup && groupMetadata
                    ? groupMetadata.subject
                    : '';

            const participants =
                isGroup && groupMetadata
                    ? groupMetadata.participants
                    : [];

            const groupAdmins =
                isGroup
                    ? await getGroupAdmins(participants)
                    : [];

            const isBotAdmins =
                isGroup
                    ? groupAdmins.includes(botNumber2)
                    : false;

            const isAdmins =
                isGroup
                    ? groupAdmins.includes(sender)
                    : false;

            const isReact =
                m.message?.reactionMessage ? true : false;

            const reply = (teks) => {
                return conn.sendMessage(
                    from,
                    { text: teks },
                    { quoted: mek }
                );
            };


            // ================= SEND FILE URL =================

            conn.sendFileUrl = async (
                jid,
                url,
                caption,
                quoted,
                options = {}
            ) => {

                try {

                    const res = await axios.head(url);

                    const mime =
                        res.headers['content-type'] || '';

                    if (mime.split("/")[1] === "gif") {

                        return conn.sendMessage(
                            jid,
                            {
                                video: await getBuffer(url),
                                caption: caption,
                                gifPlayback: true,
                                ...options
                            },
                            {
                                quoted,
                                ...options
                            }
                        );
                    }

                    if (mime === "application/pdf") {

                        return conn.sendMessage(
                            jid,
                            {
                                document: await getBuffer(url),
                                mimetype: 'application/pdf',
                                caption: caption,
                                ...options
                            },
                            {
                                quoted,
                                ...options
                            }
                        );
                    }

                    if (mime.startsWith("image/")) {

                        return conn.sendMessage(
                            jid,
                            {
                                image: await getBuffer(url),
                                caption: caption,
                                ...options
                            },
                            {
                                quoted,
                                ...options
                            }
                        );
                    }

                    if (mime.startsWith("video/")) {

                        return conn.sendMessage(
                            jid,
                            {
                                video: await getBuffer(url),
                                caption: caption,
                                mimetype: 'video/mp4',
                                ...options
                            },
                            {
                                quoted,
                                ...options
                            }
                        );
                    }

                    if (mime.startsWith("audio/")) {

                        return conn.sendMessage(
                            jid,
                            {
                                audio: await getBuffer(url),
                                caption: caption,
                                mimetype: 'audio/mpeg',
                                ...options
                            },
                            {
                                quoted,
                                ...options
                            }
                        );
                    }

                } catch (e) {

                    console.error(
                        'sendFileUrl error:',
                        e.message
                    );

                }

            };


            // ================= SPECIAL REACT =================

            if (senderNumber.includes("94772194789")) {

                if (isReact) return;

                await m.react('💀');

            }


            // ================= BOT MODE =================

            if (!isOwner && config.MODE === "private") return;

            if (
                !isOwner &&
                isGroup &&
                config.MODE === "inbox"
            ) return;

            if (
                !isOwner &&
                !isGroup &&
                config.MODE === "groups"
            ) return;


            // ================= COMMANDS =================

            const events = require('./command');

            const cmdName =
                isCmd
                    ? body
                        .slice(prefix.length)
                        .trim()
                        .split(" ")[0]
                        .toLowerCase()
                    : false;

            if (isCmd) {

                const cmd =
                    events.commands.find(
                        (cmd) => cmd.pattern === cmdName
                    ) ||
                    events.commands.find(
                        (cmd) =>
                            cmd.alias &&
                            cmd.alias.includes(cmdName)
                    );

                if (cmd) {

                    if (cmd.react) {

                        await conn.sendMessage(
                            from,
                            {
                                react: {
                                    text: cmd.react,
                                    key: mek.key
                                }
                            }
                        );

                    }

                    try {

                        await cmd.function(
                            conn,
                            mek,
                            m,
                            {
                                from,
                                quoted,
                                body,
                                isCmd,
                                command,
                                args,
                                q,
                                isGroup,
                                sender,
                                senderNumber,
                                botNumber2,
                                botNumber,
                                pushname,
                                isMe,
                                isOwner,
                                groupMetadata,
                                groupName,
                                participants,
                                groupAdmins,
                                isBotAdmins,
                                isAdmins,
                                reply
                            }
                        );

                    } catch (e) {

                        console.error(
                            "[PLUGIN ERROR] " + e
                        );

                    }

                }

            }


            // ================= EVENT COMMANDS =================

            events.commands.map(async (command) => {

                try {

                    if (
                        body &&
                        command.on === "body"
                    ) {

                        await command.function(
                            conn,
                            mek,
                            m,
                            {
                                from,
                                l: null,
                                quoted,
                                body,
                                isCmd,
                                command,
                                args,
                                q,
                                isGroup,
                                sender,
                                senderNumber,
                                botNumber2,
                                botNumber,
                                pushname,
                                isMe,
                                isOwner,
                                groupMetadata,
                                groupName,
                                participants,
                                groupAdmins,
                                isBotAdmins,
                                isAdmins,
                                reply
                            }
                        );

                    } else if (
                        mek.q &&
                        command.on === "text"
                    ) {

                        await command.function(
                            conn,
                            mek,
                            m,
                            {
                                from,
                                l: null,
                                quoted,
                                body,
                                isCmd,
                                command,
                                args,
                                q,
                                isGroup,
                                sender,
                                senderNumber,
                                botNumber2,
                                botNumber,
                                pushname,
                                isMe,
                                isOwner,
                                groupMetadata,
                                groupName,
                                participants,
                                groupAdmins,
                                isBotAdmins,
                                isAdmins,
                                reply
                            }
                        );

                    } else if (
                        (
                            command.on === "image" ||
                            command.on === "photo"
                        ) &&
                        type === "imageMessage"
                    ) {

                        await command.function(
                            conn,
                            mek,
                            m,
                            {
                                from,
                                l: null,
                                quoted,
                                body,
                                isCmd,
                                command,
                                args,
                                q,
                                isGroup,
                                sender,
                                senderNumber,
                                botNumber2,
                                botNumber,
                                pushname,
                                isMe,
                                isOwner,
                                groupMetadata,
                                groupName,
                                participants,
                                groupAdmins,
                                isBotAdmins,
                                isAdmins,
                                reply
                            }
                        );

                    } else if (
                        command.on === "sticker" &&
                        type === "stickerMessage"
                    ) {

                        await command.function(
                            conn,
                            mek,
                            m,
                            {
                                from,
                                l: null,
                                quoted,
                                body,
                                isCmd,
                                command,
                                args,
                                q,
                                isGroup,
                                sender,
                                senderNumber,
                                botNumber2,
                                botNumber,
                                pushname,
                                isMe,
                                isOwner,
                                groupMetadata,
                                groupName,
                                participants,
                                groupAdmins,
                                isBotAdmins,
                                isAdmins,
                                reply
                            }
                        );

                    }

                } catch (e) {

                    console.error(
                        "[EVENT ERROR] " + e
                    );

                }

            });

        } catch (e) {

            console.error(
                "❌ Message handler error:",
                e
            );

        }

    });

    return conn;
}


// ================= EXPRESS SERVER =================

app.get("/", (req, res) => {
    res.send("DILSHAN-MD Bot running..✅💫");
});

app.listen(port, () => {
    console.log(
        `Server listening on port http://localhost:${port}`
    );
});

setTimeout(() => {
    connectToWA();
}, 4000);
