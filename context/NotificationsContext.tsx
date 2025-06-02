"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"

// Simple UUID generator function
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export type NotificationType = "success" | "error" | "warning" | "info"

export interface Notification {
  id: string
  type: NotificationType
  message: string
  duration?: number // in milliseconds
}

interface NotificationsContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id">) => void
  removeNotification: (id: string) => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = generateUUID()
    const duration = notification.duration || 5000 // Default 5 seconds

    setNotifications((prev) => [...prev, { ...notification, id }])

    // Auto-remove notification after duration
    setTimeout(() => {
      removeNotification(id)
    }, duration)

    return id
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
