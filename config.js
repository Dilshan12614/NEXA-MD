const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "0EEgiYBZ#_FJuurYwcmHS9Y0T09QgUG_4XXAlJwC3rfHQeZkhlrs",
MONGODB_URI: process.env.MONGODB_URI
};
