import { createContext, useContext, useState } from "react";

const KeywordContext = createContext();
export const KeywordProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState("");
  return (
    <KeywordContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </KeywordContext.Provider>
  );
};

export const useKeyword = () => {
  return useContext(KeywordContext);
};
