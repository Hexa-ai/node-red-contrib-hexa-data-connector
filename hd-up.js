module.exports = function (RED) {
    function HdUp(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            if (msg.publish===true){
                sendBuffer(node)
            } else {
                addToBuffer(msg.payload);
            }   
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
        var data = [Number(id), typeof(payload.ts)==='undefined' ? Date.now()*1000 :payload.ts ,Boolean(payload.value)]
    } else if(payload.type=='integer') {
        var data = [Number(id), typeof(payload.ts)==='undefined' ? Date.now()*1000 :payload.ts ,Number(payload.value)]
    } else if(payload.type=='real') {
        if (payload.value % 1 === 0) {
            var data = [Number(id), typeof(payload.ts)==='undefined' ? Date.now()*1000 :payload.ts ,Number(payload.value)+0.001]
        } else {
            var data = [Number(id), typeof(payload.ts)==='undefined' ? Date.now()*1000 :payload.ts ,Number(payload.value)]
        }
            
    } else if(payload.type=='string') {
        var data = [Number(id), typeof(payload.ts)==='undefined' ? Date.now()*1000 :payload.ts ,String(payload.value)]
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