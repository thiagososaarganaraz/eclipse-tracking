"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTimeEntries } from "@/context/TimeEntriesContext"
import { useProjects } from "@/context/ProjectsContext"
import { ChevronLeft, ChevronRight, Clock, DollarSign } from "lucide-react"
import styles from "@/styles/Reports.module.css"

const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [viewType, setViewType] = useState<"day" | "week" | "month">("week")

  const { entries, getEntriesByDateRange } = useTimeEntries()
  const { projects, getProjectById } = useProjects()

  // Set date range based on view type
  useEffect(() => {
    const today = new Date()
    const start = new Date(today)
    const end = new Date(today)

    if (viewType === "day") {
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
    } else if (viewType === "week") {
      const day = today.getDay()
      start.setDate(today.getDate() - day)
      start.setHours(0, 0, 0, 0)
      end.setDate(today.getDate() + (6 - day))
      end.setHours(23, 59, 59, 999)
    } else if (viewType === "month") {
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      end.setMonth(today.getMonth() + 1, 0)
      end.setHours(23, 59, 59, 999)
    }

    setStartDate(start)
    setEndDate(end)
  }, [viewType])

  const handlePrevPeriod = () => {
    const newStart = new Date(startDate)
    const newEnd = new Date(endDate)

    if (viewType === "day") {
      newStart.setDate(newStart.getDate() - 1)
      newEnd.setDate(newEnd.getDate() - 1)
    } else if (viewType === "week") {
      newStart.setDate(newStart.getDate() - 7)
      newEnd.setDate(newEnd.getDate() - 7)
    } else if (viewType === "month") {
      newStart.setMonth(newStart.getMonth() - 1)
      newEnd.setMonth(newEnd.getMonth() - 1)
      newEnd.setDate(0) // Last day of previous month
    }

    setStartDate(newStart)
    setEndDate(newEnd)
  }

  const handleNextPeriod = () => {
    const newStart = new Date(startDate)
    const newEnd = new Date(endDate)

    if (viewType === "day") {
      newStart.setDate(newStart.getDate() + 1)
      newEnd.setDate(newEnd.getDate() + 1)
    } else if (viewType === "week") {
      newStart.setDate(newStart.getDate() + 7)
      newEnd.setDate(newEnd.getDate() + 7)
    } else if (viewType === "month") {
      newStart.setMonth(newStart.getMonth() + 1, 1)
      newEnd.setMonth(newEnd.getMonth() + 2, 0)
    }

    setStartDate(newStart)
    setEndDate(newEnd)
  }

  const formatDateRange = () => {
    if (viewType === "day") {
      return startDate.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    } else {
      return `${startDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })} - ${endDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`
    }
  }

  // Get entries for the selected date range
  const filteredEntries = getEntriesByDateRange(startDate, endDate)

  // Calculate total time
  const totalSeconds = filteredEntries.reduce((total, entry) => {
    if (!entry.endTime) return total

    const start = new Date(entry.startTime).getTime()
    const end = new Date(entry.endTime).getTime()
    return total + (end - start) / 1000
  }, 0)

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  // Calculate time by project
  const timeByProject = projects
    .map((project) => {
      const projectEntries = filteredEntries.filter((entry) => entry.projectId === project.id)
      const projectSeconds = projectEntries.reduce((total, entry) => {
        if (!entry.endTime) return total

        const start = new Date(entry.startTime).getTime()
        const end = new Date(entry.endTime).getTime()
        return total + (end - start) / 1000
      }, 0)

      return {
        project,
        seconds: projectSeconds,
        percentage: totalSeconds > 0 ? (projectSeconds / totalSeconds) * 100 : 0,
      }
    })
    .filter((item) => item.seconds > 0)

  // Calculate billable vs non-billable time
  const billableSeconds = filteredEntries.reduce((total, entry) => {
    if (!entry.endTime || !entry.billable) return total

    const start = new Date(entry.startTime).getTime()
    const end = new Date(entry.endTime).getTime()
    return total + (end - start) / 1000
  }, 0)

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${h}h ${m}m`
  }

  return (
    <div className={styles.reports}>
      <div className={styles.header}>
        <h1>Reports</h1>

        <div className={styles.controls}>
          <div className={styles.viewSelector}>
            <button
              className={`${styles.viewButton} ${viewType === "day" ? styles.active : ""}`}
              onClick={() => setViewType("day")}
            >
              Day
            </button>
            <button
              className={`${styles.viewButton} ${viewType === "week" ? styles.active : ""}`}
              onClick={() => setViewType("week")}
            >
              Week
            </button>
            <button
              className={`${styles.viewButton} ${viewType === "month" ? styles.active : ""}`}
              onClick={() => setViewType("month")}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      <div className={styles.dateNavigation}>
        <button className={styles.navButton} onClick={handlePrevPeriod}>
          <ChevronLeft size={20} />
        </button>
        <h2 className={styles.dateRange}>{formatDateRange()}</h2>
        <button className={styles.navButton} onClick={handleNextPeriod}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Clock size={24} />
          </div>
          <div className={styles.summaryContent}>
            <h3>Total Time</h3>
            <p className={styles.summaryValue}>
              {hours}h {minutes}m
            </p>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <DollarSign size={24} />
          </div>
          <div className={styles.summaryContent}>
            <h3>Billable Time</h3>
            <p className={styles.summaryValue}>{formatDuration(billableSeconds)}</p>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Clock size={24} />
          </div>
          <div className={styles.summaryContent}>
            <h3>Non-billable Time</h3>
            <p className={styles.summaryValue}>{formatDuration(totalSeconds - billableSeconds)}</p>
          </div>
        </div>
      </div>

      {timeByProject.length > 0 && (
        <div className={styles.projectBreakdown}>
          <h3>Time by Project</h3>
          <div className={styles.projectList}>
            {timeByProject.map(({ project, seconds, percentage }) => (
              <div key={project.id} className={styles.projectItem}>
                <div className={styles.projectInfo}>
                  <div className={styles.projectColor} style={{ backgroundColor: project.color }}></div>
                  <span className={styles.projectName}>{project.name}</span>
                </div>
                <div className={styles.projectTime}>
                  <span>{formatDuration(seconds)}</span>
                  <span className={styles.percentage}>({percentage.toFixed(1)}%)</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progress}
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: project.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredEntries.length === 0 && (
        <div className={styles.emptyState}>
          <Clock size={48} />
          <h3>No time entries found</h3>
          <p>Start tracking time to see your reports here.</p>
        </div>
      )}
    </div>
  )
}

export default Reports
