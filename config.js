const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "EQUxQZJI#o6HwYc0-GsxqfVTYESj4ABPbkDsryA-2TCWM9MCNmvM",
MONGODB_URI: process.env.MONGODB_URI
};
