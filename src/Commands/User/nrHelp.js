const { EmbedBuilder } = require('discord.js');
const vars = require('../../../config/config.json');
const { timestamp } = require('../../timestamp.js');

module.exports.help = help;

function help(channel){
	let helpEmbed = new EmbedBuilder()
		.setTitle("__**Nerdbot Help**__\nThis message will display for 1 minute.\n\n\n**Nerdbot commands**")
		.setColor(vars.embedColor)
		.setThumbnail(vars.NRicon)
		.addFields(
			{name: "!nrRules", value: "Display the rules."},
			{name: "!nrJoke", value: "Dad jokes!"},
			{name: "!nrMath", value: "Math Gifs. Optional arguments: options 1-21"},
			{name: "!nrStat [@mention, username, or user id]", value: "If no argument, display server stats, otherwise display the users statistics using either mention, display name, or ID"},
			{name: "!nrRole", value: "Add or remove yourself from various roles.  !nrRole without an argument lists roles.  !nrRole [Rolename] adds/removes you from the roll selected."},
			{name: "!nrSuggest <suggestion>", value: "Drop a suggestion in the suggestion box."},
			{name: "\u200b", value: "\u200b"},
			{name: "**Staff Commands**", value:"\u200b"},
			{name: "!nrDelete <number to delete>", value:"Deletes requested number of posts from the current channel"},
			{name: "!nrParrot \"statement\"", value:"Make the bot say what you say in the quotes following the command"},
			//{name: "!nrPromote <@username> [role]", value:"Add/Remove tagged user from the role.  use !nrPromote to see valid roles"},
			//{name: "!nrWarn <@user> [reason]", value:"Warn a member, must mention the member with the reason optional."},
			//{name: "!nrKick <@user> [reason]", value:"Kick a member, must mention the member with the reason optional."},
			//{name: "!nrBan <@user> [reason]", value:"Ban a member, must mention the member with the reason optional."},
			//{name: "!nrClear <log ID>", value:"Clear log with provided ID"},
			{name: "\u200b", value: "\u200b"},
		)
		.setFooter({ text:"To request more commands, drop a suggestion with !nrSuggest", iconURL: vars.NRicon});

	channel.send({ embeds: [helpEmbed] })
	.then(msg => setTimeout(function(){msg.delete()}, 1000*60))
	.catch(err => console.error(`${timestamp()} - Help message failed to send: ${err}`));
}
