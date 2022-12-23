const fs = require('fs')
const { EmbedBuilder, Embed } = require('discord.js');
const vars = require('../../../config/config.json');
const { timestamp } = require('../../timestamp.js');

module.exports.serverStats = serverStats;
module.exports.userStats = userStats;

async function serverStats(channel, guild){
	let d = guild.createdAt.toDateString();
	let numUsers = guild.memberCount;
    let guildMembers = await guild.members.fetch({ withPresences: true });
    let online = await guildMembers.filter(m => !m.user.bot && (m.presence?.status == 'online' || m.presence?.status == 'dnd' || m.presence?.status == 'idle')).size //I guess 'offline' is no longer a thing.  Reading the documentation would have sped up this process a little bit...
	let channels = guild.channels.cache
    let chanCount = channels.filter(c => c.type != 4 && c.type != 11).size; //type 4 is categories. 
	let forumCount = channels.filter(c => c.type === 11).size;// type 11 is forums
    let catCount = channels.filter(c => c.type === 4).size;
	let roleCount = guild.roles.cache.size - 1; //don't count @everyone

	let createdString = "This server was started on " + d;
    let channelStat = `There are ${chanCount} channels and ${forumCount} forum posts in ${catCount} categories.`
	let userStat = "Number of online users: " + online + "/" + numUsers;
	let roles = "Total number of roles: " + roleCount;
    let serverEmbed = new EmbedBuilder()
        .setDescription("__**NerdRevolt Stats**__")
		.setColor(vars.embedColor)
		.setThumbnail(vars.NRicon)
        .addFields(
            { name: '\u200b', value: '\u200b' },
            { name: 'Nerd Revolt Launch Date', value: createdString },
            { name: '\u200b', value: '\u200b' },
            { name: 'User count', value: userStat },
            { name: 'Roles', value: roles },
            { name: 'Channels', value: channelStat}
        )
        channel.send({embeds: [serverEmbed]})
            .then(msg => setTimeout(function(){msg.delete()}, 1000*30))
            .catch(err => console.error(`${timestamp()} - ServerStats message failed to send: ${err}`));
}

function userStats(message, cmd2, guild){
	if (cmd2.slice(2).slice(0,-1) === message.mentions.users.first()?.id){//It's a mention. 
        let user = guild.members.cache.find(u => u.id == message.mentions.users.first()?.id)
		stats(message, user)
	} else {
		noMention(message, cmd2, guild);
	}
}

function noMention(message, cmd2, guild){
    var user;
    if(cmd2.length == 18 && !isNaN(cmd2)){ //cmd2 is a userID
        user = guild.members.cache.find(u => u.id == cmd2);
    } else { //cmd2 is presumably a username, we'll try to find it.
    if((cmd2.startsWith('"') || cmd2.startsWith("'")) && (cmd2.endsWith('"') || cmd2.endsWith("'"))){
		cmd2 = cmd2.substr(1, cmd2.length-2) //if username is in quotes remove them
	} else {
        if((cmd2.startsWith('"') || cmd2.startsWith("'")) && (!cmd2.endsWith('"') || !cmd2.endsWith("'"))){//username in quotes but username has spaces. cmd2 is just the first argument.
            let xuser = message.content.slice(9);
            if (xuser.endsWith('"') || xuser.endsWith("'")){xuser = xuser.slice(0,-1)}; //drop the last quote if there.
            cmd2 = xuser;
        } else {
            if(cmd2.length != message.content.length-9){//check if user submitted a name with spaces in it that isn't in quotes.
                cmd2 = message.content.slice(8);
            }
        } //I'm not error checking anymore.  If they don't have it by now, then they get an error message.
    }
	//user = guild.members.cache.find(user => user.displayName == cmd2)
    user = guild.members.cache.find(user => user.displayName.toLowerCase() == cmd2.toLowerCase());//find user case insensitive.
    } 
    if (!user){errorMessage(message, cmd2)}else{stats(message, user)}; 
}

function stats(message, user){
    let uIcon = user.displayAvatarURL(); //user avatar
    //Time on Server
    var timeOutput;
    var joinDate = user.joinedAt;
    var curTime = Date.now();
    var dif = ((curTime - joinDate)/3600000); //this is all that matters for calculating 24 hours but I want to make it display nicely.
    var hour = Math.floor(dif);
    var min = Math.floor((dif - hour)*60);
    if (hour > 24){
        var day = Math.floor(hour/24)
        var hour = hour % 24 //remainder of hours
    } else day = 0
    var dayVal, hourVal, minVal;
    if (day == 1){dayVal = "day";} else dayVal = "days";
    if (hour == 1){hourVal = "hour";} else hourVal = "hours";
    if (min == 1){minVal = "min";} else minVal = "mins";
    if (day < 365){
        timeOutput = day + " " + dayVal + ", " + hour + " " + hourVal + ", " + min + " " + minVal
    } else {
        var year = Math.floor(day/365)
        day = day % 365
        if (day == 1){dayVal = "day";} else dayVal = "days";
        if (year > 1){var yearVal = 'years';} else yearval = 'year';
        timeOutput = `${year} ${yearVal}, ${day} ${dayVal}, ${hour} ${hourVal}, ${min} ${minVal}`
    }

    let log = readLog(user.id)
    let memberEmbed = new EmbedBuilder()
        .setColor(vars.embedColor)
        .setThumbnail(uIcon)
        .addFields(
            { name:'__**Member Information**__', value:'\u200b' },
            { name: 'Name', value: user.displayName},
            { name: 'ID', value: user.id },
            { name: 'Discord member since:', value: `${user.user.createdAt}`},
            { name: 'Nerd Revolt member since:', value: `${joinDate}` },
            { name: 'Time since Join', value: timeOutput },
            { name: '\u200b', value: '\u200b' },
            { name: '__**Admin Data/Warning**__', value: '\u200b' }
        )
        for (let i=0;i<log.length;i++){
            memberEmbed.addFields({ name: `ID: ${log[i].id}\tAction: ${log[i].action}`, value: `${log[i].reason} :: ${log[i].date}`});
        }
        message.channel.send({embeds: [memberEmbed]})
            .then(msg => setTimeout(function(){msg.delete()}, 1000*30))//display stats for 30 sec
            .catch(err => console.error(`${timestamp()} - User stats message failed to send: ${err}`));
}

function errorMessage(message, cmd2){
    let errorMessage = new EmbedBuilder()
        .setColor(vars.embedColor)
        .setThumbnail(vars.NRicon)
        .addFields(
            { name: '__**ERROR!! USER NOT FOUND**__', value: '\u200b'},
            { name: '\u200b', value: '\u200b'},
            { name: 'Requested User:', value: cmd2}
        );
        message.channel.send({embeds: [errorMessage]})
            .then(msg => setTimeout(function(){msg.delete()}, 1000*5))
            .catch(err => console.error(`${timestamp()} - Userstat error message failed to send: ${err}`));
}

function readLog(uid){
    let jsonStr = fs.readFileSync('data/automod.json');//read in the json data
    let obj = JSON.parse(jsonStr);
    let mod = obj.moderation;
    var log = [];
    
    for (let i=0;i<mod.length;i++){
        if (uid == mod[i].uid){
            log.push({id: mod[i].id, action: mod[i].action, reason: mod[i].reason, date: mod[i].date}) //data to the array to return.
        }
    }
    return log;
}