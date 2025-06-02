"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useProjects } from "@/context/ProjectsContext"
import { ChevronDown, X } from "lucide-react"
import styles from "@/styles/ProjectSelector.module.css"

interface ProjectSelectorProps {
  selectedProject: string | null
  onSelectProject: (projectId: string | null) => void
  disabled?: boolean
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ selectedProject, onSelectProject, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { projects, getProjectById } = useProjects()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selected = selectedProject ? getProjectById(selectedProject) : null

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  const handleSelectProject = (projectId: string | null) => {
    onSelectProject(projectId)
    setIsOpen(false)
  }

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelectProject(null)
  }

  return (
    <div className={`${styles.projectSelector} ${disabled ? styles.disabled : ""}`} ref={dropdownRef}>
      <div className={styles.selector} onClick={toggleDropdown}>
        {selected ? (
          <div className={styles.selectedProject}>
            <div className={styles.colorDot} style={{ backgroundColor: selected.color }}></div>
            <span>{selected.name}</span>
            {!disabled && (
              <button className={styles.clearButton} onClick={clearSelection} aria-label="Clear selection">
                <X size={14} />
              </button>
            )}
          </div>
        ) : (
          <span className={styles.placeholder}>Select a project</span>
        )}
        <ChevronDown size={16} className={styles.chevron} />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownItem} onClick={() => handleSelectProject(null)}>
            <span>No project</span>
          </div>

          {projects.map((project) => (
            <div key={project.id} className={styles.dropdownItem} onClick={() => handleSelectProject(project.id)}>
              <div className={styles.colorDot} style={{ backgroundColor: project.color }}></div>
              <span>{project.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectSelector
