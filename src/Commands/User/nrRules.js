const { EmbedBuilder } = require('discord.js');
const vars = require('../../../config/config.json');
const { timestamp } = require('../../timestamp.js');

module.exports.rules = rules;

function rules(channel){
	let rulesEmbed = new EmbedBuilder()
		.setTitle("__**Welcome to Nerd Revolt!**__\n\We're a new community with a wide range of categories!  Programming, Batch, Hardware, Software, Music, Gaming, Hacking and General text and voice channels.\n\n\n\Violations of any of these rules can lead to a ban of the user!")
		.setColor(vars.embedColor)
		.setThumbnail(vars.NRicon)
		.setDescription("1. Be respectful and polite; this means tolerating other users, treating them with respect, not posting discriminatory or inflammatory content, and not spamming channels.  \n\n\
		2. Do not discuss anything illegal or blackhat, send malware, post anything NSFW, or break Discord [Terms of Service](https://discord.com/terms). \n\n\
		3. Keep chatting to the relevant channels and in English. \n\n\
		4. Members with the 'Super Nerd' role can change their nickname, otherwise, request a change from an Admin. \n\n\
		5. When posting code, use code tags (\\`\\`\\`lang <code>\\`\\`\\`) or upload it as a text document. ***Do not upload executables***. \n\n\
		6. The Moderation and Admin team have the final say in any moderation decision. If you do not approve, voice your feedback. \n\n\
		7. To help people answer your questions: Don't Ask to Ask, just Ask. When possible, search your question before sending it to the server. Whilst we appreciate good questions, we are not your search engine.");
		channel.send({ embeds: [rulesEmbed] })
		.then(msg => setTimeout(function(){msg.delete()}, 1000*15))
		.catch(err => console.error(`${timestamp()} - Rules message failed to send: ${err}`));
        channel.send("<#1008355696141672548>");
}