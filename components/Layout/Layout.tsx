import type React from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import styles from "@/styles/Layout.module.css"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}

export default Layout
