wsc = new WSClient()

wsc.connect('ws://127.0.0.1:9090/')

mc.regConsoleCmd("wscreload", "reconnect to socket server",function(){
    wsc.close()
    wsc.connect('ws://127.0.0.1:9090/')
})

mc.listen("onChat", function(pl,msg){
    if(msg.includes('@everyone') || msg.includes('@here')){
        pl.crash()
    }
    else{
        wsc.send('chat:' + pl.realName + ':' + msg)
    }

})

mc.listen("onJoin", function(pl){
    wsc.send('join:' + pl.realName)
})
mc.listen("onLeft", function(pl){
    wsc.send('left:' + pl.realName)
})

wsc.listen("onTextReceived",function(msg){
	if(msg == 'connected'){
        log('Success!')
    }
	if (msg.startsWith('cmd:')){
        var result = mc.runcmdEx(msg.split(':',2)[1]);
        wsc.send('output:' + result.output)

        
    }
    if (msg.startsWith('broad:')){
		mc.broadcast(msg.split(':',2)[1])
    }
})

wsc.listen("onLostConnection",function(code){
    wsc.connect('ws://127.0.0.1:9090/')
})



