//directory of user commands

module.exports.nrHelp = require('./User/nrHelp.js').help; //channel
module.exports.nrJoke = require('./User/nrJoke.js').joke; //channel
module.exports.nrMath = require('./User/nrMath.js').mathGif; //cmd, uid, channel
module.exports.nrPing = require('./User/nrPing.js').ping; //channel
module.exports.nrPoll = require('./User/nrPoll.js').poll; //channel, user, message
module.exports.nrRole = require('./User/nrRole.js').editRoles; //message, role
module.exports.nrRules = require('./User/nrRules.js').rules; //message, cmd2, guild
module.exports.userStats = require('./User/nrStat.js').userStats; //message, cmd2, guild
module.exports.serverStats = require('./User/nrStat.js').serverStats; //channel, guild
module.exports.nrSuggest = require('./User/nrSuggest.js').suggestion; //client, channel, user, suggestion

