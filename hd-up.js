module.exports = function (RED) {
    function HdUp(config) {
        RED.nodes.createNode(this, config);
        this.publishInterval=config.publishInterval
        var node = this;
        var intervalStarted = false;
        var id = setInterval(()=>sendBuffer(node),node.publishInterval*1000);
        console.log(node.publishInterval)
        node.on('input', function (msg) {
            
            addToBuffer(msg.payload);
        });
    }
    RED.nodes.registerType("hd-up", HdUp);
}

var gtsNames=[]
var datas = []

function addToBuffer(payload) {
    
    let id = -1
    
    for (let gtsId in gtsNames) {
        if (gtsNames[gtsId]==payload.name){
            id=gtsId
        }
    }
    
    if (id==-1){
        gtsNames.push(payload.name)
        id=gtsNames.length-1
    }
    if (payload.type=='boolean') {
        var data = [Number(id), Date.now()*1000,Boolean(payload.value)]
    } else if(payload.type=='integer') {
        var data = [Number(id), Date.now()*1000,Number(payload.value)]
    } else if(payload.type=='real') {
        if (payload.value % 1 === 0) {
            var data = [Number(id), Date.now()*1000,Number(payload.value)+0.1]
        } else {
            var data = [Number(id), Date.now()*1000,Number(payload.value)]
        }
            
    } else if(payload.type=='string') {
        var data = [Number(id), Date.now()*1000,String(payload.value)]
    }
    
    datas.push(data)
    
    return datas
}

function sendBuffer(node) {
    let msg = {}
    msg.payload={
        version:'1.0',
        protocol:'hdmp',
        gtsNames:gtsNames,
        datas:datas
    }
    if(datas.length>0){
        node.send(msg)
        gtsNames=[]
        datas = []
    }
}