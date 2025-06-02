"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "@/context/ThemeContext"
import { NotificationsProvider } from "@/context/NotificationsContext"
import LoginForm from "@/components/Auth/LoginForm"
import styles from "@/styles/Login.module.css"

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true")
      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)

    // Simulate Google SSO login process
    setTimeout(() => {
      localStorage.setItem("isLoggedIn", "true")
      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  return (
    <ThemeProvider>
      <NotificationsProvider>
        <div className={styles.loginPage}>
          <LoginForm onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} isLoading={isLoading} />
        </div>
      </NotificationsProvider>
    </ThemeProvider>
  )
}
