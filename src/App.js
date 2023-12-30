import { Widget, useNear, useInitNear, useAccount } from "near-social-vm";
import * as nearAPI from "near-api-js";
import React, { useCallback, useEffect, useState } from "react";

const containerStyle = {
  height: "100vh",
  width: "100vh",
};

const Text = ({ children }) => {
  return <span style={{ fontSize: "16px", color: "#333" }}>{children}</span>;
};

function App(props) {
  console.log("NEAR objects will be initialized");

  const init = async () => {
    const { keyStores, KeyPair, connect } = nearAPI;
    const myKeyStore = new keyStores.InMemoryKeyStore();
    const PRIVATE_KEY =
      "5tbP6myFeFztTaCk25E8XkXeMvmxeUL9T4cJppKhSnFJsPA9NYBzPhu9eNMCVC9KBhTkKk6s8bGyGG28dUczSJ7v";
    const keyPair = KeyPair.fromString(PRIVATE_KEY);
    await myKeyStore.setKey("mainnet", "bosmobile.near", keyPair);

    const connectionConfig = {
      networkId: "mainnet",
      keyStore: myKeyStore,
      nodeUrl: "https://rpc.mainnet.near.org",
      walletUrl: "https://app.mynearwallet.com/",
      helperUrl: "https://helper.mainnet.near.org",
      explorerUrl: "https://explorer.mainnet.near.org",
    };
    const nearConnection = await connect(connectionConfig);

    localStorage.setItem("near-social-vm:v01::accountId", "bosmobile.near");

    localStorage.setItem("social.near:v01:widgetProps", "{}");

    localStorage.setItem("social.near:v01:editorUncommittedPreviews", true);

    localStorage.setItem("social.near:v01:editorLayout", "Split");

    localStorage.setItem(
      "near-wallet-selector:selectedWalletId",
      "my-near-wallet"
    );

    localStorage.setItem(
      "near-api-js:keystore:bosmobile.near:mainnet",
      "ed25519:5tbP6myFeFztTaCk25E8XkXeMvmxeUL9T4cJppKhSnFJsPA9NYBzPhu9eNMCVC9KBhTkKk6s8bGyGG28dUczSJ7v"
    );

    localStorage.setItem(
      "near-wallet-selector:contract",
      JSON.stringify({ contractId: "social.near", methodNames: [] })
    );

    localStorage.setItem(
      "near-wallet-selector:recentlySignedInWallets",
      JSON.stringify(["my-near-wallet"])
    );
  };

  const { keyStores } = nearAPI;
  const myKeyStore = new keyStores.InMemoryKeyStore();

  const { initNear } = useInitNear();
  const near = useNear("mainnet");
  const account = useAccount();
  const accountId = account.accountId;

  useEffect(() => {
    initNear &&
      initNear({
        networkId: "mainnet",
        keyStore: myKeyStore,
        selector: undefined,
        config: {
          defaultFinality: undefined,
        },
      });
  }, [initNear]);

  init();

  //TODO
  //We need to inject somehow Near Account without wallet selector

  return (
    <>
      <h1>Hello BOS VM</h1>
      <div style={containerStyle}>
        <Widget
          key={"mob.near/widget/ProfilePage"}
          src={"mob.near/widget/ProfilePage"}
          loading={<Text>isLoading</Text>}
        />
      </div>
    </>
  );
}

export default App;
