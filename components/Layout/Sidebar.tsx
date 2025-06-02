"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Clock, BarChart2, Folder, Settings } from "lucide-react"
import styles from "@/styles/Sidebar.module.css"

const Sidebar: React.FC = () => {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <Link href="/" className={`${styles.navItem} ${isActive("/") ? styles.active : ""}`}>
          <Clock className={styles.icon} />
          <span>Timer</span>
        </Link>

        <Link href="/reports" className={`${styles.navItem} ${isActive("/reports") ? styles.active : ""}`}>
          <BarChart2 className={styles.icon} />
          <span>Reports</span>
        </Link>

        <Link href="/projects" className={`${styles.navItem} ${isActive("/projects") ? styles.active : ""}`}>
          <Folder className={styles.icon} />
          <span>Projects</span>
        </Link>
      </nav>

      <div className={styles.bottom}>
        <Link href="/settings" className={`${styles.navItem} ${isActive("/settings") ? styles.active : ""}`}>
          <Settings className={styles.icon} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar
