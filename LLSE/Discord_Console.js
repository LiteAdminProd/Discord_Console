wsc = new WSClient()
conf = new IniConfigFile('./Discord_Console/config.ini')

const prefix = conf.getStr('main','prefix')
const token_key = conf.getStr('main','token_key')

wsc.connect('ws://127.0.0.1:9090/')

function token_gen(){
    conf.set('main','token_key',system.randomGuid())
    colorLog('yellow','token_key was change sucsessful')
}


mc.regConsoleCmd("wscreload", "reconnect to socket server",function(){
    wsc.close()
    wsc.connect('ws://127.0.0.1:9090/')
})
mc.regConsoleCmd("tknreload", "regenerate a token",function(){
    token_gen()
})


mc.listen("onServerStarted", function(pl,msg){
    token_gen()
})


mc.listen("onChat", function(pl,msg){
    if(msg.includes('@everyone') || msg.includes('@here')){
        pl.crash()
    }
    else{
        wsc.send('chat' + prefix + '<' + pl.realName + '> ' + msg)
    }

})

mc.listen("onJoin", function(pl){
    wsc.send('join' + prefix + 'Player connected ' + pl.realName)
})
mc.listen("onLeft", function(pl){
    wsc.send('left' + prefix + 'Player left ' + pl.realName)
})

wsc.listen("onTextReceived",function(msg){
	if(msg == 'connected'){
        log('Success!')
    }
	if (msg.startsWith(prefix)){
        if(msg.split(prefix,3)[2] == token_key){
            var result = mc.runcmdEx(msg.split(prefix,3)[1]);
            wsc.send('output' + prefix + result.output)
        }
        
    }
    if (msg.startsWith('broad' + prefix)){
		mc.broadcast(msg.split(prefix,2)[1])
    }
})

wsc.listen("onLostConnection",function(code){
    wsc.connect('ws://127.0.0.1:9090/')
})


setInterval(function(){
    token_gen()
},300000)



