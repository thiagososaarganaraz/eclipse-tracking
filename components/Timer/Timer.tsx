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
  const { activeEntry } = useTimeEntries()

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
