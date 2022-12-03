// Variables

var counter = 1;
var ip, mask, hostBits;
var auxSubnet, auxRequired, auxAllocated, auxNetwork, auxFirstIP, auxLastIP, auxBroadcast, auxMask;
var fullMask = [255, 255, 255, 255];
var arrIP = [];
var arrMask = [];
var vlsmArr = [];
var hop = [];

const table = document.querySelector('#vlsmTableBody');
const form = document.querySelector('#formVLSM');

// Main Functions

function executeAddInput(){
    form.appendChild(createInput());
}
function executeVLSM(){
    retrieveData();
    ipToArr(ip);
    auxSubnet = 1;
    auxRequired = vlsmArr[0];
    hostBits = calcHostBits(auxRequired);
    auxAllocated = ((2**hostBits) - 2);
    auxNetwork = arrIP;
    auxFirstIP = calcIpPlusOne(auxNetwork);
    mask = calcMask(hostBits);
    calcMaskArr(mask);
    auxMask = arrMask;
    hop = calcNetworkHop(auxMask);
    auxBroadcast = calcBroadcast(auxNetwork, hop);
    auxLastIP = calcIpMinusOne(auxBroadcast);
    table.appendChild(createTableRow());

    for (let i = 1; i < counter; i++){
        auxSubnet = i + 1;
        auxRequired = vlsmArr[i];
        hostBits = calcHostBits(auxRequired);
        auxAllocated = ((2**hostBits) - 2);
        auxNetwork = calcIpPlusOne(auxBroadcast);
        auxFirstIP = calcIpPlusOne(auxNetwork);
        mask = calcMask(hostBits);
        arrMask = [];
        calcMaskArr(mask);
        auxMask = arrMask;
        hop = calcNetworkHop(auxMask);        
        auxBroadcast = calcBroadcast(auxNetwork, hop);
        auxLastIP = calcIpMinusOne(auxBroadcast);
        table.appendChild(createTableRow());
    }
}

// Aux Functions

function retrieveData(){
    ip = document.getElementById("ip").value;
    for (let i = 1; i <= counter; i++){
        var aux;
        var id = `sub${i}`;
        aux = document.getElementById(id).value;
        vlsmArr.push(aux);
        console.log(vlsmArr);
    }
}
function calcHostBits(hosts){
    var hostBits = 0;
    while (((2 ** hostBits) - 2) < hosts){
        hostBits += 1;
    }
    return hostBits;
}
function calcMask(hostBits){
    mask = 32 - parseInt(hostBits);
    return mask;
}
function calcMaskArr(mask){
    var binMaskStr = "";
    var subStr1 = "";
    var subStr2 = "";
    var subStr3 = "";
    var subStr4 = "";

    for (let i = 1; i < 33; i++){
        if (i <= mask){
            binMaskStr += "1";
        }
        else{
            binMaskStr += "0";
        }
    }
    subStr1 = binMaskStr.substring(0,8);
    subStr2 = binMaskStr.substring(8,16);
    subStr3 = binMaskStr.substring(16,24);
    subStr4 = binMaskStr.substring(24);
    subStrToInt(subStr1);
    subStrToInt(subStr2);
    subStrToInt(subStr3);
    subStrToInt(subStr4);
}
function subStrToInt(subStr){
    var octet = 0;
    var x = 7
    for (let i = 0; i < 8; i++){
        octet += (parseInt(subStr.charAt(i)) * (2**x));
        x -= 1;
    }
    arrMask.push(octet);
}
function calcNetworkHop(mask){
    var aux;
    var networkHop = [];
    for (let i = 0; i < 4; i++){
        aux = (fullMask[i] - mask[i]);
        networkHop.push(aux);
    }
    return networkHop;
}
function ipToArr(ip){
    var aux;
    arrIP = ip.split(".");
    for (let i = 0; i < arrIP.length; i++){
        aux = arrIP[i];
        arrIP[i] = parseInt(aux);
    }
}
function calcBroadcast(ip, hop){
    var auxOctet, auxIndex;
    var Broadcast = [0, 0, 0, 0];
    for (let i = 3; i >= 0; i--){
        auxOctet = 0;
        auxOctet += (ip[i] + hop[i]);
        if (auxOctet <= 255){
            Broadcast[i] += auxOctet;
        }
        else {
            auxIndex = (i - 1);
            Broadcast[i] += 255;
            Broadcast[auxIndex] += (auxOctet - 255);
        }
    }
    return Broadcast;
}
function calcIpPlusOne(ip){
    var auxOctet, auxIndex;
    var auxArr = [0, 0, 0, 1];
    var IpPlusOne = [0, 0, 0, 0];
    for (let i = 3; i >= 0; i--){
        auxOctet = 0;
        auxOctet += (ip[i] + auxArr[i]);
        if (auxOctet <= 255){
            IpPlusOne[i] += auxOctet;
        }
        else {
            auxIndex = (i - 1);
            IpPlusOne[i] += 0;
            IpPlusOne[auxIndex] += (auxOctet - 255);
        }
    }
    return IpPlusOne;
}
function calcIpMinusOne(ip){
    var auxOctet;
    var IpMinusOne = [0, 0, 0, 0];
    if (ip[3] > 0){
        auxOctet = (ip[3] - 1);
        IpMinusOne[3] = auxOctet;
        IpMinusOne[2] = ip[2];
        IpMinusOne[1] = ip[1];
        IpMinusOne[0] = ip[0];
    }
    else {
        auxOctet = 255;
        IpMinusOne[3] = auxOctet;
        if (ip[2] > 0){
            auxOctet = (ip[2] - 1);
            IpMinusOne[2] = auxOctet;
            IpMinusOne[1] = ip[1];
            IpMinusOne[0] = ip[0];
        }
        else {
            auxOctet = 255;
            IpMinusOne[2] = auxOctet;
            if (ip[1] > 0){
                auxOctet = (ip[1] - 1);
                IpMinusOne[1] = auxOctet;
                IpMinusOne[0] = ip[0];
            }
            else {
                auxOctet = 255;
                IpMinusOne[1] = auxOctet;
                if (ip[0] > 0){
                    auxOctet = (ip[0] - 1);
                    IpMinusOne[0] = auxOctet;
                }
                else {
                    auxOctet = 255;
                    IpMinusOne[0] = auxOctet;
                }
            }
        }
    }
    return IpMinusOne;
}
function createTableRow(){
    var tr = document.createElement('tr');
    tr.appendChild(createTD(auxSubnet));
    tr.appendChild(createTD(auxRequired));
    tr.appendChild(createTD(auxAllocated));
    tr.appendChild(createTD(auxNetwork.join('.')));
    tr.appendChild(createTD(auxFirstIP.join('.')));
    tr.appendChild(createTD(auxLastIP.join('.')));
    tr.appendChild(createTD(auxBroadcast.join('.')));
    tr.appendChild(createTD(auxMask.join('.')));
    return tr;
}
function createTD(data){
    var td = document.createElement("td");
    td.textContent = data;
    return td;
}
function createInput(){
    counter += 1;
    var id = `sub${counter}`;
    var input = document.createElement("input");
    input.setAttribute("id", id);
    input.setAttribute("name", id);
    input.setAttribute("type", "number");
    input.setAttribute("class", "vlsmInput");
    return input;
}