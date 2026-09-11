const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "ccECWZ5L#VLTqn5wa8QrxmpdVWzsNGYbllusxC8rDe9c4UNDaxVE",
MONGODB_URI: process.env.MONGODB_URI
};
