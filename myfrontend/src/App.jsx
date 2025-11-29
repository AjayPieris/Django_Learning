import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [projects, setProjects] = useState([])
  
  // New State for the Form
  const [name, setName] = useState("")
  const [language, setLanguage] = useState("")
  const [description, setDescription] = useState("")

  // Fetch Function (Reused from before)
  async function fetchProjects() {
    const response = await fetch('http://127.0.0.1:8000/hello/')
    const data = await response.json()
    setProjects(data)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // New Function: Send Data to Django
  async function handleSubmit(e) {
    e.preventDefault() // Stop page refresh

    const projectData = { name, language, description }

    // The POST Request
    await fetch('http://127.0.0.1:8000/add-project/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    })

    // Clear form and refresh list
    setName("")
    setLanguage("")
    setDescription("")
    fetchProjects() 
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>My Portfolio Projects</h1>

      {/* --- THE NEW FORM --- */}
      <div style={{ background: "#f0f0f0", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>Add New Project</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: "300px" }}>
          <input 
            placeholder="Project Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <input 
            placeholder="Language (e.g. Python)" 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)} 
          />
          <textarea 
            placeholder="Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
          <button type="submit" style={{ padding: "10px", background: "blue", color: "white", border: "none" }}>Add Project</button>
        </form>
      </div>

      {/* --- THE LIST --- */}
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