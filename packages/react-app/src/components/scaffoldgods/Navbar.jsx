import React from "react";

import { useStateContext } from "../../context/StateContext";
import Alert from "./Alert";
import NetworkSwitch from "../NetworkSwitch";
import Account from "../Account";

const Navbar = () => {
  const {
    USE_BURNER_WALLET,
    USE_NETWORK_SELECTOR,
    web3Modal,
    networkOptions,
    logoutOfWeb3Modal,
    userSigner,
    price,
    address,
    mainnetProvider,
    loadWeb3Modal,

    blockExplorer,
    localProvider,
    selectedNetwork,
    setSelectedNetwork,
    showAlert,
  } = useStateContext();
  return (
    <div className="">
      {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div
        className="bg-white backdrop-filter backdrop-blur-lg bg-opacity-10"
        style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}
      >
        <div className="text-white  flex items-center justify-center gap-3">
          <div>
            {USE_NETWORK_SELECTOR && (
              <div>
                <NetworkSwitch
                  networkOptions={networkOptions}
                  selectedNetwork={selectedNetwork}
                  setSelectedNetwork={setSelectedNetwork}
                />
              </div>
            )}
          </div>
          <div className="">
            <Account
              useBurner={USE_BURNER_WALLET}
              address={address}
              localProvider={localProvider}
              userSigner={userSigner}
              mainnetProvider={mainnetProvider}
              price={price}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={blockExplorer}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
