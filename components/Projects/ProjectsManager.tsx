"use client"

import type React from "react"
import { useState } from "react"
import { useProjects } from "@/context/ProjectsContext"
import { useNotifications } from "@/context/NotificationsContext"
import { Plus, Edit, Trash2, DollarSign } from "lucide-react"
import Modal from "../UI/Modal"
import ProjectForm from "./ProjectForm"
import styles from "@/styles/ProjectsManager.module.css"

const ProjectsManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const { projects, deleteProject } = useProjects()
  const { addNotification } = useNotifications()

  const handleAddProject = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const handleEditProject = (id: string) => {
    setEditingProject(id)
    setIsModalOpen(true)
  }

  const handleDeleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      deleteProject(id)
      addNotification({
        type: "success",
        message: "Project deleted",
        duration: 3000,
      })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
  }

  return (
    <div className={styles.projectsManager}>
      <div className={styles.header}>
        <h1>Projects</h1>
        <button className={styles.addButton} onClick={handleAddProject}>
          <Plus size={20} />
          <span>Add Project</span>
        </button>
      </div>

      <div className={styles.projectsList}>
        {projects.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No projects yet. Create your first project to get started.</p>
          </div>
        ) : (
          <table className={styles.projectsTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Color</th>
                <th>Billable</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className={styles.projectRow}>
                  <td>
                    <div className={styles.projectName}>
                      <div className={styles.colorDot} style={{ backgroundColor: project.color }}></div>
                      <span>{project.name}</span>
                    </div>
                  </td>
                  <td>{project.color}</td>
                  <td>{project.billable ? <DollarSign size={16} className={styles.billableIcon} /> : "-"}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleEditProject(project.id)}
                        aria-label="Edit project"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleDeleteProject(project.id)}
                        aria-label="Delete project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProject ? "Edit Project" : "Add Project"}>
        <ProjectForm projectId={editingProject} onClose={handleCloseModal} />
      </Modal>
    </div>
  )
}

export default ProjectsManager
