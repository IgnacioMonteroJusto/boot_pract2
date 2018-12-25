pragma solidity ^0.4.25;

contract Campaign {

    struct Request {
        string description;
        uint amount;
        address recipient;
        bool complete;
        mapping(address => bool) aprovals;
        uint approvalsCount;
    }

    address public manager;
    uint minContribution;
    mapping( address => uint) approvers;
    Request[] public requests;

    modifier restrictManager(){
        require(msg.sender == manager);

        _;
    }

    constructor () public {
        manager = msg.sender;
        minContribution = 0.5 ether;
    }

    function contribute() public payable {
        require(msg.value > minContribution);

        if(approvers[msg.sender] != 0){
            approvers[msg.sender] += msg.value;
        } else{
            approvers[msg.sender] = msg.value;
        }

    }

    //only called by manager
    function createRequest(string _desc, uint _amount, address _recipient) public restrictManager{
        require(msg.sender == manager);

        Request memory newRequest = Request({
            description: _desc,
            amount: _amount,
            recipient: _recipient,
            complete: false,
            //aprovals declalarlo vacío al inicio
            approvalsCount: 0
            });


        requests.push(newRequest);
    }

    //accesible por los approvers
    function approveRequest(uint _indexRequest, string _vote) public {

        bool vote = true;
        if(keccak256(_vote) == keccak256("no")){
            vote = false;
        }
        requests[_indexRequest].approvalsCount++;
        requests[_indexRequest].aprovals[msg.sender] = vote;
    }

    //only called by manager
    function finalizeRequest(uint _index) public payable restrictManager {


        requests[_index].recipient.transfer(address(this).balance);
    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }


}