const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "8IsBnQYY#dT4KnyNW_Ti8nXdqIi4wTsDiW91b7E8BFgP9upe3Rew",
MONGODB_URI: process.env.MONGODB_URI
};
