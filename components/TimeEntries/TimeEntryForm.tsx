"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTimeEntries } from "@/context/TimeEntriesContext"
import { useNotifications } from "@/context/NotificationsContext"
import ProjectSelector from "../Projects/ProjectSelector"
import { DollarSign } from "lucide-react"
import styles from "@/styles/TimeEntryForm.module.css"

interface TimeEntryFormProps {
  entryId: string | null
  onClose: () => void
  initialStartTime?: Date
  initialEndTime?: Date
}

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ entryId, onClose, initialStartTime, initialEndTime }) => {
  const [description, setDescription] = useState("")
  const [projectId, setProjectId] = useState<string | null>(null)
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [billable, setBillable] = useState(false)

  const { addEntry, updateEntry, getEntryById } = useTimeEntries()
  const { addNotification } = useNotifications()

  useEffect(() => {
    if (entryId) {
      const entry = getEntryById(entryId)
      if (entry) {
        setDescription(entry.description)
        setProjectId(entry.projectId)
        setBillable(entry.billable)

        const start = new Date(entry.startTime)
        setStartDate(start.toISOString().split("T")[0])
        setStartTime(start.toTimeString().slice(0, 5))

        if (entry.endTime) {
          const end = new Date(entry.endTime)
          setEndDate(end.toISOString().split("T")[0])
          setEndTime(end.toTimeString().slice(0, 5))
        } else {
          const now = new Date()
          setEndDate(now.toISOString().split("T")[0])
          setEndTime(now.toTimeString().slice(0, 5))
        }
      }
    } else if (initialStartTime) {
      // Use provided initial times if available
      setStartDate(initialStartTime.toISOString().split("T")[0])
      setStartTime(initialStartTime.toTimeString().slice(0, 5))

      if (initialEndTime) {
        setEndDate(initialEndTime.toISOString().split("T")[0])
        setEndTime(initialEndTime.toTimeString().slice(0, 5))
      } else {
        // Default to 1 hour later if no end time provided
        const defaultEnd = new Date(initialStartTime)
        defaultEnd.setHours(defaultEnd.getHours() + 1)
        setEndDate(defaultEnd.toISOString().split("T")[0])
        setEndTime(defaultEnd.toTimeString().slice(0, 5))
      }
    } else {
      // Set default values for new entry
      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

      setStartDate(oneHourAgo.toISOString().split("T")[0])
      setStartTime(oneHourAgo.toTimeString().slice(0, 5))
      setEndDate(now.toISOString().split("T")[0])
      setEndTime(now.toTimeString().slice(0, 5))
    }
  }, [entryId, getEntryById, initialStartTime, initialEndTime])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const startDateTime = new Date(`${startDate}T${startTime}`)
      const endDateTime = new Date(`${endDate}T${endTime}`)

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error("Invalid date or time")
      }

      if (startDateTime >= endDateTime) {
        throw new Error("Start time must be before end time")
      }

      const entryData = {
        description,
        projectId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        billable,
      }

      if (entryId) {
        updateEntry(entryId, entryData)
        addNotification({
          type: "success",
          message: "Time entry updated",
          duration: 3000,
        })
      } else {
        addEntry(entryData)
        addNotification({
          type: "success",
          message: "Time entry added",
          duration: 3000,
        })
      }

      onClose()
    } catch (error) {
      addNotification({
        type: "error",
        message: error instanceof Error ? error.message : "An error occurred",
        duration: 5000,
      })
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What did you work on?"
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Project</label>
        <ProjectSelector selectedProject={projectId} onSelectProject={setProjectId} />
      </div>

      <div className={styles.timeSection}>
        <div className={styles.formGroup}>
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="startTime">Start Time</label>
          <input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.timeSection}>
        <div className={styles.formGroup}>
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="endTime">End Time</label>
          <input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.checkboxGroup}>
        <input
          id="billable"
          type="checkbox"
          checked={billable}
          onChange={(e) => setBillable(e.target.checked)}
          className={styles.checkbox}
        />
        <label htmlFor="billable" className={styles.checkboxLabel}>
          <DollarSign size={16} />
          <span>Billable</span>
        </label>
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={styles.submitButton}>
          {entryId ? "Update" : "Add"} Entry
        </button>
      </div>
    </form>
  )
}

export default TimeEntryForm
