import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    "age":14,
    "location":null,
    "contacts":null,
    "firstname":"",
    "lastname":"",
    "grade":null,
    "school_id":null,
    "gender":null,
    "phone":null,
    "photo":null
  });
  const [userId, setUserId] = useState(null);


  const updateUser = (updates) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updates,
    }));
  };

  const updateUserId = (id) => {
    setUserId(id);
  }

  return (
    <UserContext.Provider
      value={{
        user,
        userId,
        updateUser,
        updateUserId
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
