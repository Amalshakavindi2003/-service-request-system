import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getProfileApi, updateProfileApi } from '../api/userApi'
import { loginApi, registerApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('srm_token'))
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('srm_user')
    return raw ? JSON.parse(raw) : null
  })
  const [loadingAuth, setLoadingAuth] = useState(Boolean(token))

  const persistSession = (sessionToken, sessionUser) => {
    setToken(sessionToken)
    setUser(sessionUser)
    localStorage.setItem('srm_token', sessionToken)
    localStorage.setItem('srm_user', JSON.stringify(sessionUser))
  }

  const clearSession = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('srm_token')
    localStorage.removeItem('srm_user')
  }

  const login = async (payload) => {
    const { data } = await loginApi(payload)
    persistSession(data.token, data.user)
    toast.success('Welcome back!')
    return data.user
  }

  const register = async (payload) => {
    const { data } = await registerApi(payload)
    persistSession(data.token, data.user)
    toast.success('Account created successfully')
    return data.user
  }

  const logout = () => {
    clearSession()
    toast.success('Logged out')
  }

  const refreshProfile = async () => {
    const { data } = await getProfileApi()
    setUser(data)
    localStorage.setItem('srm_user', JSON.stringify(data))
    return data
  }

  const saveProfile = async (payload) => {
    const { data } = await updateProfileApi(payload)
    setUser(data.user)
    localStorage.setItem('srm_user', JSON.stringify(data.user))
    toast.success('Profile updated')
    return data.user
  }

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setLoadingAuth(false)
        return
      }

      try {
        await refreshProfile()
      } catch (error) {
        clearSession()
      } finally {
        setLoadingAuth(false)
      }
    }

    load()
  }, [token])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === 'admin',
      loadingAuth,
      login,
      register,
      logout,
      refreshProfile,
      saveProfile,
    }),
    [token, user, loadingAuth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}