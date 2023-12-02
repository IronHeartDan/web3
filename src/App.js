import React, { useState, useEffect } from 'react';
import { fromWei } from 'web3-utils';

import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [accountBalance, setAccountBalance] = useState('');
  const [availableNetworks, setAvailableNetworks] = useState([]);

  const connectToMetaMask = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'eth_requestAccounts',
          // params: [
          //   {
          //     chainId: '1'
          //   }
          // ]
        });

        setIsConnected(true);
      } else {
        console.error('MetaMask is not installed.');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  const fetchAvailableNetworks = async () => {
    try {
      if (window.ethereum) {
        const networkList = await window.ethereum.request({
          method: 'net_version'
        });

        const availableNetworkIds = networkList === 'loading' ? [] : [networkList];
        setAvailableNetworks(availableNetworkIds);
      }
    } catch (error) {
      console.error('Error fetching available networks:', error);
    }
  };

  const fetchAccountBalance = async () => {
    try {
      if (window.ethereum && window.ethereum.selectedAddress) {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [window.ethereum.selectedAddress, 'latest']
        });

        // Convert the balance from wei to Ether
        const balanceInEther = fromWei(balance, 'ether');
        // const balanceInEther = window.ethereum.utils.fromWei(balance, 'ether');
        setAccountBalance(balanceInEther);
      }
    } catch (error) {
      console.error('Error fetching account balance:', error);
    }
  };

  useEffect(() => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      setIsConnected(window.ethereum.selectedAddress !== null);
    }
  }, []);


  useEffect(() => {
    if (isConnected) {
      fetchAccountBalance()
      fetchAvailableNetworks()
    }
  }, [isConnected]);

  return (
    <div className="app">
      <div>
        <h1>Web3</h1>
        <p>Account Balance: {accountBalance} ETH</p>
        {isConnected ? (
          <p>Connected to MetaMask</p>
        ) : (
          <button onClick={connectToMetaMask}>Connect To MetaMask</button>
        )}
        {availableNetworks.map((item) => (
          <p>{item}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
