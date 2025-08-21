import React from "react";
import { InstanceContext } from "./context";
import { useImmer } from "use-immer";

export const InstanceContextProvider = ({ children }) => {
  const storedData = JSON.parse(localStorage.getItem("instanceDetails")) || {};
  const [instanceDetails, setInstanceDetails] = useImmer({
    instanceUrl: storedData.instanceUrl || "",
    username: storedData.username || "",
    password: storedData.password || "",
    clientId: storedData.clientId || "",
    clientSecret: storedData.clientSecret || "",
  });
  return (
    <InstanceContext.Provider value={[instanceDetails, setInstanceDetails]}>
      {children}
    </InstanceContext.Provider>
  );
};

