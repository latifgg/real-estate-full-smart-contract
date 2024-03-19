const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("RealEstateMarket", function () {
    async function deployRealEstateMarketFixture() {
        const [deployer, buyer, buyer2, houseOwner] = await ethers.getSigners();
    
        const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy();
  await mockUSDT.getDeployedCode();
    
  const RealEstateMarket = await ethers.getContractFactory("RealEstateMarket");
  const realEstateMarket = await RealEstateMarket.deploy(mockUSDT.target);
  //await realEstateMarket.getDeployedCode();
    
        return { realEstateMarket, mockUSDT, deployer, buyer, buyer2, houseOwner };
    }
    

    describe("Listing and Buying a House", function () {
        it("should allow a buyer to approve USDT to RealEstateMarket contract and buy shares", async function () {
            const { realEstateMarket, mockUSDT, deployer, buyer } = await loadFixture(deployRealEstateMarketFixture);
        // Ev listeleme
        await realEstateMarket.connect(deployer).listHouse(1, ethers.parseEther("100"), 100, deployer.target);

        // Alıcının mockUSDT'yi RealEstateMarket sözleşmesine approve etmesi
        await mockUSDT.connect(buyer).approve(realEstateMarket.target, ethers.parseEther("10"));

        // Alıcının payları satın alması
        await realEstateMarket.connect(buyer).buyShares(1, 10, ethers.parseEther("10"));

        // Satılan pay sayısının doğrulanması
        const soldShares = await realEstateMarket.getSoldShares(1);
        expect(soldShares).to.equal(10);
        
            // Buyer1'in RealEstateMarket sözleşmesine USDT onayı (approve) vermesi
            // const approveAmount = ethers.parseUnits("20000", "ether"); // Örnek: 20,000 USDT
            // await mockUSDT.connect(buyer1).approve(realEstateMarket.target, approveAmount);
        
            // // Buyer1'in payları satın alması
            // const houseId = 1;
            // const sharesAmount = 20; // Örnek: 20 pay
            // const usdtAmount = approveAmount; // 20,000 USDT
            // await realEstateMarket.connect(buyer1).buyShares(houseId, sharesAmount, usdtAmount);
        
            // // Testler ve doğrulamalar
            // // Örneğin satın alınan pay sayısını kontrol et
            // const sharesBought = await realEstateMarket.getSoldShares(houseId);
            // expect(sharesBought).to.equal(sharesAmount);
        
            // Ve diğer gerekli test/doğrulamalar...
          });

        // it("Should allow owner to list a house", async function () {
        //     const { realEstateMarket, houseOwner } = await loadFixture(deployRealEstateMarketFixture);
        //     await expect(realEstateMarket.listHouse(1, ethers.parseEther("100"), 100, houseOwner.target))
        //         .to.emit(realEstateMarket, "HouseListed")
        //         .withArgs(1, ethers.parseEther("100"), 100, houseOwner.target);
        //         console.log("adress1", address)
        //         console.log("houseowner-adress1", houseOwner.target)
        // });

        // it("Should allow buyers to buy shares of the house", async function () {
        //     const { realEstateMarket, buyer1 } = await loadFixture(deployRealEstateMarketFixture);
        //     await realEstateMarket.listHouse(1, ethers.parseEther("100"), 100, buyer1.address);
        //     await expect(realEstateMarket.connect(buyer1).buyShares(1, 10, ethers.parseEther("10")))
        //         .to.emit(realEstateMarket, "SharesBought")
        //         .withArgs(1, buyer1.address, 10, ethers.parseEther("10"));
        //         console.log("adress2", address)
        //         console.log("buyer1-adress2", buyer1.address)
        // });

        // it("Should allow the house owner to withdraw funds after all shares are sold", async function () {
        //     const { realEstateMarket, usdt, houseOwner } = await loadFixture(deployRealEstateMarketFixture);
        //     await realEstateMarket.listHouse(1, ethers.parseEther("100"), 100, houseOwner.address);
        //     // Simulate buying all shares
        //     // Note: Make sure enough USDT is transferred for the test to succeed
        //     await realEstateMarket.connect(houseOwner).buyShares(1, 100, ethers.parseEther("100"));
        //     await expect(realEstateMarket.connect(houseOwner).withdrawFunds(1))
        //         .to.emit(realEstateMarket, "FundsWithdrawn")
        //         .withArgs(1, ethers.parseEther("100"));
        // });

        // Add more tests as needed...
    });

    // You can add more describe blocks for other functionalities
});
