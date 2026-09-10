const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "8Q9wASxS#z-8xtaeQejj0230xr_KXB_Fg4noAz6ZhVgDwUcdAlJw",
MONGODB_URI: process.env.MONGODB_URI
};
