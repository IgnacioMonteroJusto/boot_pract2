pragma solidity ^0.4.25;

contract Campaign {

    event VoteLog(address wallet, bool vote);

    struct Request {
        string description;
        uint amount;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalsCount;
    }

    address public manager;
    uint minContribution;
    uint public numApprovers;
    mapping( address => uint) approvers;
    mapping( address => bool) approversVoted;

    //Request[] public requests;
    uint numRequest;
    mapping( uint => Request ) public requests;

    modifier restrictManager(){
        require(msg.sender == manager);

        _;
    }

    modifier restrictApprover(){
        require(approvers[msg.sender] != 0);

        _;
    }

    constructor () public {
        manager = msg.sender;
        minContribution = 0.5 ether;
        numRequest = 0;
    }

    function contribute() public payable {
        require(msg.value > minContribution);

        if(approvers[msg.sender] != 0){
            approvers[msg.sender] += msg.value;
        } else{
            approvers[msg.sender] = msg.value;
        }
        approversVoted[msg.sender] = false;
        numApprovers++;
    }

    //only called by manager
    function createRequest(string _desc, uint _amount, address _recipient) public restrictManager{
        require(msg.sender == manager);

        Request memory newRequest = Request({
            description: _desc,
            amount: _amount,
            recipient: _recipient,
            complete: false,
            //approvals: (_recipient, false),//aprovals declalarlo vacío al inicio
            approvalsCount: 0
            });

        requests[numRequest] = newRequest;
        //requests[numRequest].approvals[_recipient] = false;
        numRequest++;

    }

    //accesible por los approvers
    function approveRequest(uint _indexRequest, string _vote) public restrictApprover{

        require(approversVoted[msg.sender] == true, 'User has already voted');

        bool vote = true;
        if(keccak256(_vote) == keccak256("no")){
            vote = false;
        }

        requests[_indexRequest].approvals[msg.sender] = vote;
        if(vote)requests[_indexRequest].approvalsCount++;

        uint possitiveVotes = numApprovers - requests[_indexRequest].approvalsCount;

        if(possitiveVotes > numApprovers / 2){
            requests[_indexRequest].complete = true;
        }

        approversVoted[msg.sender] = true;
        emit VoteLog(msg.sender, vote);
    }

    //only called by manager
    function finalizeRequest(uint _index) public payable restrictManager {
        require(address(this).balance >= requests[_index].amount, 'Not enough founds.');

        if(requests[_index].complete){

            requests[_index].recipient.transfer(requests[_index].amount);
        }

    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }

    function getNumRequest()public view returns (uint){
        return numRequest;
    }

}