module.exports.parrot = parrot;
const { timestamp } = require('../../timestamp.js');

function parrot(channel, message){
    msg = message.content.slice(10)//capture all arguments on the command.
    console.log(`${timestamp()} - ${message.member.displayName} has sent the following parrot message: ${msg}`) //log the message to console.  Just in case.
    channel.send(msg)
    .catch(err => console.error(`${timestamp()} - Parrot message failed to send: ${err}`));
}