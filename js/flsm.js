
var ip = document.querySelector("#ip");
var mask = document.querySelector("#mask");
var subnets = document.querySelector("#subnets");



function calculateSubnetBits(subnets){
    var subnetBits = 0;
    while ((2 ** subnetBits) < subnets){
        subnetBits += 1;
    }
    return subnetBits;
}