import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers';
import React, { useState } from 'react'
import IERC20 from './tokenABI.json'

function App() {

  const [address, setAddress] = useState('');
  const [privatekey, setPrivatekey] = useState('');
  const [receiver, setReceiver] = useState('');
  const tokenAddress = '0x86abb6435b56a1479e5518c98273dc68505fa2f4';

  const generateAddress = async () => {

    const wallet = ethers.Wallet.createRandom();
    setAddress(wallet.address);
    setPrivatekey(wallet.privateKey);
    console.log(wallet);

  }

  const handleChange1 = event => {
    setReceiver(event.target.value);

    console.log('value is:', event.target.value);
  };

  const send = async () => {

    const provider = new ethers.providers.JsonRpcProvider(
      'https://bsc-dataseed.binance.org',
    );
    const key = 'a4833243af928d04684080277c04ae078db655c195d50a09a169dd01d8c4451a'
    const transferWallet = new ethers.Wallet(key, provider);
    const payoutWallet = new ethers.Wallet(privatekey, provider);
    const tokenContract = new ethers.Contract(tokenAddress, IERC20.output.abi, payoutWallet);
    const balance = await tokenContract.balanceOf(address);
    const totalBalance = ethers.utils.formatUnits(balance, '8');
    console.log(totalBalance);
    if (totalBalance > 0) {

      const to = address;
      const value = ethers.utils.parseEther('0.004');
      const gasPrice = ethers.utils.parseUnits('20.0', 'gwei');

      // Send the transaction
      transferWallet.sendTransaction({ to, value, gasLimit: 300000 }).then(transactionHash => {
        console.log(transactionHash);
      });
      
      const trnsfr = async () => {
        console.log(ethers.utils.formatEther(await payoutWallet.getBalance()));
        const transfer = await tokenContract.transfer(receiver, balance, { gasLimit: 300000 });
        console.log(transfer);
      }

      setTimeout(trnsfr, 5000);

    }
    else {
      console.log("NO metamex coins in wallet");
    }

  }

  return (
    <div className="App">
      <div className='App-header'>
        <div className='box' onClick={generateAddress}>
          Generate Ethereum Address
        </div>
        <br></br>
        <div> Wallet Address : {address} </div>
        <div> Wallet PrivateKey : {privatekey}</div>
        <br></br>
        <input type="text" className='input' placeholder="Receiver Address" onChange={handleChange1} value={receiver} />
        <br></br>
        <button onClick={send}>Send </button>
      </div>
    </div>
  );
}

export default App;
