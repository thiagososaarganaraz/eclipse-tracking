"use client"

import { ThemeProvider } from "@/context/ThemeContext"
import { TimeEntriesProvider } from "@/context/TimeEntriesContext"
import { ProjectsProvider } from "@/context/ProjectsContext"
import { NotificationsProvider } from "@/context/NotificationsContext"
import Layout from "@/components/Layout/Layout"
import ProjectsManager from "@/components/Projects/ProjectsManager"

export default function ProjectsPage() {
  return (
    <ThemeProvider>
      <NotificationsProvider>
        <TimeEntriesProvider>
          <ProjectsProvider>
            <Layout>
              <ProjectsManager />
            </Layout>
          </ProjectsProvider>
        </TimeEntriesProvider>
      </NotificationsProvider>
    </ThemeProvider>
  )
}
