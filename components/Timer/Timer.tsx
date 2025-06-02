"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTimeEntries } from "@/context/TimeEntriesContext"
import { useProjects } from "@/context/ProjectsContext"
import { useNotifications } from "@/context/NotificationsContext"
import { Play, Square, Clock } from "lucide-react"
import ProjectSelector from "../Projects/ProjectSelector"
import styles from "@/styles/Timer.module.css"

interface TimerProps {
  onAddEntry: () => void
}

const Timer: React.FC<TimerProps> = ({ onAddEntry }) => {
  const [description, setDescription] = useState("")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const { activeEntry, startTimer, stopTimer } = useTimeEntries()
  const { projects } = useProjects()
  const { addNotification } = useNotifications()

  // Update elapsed time when timer is running
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (activeEntry) {
      const startTime = new Date(activeEntry.startTime).getTime()

      interval = setInterval(() => {
        const now = Date.now()
        setElapsedTime(Math.floor((now - startTime) / 1000))
      }, 1000)

      // Set description and project from active entry
      setDescription(activeEntry.description)
      setSelectedProject(activeEntry.projectId)
    } else {
      setElapsedTime(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [activeEntry])

  const handleStartTimer = () => {
    startTimer(description, selectedProject)
    addNotification({
      type: "success",
      message: "Timer started",
      duration: 3000,
    })
  }

  const handleStopTimer = () => {
    stopTimer()
    addNotification({
      type: "info",
      message: "Timer stopped",
      duration: 3000,
    })
    setDescription("")
    setSelectedProject(null)
  }

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

  return (
    <div className={styles.timer}>
      <div className={styles.inputSection}>
        <input
          type="text"
          placeholder="What are you working on?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!!activeEntry}
          className={styles.descriptionInput}
        />

        <ProjectSelector
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          disabled={!!activeEntry}
        />
      </div>

      <div className={styles.controlSection}>
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
          <span>{activeEntry ? "Stop" : "Start"}</span>
        </button>
      </div>
    </div>
  )
}

export default Timer
