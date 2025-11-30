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

  // 1. Fetch Projects (Only works if we want it to)
  async function fetchProjects() {
    const response = await fetch("http://127.0.0.1:8000/hello/");
    const data = await response.json();
    setProjects(data);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  // 2. THE NEW LOGIN FUNCTION
  async function handleLogin(e) {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/login/", {
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
    await fetch("http://127.0.0.1:8000/add-project/", {
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

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {/* --- SHOW LOGIN SCREEN IF NOT LOGGED IN --- */}
      {!isLoggedIn ? (
        <div
          style={{
            border: "2px solid blue",
            padding: "20px",
            borderRadius: "10px",
            maxWidth: "300px",
          }}
        >
          <h2>Please Login</h2>
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <input
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              style={{ background: "blue", color: "white" }}
            >
              Login
            </button>
          </form>
        </div>
      ) : (
        /* --- SHOW DASHBOARD IF LOGGED IN --- */
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1>Welcome, {user}!</h1>
            <button
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("username");
                setIsLoggedIn(false);
                setUser("");
              }}
              style={{ background: "red", color: "white" }}
            >
              Logout
            </button>
          </div>

          {/* Add Project Form */}
          <div
            style={{
              background: "#f0f0f0",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <h3>Add New Project</h3>
            <input
              placeholder="Name"
              value={projName}
              onChange={(e) => setProjName(e.target.value)}
              style={{ marginRight: "5px" }}
            />
            <input
              placeholder="Language"
              value={projLang}
              onChange={(e) => setProjLang(e.target.value)}
              style={{ marginRight: "5px" }}
            />
            <input
              placeholder="Description"
              value={projDesc}
              onChange={(e) => setProjDesc(e.target.value)}
            />
            {/* NEW: File Input */}
            <input
              type="file"
              id="fileInput"
              onChange={(e) => setProjImage(e.target.files[0])}
              style={{ marginTop: "10px" }}
            />
            <button onClick={handleAddProject} style={{ marginLeft: "10px" }}>
              Add
            </button>
          </div>

         {/* Render projects list */}
         <div>
           {projects.map((project) => (
             <div
               key={project.id || project.name}
               style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px", marginBottom: "10px" }}
             >
               <h4>{project.name}</h4>
               <p>
                 <strong>Language:</strong> {project.language}
               </p>
               <p>{project.description}</p>

               {project.image && (
                 <div style={{ marginTop: "10px" }}>
                   {/* LOGIC: Is it a video? */}
                   {isVideo(project.image) ? (
                     <video controls width="100%" style={{ borderRadius: "8px" }}>
                       <source src={`http://127.0.0.1:8000/media/${project.image}`} type="video/mp4" />
                       Your browser does not support the video tag.
                     </video>
                   ) : (
                     /* LOGIC: No? Then it must be an image */
                     <img
                       src={`http://127.0.0.1:8000/media/${project.image}`}
                       alt={project.name}
                       style={{ width: "200px", borderRadius: "8px" }}
                     />
                   )}
                 </div>
               )}
             </div>
           ))}
         </div>
       </div>
      )}
    </div>
  );
}

export default App;
