import { createContext, useContext, useState } from "react";

const UserEditedContext = createContext();
export const UserEditedProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState("");
  return (
    <UserEditedContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </UserEditedContext.Provider>
  );
};

export const useUserEdited = () => {
  return useContext(UserEditedContext);
};
