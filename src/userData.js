const vars = require('../config/config.json')
const fs = require('fs');
const fileName = 'data/userdata.json';
const { timestamp } = require('./timestamp.js');

exports.deleteUser = deleteUser;


exports.storeNewUser = function storeNewUser(uid, uname){ //Write users to .json
	let thisUserData = {uid: uid, uname: uname, joined: new Date()};
	let jsonStr = fs.readFileSync(fileName); //read in the json data
	let obj = JSON.parse(jsonStr); //parsed the json string for reading.
	let users = obj.users;
	let found = false;

	for (let i=0;i<users.length;i++){
		if (uid == users[i].uid){
			found = true;
		}
	}
	if (!found){
		obj['users'].push(thisUserData); //adds new users to the users object in obj
		jsonStr = JSON.stringify(obj); //converts my json string back to the correct format for writing.
		fs.writeFileSync(fileName,jsonStr, function(err) {
			if (err) {
				console.error(timestamp() + " - " +err);
			}
		}); //write the new json file
	}
}

function deleteUser(uid){ //remove users from .json
	let jsonData = fs.readFileSync(fileName)
	let users = JSON.parse(jsonData).users;
	
	for (let i=0;i<users.length;i++){
		if (uid == users[i].uid){
			users.splice(i,1);
			jsonData = JSON.stringify({"users":users});
			fs.writeFileSync(fileName, jsonData, function(err) {
				if (err) {
					console.error(timestamp() + " - " +err);
				}
			});
		}
	}

}
exports.checkUsers = function checkUsers(client){ //hourly, check members of the new users group.  Compare that list of users to the users we have in the .json file.  Anyone older than 24 hours kick
	setInterval(function(){
		console.log("Checking for expired users - " + Date());
		let now = new Date();
		var jsonData = fs.readFileSync(fileName)
		var users = JSON.parse(jsonData).users;
		var nRevolt = client.guilds.cache.get(vars.guildID);
		nRevolt.members.fetch()
		.then(nRevolt.roles.fetch(vars.roleNewUser))
		.catch(err => console.error(`${timestamp()} - Something went wrong when fetching the NewUser role: ${err}`));
		let roleMembers = nRevolt.roles.cache.get(vars.roleNewUser).members.map(m=>m.user.id); //get members of the new user role

		for (let a=0;a<roleMembers.length;a++){ //loop through members of the new user role
			for (let i=0;i<users.length;i++){ //loop through members of the .json file
				var uid = users[i].uid;
				var name = users[i].uname;
				var join = new Date(users[i].joined);
				if (uid == roleMembers[a]){
					let diffDay = (Math.abs(now.getTime()-join.getTime()))/(1000 * 60 * 60 * 24); //Calculate the difference in days. if >= 1 then kick.
					//let diffMin = (Math.abs(now.getTime()-join.getTime()))/(1000 * 60); //Calculate the difference in min.  useful for testing.
					if (diffDay >= 1){
						
						nRevolt.members.cache.get(uid).kick("Failed to accept rules within 24 hours of joining");
						console.log(name + " has been kicked for inactivity - " + timestamp());
						deleteUser(uid);
					}
				} //No user match
			}
		}
	}, 1000*60*60);//run every hour
	//}, 1000*10);//run every 10 sec for faster testing.
}