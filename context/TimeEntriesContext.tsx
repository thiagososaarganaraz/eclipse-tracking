"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

// Simple UUID generator function
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export interface TimeEntry {
  id: string
  description: string
  projectId: string | null
  startTime: string // ISO string
  endTime: string | null // ISO string or null if ongoing
  billable: boolean
  createdAt: string // ISO string
  updatedAt: string // ISO string
}

interface TimeEntriesContextType {
  entries: TimeEntry[]
  activeEntry: TimeEntry | null
  startTimer: (description?: string, projectId?: string | null) => void
  stopTimer: () => void
  addEntry: (entry: Omit<TimeEntry, "id" | "createdAt" | "updatedAt">) => void
  updateEntry: (id: string, updates: Partial<TimeEntry>) => void
  deleteEntry: (id: string) => void
  getEntryById: (id: string) => TimeEntry | undefined
  getEntriesByDate: (date: Date) => TimeEntry[]
  getEntriesByDateRange: (startDate: Date, endDate: Date) => TimeEntry[]
  getEntriesByProject: (projectId: string) => TimeEntry[]
}

const TimeEntriesContext = createContext<TimeEntriesContextType | undefined>(undefined)

export const TimeEntriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null)

  // Load entries from localStorage on initial render
  useEffect(() => {
    const savedEntries = localStorage.getItem("timeEntries")
    const savedActiveEntry = localStorage.getItem("activeEntry")

    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }

    if (savedActiveEntry) {
      setActiveEntry(JSON.parse(savedActiveEntry))
    }
  }, [])

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("timeEntries", JSON.stringify(entries))
  }, [entries])

  // Save active entry to localStorage whenever it changes
  useEffect(() => {
    if (activeEntry) {
      localStorage.setItem("activeEntry", JSON.stringify(activeEntry))
    } else {
      localStorage.removeItem("activeEntry")
    }
  }, [activeEntry])

  const startTimer = (description = "", projectId = null) => {
    if (activeEntry) {
      stopTimer()
    }

    const newEntry: TimeEntry = {
      id: generateUUID(),
      description,
      projectId,
      startTime: new Date().toISOString(),
      endTime: null,
      billable: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setActiveEntry(newEntry)
  }

  const stopTimer = () => {
    if (activeEntry) {
      const stoppedEntry = {
        ...activeEntry,
        endTime: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setEntries((prev) => [stoppedEntry, ...prev])
      setActiveEntry(null)
    }
  }

  const addEntry = (entry: Omit<TimeEntry, "id" | "createdAt" | "updatedAt">) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setEntries((prev) => [newEntry, ...prev])
  }

  const updateEntry = (id: string, updates: Partial<TimeEntry>) => {
    if (activeEntry && activeEntry.id === id) {
      setActiveEntry({
        ...activeEntry,
        ...updates,
        updatedAt: new Date().toISOString(),
      })
    } else {
      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, ...updates, updatedAt: new Date().toISOString() } : entry)),
      )
    }
  }

  const deleteEntry = (id: string) => {
    if (activeEntry && activeEntry.id === id) {
      setActiveEntry(null)
    } else {
      setEntries((prev) => prev.filter((entry) => entry.id !== id))
    }
  }

  const getEntryById = (id: string) => {
    if (activeEntry && activeEntry.id === id) return activeEntry
    return entries.find((entry) => entry.id === id)
  }

  const getEntriesByDate = (date: Date) => {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return entries.filter((entry) => {
      const entryStart = new Date(entry.startTime)
      return entryStart >= startOfDay && entryStart <= endOfDay
    })
  }

  const getEntriesByDateRange = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)

    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    return entries.filter((entry) => {
      const entryStart = new Date(entry.startTime)
      return entryStart >= start && entryStart <= end
    })
  }

  const getEntriesByProject = (projectId: string) => {
    return entries.filter((entry) => entry.projectId === projectId)
  }

  return (
    <TimeEntriesContext.Provider
      value={{
        entries,
        activeEntry,
        startTimer,
        stopTimer,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntryById,
        getEntriesByDate,
        getEntriesByDateRange,
        getEntriesByProject,
      }}
    >
      {children}
    </TimeEntriesContext.Provider>
  )
}

export const useTimeEntries = (): TimeEntriesContextType => {
  const context = useContext(TimeEntriesContext)
  if (context === undefined) {
    throw new Error("useTimeEntries must be used within a TimeEntriesProvider")
  }
  return context
}
