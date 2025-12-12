import Web3 from "web3";
import HelloWorld from "./artifacts/HelloWorld.json";

const RPC_URL = "http://127.0.0.1:7545";
const PRIVATE_KEY = "6a2c2320eadaa99c8f1d21594953e4a83c2ec32b68c170ff8e7f2472d556dfbc"; // ← mets la clé ici

let web3;
let contract;

export async function loadBlockchain() {
  console.log(">>> loadBlockchain called");

  web3 = new Web3(RPC_URL);

  console.log(">>> Web3 object =", web3);

  const networkId = await web3.eth.net.getId();
  console.log(">>> networkId =", networkId);

  const deployedNetwork = HelloWorld.networks[networkId];
  console.log(">>> deployedNetwork =", deployedNetwork);

  if (!deployedNetwork) {
    console.error("CONTRACT NOT FOUND IN JSON");
  }

  contract = new web3.eth.Contract(
    HelloWorld.abi,
    deployedNetwork.address
  );

  return contract;
}


// GETTER
export async function getName() {
  return await contract.methods.yourName().call();
}

// SETTER avec private key GANACHE
export async function setName(newName) {
  if (!web3) {
    console.error("Web3 NOT INITIALIZED !");
    return;
  }

  const account = web3.eth.accounts.privateKeyToAccount("0x" + PRIVATE_KEY);
  const sender = account.address;

  const tx = {
    from: sender,
    to: contract.options.address,
    gas: 200000, // gas limit
    gasPrice: web3.utils.toWei("10", "gwei"), // <-- ajouté
    data: contract.methods.setName(newName).encodeABI(),
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, "0x" + PRIVATE_KEY);

  return await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

