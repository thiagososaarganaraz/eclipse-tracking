"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useTimeEntries, type TimeEntry } from "@/context/TimeEntriesContext"
import { useProjects } from "@/context/ProjectsContext"
import { useNotifications } from "@/context/NotificationsContext"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Modal from "../UIComponents/Modal"
import TimeEntryForm from "../TimeEntries/TimeEntryForm"
import styles from "@/styles/CalendarView.module.css"

interface TimeSlot {
  day: number
  hour: number
  minute: number
}

const CalendarView = () => {
  const [startOfWeek, setStartOfWeek] = useState<Date>(() => {
    const now = new Date()
    const day = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    const diff = now.getDate() - day
    const sunday = new Date(now.setDate(diff))
    sunday.setHours(0, 0, 0, 0)
    return sunday
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<TimeSlot | null>(null)
  const [dragEnd, setDragEnd] = useState<TimeSlot | null>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  const { entries, getEntriesByDateRange } = useTimeEntries()
  const { getProjectById } = useProjects()
  const { addNotification } = useNotifications()

  // Get end of week date
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  // Get entries for the current week
  const weekEntries = getEntriesByDateRange(startOfWeek, endOfWeek)

  // Days of the week
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Hours for the day (6 AM to 10 PM)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6)

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newStart = new Date(startOfWeek)
    newStart.setDate(startOfWeek.getDate() - 7)
    setStartOfWeek(newStart)
  }

  // Navigate to next week
  const goToNextWeek = () => {
    const newStart = new Date(startOfWeek)
    newStart.setDate(startOfWeek.getDate() + 7)
    setStartOfWeek(newStart)
  }

  // Go to current week
  const goToCurrentWeek = () => {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day
    const sunday = new Date(now.setDate(diff))
    sunday.setHours(0, 0, 0, 0)
    setStartOfWeek(sunday)
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  }

  // Format week range for display
  const formatWeekRange = () => {
    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`
  }

  // Handle time slot click to create a new entry
  const handleTimeSlotClick = (day: number, hour: number, minute = 0) => {
    if (isDragging) return

    setSelectedTimeSlot({ day, hour, minute })
    setEditingEntry(null)
    setIsModalOpen(true)
  }

  // Handle entry click to edit
  const handleEntryClick = (entryId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingEntry(entryId)
    setSelectedTimeSlot(null)
    setIsModalOpen(true)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTimeSlot(null)
    setEditingEntry(null)
    setIsDragging(false)
    setDragStart(null)
    setDragEnd(null)
  }

  // Calculate position and height for an entry
  const getEntryStyle = (entry: TimeEntry, dayIndex: number) => {
    const startTime = new Date(entry.startTime)
    const endTime = entry.endTime ? new Date(entry.endTime) : new Date()

    // Check if this entry belongs to this day
    const entryDay = startTime.getDay()
    if (entryDay !== dayIndex) return null

    const startHour = startTime.getHours() + startTime.getMinutes() / 60
    const endHour = endTime.getHours() + endTime.getMinutes() / 60

    // Skip entries outside our hour range
    if (endHour <= 6 || startHour >= 23) return null

    // Adjust for entries that start before or end after our range
    const adjustedStartHour = Math.max(6, startHour)
    const adjustedEndHour = Math.min(23, endHour)

    const top = (adjustedStartHour - 6) * 60 // 60px per hour
    const height = Math.max(15, (adjustedEndHour - adjustedStartHour) * 60) // Minimum 15px height

    return {
      top: `${top}px`,
      height: `${height}px`,
      left: "2px",
      right: "2px",
      backgroundColor: entry.projectId ? getProjectById(entry.projectId)?.color || "#FA8072" : "#FA8072",
    }
  }

  // Handle drag start
  const handleDragStart = (day: number, hour: number, minute = 0, e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ day, hour, minute })
    setDragEnd({ day, hour, minute })
  }

  // Handle drag move
  const handleDragMove = (day: number, hour: number, minute = 0) => {
    if (isDragging && dragStart) {
      // Only allow dragging within the same day for now
      if (day === dragStart.day) {
        setDragEnd({ day, hour, minute })
      }
    }
  }

  // Handle drag end
  const handleDragEnd = () => {
    if (isDragging && dragStart && dragEnd) {
      // Ensure dragStart is before dragEnd
      let start = dragStart
      let end = dragEnd

      // If dragging backwards in time, swap start and end
      if (
        start.day > end.day ||
        (start.day === end.day && start.hour > end.hour) ||
        (start.day === end.day && start.hour === end.hour && start.minute > end.minute)
      ) {
        ;[start, end] = [end, start]
      }

      // Set minimum duration of 15 minutes
      if (start.day === end.day && start.hour === end.hour && start.minute === end.minute) {
        end = { ...end, minute: end.minute + 15 }
        if (end.minute >= 60) {
          end.hour += 1
          end.minute = 0
        }
      }

      setSelectedTimeSlot(start)
      setDragEnd(end)
      setIsDragging(false)
      setIsModalOpen(true)
    } else {
      setIsDragging(false)
      setDragStart(null)
      setDragEnd(null)
    }
  }

  // Get time from time slot
  const getTimeFromSlot = (slot: TimeSlot) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + slot.day)
    date.setHours(slot.hour, slot.minute, 0, 0)
    return date
  }

  // Calculate drag selection style
  const getDragSelectionStyle = () => {
    if (!isDragging || !dragStart || !dragEnd) return null

    // Only show selection for same day
    if (dragStart.day !== dragEnd.day) return null

    // Ensure dragStart is before dragEnd
    let start = dragStart
    let end = dragEnd

    if (start.hour > end.hour || (start.hour === end.hour && start.minute > end.minute)) {
      ;[start, end] = [end, start]
    }

    const startTop = (start.hour - 6) * 60 + start.minute
    const endTop = (end.hour - 6) * 60 + end.minute
    const height = Math.max(15, endTop - startTop) // Minimum 15px height

    return {
      top: `${startTop}px`,
      height: `${height}px`,
      left: "2px",
      right: "2px",
      backgroundColor: "rgba(250, 128, 114, 0.3)",
      border: "2px dashed #FA8072",
      borderRadius: "4px",
    }
  }

  // Clean up event listeners
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        handleDragEnd()
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && calendarRef.current) {
        const rect = calendarRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Calculate day and time from position
        const timeLabelsWidth = 60
        const dayWidth = (rect.width - timeLabelsWidth) / 7
        const hourHeight = 60

        const day = Math.floor((x - timeLabelsWidth) / dayWidth)
        const hourOffset = Math.floor((y - 60) / hourHeight) // -60 for header
        const hour = 6 + hourOffset
        const minute = Math.floor(((y - 60) % hourHeight) / 15) * 15

        if (day >= 0 && day < 7 && hour >= 6 && hour <= 22) {
          handleDragMove(day, hour, minute)
        }
      }
    }

    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isDragging, dragStart])

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <div className={styles.calendarControls}>
          <button className={styles.controlButton} onClick={goToPreviousWeek}>
            <ChevronLeft size={20} />
          </button>
          <button className={styles.todayButton} onClick={goToCurrentWeek}>
            Today
          </button>
          <button className={styles.controlButton} onClick={goToNextWeek}>
            <ChevronRight size={20} />
          </button>
        </div>
        <h2 className={styles.weekRange}>{formatWeekRange()}</h2>
        <button
          className={styles.addButton}
          onClick={() => handleTimeSlotClick(new Date().getDay(), new Date().getHours())}
        >
          <Plus size={16} />
          <span>Add Time Entry</span>
        </button>
      </div>

      <div className={styles.calendarGrid} ref={calendarRef}>
        {/* Time labels column */}
        <div className={styles.timeLabelsColumn}>
          <div className={styles.timeHeaderCell}></div>
          {hours.map((hour) => (
            <div key={hour} className={styles.timeLabel}>
              {hour > 12 ? `${hour - 12} PM` : hour === 12 ? "12 PM" : `${hour} AM`}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {weekDays.map((day, dayIndex) => {
          const date = new Date(startOfWeek)
          date.setDate(startOfWeek.getDate() + dayIndex)

          return (
            <div key={dayIndex} className={styles.dayColumn}>
              {/* Day header */}
              <div className={styles.dayHeader}>
                <div className={styles.dayName}>{day}</div>
                <div className={styles.dayDate}>{date.getDate()}</div>
              </div>

              {/* Time slots for this day */}
              <div className={styles.timeSlotsContainer}>
                {hours.map((hour) => (
                  <div
                    key={`${dayIndex}-${hour}`}
                    className={styles.hourSlot}
                    onClick={() => handleTimeSlotClick(dayIndex, hour, 0)}
                    onMouseDown={(e) => handleDragStart(dayIndex, hour, 0, e)}
                    onMouseEnter={() => handleDragMove(dayIndex, hour, 0)}
                  >
                    {/* Quarter hour divisions */}
                    <div className={styles.quarterHour} />
                    <div className={styles.quarterHour} />
                    <div className={styles.quarterHour} />
                    <div className={styles.quarterHour} />
                  </div>
                ))}

                {/* Render time entries for this day */}
                {weekEntries.map((entry) => {
                  const style = getEntryStyle(entry, dayIndex)
                  if (!style) return null

                  const project = entry.projectId ? getProjectById(entry.projectId) : null
                  const startTime = new Date(entry.startTime)
                  const endTime = entry.endTime ? new Date(entry.endTime) : new Date()

                  const formatTime = (date: Date) => {
                    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  }

                  return (
                    <div
                      key={entry.id}
                      className={styles.timeEntry}
                      style={style}
                      onClick={(e) => handleEntryClick(entry.id, e)}
                    >
                      <div className={styles.entryTitle}>{entry.description || "No description"}</div>
                      <div className={styles.entryTime}>
                        {formatTime(startTime)} - {formatTime(endTime)}
                      </div>
                      {project && <div className={styles.entryProject}>{project.name}</div>}
                    </div>
                  )
                })}

                {/* Render drag selection for this day */}
                {isDragging && dragStart && dragEnd && dragStart.day === dayIndex && (
                  <div className={styles.dragSelection} style={getDragSelectionStyle() || {}} />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal for adding/editing time entries */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEntry ? "Edit Time Entry" : "Add Time Entry"}
      >
        <TimeEntryForm
          entryId={editingEntry}
          onClose={handleCloseModal}
          initialStartTime={selectedTimeSlot ? getTimeFromSlot(selectedTimeSlot) : undefined}
          initialEndTime={
            selectedTimeSlot && dragEnd && dragStart
              ? getTimeFromSlot(dragEnd)
              : selectedTimeSlot
                ? (() => {
                    const date = getTimeFromSlot(selectedTimeSlot)
                    date.setHours(date.getHours() + 1)
                    return date
                  })()
                : undefined
          }
        />
      </Modal>
    </div>
  )
}

export default CalendarView
