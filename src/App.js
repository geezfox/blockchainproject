import { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null
  })
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()

      if (provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider
        })
       
        provider.request({ method: "eth_requestAccounts" })
      } else {
        console.error("Please, install Metamask.")
      }
    }
    loadProvider()
  }, [])

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0])
    }
    web3Api.web3 && getAccount()
  }, [web3Api.web3])

  useEffect(() => {
    const loadBalance = async () => {
      if (account && web3Api.web3) {
        const balance = await web3Api.web3.eth.getBalance(account)
        setBalance(web3Api.web3.utils.fromWei(balance, "ether"))
      }
    }
    loadBalance()
  }, [account, web3Api.web3])

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <span>
          <strong>Account: </strong>
        </span>
        <h1>
          {account ? account : "not connected"}
        </h1>
        <div className="balance-view is-size-2">
          <div className="is-flex is-align-items-center">
            <span>
              <strong className="mr-2">Account: </strong>
            </span>
            {account ?
              <div>{account}</div> :
              <button
                className="button is-small"
                onClick={() =>
                  web3Api.provider.request({ method: "eth_requestAccounts" })
                }
              >
                Connect Wallet
              </button>
            }
          </div>
          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>{balance ? balance : "Loading..."} ETH</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
