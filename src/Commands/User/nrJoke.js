const fs = require('fs');
const { timestamp } = require('../../timestamp.js');

module.exports.joke = joke;

function joke(channel){
	let f = './data/jokes.txt'
	fs.readFile(f, "utf-8", (err, buf) => {
		if (err){console.error(`${timestamp()} - There was a problem reading the jokes file: ${err}`)};
		jokes = buf.split(';');
		let j = Math.floor(Math.random() * jokes.length) //random from 0-length of jokes[]
		channel.send(jokes[j])
			.then(msg => setTimeout(function(){msg.delete()}, 1000*10))//display message for 30 seconds then delete
			.catch(err => console.error(`${timestamp()} - Joke message failed to send: ${err}`));
	})
}