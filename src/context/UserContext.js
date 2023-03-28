import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    "age":13,
    "location":null,
    "contacts":null,
    "firstname":"",
    "lastname":"",
    "grade":null,
    "school_id":null,
    "gender":null,
    "phone":null,
    "image":null
  });


  const updateUser = (updates) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updates,
    }));
  };


  return (
    <UserContext.Provider
      value={{
        user,
        updateUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
