// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract MockUSDT is ERC20 {
    constructor() ERC20("Mock USDT", "mUSDT") {
        uint256 initialSupply = 1000000 * (10 ** uint256(decimals()));
        _mint(msg.sender, initialSupply); 
        console.log("Mock USDT with initial supply of", initialSupply, "minted to", msg.sender);
    }
}
