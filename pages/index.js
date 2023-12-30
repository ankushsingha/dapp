import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

const HomePage = () => {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState("green");
  const [ownerName, setOwnerName] = useState("Ankush");
  const [nomineeName, setNomineeName] = useState("Swagath");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      try {
        let tx = await atm.deposit(50);
        await tx.wait();
        getBalance();
        addNotification("Deposit successful!", tx.hash);
      } catch (error) {
        addNotification(`Deposit failed: ${error.message}`);
      }
    }
  };

  const withdraw = async () => {
    if (atm) {
      try {
        let tx = await atm.withdraw(25);
        await tx.wait();
        getBalance();
        addNotification("Withdrawal successful!", tx.hash);
      } catch (error) {
        addNotification(`Withdrawal failed: ${error.message}`);
      }
    }
  };

  const addNotification = (message, hash) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { message, hash, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "green" ? "light" : "green"));
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask to use this ATM.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Connect Metamask Wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Owner Name: {ownerName}</p>
        <p>Nominee Name: {nomineeName}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={deposit} style={{ backgroundColor: 'blue', color: '#fff' }}>Deposit 50 ETH</button>
        <button onClick={withdraw} style={{ backgroundColor: 'red', color: '#fff' }}>Withdraw 25 ETH</button>
        <table>
          <thead>
            <tr>
              <th>Notification</th>
              <th>Transaction Hash</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification, index) => (
              <tr key={index}>
                <td>{notification.message}</td>
                <td>{notification.hash}</td>
                <td>{notification.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className={`container ${theme}`}>
      <button className="theme-switch" onClick={toggleTheme}>
        Toggle Theme
      </button>
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <button onClick={clearNotifications}>Clear Notifications</button>
      <style jsx>{`
        .container {
          text-align: center;
          transition: background-color 0.3s;
        }

        .green {
          background-color: #4caf50;
          color: #fff;
        }

        .theme-switch {
          position: absolute;
          top: 10px;
          left: 10px;
        }

        table {
          width: 100%;
          margin-top: 20px;
          border-collapse: collapse;
        }

        th,
        td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }

        th {
          background-color: #f2f2f2;
        }
      `}</style>
    </main>
  );
};

export default HomePage;
