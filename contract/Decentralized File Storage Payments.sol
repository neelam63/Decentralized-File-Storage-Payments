// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StoragePayment {
    address public owner;

    struct StorageDeal {
        address provider;
        address client;
        uint256 amount;
        bool paid;
    }

    uint256 public dealCount;
    mapping(uint256 => StorageDeal) public deals;

    constructor() {
        owner = msg.sender;
    }

    function createDeal(address _provider) external payable returns (uint256) {
        require(msg.value > 0, "Payment required");

        dealCount++;
        deals[dealCount] = StorageDeal({
            provider: _provider,
            client: msg.sender,
            amount: msg.value,
            paid: false
        });

        return dealCount;
    }

    function releasePayment(uint256 _dealId) external {
        StorageDeal storage deal = deals[_dealId];
        require(msg.sender == deal.client, "Only client can release payment");
        require(!deal.paid, "Already paid");

        deal.paid = true;
        payable(deal.provider).transfer(deal.amount);
    }
}
