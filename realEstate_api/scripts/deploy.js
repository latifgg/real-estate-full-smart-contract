async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // `MockUSDT` sözleşmesini deploy ediyoruz.
  const MockUSDT = await ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy();
  //await mockUSDT.getDeployedCode(); // Deploy işleminin tamamlandığını doğruluyoruz.
  //await mockUSDT.waitForDeployment();
  console.log("MockUSDT contract deployed to:", mockUSDT.target);

  // `RealEstateMarket` sözleşmesini deploy ediyoruz.
  // Burada `RealEstateMarket` sözleşmesinin yapıcı metoduna (constructor) `MockUSDT` adresini gönderiyoruz.
  const RealEstateMarket = await ethers.getContractFactory("RealEstateMarket");
  const realEstateMarket = await RealEstateMarket.deploy(mockUSDT.target);
  //await realEstateMarket.getDeployedCode(); // Deploy işleminin tamamlandığını doğruluyoruz.
  console.log("RealEstateMarket contract deployed to:", realEstateMarket.target);
  // MockUSDT'den RealEstateMarket'e Token Transferi için Approve Et
  const approveAmount = ethers.parseUnits('10000000', 18); // Örnek olarak 1000 token
  const approveTx = await mockUSDT.connect(deployer).approve(realEstateMarket.target, approveAmount);
  await approveTx.wait();
  console.log(`Approved ${approveAmount} tokens from MockUSDT to RealEstateMarket`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
