// app.js

// Connect to the Ethereum provider (MetaMask)
async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            window.web3 = new Web3(window.ethereum);
            console.log("Wallet connected!");
        } catch (error) {
            console.error("User denied wallet connection", error);
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// Define contract ABI and address
const contractABI = [ 
    // Insert your contract ABI here
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            { "internalType": "address", "name": "_provider", "type": "address" }
        ],
        "name": "createDeal",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_dealId", "type": "uint256" }
        ],
        "name": "releasePayment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_dealId", "type": "uint256" }
        ],
        "name": "getDeal",
        "outputs": [
            { "internalType": "address", "name": "provider", "type": "address" },
            { "internalType": "address", "name": "client", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "bool", "name": "paid", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE";

let contract;

// Initialize contract after wallet connection
async function initContract() {
    await connectWallet();
    const web3 = window.web3;
    contract = new web3.eth.Contract(contractABI, contractAddress);
}

// Create a new deal
async function createDeal(providerAddress, amountInEther) {
    const accounts = await web3.eth.getAccounts();
    const from = accounts[0];

    try {
        const amountInWei = web3.utils.toWei(amountInEther, "ether");
        const tx = await contract.methods.createDeal(providerAddress)
            .send({ from, value: amountInWei });
        
        console.log("Deal created:", tx);
        alert("Deal created successfully!");
    } catch (error) {
        console.error("Error creating deal:", error);
