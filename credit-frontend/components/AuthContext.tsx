import React, { createContext, useState, useContext, ReactNode } from "react";

export type UserType =
  | "User"
  | "Admin"
  | "Technician"
  | "Site Owner"
  | "Site Manager"
  | "Finance Manager";

type AuthContextType = {
  isLoggedIn: boolean;
  userName: string;
  userType: UserType | null;
  login: (name: string, type: UserType) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState<UserType | null>(null);

  const login = (name: string, type: UserType) => {
    setIsLoggedIn(true);
    setUserName(name);
    setUserType(type);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
