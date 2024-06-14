require('dotenv').config();
const {
	Activity,
	ActivityType,
	ApplicationCommandType,
	Client,
	Collection,
	DiscordAPIError,
	GatewayIntentBits,
	IntentsBitField,
	Partials,
	WebhookClient,
 } = require('discord.js')

const fs = require('fs');
const { nrCommand } = require('./src/nrCommand.js');
const { timestamp } = require('./src/timestamp.js');
const ud = require('./src/userData.js')
const vars = require('./config/config.json');
const reactions = require('./src/Reactions.js');
const client = new Client({ 
	intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
      ],
      partials: [Partials.User, Partials.Message, Partials.Reaction],
      allowedMentions: {
        repliedUser: false,
      },
      restRequestTimeout: 20000,
    });
	module.exports = {
		/**
		 * @param {Client} client
		 */
	}

client.on('error', (err) => console.error(timestamp() + ' - Discord client caught an error: ', err)); //display client errors to console
process.on('unhandledRejection', (err) => console.error(timestamp() + ' - Unhandled Rejection.', err));
process.on('uncaughtException',  (err) => console.error(timestamp() + ' - Uncaught Exception.', err));
process.on('uncaughtExceptionMonitor', (err) => console.error(timestamp() + ' - Uncaught Exception Monitor.', err));

client.once('ready', () => {
	console.log(`${timestamp()} - Logged in as ${client.user.tag}!`)
	client.user.setActivity('!nrHelp || NerdRevolt', { type: ActivityType.Watching }) //Watching !nrHelp || NerdRevolt.
	console.log(`${timestamp()} - Client activity set to '${client.user.presence.activities[0].name}'`);
	ud.checkUsers(client)//check for users that should be removed from userData
});

client.on('guildMemberAdd', (member) => { //add newly joined members to the new user role
	let Bot = member.user.bot;
	if(!Bot){ //if new user isn't a bot then give the newUser role and add to the userData.json
		member.roles.add(vars.roleNewUser)    //id for "New User' role on server
			.then(console.log(timestamp() + " - " + member.user.username+" has joined "+ member.guild.name + " with the New User role!"))
			.then(ud.storeNewUser(member.user.id, member.user.username))
			.catch(err => console.error(timestamp() + ` - Something bad happended: ${err}`))
	//		*/		
	}
});

client.on('guildMemberRemove', (member) => { // member left server
	ud.deleteUser(member.id); //if the member leaving is in my userData.json, I don't want them there anymore.
	console.log(`${timestamp()} - ${member.displayName} has left the server.`)
});

client.on('messageReactionAdd', async (reaction, user) =>{
	//when a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error(timestamp() + ' - Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	// Now the message has been cached and is fully available.  Now we can see what message it was and respond appropriately
	var _MEMBER = reaction.message.guild.members.fetch(user.id)
	switch(reaction.message.id){
		case vars.ruleMSG:
			_MEMBER.then(function(member){
				reactions.rulesAdd(reaction, member, user);
			})
		break;
		case vars.langMSG:
			_MEMBER.then(function(member){
				reactions.langAdd(reaction, member, user);
			})
		break;
		case vars.osMSG:
			_MEMBER.then(function(member){
				reactions.osAdd(reaction, member, user);
			})
		break;
		case vars.genRoles:
			_MEMBER.then(function(member){
				reactions.generalAdd(reaction, member, user);
			})
		break;
	}
	
});

client.on('messageReactionRemove', async (reaction, user) =>{
	//when a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error(timestamp() + ' - Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	// Now the message has been cached and is fully available.  Now we can see what message it was and respond appropriately
	var _MEMBER = reaction.message.guild.members.fetch(user.id)
	switch(reaction.message.id){
		case vars.langMSG:
			_MEMBER.then(function(member){
				reactions.langRemove(reaction, member, user);
			})
		break;
		case vars.osMSG:
			_MEMBER.then(function(member){
				reactions.osRemove(reaction, member, user);
			})
		break;
		case vars.genRoles:
			_MEMBER.then(function(member){
				reactions.generalRemove(reaction, member, user);
			})
		break;
	}
	
});

//Listen for commands that start with !nr and respond accordingly.
client.on('messageCreate', function(message){
	if (message.content.substring(0,3)=="!nr"){ //check if the message is a NerdBot command
		nrCommand(message, client)
	}
});

//slash interactions
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const {commandName} = interaction;

	if (commandName === 'ping'){
		await interaction.reply('pong')
	} else if (commandName === 'server'){
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user'){
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	}
});


client.login(process.env.CLIENT_TOKEN);
