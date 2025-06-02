"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useProjects } from "@/context/ProjectsContext"
import { useNotifications } from "@/context/NotificationsContext"
import { DollarSign } from "lucide-react"
import styles from "@/styles/ProjectForm.module.css"

interface ProjectFormProps {
  projectId: string | null
  onClose: () => void
}

const ProjectForm: React.FC<ProjectFormProps> = ({ projectId, onClose }) => {
  const [name, setName] = useState("")
  const [color, setColor] = useState("#FA8072")
  const [billable, setBillable] = useState(false)

  const { projects, addProject, updateProject } = useProjects()
  const { addNotification } = useNotifications()

  // Predefined colors
  const colorOptions = [
    "#FA8072", // Salmon (accent)
    "#10B981", // Green (success)
    "#F59E0B", // Yellow (warning)
    "#EF4444", // Red (error)
    "#3B82F6", // Blue
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#14B8A6", // Teal
  ]

  useEffect(() => {
    if (projectId) {
      const project = projects.find((p) => p.id === projectId)
      if (project) {
        setName(project.name)
        setColor(project.color)
        setBillable(project.billable)
      }
    }
  }, [projectId, projects])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      addNotification({
        type: "error",
        message: "Project name is required",
        duration: 3000,
      })
      return
    }

    try {
      if (projectId) {
        updateProject(projectId, { name, color, billable })
        addNotification({
          type: "success",
          message: "Project updated",
          duration: 3000,
        })
      } else {
        addProject({ name, color, billable })
        addNotification({
          type: "success",
          message: "Project created",
          duration: 3000,
        })
      }

      onClose()
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to save project",
        duration: 5000,
      })
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Project Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter project name"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label>Color</label>
        <div className={styles.colorPicker}>
          {colorOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`${styles.colorOption} ${color === option ? styles.selectedColor : ""}`}
              style={{ backgroundColor: option }}
              onClick={() => setColor(option)}
              aria-label={`Select color ${option}`}
            />
          ))}
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
          <span>Billable by default</span>
        </label>
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={styles.submitButton}>
          {projectId ? "Update" : "Create"} Project
        </button>
      </div>
    </form>
  )
}

export default ProjectForm
