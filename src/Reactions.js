const vars = require('../config/config.json');
const { EmbedBuilder } = require('discord.js');
const ud = require('./userData.js');
const { timestamp } = require('./timestamp.js');

exports.rulesAdd = function ruleReaction(reaction, member, user){ //user accepted rules by reacting on message.
    var client = reaction.client;
	if(reaction.emoji.name === '👍'){
		member.roles.add(vars.roleMember);
		member.roles.remove(vars.roleNewUser);
		console.log(`${timestamp()} - ${user.username} has been added to the Members role.`);
		ud.deleteUser(user.id)
        buildWelcomeEmbed(member, user, user.id, client)
	} else {
        console.log(`${timestamp()} - Invalid reaction on rules Message: ${reaction.emoji.name}`);
        reaction.remove(user)
        .catch(err => console.error(`${timestamp()} - Something bad happended: ${err}`));
    }
}

exports.langAdd = function langReaction(reaction, member, user){ //user selected a language role
    var langChan = vars.langChan;
    var client = reaction.client
    switch(reaction.emoji.name){
        case '🇧':
				member.roles.add(vars.batch);
				output(user.username + " has been added to the Batch role.", langChan, client);
			break;
			case '🇨':
				member.roles.add(vars.cLang);
				output(user.username + " has been added to the C role.", langChan, client);
			break;
			case '🇯':
				member.roles.add(vars.java);
				output(user.username + " has been added to the Java role.", langChan, client);
			break;
			case '🇵':
				member.roles.add(vars.python);
				output(user.username + " has been added to the Python role.", langChan, client);
			break;
			case '🇻':
				member.roles.add(vars.vb);
				output(user.username + " has been added to the VB role.", langChan, client)
			break;
			case '🇼':
				member.roles.add(vars.webdev);
				output(user.username + " has been added to the WebDev role.", langChan, client)
			break;
			case '🇬':
				member.roles.add(vars.go);
				output(user.username + " has been added to the Go role.", langChan, client);
			break;
			case '🇷':
				member.roles.add(vars.rust);
				output(user.username + " has been added to the Rust role.", langChan, client);
			break;
			case '⁉️':
				member.roles.add(vars.challenge);
				output(user.username + " has been added to the Challenge role.", langChan, client);
			break;
			default:
				console.log(`${timestamp()} - Invalid reaction on Language Message: ${reaction.emoji.name}`);//catch invalid reactions and remove it.  Shouldn't happen but better safe than sorry.
                reaction.remove(user)
                .catch(err => console.error(`${timestamp()} - Something bad happended: ${err}`));
    }
}

exports.osAdd = function osReaction(reaction, member, user){
    var langChan = vars.langChan;
    var client = reaction.client
    switch(reaction.emoji.name){
        case 'windows':
            member.roles.add(vars.windowsOS);
            output(user.username + " has been added to the Windows role.", langChan, client);
        break;
        case 'linux':
            member.roles.add(vars.linuxOS);
            output(user.username + " has been added to the Linux role.", langChan, client);
        break;
        case 'AppleOS':
            member.roles.add(vars.appleOS);
            output(user.username + " has been added to the Apple role.", langChan, client);
        break;
        case 'android':
            member.roles.add(vars.androidOS);
            output(user.username + " has been added to the Android role.", langChan, client);
        break;
        default: 
            console.log(`${timestamp()} - Invalid reaction on OS Message: ${reaction.emoji.name}`);
            reaction.remove(user)
            .catch(err => console.error(`${timestamp()} - Something bad happended: ${err}`));
    }
}

exports.generalAdd = function genReaction(reaction, member, user){
    var langChan = vars.langChan;
    var client = reaction.client
    switch(reaction.emoji.name){
        case '🎮':
            member.roles.add(vars.gaming);
            output(user.username + " has been added to the Gaming role.", langChan, client);
        break;
        case '🎸':
            member.roles.add(vars.music);
            output(user.username + " has been added to the Music role.", langChan, client);
        break;
        case '💻':
            member.roles.add(vars.tech);
            output(user.username + " has been added to the Tech role.", langChan, client);
        break;
        default: console.log(`${timestamp()} - Invalid reaction on General Message: ${reaction.emoji.name}`);
        reaction.remove(user)
        .catch(err => console.error(`${timestamp()} - Something bad happended: ${err}`));
    }
}


//////REMOVE ROLES


exports.langRemove = function langReactionRemove(reaction, member, user){ //user selected a language role
    var langChan = vars.langChan;
    var client = reaction.client
    switch(reaction.emoji.name){
        case '🇧':
				member.roles.remove(vars.batch);
				output(user.username + " has been removed from the Batch role.", langChan, client);
			break;
			case '🇨':
				member.roles.remove(vars.cLang);
				output(user.username + " has been removed from the C role.", langChan, client);
			break;
			case '🇯':
				member.roles.remove(vars.java);
				output(user.username + " has been removed from the Java role.", langChan, client);
			break;
			case '🇵':
				member.roles.remove(vars.python);
				output(user.username + " has been removed from the Python role.", langChan, client);
			break;
			case '🇻':
				member.roles.remove(vars.vb);
				output(user.username + " has been removed from the VB role.", langChan, client)
			break;
			case '🇼':
				member.roles.remove(vars.webdev);
				output(user.username + " has been removed from the WebDev role.", langChan, client)
			break;
			case '🇬':
				member.roles.remove(vars.go);
				output(user.username + " has been removed from the Go role.", langChan, client);
			break;
			case '🇷':
				member.roles.remove(vars.rust);
				output(user.username + " has been removed from the Rust role.", langChan, client);
			break;
			case '⁉️':
				member.roles.remove(vars.challenge);
				output(user.username + " has been removed from the Challenge role.", langChan, client);
			break;
    }
}

exports.osRemove = function osReactionRemove(reaction, member, user){
    var langChan = vars.langChan;
    var client = reaction.client
    switch(reaction.emoji.name){
        case 'windows':
            member.roles.remove(vars.windowsOS);
            output(user.username + " has been removed from the Windows role.", langChan, client);
        break;
        case 'linux':
            member.roles.remove(vars.linuxOS);
            output(user.username + " has been removed from the Linux role.", langChan, client);
        break;
        case 'AppleOS':
            member.roles.remove(vars.appleOS);
            output(user.username + " has been removed from the Apple role.", langChan, client);
        break;
        case 'android':
            member.roles.remove(vars.androidOS);
            output(user.username + " has been removed from the Android role.", langChan, client);
        break;
    }
}

exports.generalRemove = function genReactionRemove(reaction, member, user){
    var langChan = vars.langChan;
    var client = reaction.client
    switch(reaction.emoji.name){
        case '🎮':
            member.roles.remove(vars.gaming);
            output(user.username + " has been removed from the Gaming role.", langChan, client);
        break;
        case '🎸':
            member.roles.remove(vars.music);
            output(user.username + " has been removed from the Music role.", langChan, client);
        break;
        case '💻':
            member.roles.remove(vars.tech);
            output(user.username + " has been removed from the Tech role.", langChan, client);
        break;
    }
}

function output(outText, channelID, client){ //briefly display text on role selection
    client.channels.cache.get(channelID).send(outText).then(sent => {
        setTimeout(() => sent.delete(), 0)
    })
    .catch(err => console.error(`${timestamp()} - Something bad happended: ${err}`));
}

function buildWelcomeEmbed(member, user, uid, client){
    let uIcon = member.displayAvatarURL();
	if (uIcon == 'undefined'){uIcon=NRicon};
	if(uid=='undefined'){return}//can't delete undefined also, don't want an ugly message.
    let currentUser = user.username;
            
    let welcomeEmbed = new EmbedBuilder()
        .setTitle("__**Welcome to Nerd Revolt!**__")
        .setColor(vars.embedColor)
        .setThumbnail(uIcon)
        .setDescription("Hey "+currentUser+" (<@" + user.id + ">), welcome to **Nerd Revolt**:tada::hugging:!  Have fun coding with us!\n\n\
        Be sure to check out the <#"+vars.langChan+"> channel to select your prefered programming lanugages.  \nYou can also select your roles manually using the !nrRole command.")
        setTimeout(function(){ client.channels.cache.get(vars.welcomeChan).send({ embeds: [welcomeEmbed] }); }, 2000)
}