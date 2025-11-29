import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [projects, setProjects] = useState([])
  
  // --- AUTH STATE ---
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Keeps track: Are we logged in?
  const [user, setUser] = useState("") // Stores the username if logged in

  // --- PROJECT FORM STATE ---
  const [projName, setProjName] = useState("")
  const [projLang, setProjLang] = useState("")
  const [projDesc, setProjDesc] = useState("")

  // 1. Fetch Projects (Only works if we want it to)
  async function fetchProjects() {
    const response = await fetch('http://127.0.0.1:8000/hello/')
    const data = await response.json()
    setProjects(data)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // 2. THE NEW LOGIN FUNCTION
  async function handleLogin(e) {
    e.preventDefault()
    
    const response = await fetch('http://127.0.0.1:8000/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()

    if (response.ok) {
      // If Django says "Yes"
      setIsLoggedIn(true)
      setUser(data.username)
      alert("Welcome " + data.username + "!")
    } else {
      // If Django says "No"
      alert("Login Failed: " + data.error)
    }
  }

  // 3. Add Project Function
  async function handleAddProject(e) {
    e.preventDefault()
    const projectData = { name: projName, language: projLang, description: projDesc }
    await fetch('http://127.0.0.1:8000/add-project/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    })
    setProjName(""); setProjLang(""); setProjDesc("");
    fetchProjects() 
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      
      {/* --- SHOW LOGIN SCREEN IF NOT LOGGED IN --- */}
      {!isLoggedIn ? (
        <div style={{ border: "2px solid blue", padding: "20px", borderRadius: "10px", maxWidth: "300px" }}>
          <h2>Please Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" style={{ background: "blue", color: "white" }}>Login</button>
          </form>
        </div>
      ) : (
        /* --- SHOW DASHBOARD IF LOGGED IN --- */
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1>Welcome, {user}!</h1>
            <button onClick={() => setIsLoggedIn(false)} style={{ background: "red", color: "white" }}>Logout</button>
          </div>

          {/* Add Project Form */}
          <div style={{ background: "#f0f0f0", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
             <h3>Add New Project</h3>
             <input placeholder="Name" value={projName} onChange={(e) => setProjName(e.target.value)} style={{marginRight: "5px"}}/>
             <input placeholder="Language" value={projLang} onChange={(e) => setProjLang(e.target.value)} style={{marginRight: "5px"}}/>
             <input placeholder="Description" value={projDesc} onChange={(e) => setProjDesc(e.target.value)} />
             <button onClick={handleAddProject} style={{ marginLeft: "10px" }}>Add</button>
          </div>

          {/* List Projects */}
          {projects.map((project) => (
            <div key={project.id} style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}>
              <h3>{project.name}</h3>
              <p>{project.language}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App