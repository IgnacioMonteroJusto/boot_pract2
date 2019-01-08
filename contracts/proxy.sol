pragma solidity ^0.4.25;

contract Proxy {
    address public addressProxy;

    constructor (address _address) public {
        addressProxy = _address;
    }

    function proxyAddress() public view returns(address){
        return addressProxy;
    }

    function setProxyAddress(address _newAddress) public restrictManager {
        addressProxy = _newAddress;
    }
}
