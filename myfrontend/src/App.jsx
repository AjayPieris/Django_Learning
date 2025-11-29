import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // 1. Create a "Basket" to hold the projects
  // initially, the basket is an empty list []
  const [projects, setProjects] = useState([])

  // 2. This runs AUTOMATICALLY when the page loads
  useEffect(() => {
    async function fetchProjects() {
      try {
        // Go to the Django URL
        const response = await fetch('http://127.0.0.1:8000/hello/')
        
        // Convert the answer to JSON
        const data = await response.json()

        // Put the data into our Basket
        setProjects(data)
        console.log("Data received:", data) // Check your browser console!
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchProjects()
  }, []) // The empty [] means "Run this only once"

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>My Portfolio Projects</h1>
      
      {/* 3. Loop through the basket and show each item */}
      {projects.map((project) => (
        <div key={project.id} style={{ border: "1px solid #ddd", margin: "10px", padding: "10px", borderRadius: "8px" }}>
          <h2>{project.name}</h2>
          <p><strong>Language:</strong> {project.language}</p>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  )
}

export default App