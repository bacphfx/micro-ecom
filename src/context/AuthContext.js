import { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadUser();
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const login = (token) => {
    localStorage.setItem("token", JSON.stringify(token));
    loadUser();
  };

  const loadUser = async () => {
    try {
      let res = await axiosClient.get("/users/me");
      setUser(res);
    } catch (error) {
      console.log(error);
    }
  };
};
