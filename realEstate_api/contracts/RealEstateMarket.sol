// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "hardhat/console.sol";

contract RealEstateMarket is ERC1155, Ownable, ERC1155Holder {
    IERC20 public usdt;

    struct House {
    uint256 price; // Payın USDT cinsinden fiyatı
    uint256 totalShares; // Toplam pay sayısı
    uint256 sharesSold; // Satılan pay sayısı
    uint256 fundsCollected; // Toplanan fonlar
    address payable houseOwner; // Ev sahibinin adresi (daha açıklayıcı)
}

 event HouseListed(uint256 houseId, uint256 price, uint256 totalShares, address indexed houseOwner);




    mapping(uint256 => House) public houses;
    uint256 public commissionRate = 1; // %1 komisyon oranı

    constructor(address _usdtAddress) ERC1155("https://yourapi.com/api/item/{id}.json") Ownable(msg.sender) {
        usdt = IERC20(_usdtAddress);
    }
    uint256[] private houseIds;

    function listHouse(uint256 houseId, uint256 price, uint256 totalShares, address payable houseOwner) public onlyOwner {
    require(houses[houseId].totalShares == 0, "House already listed");
    houses[houseId] = House(price, totalShares, 0, 0, houseOwner);
    _mint(address(this), houseId, totalShares, "");
    houseIds.push(houseId); 
    emit HouseListed(houseId, price, totalShares, houseOwner);
    console.log("listhouse ID'si:", houseId);
}

function getAllHouses() public view returns (uint256[] memory) {
        return houseIds;
    }


    function buyShares(uint256 houseId, uint256 sharesAmount, uint256 usdtAmount) public {
        House storage house = houses[houseId];
        require(house.totalShares >= house.sharesSold + sharesAmount, "Not enough shares available");
        
         console.log("buyshares ID'si:", houseId);
        uint256 pricePerShare = house.price / house.totalShares;
        uint256 requiredAmount = pricePerShare * sharesAmount;
        uint256 totalRequiredAmount = requiredAmount + (requiredAmount * commissionRate / 100); // Total amount including commission
        
        require(usdtAmount == totalRequiredAmount, "Incorrect USDT amount");
        
        require(usdt.transferFrom(msg.sender, address(this), usdtAmount), "USDT transfer failed");
        
        uint256 commission = requiredAmount * commissionRate / 100;
        house.fundsCollected += (usdtAmount - commission); // Deduct commission and add the rest to the house's funds
        houses[houseId].sharesSold += sharesAmount;
        
        // Directly transfer commission to the contract owner
        require(usdt.transfer(owner(), commission), "Commission transfer failed");

        _safeTransferFrom(address(this), msg.sender, houseId, sharesAmount, "");
    }

    function releaseFunds(uint256 houseId) public {
    House storage house = houses[houseId];
    require(msg.sender == house.houseOwner, "Only the house owner can release funds");
    require(house.totalShares == house.sharesSold, "Not all shares sold");

    uint256 fundsToRelease = house.fundsCollected;
    house.fundsCollected = 0; // Fonları sıfırla

    require(usdt.transfer(house.houseOwner, fundsToRelease), "Funds release failed");
    }


    function getTotalShares(uint256 houseId) public view returns (uint256) {
    return houses[houseId].totalShares;
    }

    function getSoldShares(uint256 houseId) public view returns (uint256) {
        return houses[houseId].sharesSold;
    }
    
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC1155Holder) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
