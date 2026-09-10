// Database disabled for NEXA-MD

const readEnv = async () => {
    return {
        PREFIX: process.env.PREFIX || '.',
        MODE: process.env.MODE || 'public',
        AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || 'false',
        ALIVE_IMG: process.env.ALIVE_IMG || '',
        ALIVE_MSG: process.env.ALIVE_MSG || 'Hello, I am alive now!'
    };
};

module.exports = {
    readEnv
};
