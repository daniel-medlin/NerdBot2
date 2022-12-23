const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { SlashCommandBuilder, Routes } = require('discord.js');
const {REST} = require('@discordjs/rest');
const { clientID, guildID } = require('./config.json');

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    new SlashCommandBuilder().setName('server').setDescription('Replies with info!'),
    new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN)

rest.put(Routes.applicationGuildCommands(clientID, guildID), { body: commands })
    .then((data) => console.log('Successfully registered '+data.length+' application commands.'))
    .catch(console.error);

