import React, { createContext, useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";
import { AxiosContext } from "./AxiosContext";

export const MetaContext = createContext();

export const MetaProvider = ({ children }) => {
  const [metadata, setMetadata] = useState({
    unread_likes: 0,
    friend_requests: 0,
    unread_posts:0
  });

  const {authAxios} = React.useContext(AxiosContext);
  const {authState} = React.useContext(AuthContext);

  const updateMetadata = (updatedFields) => {
    console.log("updatedFields", updatedFields)
    setMetadata((prevState) => ({ ...prevState, ...updatedFields }));
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      console.log("in fetchMetadata")
      try {
        console.log("calling")
        console.log(authAxios)
        const response = await authAxios.get("/get_metadata");
        console.log("responded")
        console.log(response.data)
        if (response.data.status == 0) {  
          updateMetadata({unread_posts: response.data.new_board_elems,unread_likes: response.data.unread_likes_count,friend_requests: response.data.pending_requests_count})
        }
      } catch (error) {
        console.log(error);
      }
    }

    if(authState.token){
      console.log("Token found,setting polling ",authState.token)

    fetchMetadata();

    const intervalId = setInterval(  fetchMetadata, 10000)

    return () => {
      clearInterval(intervalId)
    };
  }

  }, [authState.token]);

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
