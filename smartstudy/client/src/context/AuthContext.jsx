import { createContext, useContext, useEffect, useState } from 'react'
import { loginApi, signupApi } from '../api/auth'
const Ctx = createContext(null)
export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  useEffect(()=>{ if(token){ const raw = localStorage.getItem('user'); if(raw) setUser(JSON.parse(raw)) } }, [token])
  const login = async (email,password)=>{
    try{ const { token, user } = await loginApi(email,password); localStorage.setItem('token',token); localStorage.setItem('user', JSON.stringify(user)); setToken(token); setUser(user); return true }
    catch(e){ alert(e.response?.data?.error || 'Login failed'); return false }
  }
  const signup = async (name,email,password)=>{
    try{ const { token, user } = await signupApi(name,email,password); localStorage.setItem('token',token); localStorage.setItem('user', JSON.stringify(user)); setToken(token); setUser(user); return true }
    catch(e){ alert(e.response?.data?.error || 'Signup failed'); return false }
  }
  const logout = ()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); setToken(null); setUser(null) }
  return <Ctx.Provider value={{ user, token, login, signup, logout }}>{children}</Ctx.Provider>
}
export const useAuth = ()=> useContext(Ctx)
