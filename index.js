import { default: makeWASocket, useMultiFileAuthState, delay, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import axios from 'axios';
import { download } from './mega.js'; // mega.js එකෙන් download function එක ගනී

// 🔐 ඔයාගේ සැබෑ කෙටි සෙෂන් ID එක මෙතනට දාන්න
const SESSION_ID = "DILSHAN-MD~xxxxxx"; 

async function startBot() {
    const authFolder = './auth_session';
    
    if (!fs.existsSync(authFolder + '/creds.json')) {
        console.log("[BOT] Session files not found. Fetching from Mega...");
        try {
            fs.mkdirSync(authFolder, { recursive: true });
            const fileBuffer = await download(SESSION_ID); 
            fs.writeFileSync(`${authFolder}/creds.json`, fileBuffer);
            console.log("[BOT] Session downloaded successfully!");
        } catch (err) {
            console.error("[BOT] Failed to download session. Check Session ID!", err);
            return;
        }
    }

    const { state, saveCreds } = await useMultiFileAuthState(authFolder);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
            console.log(`[BOT] Connection closed. Reconnecting: ${shouldReconnect}`);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('[BOT] DILSHAN-MD is online and ready! 🧚‍♂️');
        }
    });

    // 📩 මැසේජ් ලැබෙද්දී ක්‍රියාත්මක වන නිවැරදි Baileys Logic එක
    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek.message) return;
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return;

            const from = mek.key.remoteJid;
            
            // 🛠️ Baileys වල නිවැරදිව මැසේජ් Type එක හඳුනාගැනීම
            const type = Object.keys(mek.message)[0] === 'ephemeralMessage' ? Object.keys(mek.message.ephemeralMessage.message)[0] : Object.keys(mek.message)[0];
            
            let body = '';
            if (type === 'conversation') body = mek.message.conversation;
            else if (type === 'extendedTextMessage') body = mek.message.extendedTextMessage.text;
            else if (type === 'imageMessage') body = mek.message.imageMessage.caption;
            else if (type === 'videoMessage') body = mek.message.videoMessage.caption;

            const prefix = '.'; 
            const isCmd = body.startsWith(prefix);
            const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : '';
            const args = body.trim().split(/ +/).slice(1);
            const q = args.join(' ');

            const reply = async (text) => {
                await sock.sendMessage(from, { text: text }, { quoted: mek });
            };

            if (!isCmd) return;

            switch (command) {

                // 🤖 1. AI CHAT
                case 'ai':
                case 'chat': {
                    if (!q) return reply("❌ කරුණාකර ප්‍රශ්නයක් ලියන්න!");
                    await reply("⏳ AI පිළිතුර සකසමින් පවතී...");
                    try {
                        const response = await axios.get(`https://giftedtech.my.id{encodeURIComponent(q)}`);
                        const aiReply = response.data.result || "පිළිතුරක් සෙවීමට නොහැකි විය.";
                        await reply(`🤖 *DILSHAN-MD AI CHAT*\n\n${aiReply}`);
                    } catch (e) {
                        reply("❌ AI සම්බන්ධතාවය බිඳ වැටුණා.");
                    }
                    break;
                }

                // ✨ 2. AI IMAGE GENERATOR
                case 'img':
                case 'gen': {
                    if (!q) return reply("❌ පින්තූරය ගැන විස්තරයක් දෙන්න!");
                    await reply("⏳ AI පින්තූරය සාදමින් පවතී...");
                    try {
                        const imageUrl = `https://pollinations.ai{encodeURIComponent(q)}?width=1024&height=1024&nologo=true`;
                        await sock.sendMessage(from, { 
                            image: { url: imageUrl }, 
                            caption: `✨ *AI IMAGE GENERATOR*\n\n📝 *Prompt:* ${q}` 
                        }, { quoted: mek });
                    } catch (e) {
                        reply("❌ පින්තූරය සෑදීමට නොහැකි විය.");
                    }
                    break;
                }

                // 🎙️ 3. TEXT TO SPEECH
                case 'tts':
                case 'say': {
                    if (!q) return reply("❌ ශබ්ද නගා කියවිය යුතු දේ ලියන්න!");
                    await reply("⏳ හඬ පටය සකසමින් පවතී...");
                    try {
                        const ttsUrl = `https://giftedtech.my.id{encodeURIComponent(q)}&lang=en`;
                        await sock.sendMessage(from, { 
                            audio: { url: ttsUrl }, 
                            mimetype: 'audio/mp4', 
                            ptt: true 
                        }, { quoted: mek });
                    } catch (e) {
                        reply("❌ හඬ පටය සෑදීමට නොහැකි විය.");
                    }
                    break;
                }

                // 🎵 4. SONG DOWNLOADER
                case 'song':
                case 'play': {
                    if (!q) return reply("❌ සින්දුවේ නම ලියන්න!");
                    await reply("⏳ සින්දුව බාගත වෙමින් පවතී...");
                    try {
                        const res = await axios.get(`https://giftedtech.my.id{encodeURIComponent(q)}`);
                        const audioLink = res.data.result.download_url;
                        await sock.sendMessage(from, { 
                            document: { url: audioLink }, 
                            mimetype: 'audio/mpeg', 
                            fileName: `${q}.mp3` 
                        }, { quoted: mek });
                    } catch (e) {
                        reply("❌ සින්දුව සෙවීමට නොහැකි විය.");
                    }
                    break;
                }

                // 🎬 5. VIDEO DOWNLOADER
                case 'video': {
                    if (!q) return reply("❌ වීඩියෝ ලින්ක් එකක් හෝ නමක් දෙන්න!");
                    await reply("⏳ වීඩියෝව බාගත වෙමින් පවතී...");
                    try {
                        const res = await axios.get(`https://giftedtech.my.id{encodeURIComponent(q)}`);
                        const videoLink = res.data.result.download_url;
                        await sock.sendMessage(from, { 
                            video: { url: videoLink }, 
                            caption: `🎬 *DILSHAN-MD DOWNLOADER*` 
                        }, { quoted: mek });
                    } catch (e) {
                        reply("❌ වීඩියෝව බාගත කිරීමට නොහැකි විය.");
                    }
                    break;
                }

                // 🎭 6. STICKER MAKER
                case 'sticker':
                case 's': {
                    const isMedia = (type === 'imageMessage' || type === 'videoMessage');
                    const isQuotedImage = type === 'extendedTextMessage' && body.includes('imageMessage');
                    
                    if (isMedia || isQuotedImage) {
                        await reply("⏳ ස්ටිකරය සාදමින් පවතී...");
                        const { downloadContentFromMessage } = await import('@whiskeysockets/baileys');
                        const msg = isQuotedImage ? mek.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage : mek.message.imageMessage;
                        const stream = await downloadContentFromMessage(msg, 'image');
                        let buffer = Buffer.from([]);
                        for await(const chunk of stream) { buffer = Buffer.concat([buffer, chunk]); }
                        
                        const Sticker = (await import('wa-sticker-formatter')).default;
                        const sticker = new Sticker(buffer, {
                            pack: 'DILSHAN-MD',
                            author: 'Dilshan Ashinsa',
                            type: 'full'
                        });
                        await sock.sendMessage(from, await sticker.toMessage(), { quoted: mek });
                    } else {
                        reply("❌ කරුණාකර පින්තූරයක් සමඟ .s කමාන්ඩ් එක යවන්න!");
                    }
                    break;
                }

                // ✍️ 7. FANCY FONTS
                case 'font':
                case 'fancy': {
                    if (!q) return reply("❌ මෝස්තර කළ යුතු නම ලියන්න!");
                    try {
                        const res = await axios.get(`https://giftedtech.my.id{encodeURIComponent(q)}`);
                        const fontList = res.data.result.map(f => f.result).join('\n\n');
                        await reply(`✍ *FANCY FONTS FOR: ${q}*\n\n${fontList}`);
                    } catch (e) {
                        reply("❌ අකුරු මෝස්තර කිරීමට නොහැකි විය.");
                    }
                    break;
                }
            }
        } catch (err) {
            console.error(err);
        }
    });
}

startBot();
