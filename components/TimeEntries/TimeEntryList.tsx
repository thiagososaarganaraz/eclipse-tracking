"use client"

import type React from "react"
import { useTimeEntries, type TimeEntry } from "@/context/TimeEntriesContext"
import { useProjects } from "@/context/ProjectsContext"
import { useNotifications } from "@/context/NotificationsContext"
import { Edit, Trash2, DollarSign } from "lucide-react"
import styles from "@/styles/TimeEntryList.module.css"

interface TimeEntryListProps {
  entries: TimeEntry[]
  onEditEntry: (id: string) => void
}

const TimeEntryList: React.FC<TimeEntryListProps> = ({ entries, onEditEntry }) => {
  const { deleteEntry } = useTimeEntries()
  const { getProjectById } = useProjects()
  const { addNotification } = useNotifications()

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id)
    addNotification({
      type: "success",
      message: "Time entry deleted",
      duration: 3000,
    })
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const calculateDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return "Running..."

    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    const durationMs = end - start

    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  if (entries.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No time entries for this period</p>
      </div>
    )
  }

  return (
    <div className={styles.entryList}>
      {entries.map((entry) => {
        const project = entry.projectId ? getProjectById(entry.projectId) : null

        return (
          <div key={entry.id} className={styles.entryItem}>
            <div className={styles.entryMain}>
              <div className={styles.entryDescription}>
                <h3>{entry.description || "No description"}</h3>
                {project && (
                  <div className={styles.projectTag} style={{ backgroundColor: project.color }}>
                    {project.name}
                  </div>
                )}
              </div>

              <div className={styles.entryTime}>
                <span>
                  {formatTime(entry.startTime)} - {entry.endTime ? formatTime(entry.endTime) : "Running"}
                </span>
                <span className={styles.duration}>{calculateDuration(entry.startTime, entry.endTime)}</span>
              </div>
            </div>

            <div className={styles.entryActions}>
              {entry.billable && (
                <span className={styles.billableIcon}>
                  <DollarSign size={16} />
                </span>
              )}

              <button className={styles.actionButton} onClick={() => onEditEntry(entry.id)} aria-label="Edit entry">
                <Edit size={16} />
              </button>

              <button
                className={styles.actionButton}
                onClick={() => handleDeleteEntry(entry.id)}
                aria-label="Delete entry"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TimeEntryList
