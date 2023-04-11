import React, { createContext, useState } from "react";

export const MetaContext = createContext();

export const MetaProvider = ({ children }) => {
  const [metadata, setMetadata] = useState({
    unread_likes: 0,
    friend_requests: 0
  });

  const updateMetadata = (updatedFields) => {
    console.log("updatedFields", updatedFields)
    setMetadata((prevState) => ({ ...prevState, ...updatedFields }));
  };

  return (
    <MetaContext.Provider
      value={{
        metadata,
        updateMetadata,
      }}
    >
      {children}
    </MetaContext.Provider>
  );
};
