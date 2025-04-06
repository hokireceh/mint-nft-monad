const hre = require("hardhat");
const ethers = require("ethers");

async function main() {
  // Ambil kontrak NFT yang sudah dideploy
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const nft = await MyNFT.deploy();
  await nft.deployed();

  console.log("✅ NFT Contract deployed at:", nft.address);

  // Ambil alamat wallet yang akan melakukan mint
  const walletAddress = "0x103D1D8d46de2E7829Ad5FBe2D322c705B602780";  // Ganti dengan alamat yang sesuai
  const metadataURI = "ipfs://bafkreics4cfczn3asvrhx4jdwdjwqhc5lmzjchlvmukvhuzzcp6qw6di5m";  // Ganti dengan URI metadata yang sesuai
  
  // Cek saldo MON sebelum minting
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const balance = await provider.getBalance(walletAddress);
  console.log(`Saldo MON untuk ${walletAddress}:`, ethers.utils.formatEther(balance), "MON");

  // Pastikan saldo MON cukup untuk mint (minimal 0.05 MON)
  if (parseFloat(ethers.utils.formatEther(balance)) >= 0.05) {
    // Melakukan mint NFT jika saldo cukup
    const mintTx = await nft.mintNFT(walletAddress, metadataURI, {
      value: ethers.utils.parseEther("0.05"),  // Biaya mint 0.05 MON
      gasLimit: 500000,  // Tentukan gas limit
    });
    
    console.log("Minting NFT...");
    await mintTx.wait(); // Tunggu sampai transaksi selesai
    console.log("✅ NFT berhasil di-mint!");
  } else {
    console.log("Saldo MON tidak cukup untuk minting. Pastikan ada setidaknya 0.05 MON.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
