"use client"

import type React from "react"
import { useState } from "react"
import { useTheme } from "@/context/ThemeContext"
import { Clock, Mail, Lock } from "lucide-react"
import styles from "@/styles/LoginForm.module.css"

interface LoginFormProps {
  onLogin: () => void
  onGoogleLogin: () => void
  isLoading: boolean
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onGoogleLogin, isLoading }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { theme, toggleTheme } = useTheme()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginForm}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Clock className={styles.logoIcon} />
            <h1>Eclipse Tracking</h1>
          </div>
          <p className={styles.subtitle}>Track your time, boost your productivity</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={styles.input}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.loginButton} disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button className={styles.googleButton} onClick={onGoogleLogin} disabled={isLoading}>
          <svg className={styles.googleIcon} viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div className={styles.footer}>
          <button className={styles.themeToggle} onClick={toggleTheme}>
            Switch to {theme === "light" ? "dark" : "light"} theme
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
