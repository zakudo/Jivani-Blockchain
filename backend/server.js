const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Sepolia Network & Wallet Connection Setup
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// 2. Apna Copied Sepolia Contract Address Yahan Paste Karein
const CONTRACT_ADDRESS =process.env.CONTRACT_ADDRESS || "0xb2dE751D22Adfb449e95DA3c1e8836C6c61B537d";

const CONTRACT_ABI = [
  "function registerBatch(string _name, string _batchId, string _manufacturer, uint256 _mfgDate, uint256 _expDate) external",
  "function verifyBatch(string _batchId) external view returns (string name, string batchId, string manufacturer, uint256 mfgDate, uint256 expDate, address registeredBy, bool exists)"
];

// Contract instance with Wallet (Read + Write capabilities)
const medChainContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// Public API Route: Consumer Verification
app.get("/api/verify/:batchId", async (req, res) => {
  try {
    const { batchId } = req.params;
    const batch = await medChainContract.verifyBatch(batchId);

    if (!batch.exists) {
      return res.status(404).json({ success: false, message: "Batch not found on ledger" });
    }

    res.json({
      success: true,
      data: {
        name: batch.name,
        batchId: batch.batchId,
        manufacturer: batch.manufacturer,
        mfgDate: new Date(Number(batch.mfgDate) * 1000).toISOString().split('T')[0],
        expDate: new Date(Number(batch.expDate) * 1000).toISOString().split('T')[0],
        registeredBy: batch.registeredBy,
        exists: batch.exists
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid or Counterfeit Batch ID" });
  }
});

// Port declaration for Local and Vercel compatibility
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 MedChain Express API running on port ${PORT}`);
});

module.exports = app;