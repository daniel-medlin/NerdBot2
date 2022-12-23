const vars = require('../../../config/config.json');
const { timestamp } = require('../../timestamp.js');

module.exports.del = del;

function del(message, number){
    let logsChan = message.guild.channels.cache.find(c => c.id === vars.logChan)
    let userName = message.member.displayName;
    if (number >= 1 && number < 100){
        number = parseInt(number)
        number++
        message.channel.bulkDelete(number)
            .then(function(){
                console.log(`${timestamp()} - ${number - 1} messages in ${message.channel.name} deleted by ${userName}`)
                logsChan.send(`${number - 1} messages in <#${message.channel.id}> deleted by ${message.author}`)
            })
            .catch(err => {
                logsChan.send(`Bulk Delete failed: ${err}`)
                console.error(`${timestamp()} - Bulk Delete failed: ${err}`)
            })
    } else {
        message.channel.send(`Bulk Delete only works on a positive number of messages between 1 and 100 newer than 2 weeks old.  Your selection was: ${number}.`)
            .then(msg => setTimeout(function(){msg.delete()}, 1000*5))
            .catch(err => console.error(`${timestamp()} - Invalid bulkdelete message to send: ${err}`))
    }
}