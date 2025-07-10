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

export interface Project {
  id: string
  name: string
  color: string
  billable: boolean
  createdAt: string // ISO string
  updatedAt: string // ISO string
}

interface ProjectsContextType {
  projects: Project[]
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  getProjectById: (id: string) => Project | undefined
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([])

  // Load projects from localStorage on initial render
  useEffect(() => {
    const savedProjects = localStorage.getItem("projects")
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    } else {
      // Add some default projects if none exist
      const defaultProjects: Project[] = [
        {
          id: generateUUID(),
          name: "Personal",
          color: "#10B981",
          billable: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: generateUUID(),
          name: "Work",
          color: "#FA8072",
          billable: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]
      setProjects(defaultProjects)
      localStorage.setItem("projects", JSON.stringify(defaultProjects))
    }
  }, [])

  // Save projects to localStorage whenever they change, but not if empty on first load
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("projects", JSON.stringify(projects))
    }
  }, [projects])

  const addProject = (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    const newProject: Project = {
      ...project,
      id: generateUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setProjects((prev) => [...prev, newProject])
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, ...updates, updatedAt: new Date().toISOString() } : project,
      ),
    )
  }

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== id))
  }

  const getProjectById = (id: string | null) => {
    if (!id) return undefined
    return projects.find((project) => project.id === id)
  }

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        getProjectById,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider")
  }
  return context
}
