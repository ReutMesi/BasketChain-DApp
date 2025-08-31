// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IToken {
    function transferFrom(address from, address to, uint amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
    function transfer(address to, uint amount) external returns (bool);
}

interface INFT {
    function owner() external view returns (address);
    function salaryRequest() external view returns (uint);
    function signed() external view returns (bool);
    function markAsSigned() external;
}

contract TeamManager {
    struct Request {
        string description;
        address nftAddress;
        bool complete;
        uint approvalCount;
        bool approvedByPlayer;
        mapping(address => bool) approvals;
    }

    address public admin;
    IToken public token;

    mapping(address => bool) public boardMembers;
    uint public boardMemberCount;

    Request[] public requests;

    uint public minimumContribution = 0.0000001 ether;

    constructor(address tokenAddress, address creator) {
        admin = creator;
        token = IToken(tokenAddress);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function joinBoard() public payable {
        require(msg.value >= minimumContribution, "Minimum 0.0000001 ETH required");
        require(!boardMembers[msg.sender], "Already on board");

        boardMembers[msg.sender] = true;
        boardMemberCount++;
    }

    function createRequest(string memory description, address nftAddress) public onlyAdmin {
        INFT nft = INFT(nftAddress);
        require(!nft.signed(), "Player already signed");

        Request storage r = requests.push();
        r.description = description;
        r.nftAddress = nftAddress;
    }

    function approveRequest(uint index) public {
        Request storage r = requests[index];
        require(boardMembers[msg.sender], "Not a board member");
        require(!r.approvals[msg.sender], "Already approved");

        r.approvals[msg.sender] = true;
        r.approvalCount++;
    }

    function playerApprove(uint index) public {
        Request storage r = requests[index];
        INFT nft = INFT(r.nftAddress);
        require(msg.sender == nft.owner(), "Only the player can approve");
        require(!r.approvedByPlayer, "Already approved");

        r.approvedByPlayer = true;
    }

    function finalizeRequest(uint index) public onlyAdmin {
        Request storage r = requests[index];
        INFT nft = INFT(r.nftAddress);

        require(!r.complete, "Already finalized");
        require(r.approvedByPlayer, "Player did not approve");
        require(r.approvalCount > boardMemberCount / 2, "Not enough board approvals");

        address player = nft.owner();
        uint salary = nft.salaryRequest();

        require(token.balanceOf(address(this)) >= salary, "Not enough tokens");
        token.transfer(player,salary);
        nft.markAsSigned();
        r.complete = true;
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    function isBoardMember(address addr) public view returns (bool) {
        return boardMembers[addr];
    }

    function getTeamBalances() public view returns (uint etherBalance, uint basketTokenBalance) {
        etherBalance = address(this).balance;
        basketTokenBalance = token.balanceOf(address(this));
    }

    struct RequestView {
        string description;
        address nftAddress;
        bool complete;
        uint approvalCount;
        bool approvedByPlayer;
    }

    function getAllRequests() public view returns (RequestView[] memory) {
        RequestView[] memory result = new RequestView[](requests.length);
        for (uint i = 0; i < requests.length; i++) {
            Request storage r = requests[i];
            result[i] = RequestView({
                description: r.description,
                nftAddress: r.nftAddress,
                complete: r.complete,
                approvalCount: r.approvalCount,
                approvedByPlayer: r.approvedByPlayer
            });
        }
        return result;
    }
}

contract TeamFactory {
    address public tokenAddress;
    address[] public deployedTeams;

    constructor(address _token) {
        tokenAddress = _token;
    }

    function createTeam() public {
        TeamManager newTeam = new TeamManager(tokenAddress, msg.sender);
        deployedTeams.push(address(newTeam));

        uint initialAllocation = 100_000 * 10**18;
        IToken(tokenAddress).transfer(address(newTeam), initialAllocation);
    }

    function getTeams() public view returns (address[] memory) {
        return deployedTeams;
    }
}
