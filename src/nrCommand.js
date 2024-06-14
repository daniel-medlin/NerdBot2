const { EmbedBuilder } = require('discord.js');
const { timestamp } = require('./timestamp.js');
const fs = require('fs');
const vars = require('../config/config.json');
const uCommand = require('./Commands/userCommands.js'); //user commands
const aCommand = require('./Commands/adminCommands.js'); //admin commands

exports.nrCommand = nrCommand


function logCommand(client, type, message){ //log commands to logs
		let user = message.member.displayName;
		let chan = message.channel.name;
		let content = message.content;
		let logEmbed = new EmbedBuilder()
			.setTitle('Nerdbot command')
			.setColor(vars.embedColor)
			.setThumbnail(vars.NRicon)
			.setFields(
				{ name: "Command Type", value: type},
				{ name: "User", value: user},
				{ name: "Channel", value: chan},
				{ name: "Message", value: content}
			)
			.setFooter({ text: timestamp(), iconURL: vars.NRicon });
		client.channels.cache.get(vars.nrLogsChan).send({ embeds: [logEmbed] });
}
function isAdmin(member){ //checks if user is mod or admin
	if (member.roles.cache.find(r => r.name === "Admin" || r.name === 'Moderator')){
		return true 
	} return false 
}
function nrCommand(message, client){//messages recieved here have already been verified to start with '!nr'
	var msg = message.content;
	var args = msg.substring(3).split(' '); //split the remainder of the message by spaces for each argument.
	var channel = message.channel
	var cmd = args[0].toLowerCase(); //pull out the first argument and convert to lowercase.
	var cmd2 = args[1]; //second argument
	var cmd3 = args[2]; //third argument
	var displayName = message.member.displayName; //get the display name for the user (This is either the username or the nickname)
	var guild = message.guild;
	var member = message.member
	var uid = message.author.id; //user ID
	var user = message.author.username; //get username that requested the command
	switch(cmd){
		case 'rules'://!nrRules
			message.delete();
			logCommand(client, "User", message);
			uCommand.nrRules(channel, message);
		break;
		
		case 'hello'://!nrHello
			message.delete();
			logCommand(client, "User", message);
			channel.send("Hi there, " + displayName + "!");
		break;
		case 'help'://!nrHelp
			message.delete();
			logCommand(client, "User", message);
			uCommand.nrHelp(channel);
		break;
		case 'humble'://!nrHumble
			message.delete()
			logCommand(client, "User", message);
			message.channel.send(`<@${uid}> be praised!`)
            	.catch(err => console.error(`${timestamp()} - Failed to send humble message: ${err}`));
		break;
		case 'joke'://!nrJoke
			message.delete();
			logCommand(client, "User", message);
			uCommand.nrJoke(channel);
		break;
		case 'math'://!nrMath
			message.delete();
			logCommand(client, "User", message);
			uCommand.nrMath(args, uid, channel);
		break;
		case 'ping'://!nrPing
			message.delete();
			logCommand(client, "User", message);
			uCommand.nrPing(channel);
		break;
		case 'poll'://!nrPoll
			message.delete();
			logCommand(client, "User", message);
			uCommand.nrPoll(channel, displayName, message);
		break;
		case 'role'://!nrRole
			message.delete()
			logCommand(client, "User", message)
			if (cmd2 == null){
				uCommand.nrRole(message, 'noSelect');
			} else uCommand.nrRole(message, cmd2);
		break;		
		case 'stat'://!nrStat if no argument, show server stats otherwise argument should be a user.
		message.delete();
		logCommand(client, "User", message)
		if (cmd2 == null){
			uCommand.serverStats(channel, guild);
			} else uCommand.userStats(message, cmd2, guild);
		break;
		case 'suggest'://!nrSuggest
			message.delete();
			logCommand(client, "User", message)
			uCommand.nrSuggest(client, channel, displayName, message.content.slice(11))//send whole message minus the !nrsuggest
		break;
		//////////////////
		//ADMIN COMMANDS//
		//////////////////
		case 'delete'://!nrDelete
			message.delete();
			logCommand(client, "Admin", message)
			if (isAdmin(member)){
				if(!isNaN(cmd2)){
					aCommand.nrDelete(message, cmd2)
				} else {
					message.channel.send('The command !nrDelete requires a number between 1 and 100 to delete.')
						.then(msg => setTimeout(function(){msg.delete()}, 1000*5)).catch(err => console.error(`${timestamp()} - Failed to send nrDelete error message: ${err}`));
				}
			} else { //user was not admin
				if(isNaN(cmd2)){
					client.channels.cache.get(vars.logChan).send(`Warning: <@${vars.roleAdmin}>, <@${vars.roleMod}>: <@${member.id}> has attempted to use the command '!nrDelete' in <#${message.channel.id}>`)
				} else {
					client.channels.cache.get(vars.logChan).send(`Warning: <@${vars.roleAdmin}>, <@${vars.roleMod}>: <@${member.id}> has attempted to use the command '!nrDelete' to delete ${cmd2} messages in <#${message.channel.id}>`)
				}
				message.channel.send('Only Admin or Mods can use this command.  This action has been flagged for review.')
					.then(msg => setTimeout(function(){msg.delete()}, 1000*15))
					.catch(err => console.error(`${timestamp()} - Failed to send nrDelete user flagged message: ${err}`));
			}
		break;
		case 'parrot'://!nrParrot
			message.delete();
			logCommand(client, "Admin", message)
			if (isAdmin(member)){
				aCommand.nrParrot(channel, message);
			} else {
				message.channel.send('Only NRevolt Staff can use this command.')
					.then(msg => setTimeout(function(){msg.delete()}, 1000*5))
					.catch(err => console.error(`${timestamp()} - Failed to send parrot invalid user message: ${err}`));
			}
		break;
		case 'promote'://!nrPromote
			message.delete();
			logCommand(client, "Admin", message)
			if(isAdmin(member)){
				if(cmd2 == null){aCommand.nrPromote('display',"",channel,"");
				} else if(!message.mentions.members.first()){ //command requires a mention
					aCommand.nrPromote('display', "", channel, "");
					channel.send('**Invalid Argument** - Correct usage: !nrPromote <@username> [role]')
						.then(msg => setTimeout(function(){msg.delete()}, 1000*5))
						.catch(err => console.error(`${timestamp()} - Failed to send nrPromote error: ${err}`));
				} else {
					let role = cmd3
					aCommand.nrPromote('edit', message, channel, role)
				}
			}
		break;
		case 'warn'://!nrWarn
			message.delete();
			logCommand(client, "Admin", message)
			message.channel.send('nope')
				.then(msg => setTimeout(function(){msg.delete()}, 1000*3))
				.catch(err => console.error(`${timestamp()} - Dumb Error`));
		break;
		case 'kick'://!nrKick
			message.delete();
			logCommand(client, "Admin", message)
			message.channel.send('nope')
				.then(msg => setTimeout(function(){msg.delete()}, 1000*3))
				.catch(err => console.error(`${timestamp()} - Dumb Error`));
		break;
		case 'ban'://!nrBan
			message.delete();
			logCommand(client, "Admin", message)
			message.channel.send('nope')
				.then(msg => setTimeout(function(){msg.delete()}, 1000*3))
				.catch(err => console.error(`${timestamp()} - Dumb Error`));
		break;
		case 'clear'://!nrClear
			message.delete();
			logCommand(client, "Admin", message)
			message.channel.send('nope')
				.then(msg => setTimeout(function(){msg.delete()}, 1000*3))
				.catch(err => console.error(`${timestamp()} - Dumb Error`));
		break;
		case 'test'://!nrTest
			message.delete();
			logCommand(client, "Admin", message)
			console.log(`${timestamp()} - TEST COMMAND - ${user} is admin: ${isAdmin(member)}`)
		break;
	}
}



