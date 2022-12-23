module.exports.ping = ping;
const { timestamp } = require('../../timestamp.js');


function ping(channel){
	let r = Math.floor(Math.random() * 10)
	var response = ["I'm still here...", "What?!", "I didn't do it!", "...", ":nerd:", "What do you want?", "@Nerdbot isn't here right now, please leave a message after the beep...",
	"Go get your own beer!", "Why did you waste so much time programming these responses?", "Here I am!"];
	channel.send(response[r]).catch(err => console.error(`${timestamp()} - Ping response message failed to send: ${err}`));
}