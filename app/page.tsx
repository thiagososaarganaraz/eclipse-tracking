"use client"

import { useEffect } from "react"
import { ThemeProvider } from "@/context/ThemeContext"
import { TimeEntriesProvider } from "@/context/TimeEntriesContext"
import { ProjectsProvider } from "@/context/ProjectsContext"
import { NotificationsProvider } from "@/context/NotificationsContext"
import Layout from "@/components/Layout/Layout"
import Dashboard from "@/components/Dashboard/Dashboard"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  return (
    <ThemeProvider>
      <NotificationsProvider>
        <ProjectsProvider>
          <TimeEntriesProvider>
            <Layout>
              <Dashboard />
            </Layout>
          </TimeEntriesProvider>
        </ProjectsProvider>
      </NotificationsProvider>
    </ThemeProvider>
  )
}
