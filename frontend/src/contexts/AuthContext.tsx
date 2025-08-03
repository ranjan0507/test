import { authApi } from "@/services/api";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthResponse } from "../types/index.ts";

interface AuthContextType{
  user : AuthResponse["user"] | null ;
  loading : boolean ;
  login : (username:string , password : string) => Promise<void> ;
  register : (username:string , password : string) => Promise<void> ;
  logout : () => void ;
}

const AuthContext = createContext<AuthContextType|undefined>(undefined)

export function AuthProvider({children} : {children : ReactNode}){
  const [user,setUser] = useState<AuthContextType["user"]>(null) ;
  const [loading,setLoading] = useState(true) ;

  useEffect(()=>{
    const token = localStorage.getItem('token') ;
    const stored = localStorage.getItem('user') ;
    if(token && stored){
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  },[])

  const login = async (username: string, password: string) => {
    try {
      const res = await authApi.login(username, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
    } catch (err: any) {
      throw new Error(err.message || 'Login failed');
    }
  }

  const register = async (username: string, password: string) => {
    try {
      const res = await authApi.register(username, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
    } catch (err: any) {
      throw new Error(err.message || 'Registration failed');
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return(
    <AuthContext.Provider
    value={{loading,login,register,logout,user}}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}