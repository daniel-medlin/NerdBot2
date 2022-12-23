const vars = require('../../../config/config.json');
const { EmbedBuilder } = require('discord.js')
const { timestamp } = require('../../timestamp.js');

module.exports.editRoles = function (message,role){
  var role = role.toLowerCase();
  var user = message.author
  var chan = message.channel;
  var uid = user.id;
  if (role == 'noselect'){ //no role selected
    displayOptions(chan, message);
  } else {
    if (roleCheck(role)){ //check if valid role
      executeRoleChange(chan, message, role);
    } else displayOptions(chan, message);
  }
}

function displayOptions(channel, message){
  let member = message.member
  //let roles = member.roles.map(r => `${r.name}`) //creates an array of roles the user is a member of
  let roles = member.roles.cache.map(r => `${r.name}`);

  let optionsEmbed = new EmbedBuilder()
    .setTitle("__**USER ASSIGNED ROLES**__\n\n\n")
    .setDescription("Add your remove yourself from the roles listed in the **Available Roles** section below.\n\n\
      Usage:\n\
      !nrRole [role]")
    .setColor(vars.embedColor)
    .setThumbnail(vars.NRicon)
    .addFields(
      {name: '\u200b', value: "__**Currently Assigned Roles for user: " + message.author.username + "**__"},
    )
  //list user roles
  var count = 1;
  var fieldVal = "";
  for(let i=0;i<roles.length;i++){
    if (roles[i] != '@everyone'){
      if (roles.length>3){
        if (count == 3){
          fieldVal = fieldVal + roles[i]
          optionsEmbed.addFields({name: "\u200b", value: fieldVal});
          count = 1
          fieldVal = ""
        } else {
          fieldVal = fieldVal + roles[i] + ", "
          count++
        }
      } else {
        optionsEmbed.addFields({ name: "\u200b", value: roles[i] })
      }
      if(i==(roles.length-2)){//end of the loop
        if (fieldVal != ""){//check if we still have data to display
          optionsEmbed.addFields({name: "\u200b", value: fieldVal.slice(0, -2)}); //trim the ", " from the end.
        }
      }
    }
  }
  optionsEmbed
  .addFields(
    { name: '\u200b', value: '\u200b'},
    { name: '\u200b', value: '__**Available Roles**__'},
    { name: '\u200b', value: 'Batch, C, Go' },
    { name: '\u200b', value: 'Java, Python, VB' },
    { name: '\u200b', value: 'WebDev, Challenge, Windows' },
    { name: '\u200b', value: 'Linux, Apple, Android' },
    { name: '\u200b', value: 'Gaming, Tech, Music' },
  )
  channel.send({embeds: [optionsEmbed]})
    .then(msg => setTimeout(function(){msg.delete()}, 1000*30))//display message for 30 seconds then delete
    .catch(err => console.error(`${timestamp()} - Role Options message failed to send: ${err}`));
}

function roleCheck(role){
  const validRoles = ["batch", "c", "go", "java", "python", "vb", "webdev", "challenge", "windows", "linux", "apple", "android", "gaming", "tech", "music"]
  if (validRoles.includes(role)){
    return true;
  } else return false;
}

function executeRoleChange(channel, message, role){
  var userRole
  let member = message.member
  let roles = member.roles.cache.map(r => `${r.name}`); //creates an array of roles the user is a member of
  switch(role){ 
    case 'batch': userRole = 'Batch';rid=vars.batch;break;
    case 'c': userRole = 'C Language';rid=vars.cLang;break;
    case 'go': userRole = 'Go';rid=vars.go;break;
    case 'java': userRole = 'Java';rid=vars.java;break;
    case 'python': userRole = 'Python';rid=vars.java;break;
    case 'vb': userRole = 'VB';rid=vars.vb;break;
    case 'webdev': userRole = 'WebDev';rid=vars.webdev;break;
    case 'challenge': userRole = 'Challenge';rid=vars.challenge;break;
    case 'windows': userRole = 'Windows';rid=vars.windowsOS;break;
    case 'linux': userRole = 'Linux';rid=vars.linuxOS;break;
    case 'apple': userRole = 'Apple';rid=vars.appleOS;break;
    case 'android': userRole = 'Android';rid=vars.androidOS;break;
    case 'gaming': userRole = 'Gaming';rid=vars.gaming;break;
    case 'tech': userRole = 'Tech';rid=vars.tech;break;
    case 'music': userRole = 'Music';rid=vars.music;break;
  }
  //var newRole = message.guild.roles.cache.get(role => role.name === userRole)
  if (roles.includes(userRole)){
    member.roles.remove(rid)//remove role from user
      .catch(err => console.error(`${timestamp()} - Failed to remove ${message.author} from ${userRole}: ${err}`));
    channel.send(`User: ${message.author} removed from role: **${userRole}**`)
      .then(msg => setTimeout(function(){msg.delete()}, 1000*5))
      .catch(err => console.error(`${timestamp()} - User removed message failed to send: ${err}`));
  } else {
    member.roles.add(rid)
      .catch(err => console.error(`${timestamp()} - Failed to add ${message.author} to ${userRole}: ${err}`));
    //add role to user
    channel.send(`User: ${message.author} added to role: **${userRole}**`)
    .then(msg => setTimeout(function(){msg.delete()}, 1000*5))
      .catch(err => console.error(`${timestamp()} - User added message failed to send: ${err}`));
  }
}