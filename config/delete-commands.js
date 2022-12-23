const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { SlashCommandBuilder, Routes } = require('discord.js');
const {REST} = require('@discordjs/rest');
const { clientID, guildID } = require('./config.json');
const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN)

const delCommands = ['1019769296097906759','1019769296097906760']

delCommands.forEach(item => {
rest.delete(Routes.applicationGuildCommand(clientID, guildID, item ))
    .then(() => console.log('Successfully deleted command'))
    .catch(console.error);
});