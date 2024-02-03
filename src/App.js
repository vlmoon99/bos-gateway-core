import * as nearAPI from "near-api-js";
import { Widget, useNear, useInitNear, useAccount } from "near-social-vm";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import React, { useCallback, useEffect, useState } from "react";
import ls from "local-storage";
import "./App.scss";

const WalletSelectorDefaultValues = {
  "near-wallet-selector:selectedWalletId": "near-wallet",
  "near-wallet-selector:recentlySignedInWallets": ["near-wallet"],
  "near-wallet-selector:contract": {
    contractId: "social.near",
    methodNames: [],
  },
};

const WalletSelectorAuthKey = "near_app_wallet_auth_key";

function App(props) {
  const src = "vlmoon.near/widget/ProfileEditor";
  const widgetProps = {};
  const PRIVATE_KEY =
  "ed25519:5tbP6myFeFztTaCk25E8XkXeMvmxeUL9T4cJppKhSnFJsPA9NYBzPhu9eNMCVC9KBhTkKk6s8bGyGG28dUczSJ7v";
  const accountId =
  "bosmobile.near";

  console.log("NEAR objects will be initialized");


  const [isInitialized, setIsInitialized] = useState(false);
  const [nearInitialized, setNearInitialized] = useState(false);
  const { initNear } = useInitNear();
  const near = useNear();
  // const account = useAccount();

  useEffect(() => {
    const myKeyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
    async function setData() {
      ls.clear();
      const keyPair = nearAPI.KeyPair.fromString(PRIVATE_KEY);
      await myKeyStore.setKey("mainnet", accountId, keyPair);
      Object.entries(WalletSelectorDefaultValues).forEach(([key, value]) => {
        ls.set(key, value);
      });
      ls.set(WalletSelectorAuthKey, {
        accountId: accountId,
        allKeys: [keyPair.publicKey.toString()],
      });
    }

    setData();

    initNear &&
      initNear({
        networkId: "mainnet",
        selector: setupWalletSelector({
          network: "mainnet",
          modules: [setupMyNearWallet()],
        }),
        config: {
          defaultFinality: undefined,
        },
      });

    setNearInitialized(true);
  }, [initNear]);

  useEffect(() => {
    async function loginInAccount() {
      const wallet = await (await near.selector).wallet("my-near-wallet");
      wallet.signIn({ contractId: near.config.contractName });
      setIsInitialized(true);
    }
    if (nearInitialized) {
      loginInAccount();
    }
  }, [nearInitialized, near]);

  if (!isInitialized) {
    return (
      <div class="centered-spinner">
        <div class="spinner-grow" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Widget key={src} src={src} props={widgetProps} />
      </div>
    );
  }
}

export default App;
