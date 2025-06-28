"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTheme } from "@/context/ThemeContext"
import { useTimeEntries } from "@/context/TimeEntriesContext"
import { Sun, Moon, Eclipse, Play, Square, Clock } from "lucide-react"
import styles from "@/styles/Header.module.css"

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const { activeEntry, startTimer, stopTimer } = useTimeEntries()

  // Timer logic
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (activeEntry) {
      const startTime = new Date(activeEntry.startTime).getTime()
      interval = setInterval(() => {
        const now = Date.now()
        setElapsedTime(Math.floor((now - startTime) / 1000))
      }, 1000)
    } else {
      setElapsedTime(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [activeEntry])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":")
  }

  // You may want to lift these handlers up if you want notifications
  const handleStartTimer = () => {
    startTimer("", null) // You can adjust description/project as needed
  }

  const handleStopTimer = () => {
    stopTimer()
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Eclipse className={styles.logoIcon} />
        <h1>Eclipse Tracking</h1>
      </div>

      <div className={styles.controls}>
        <div className={styles.timeDisplay}>
          <Clock className={styles.clockIcon} />
          <span className={styles.time}>{formatTime(elapsedTime)}</span>
        </div>
        <button
          className={`${styles.timerButton} ${activeEntry ? styles.stopButton : styles.startButton}`}
          onClick={activeEntry ? handleStopTimer : handleStartTimer}
          aria-label={activeEntry ? "Stop timer" : "Start timer"}
        >
          {activeEntry ? <Square size={20} /> : <Play size={20} />}
        </button>
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
