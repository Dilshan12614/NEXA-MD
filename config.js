const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "JRcBzaRC#JF52OB25H9Gl6etbcAqR8CASkY71brtIWst7bY5fkoc",
MONGODB_URI: process.env.MONGODB_URI
};
