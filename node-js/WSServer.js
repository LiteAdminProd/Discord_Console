var fs = require('fs')
ini = require('ini')

var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

const prefix = config.prefix 
const hook_url = config.discord_hook 
const bot_token = config.bot_token 
const adminid = config.adminid 
const chatid = config.chatid

const join_mes = 'Player join:'
const left_mes = 'Player left:'

const WebSocket = require('ws')
const { Webhook } = require('discord-webhook-node');
const chat = new Webhook(hook_url)

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES] });

let port= 9090;

command = ''

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const wss = new WebSocket.Server({port:port})
console.log('Ready')

function getmsg(res){
	let msg = ''
	for(let i = 1; i < res.split(':').length; i++){
		msg += res.split(':')[i] + ' '
	}
	return msg
}

wss.on('connection', socket => {
	console.log('Connected')
    socket.send('connected')
	setInterval(() => {
		if(command != ' '){
			socket.send(command)
			command = ' '
		}
	}, 100);
	socket.on('message', packet => {
		res = String(packet)
		if(res.startsWith('chat:')){
			chat.send('<' + res.split(':')[1] + '> ' + res.split(':')[2]);
		}
		if(res.startsWith('output:')){
			chat.send('response:\n' + getmsg(res));
		}
		if(res.startsWith('join:')){
			chat.send(join_mes + ' ' + getmsg(res));
		}
		if(res.startsWith('left:')){
			chat.send(left_mes + ' ' + getmsg(res));
		}
		
    })
})


client.on('messageCreate', (message) => {
	if (message.content.startsWith(prefix) && message.member.roles.cache.some(role => role.id == adminid)) {
		command = 'cmd:' + message.content.replace(prefix, '')
	}
	else if(message.channel.id == chatid){
		if(!message.content.startsWith('<')){
			if(!message.content.startsWith('Player')){
				if(!message.content.startsWith('response')){
					command = 'broad:§9[Discord]§r ' + message.author.username + '> ' + message.content
				}
			}
		}
	}
});


console.log('websocket server listen port is ' + port );

client.login(bot_token);
