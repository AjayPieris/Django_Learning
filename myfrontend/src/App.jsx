import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [projects, setProjects] = useState([]);

  // --- AUTH STATE ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [isLoggedIn, setIsLoggedIn] = useState(false) // Keeps track: Are we logged in?

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  // const [user, setUser] = useState("") // Stores the username if logged in
  const [user, setUser] = useState(localStorage.getItem("username") || "");

  // --- PROJECT FORM STATE ---
  const [projName, setProjName] = useState("");
  const [projLang, setProjLang] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projImage, setProjImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false); // Default = Closed

  // 1. Fetch Projects (Only works if we want it to)
  async function fetchProjects() {
    const response = await fetch("https://AjayAR2001.pythonanywhere.com/hello/");
    const data = await response.json();
    setProjects(data);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  // 2. THE NEW LOGIN FUNCTION
  async function handleLogin(e) {
    e.preventDefault();

    const response = await fetch("https://AjayAR2001.pythonanywhere.com/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // If Django says "Yes"
      // setIsLoggedIn(true)
      // setUser(data.username)
      // alert("Welcome " + data.username + "!")

      // Save to browser memory
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", data.username);

      // Update state
      setIsLoggedIn(true);
      setUser(data.username);
      alert("Welcome " + data.username + "!");
    } else {
      // If Django says "No"
      alert("Login Failed: " + data.error);
    }
  }

  // 3. Add Project Function
  async function handleAddProject(e) {
    e.preventDefault();

    // 1. Create a "FormData" package
    const formData = new FormData();
    formData.append("name", projName);
    formData.append("language", projLang);
    formData.append("description", projDesc);

    // Only append image if the user selected one
    if (projImage) {
      formData.append("image", projImage);
    }

    // 2. Send the package
    // Note: We REMOVED 'Content-Type': 'application/json'
    // The browser sets the correct boundary headers automatically for files.
    await fetch("https://AjayAR2001.pythonanywhere.com/add-project/", {
      method: "POST",
      body: formData,
    });

    // 3. Cleanup
    setProjName("");
    setProjLang("");
    setProjDesc("");
    setProjImage(null);

    // Reset the file input manually (a small React trick)
    document.getElementById("fileInput").value = "";

    fetchProjects();
  }

  // Helper to check if a file is a video
  function isVideo(url) {
    // If no URL, return false
    if (!url) return false;
    // Check if it ends with .mp4, .webm, or .ogg
    return url.toLowerCase().match(/\.(mp4|webm|ogg)$/);
  }

  // Function to delete a project
  async function handleDelete(id) {
    // 1. Ask for confirmation (Safety first!)
    if (confirm("Are you sure you want to delete this?")) {
      // 2. Send the DELETE command to Django
      await fetch(`https://AjayAR2001.pythonanywhere.com/delete-project/${id}/`, {
        method: "DELETE",
      });

      // 3. Refresh the list to show it's gone
      fetchProjects();
    }
  }

  // 1. Fill the form with existing data
  function startEditing(project) {
    setProjName(project.name);
    setProjLang(project.language);
    setProjDesc(project.description);
    setEditingId(project.id); // Turn on "Edit Mode"
    setIsFormOpen(true); // <--- Force the form to open!

    // Scroll to top so user sees the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 2. Send the updates to Django
  async function handleUpdate() {
    const formData = new FormData();
    formData.append("name", projName);
    formData.append("language", projLang);
    formData.append("description", projDesc);
    if (projImage) {
      formData.append("image", projImage);
    }

    await fetch(`https://AjayAR2001.pythonanywhere.com/update-project/${editingId}/`, {
      method: "POST",
      body: formData,
    });

    // Cleanup
    setProjName("");
    setProjLang("");
    setProjDesc("");
    setProjImage(null);
    setEditingId(null); // Turn off "Edit Mode"
    document.getElementById("fileInput").value = "";
    fetchProjects();
  }

  return (
    <div className="app">
      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <h1>CRUD</h1>
        {isLoggedIn && (
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span>Hello, {user}</span>
            <button
              className="btn btn-danger"
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("username");
                setIsLoggedIn(false);
                setUser("");
              }}
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      <div className="container">
        {/* --- LOGIN SCREEN --- */}
        {!isLoggedIn ? (
          <div
            className="form-box"
            style={{ textAlign: "center", marginTop: "100px" }}
          >
            <h2>Please Login</h2>
            <form onSubmit={handleLogin} className="form-inputs">
              <input
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </form>
          </div>
        ) : (
          /* --- DASHBOARD --- */
          <div>
            {/* 1. The "Show Form" Button (Only visible if form is CLOSED) */}
            {!isFormOpen && (
              <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <button
                  onClick={() => {
                    setIsFormOpen(true);
                    setEditingId(null); // Ensure we are in "Add Mode"
                    setProjName("");
                    setProjLang("");
                    setProjDesc(""); // Clear old data
                  }}
                  className="btn btn-primary"
                  style={{ fontSize: "18px", padding: "15px 30px" }}
                >
                  + Create New Project
                </button>
              </div>
            )}

            {/* 2. The Form (Only visible if form is OPEN) */}
            {isFormOpen && (
              <div className="form-box">
                <h3>{editingId ? "Edit Project" : "Add New Project"}</h3>
                <div className="form-inputs">
                  <input
                    placeholder="Project Name"
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                  />
                  <input
                    placeholder="Language (e.g. Python)"
                    value={projLang}
                    onChange={(e) => setProjLang(e.target.value)}
                  />
                  <textarea
                    placeholder="Description"
                    rows="3"
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                  />
                  <input
                    type="file"
                    id="fileInput"
                    onChange={(e) => setProjImage(e.target.files[0])}
                  />

                  <div style={{ display: "flex", gap: "10px" }}>
                    {/* Submit Button */}
                    {editingId ? (
                      <button
                        onClick={handleUpdate}
                        className="btn btn-success"
                        style={{ flex: 1 }}
                      >
                        Update Project
                      </button>
                    ) : (
                      <button
                        onClick={handleAddProject}
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                      >
                        Save Project
                      </button>
                    )}

                    {/* Cancel Button - Closes the form */}
                    <button
                      onClick={() => {
                        setIsFormOpen(false); // <--- Close the form
                        setEditingId(null);
                        setProjName("");
                        setProjLang("");
                        setProjDesc("");
                      }}
                      className="btn btn-warning"
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* --- PROJECT GRID --- */}
            <div className="project-grid">
              {projects.map((project) => (
                <div key={project.id} className="card">
                  {/* Action Buttons */}
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="action-btn delete-btn"
                  >
                    X
                  </button>
                  <button
                    onClick={() => startEditing(project)}
                    className="action-btn edit-btn"
                  >
                    ✎
                  </button>

                  {/* Media Display (Video/Image) */}
                  {project.image && (
                    <div className="media-container">
                      {isVideo(project.image) ? (
                        <video controls className="card-media">
                          <source
                            src={`https://AjayAR2001.pythonanywhere.com/media/${project.image}`}
                            type="video/mp4"
                          />
                        </video>
                      ) : (
                        <img
                          src={`https://AjayAR2001.pythonanywhere.com/media/${project.image}`}
                          alt={project.name}
                          className="card-media"
                        />
                      )}
                    </div>
                  )}

                  {/* Text Content */}
                  <div className="card-content">
                    <span className="card-badge">{project.language}</span>
                    <h3 className="card-title">{project.name}</h3>
                    <p style={{ color: "#666", lineHeight: "1.5" }}>
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
