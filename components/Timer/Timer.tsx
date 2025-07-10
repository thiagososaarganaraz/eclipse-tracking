"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTimeEntries } from "@/context/TimeEntriesContext"
import { useProjects } from "@/context/ProjectsContext"
import { useNotifications } from "@/context/NotificationsContext"
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
    </div>
  )
}

export default Timer
