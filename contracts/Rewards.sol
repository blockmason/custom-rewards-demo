pragma solidity ^0.5.10;

contract Rewards {
    mapping(string => address) public redeemedRewards;
    address public authority;

    constructor() public {
        authority = msg.sender;
    }

    function redeemReward(string memory reward, address student) public {
        redeemedRewards[reward] = student;
    }
}