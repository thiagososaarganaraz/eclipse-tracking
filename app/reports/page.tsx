"use client"

import { ThemeProvider } from "@/context/ThemeContext"
import { TimeEntriesProvider } from "@/context/TimeEntriesContext"
import { ProjectsProvider } from "@/context/ProjectsContext"
import { NotificationsProvider } from "@/context/NotificationsContext"
import Layout from "@/components/Layout/Layout"
import Reports from "@/components/Reports/Reports"

export default function ReportsPage() {
  return (
    <ThemeProvider>
      <NotificationsProvider>
        <TimeEntriesProvider>
          <ProjectsProvider>
            <Layout>
              <Reports />
            </Layout>
          </ProjectsProvider>
        </TimeEntriesProvider>
      </NotificationsProvider>
    </ThemeProvider>
  )
}
