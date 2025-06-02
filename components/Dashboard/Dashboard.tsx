"use client"

import type React from "react"
import { useState } from "react"
import { useTimeEntries } from "@/context/TimeEntriesContext"
import { useProjects } from "@/context/ProjectsContext"
import { useNotifications } from "@/context/NotificationsContext"
import TimeEntryList from "../TimeEntries/TimeEntryList"
import TimeEntryForm from "../TimeEntries/TimeEntryForm"
import Timer from "../Timer/Timer"
import CalendarView from "../Calendar/CalendarView"
import Modal from "../UI/Modal"
import { Calendar, List } from "lucide-react"
import styles from "@/styles/Dashboard.module.css"

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const { entries, activeEntry, getEntryById } = useTimeEntries()
  const { projects } = useProjects()
  const { addNotification } = useNotifications()

  const handleEditEntry = (id: string) => {
    setEditingEntry(id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEntry(null)
  }

  const handleAddEntry = () => {
    setEditingEntry(null)
    setIsModalOpen(true)
  }

  // Get today's entries
  const today = new Date()
  const todayEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.startTime)
    return (
      entryDate.getDate() === today.getDate() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getFullYear() === today.getFullYear()
    )
  })

  return (
    <div className={styles.dashboard}>
      <div className={styles.timerSection}>
        <Timer onAddEntry={handleAddEntry} />
      </div>

      <div className={styles.viewToggle}>
        <button
          className={`${styles.viewButton} ${viewMode === "list" ? styles.active : ""}`}
          onClick={() => setViewMode("list")}
        >
          <List size={18} />
          <span>List View</span>
        </button>
        <button
          className={`${styles.viewButton} ${viewMode === "calendar" ? styles.active : ""}`}
          onClick={() => setViewMode("calendar")}
        >
          <Calendar size={18} />
          <span>Calendar View</span>
        </button>
      </div>

      {viewMode === "list" ? (
        <div className={styles.entriesSection}>
          <h2 className={styles.sectionTitle}>Today</h2>
          <TimeEntryList entries={todayEntries} onEditEntry={handleEditEntry} />
        </div>
      ) : (
        <CalendarView />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEntry ? "Edit Time Entry" : "Add Time Entry"}
      >
        <TimeEntryForm entryId={editingEntry} onClose={handleCloseModal} />
      </Modal>
    </div>
  )
}

export default Dashboard
