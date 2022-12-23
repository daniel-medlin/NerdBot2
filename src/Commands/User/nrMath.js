const vars = require('../../../config/config.json');
const { EmbedBuilder } = require('discord.js');
const { timestamp } = require('../../timestamp.js');

module.exports.mathGif = mathGif;

function mathGif(cmd, uid, channel){ //cmd is the array of arguments from the !nrmath command
  var choice;
  var optionMessage;
  if (cmd[1] == null || isNaN(cmd[1])){ choice = 0 } else choice = cmd[1]; //set the choice to the argument or 0 if nothing is present.

  if (choice < 1 || choice > 21){ //if the argument is between 1 and 21 then return a gif otherwise return the options.
    channel.send({embeds: [displayOptions()] }) //build the options embed and display it..
      .then(msg => {optionMessage = msg; setTimeout(function(){msg.delete()}, 1000 * 20)})
      .catch(err => console.error(`${timestamp()} - MathGif options failed to send: ${err}`));

    let filter = m => !m.author.bot && m.author.id === uid;
    let collector = channel.createMessageCollector({filter, time: 1000 * 20 }); //listen for a response

    collector.on('collect', response => {
      if (parseInt(response) > 0 && parseInt(response) < 22){
        optionMessage.delete().catch(err => console.error(`${timestamp()} - Failed to delete mathGif options.  Is it already gone?: ${err}`));
        channel.send(selection(parseInt(response)))
          .catch(err => console.error(`${timestamp()} - MathGif failed to send: ${err}`));
        collector.stop();
        response.delete().catch(err => console.error(`${timestamp()} - Failed to delete mathGif response: ${err}`));
      } else if ((response.content).toLowerCase() == "cancel"){
        channel.send("Canceling request..")
          .then(msg => setTimeout(function(){msg.delete()}, 1000*3))
          .catch(err => console.error(`${timestamp()} - Cancel message failed to send: ${err}`));
        collector.stop();
        response.delete().catch(err => console.error(`${timestamp()} - Failed to delete response: ${err}`));
        optionMessage.delete().catch(err => console.error(`${timestamp()} - Failed to delete mathGif options.  Is it already gone?: ${err}`));
      } else {
        response.delete().catch(err => console.error(`${timestamp()} - Failed to delete response: ${err}`));
        channel.send("Invalid selection! Canceling request.")
				.then(msg => setTimeout(function(){msg.delete()}, 1000*5))
				.catch(err => console.error(`${timestamp()} - Cancel message failed to send: ${err}`));
      }
    });
    //collector.on('end', collected => console.log(`Collected ${collected.size} items from mathGif.js`));
  } else {
    channel.send(selection(parseInt(choice))) //user submitted a valid selection with the !nrMath command.
      .then(msg => setTimeout(function(){msg.delete()}, 1000*60))
      .catch(err => console.error(`${timestamp()} - MathGif failed to send: ${err}`));
  }

}

function selection(MathNum){
    var giffyBois = [ "http://i.imgur.com/QjI3a5N.gif","http://i.imgur.com/UM4iYce.gif","http://i.imgur.com/ptJ6Ph6.gif",
    "http://i.imgur.com/sYgj4HS.gif","http://i.imgur.com/16Afrj1.gif","http://i.imgur.com/O9W3KCz.gif","http://i.imgur.com/bZDfWVr.gif",
    "http://i.imgur.com/vVcc2OP.gif","http://i.imgur.com/AQUrYb1.gif","http://i.imgur.com/WheKCzG.gif","http://i.imgur.com/cBzeLOo.gif",
    "http://i.imgur.com/ZJ7H3Zw.gif","http://i.imgur.com/7sNvJ9c.gif","http://i.imgur.com/SEDLpsd.gif","http://i.imgur.com/wEbNVxU.gif",
    "http://i.imgur.com/WrdyKdG.gif","http://i.imgur.com/YCnwxZJ.gif","http://i.imgur.com/S7FJlZi.gif","http://i.imgur.com/kmh3hR5.gif",
    "http://i.imgur.com/bsIyErA.gif","http://i.imgur.com/Dc1OkwU.gif"

    ]

    return giffyBois[MathNum-1];
}

function displayOptions(){
    const optionsEmbed = new EmbedBuilder()
        .setTitle('__**Math GIFS**__')
        .setColor(vars.embedColor)
        .setThumbnail(vars.NRicon)
        .addFields(
          { name: 'Available Options', value: '\u200b' },
          { name: '\u200b', value: "\
            **1**:  How to draw an ellipse. \n\n\
            **2**:  Solving pascal triangles. \n\n\
            **3**:  Using FOIL to multiply binomials. \n\n\
            **4**:  How to solve logarithms. \n\n\
            **5**:  Matrix transpositions. \n\n\
            **6**:  What the Pythagorean Theorem is really trying to show you. \n\n\
            **7**:  Exterior angles of polygons will ALWAYS add up to 360 degrees. \n\n\
            **8**:  Visualization of Pi. \n\n\
            **9**:  Radians.\n\n\
            **10**:  Visualizing sine (red) on the Y axis and cosine (blue) on the X axis. The relative position of the circle is shown in black."
          },
          {name: '\u200b', value:"\
            **11**:  Same as 10, 2d.\n\n\
            **12**:  SIN and COS for triangles.\n\n\
            **13**:  COS is derivative of SIN.\n\n\
            **14**:  Tangent lines\n\n\
            **15**:  Tangent lines (side view)\n\n\
            **16**:  Cartesian to polar coords.\n\n\
            **17**:  Draw a parabola.\n\n\
            **18**:  Riemann sum is ~ area of a curve.\n\n\
            **19**:  Hyperbola\n\n\
            **20**:  3d Hyperbola - Made with straight lines.\n\n\
            **21**:  Hyperbola video."
          },
          { name: '\u200b', value: '\u200b'},
          { name: 'To make a selection, just type a number into the chat and the bot will display your GIF', value: 'You will have 20 seconds to make a selection.'}
        );
        return(optionsEmbed);
}

