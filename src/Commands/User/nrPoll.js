const { EmbedBuilder } = require('discord.js');
const vars = require('../../../config/config.json');
const { timestamp } = require('../../timestamp.js');

module.exports.poll = poll;

function poll(channel, user, message){
    let question = message.content.slice(8)
    if ((question.startsWith("'") && question.endsWith("'")) || (question.startsWith('"') && question.endsWith('"'))){
        question = question.substring(1,question.length-1)//strip quotes around question
    }
    let pollEmbed = new EmbedBuilder()
        .setTitle('Poll Question')
        .setColor(vars.embedColor)
        .setThumbnail(vars.NRicon)
        .setFields(
            { name: `${user} has posed the following question:`, value:'\u200b'},
            { name: question, value: '\u200b'},
            { name: '\u200b', value: "👍 for Yes, 👎 for No, 😶 for no opinion"},
        )

	  channel.send({ embeds: [pollEmbed] })
            .then(msg => addReactions(msg))
            .catch(err => console.error(`${timestamp()} - Failed to send Poll message: ${err}`));
    }


    function addReactions(pollQuestion){
        pollQuestion.react("👍")
            .then(() => pollQuestion.react("👎"))
            .then(() => pollQuestion.react("😶"))
            .catch(err => console.error(`${timestamp()} - One of the emojis failed to react. ${err}`));
    }