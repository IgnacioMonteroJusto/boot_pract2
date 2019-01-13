pragma solidity ^0.4.25;

//import "proxy.sol";

contract ERC20Interface {
    // Send _value amount of tokens to address _to
    function transfer(address _to, uint256 _value) public returns (bool success);
    // Get the account balance of another account with address _owner
    function balanceOf(address _owner) public constant returns (uint256 balance);
}

contract Campaign {

    event VoteLog(address wallet, bool vote);

    event PaymentLog(address from, address to, uint value);

    struct votedRequest{
        address voter;
        uint request_id;
    }
    struct Request {
        string description;
        uint amount;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalsCount;
    }

    uint private reward = 50;
    //ERC20Interface nachoToken = ERC20Interface(0x313300d64372c4bf94466508770D1d8195277690);
    ERC20Interface nachoToken;
    //address public nachoToken = 0x313300d64372c4bf94466508770D1d8195277690;//Natoken
    address public manager;
    uint minContribution;
    uint public numApprovers;
    mapping( address => uint) approvers;
    mapping( address => bool) approversVoted;

    //Request[] public requests;
    uint numRequest;
    mapping( uint => Request ) public requests;
    votedRequest[] public voter;

    modifier restrictManager(){
        require(msg.sender == manager);

        _;
    }

    modifier restrictApprover(){
        require(approvers[msg.sender] != 0);

        _;
    }

    constructor (address _nachotoken) public {
        manager = msg.sender;
        minContribution = 0.5 ether;
        numRequest = 0;
        nachoToken = ERC20Interface(_nachotoken);
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
    function createRequest(string _desc, uint _amount, address _recipient) public {

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
    function approveRequest(uint _indexRequest, bool _vote) public restrictApprover{

        require(approversVoted[msg.sender] == true, 'User has already voted');

        requests[_indexRequest].approvals[msg.sender] = _vote;
        if(_vote){
            requests[_indexRequest].approvalsCount++;
            voter.push(votedRequest({
                voter: msg.sender,
                request_id: _indexRequest
            }));
        }

        uint possitiveVotes = numApprovers - requests[_indexRequest].approvalsCount;

        if(possitiveVotes > numApprovers / 2){
            requests[_indexRequest].complete = true;
        }

        approversVoted[msg.sender] = true;
        emit VoteLog(msg.sender, _vote);
    }

    //only called by manager
    function finalizeRequest(uint _index) public payable restrictManager {
        require(address(this).balance >= requests[_index].amount, 'Not enough founds.');

        if(requests[_index].complete){

            requests[_index].recipient.transfer(requests[_index].amount);

            payTokens(_index);
            requests[_index].approvalsCount = 0;
            delete voter;
        }

    }

    function payTokens(uint _indexRequest) internal  returns (bool){

        //loop array and pay tokens
        for(uint i = 0; i<= voter.length; i++){
            if(voter[i].request_id == _indexRequest && requests[_indexRequest].approvals[voter[i].voter] == true){
                payTokensTo(voter[i].voter);
            }
        }
        return true;
    }

    function payTokensTo(address _to) internal returns (bool){

        /*
        El contrato nachoTOken tiene que tener fondos para poder transferir tokens.
        Los tokens, se transfieren al manager a la hora de crear el contrato, con lo que
        el manager tendría que pasar los tokens al contrato nachoTokens para que sea este quien transfiera el dinero
        de la recompensas.
        */
        nachoToken.transfer(_to, reward);
        return true;
    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }

    function getNumRequest()public view returns (uint){
        return numRequest;
    }

    function getTokenAddress()public view returns (address){
        return nachoToken;
    }
}