// Variables

var ip, mask, subnets, newMask, subnetBits;
var fullMask = [255, 255, 255, 255];
var arrMask = [];
var networkHop = [];
var arrIP = [];

var auxSubnet, auxNetwork, auxFirstIP, auxLastIP, auxBroadcast, auxMask;

const table = document.querySelector('#flsmTableBody');

// Main Function

function executeFLSM(){
    retrieveData();
    subnetBits = calcSubnetBits(subnets);
    newMask = calcNewMask(mask, subnetBits);
    calcMaskArr(newMask);
    calcNetworkHop();
    ipToArr(ip);
    auxSubnet = 1;
    auxNetwork = arrIP;
    auxFirstIP = calcIpPlusOne(auxNetwork);
    auxBroadcast = calcBroadcast(auxNetwork, networkHop);
    auxLastIP = calcIpMinusOne(auxBroadcast);
    auxMask = arrMask;
    table.appendChild(createTableRow());
    for (let i = 2; i <= subnets; i++){
        auxSubnet = i;
        auxNetwork = calcIpPlusOne(auxBroadcast);
        auxFirstIP = calcIpPlusOne(auxNetwork);
        auxBroadcast = calcBroadcast(auxNetwork, networkHop);
        auxLastIP = calcIpMinusOne(auxBroadcast);
        auxMask = arrMask;
        table.appendChild(createTableRow());        
    }
}

// Aux Functions

function retrieveData(){
    ip = document.getElementById("ip").value;
    mask = document.getElementById("mask").value;
    subnets = document.getElementById("subnets").value;
}
function calcSubnetBits(subnets){
    var subnetBits = 0;
    while ((2 ** subnetBits) < subnets){
        subnetBits += 1;
    }
    return subnetBits;
}
function calcNewMask(mask, subnetBits){
    newMask = parseInt(mask) + parseInt(subnetBits);
    return newMask;
}
function calcMaskArr(newMask){
    var binMaskStr = "";
    var subStr1 = "";
    var subStr2 = "";
    var subStr3 = "";
    var subStr4 = "";

    for (let i = 1; i < 33; i++){
        if (i <= newMask){
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
function calcNetworkHop(){
    var aux;
    for (let i = 0; i < 4; i++){
        aux = (fullMask[i] - arrMask[i]);
        networkHop.push(aux);
    }
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