/* eslint-disable react/jsx-no-bind */
import { useState, useEffect } from 'react';
import Modal from 'react-modal';

import styles from '../../styles';
import CustomButton from './CustomButton';

import { GetParams, SwitchNetwork } from '../../utils/onboard.js';
import { useStateContext } from '../../context/StateContext';
import Account from '../Account';
import NetworkSwitch from '../NetworkSwitch';

const OnboardModal = () => {
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
    updateCurrentWalletAddress,
  } = useStateContext();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(-1);

  async function resetParams() {
    const currentStep = await GetParams();
    setStep(currentStep.step);
    setIsOpen(currentStep.step !== -1);
  }

  useEffect(() => {
    resetParams();

    window?.ethereum?.on('chainChanged', () => {
      resetParams();
    });

    window?.ethereum?.on('accountsChanged', () => {
      resetParams();
    });
  }, []);

  const generateStep = st => {
    switch (st) {
      case 0:
        return (
          <>
            <p className={styles.modalText}>You don't have Core Wallet installed!</p>
            <CustomButton title="Download Core" handleClick={() => window.open('https://core.app/', '_blank')} />
          </>
        );

      case 1:
        return (
          <>
            <p className={styles.modalText}>You haven't connected your account to Core Wallet!</p>
            <CustomButton title="Connect Account" handleClick={updateCurrentWalletAddress} />
          </>
        );

      case 2:
        return (
          <>
            <p className={styles.modalText}>You're on a different network. Switch to Fuji C-Chain.</p>
            <CustomButton title="Switch" handleClick={SwitchNetwork} />
          </>
        );

      case 3:
        return (
          <>
            <p className={styles.modalText}>Oops, you don't have AVAX tokens in your account</p>
            <CustomButton
              title="Grab some test tokens"
              handleClick={() => window.open('https://faucet.avax.network/', '_blank')}
            />
          </>
        );

      default:
        return <p className={styles.modalText}>Good to go!</p>;
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      className={`absolute inset-0 ${styles.flexCenter} flex-col ${styles.glassEffect}`}
      overlayClassName="Overlay"
    >
      {/* {generateStep(step)} */}
      <div className="flex-1 px-4 flex flex-row justify-end">
        {USE_NETWORK_SELECTOR && (
          <NetworkSwitch
            networkOptions={networkOptions}
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={setSelectedNetwork}
          />
        )}
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
    </Modal>
  );
};

export default OnboardModal;
