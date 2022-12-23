//directory of admin commands
const { timestamp } = require('../timestamp.js');

module.exports.nrDelete = require('./Admin/nrDelete.js').del //message, number
module.exports.nrParrot = require('./Admin/nrParrot.js').parrot //channel, message

module.exports.nrPromote = nrPromote
const promote = require('./Admin/promote.js')

function nrPromote(command, message, channel, role){
    switch(command){
        case 'display':
            promote.display(channel);
        break;
        case 'edit':
            promote.editRoles(message, channel, role);
        break;
        default:console.error(`${timestamp()} - nrPromote invalid command: ${command}`);break;
    }
}