"use client"

import type React from "react"
import { useTheme } from "@/context/ThemeContext"
import { useTimeEntries } from "@/context/TimeEntriesContext"
import { Sun, Moon, Eclipse } from "lucide-react"
import styles from "@/styles/Header.module.css"

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const { activeEntry, startTimer, stopTimer } = useTimeEntries()


  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Eclipse className={styles.logoIcon} />
        <h1>Eclipse Tracking</h1>
      </div>

      <div className={styles.controls}>
        {activeEntry && (
          <div className={styles.activeTimer}>
            <span className={styles.pulse}></span>
            <span>Timer Running</span>
          </div>
        )}
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  )
}

export default Header
