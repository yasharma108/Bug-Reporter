const API = `${BACKEND_URL}/api/bugs`;
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

const severityOrder = { "high": 1, "medium": 2, "low": 3 };

async function loadBugs() {
  const res = await fetch(API, {
    headers: { Authorization: token }
  });

  let bugs = await res.json();

  // Sort by severity (high > medium > low)
  bugs.sort((a, b) => (severityOrder[a.severity] || 4) - (severityOrder[b.severity] || 4));

  updateTriageBanner(bugs);

  const list = document.getElementById("bugList");
  list.innerHTML = "";

  bugs.forEach(bug => {
    const li = document.createElement("li");
    li.className = "card";
    li.id = `bug-card-${bug._id}`;

    const badgeClass = bug.severity ? bug.severity.toLowerCase() : "low";

    let codeBlock = "";
    if (bug.codeSnippet) {
       codeBlock = `<pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; font-size: 0.85rem; overflow-x: auto; font-family: monospace;"><code>${bug.codeSnippet.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
    }

    li.innerHTML = `
      <div class="card-header">
        <span class="card-title">${bug.title}</span>
        <span class="badge ${badgeClass}">${bug.severity || "low"}</span>
      </div>
      <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 5px;">
        Status: ${bug.status || "open"}
      </div>
      ${codeBlock}

      <div class="card-actions">
        <select onchange="updateStatus('${bug._id}', this.value)">
          <option value="open" ${bug.status === "open" ? "selected" : ""}>Open</option>
          <option value="in-progress" ${bug.status === "in-progress" ? "selected" : ""}>In Progress</option>
          <option value="resolved" ${bug.status === "resolved" ? "selected" : ""}>Resolved</option>
        </select>
        <button class="btn-idea" onclick="getIdea('${bug._id}')">Get AI Solution</button>
        <button class="btn-danger" onclick="deleteBug('${bug._id}')">Delete</button>
      </div>
      <div id="idea-${bug._id}" class="suggestion-box"></div>
    `;

    list.appendChild(li);
  });
}

function updateTriageBanner(bugs) {
  const banner = document.getElementById("triageBanner");
  const openBugs = bugs.filter(b => b.status === "open" || b.status === "in-progress");
  
  if (openBugs.length === 0) {
    banner.style.display = "none";
    return;
  }

  const topBug = openBugs[0]; // Already sorted by severity
  
  banner.style.display = "flex";
  banner.className = "triage-banner"; // reset class
  
  let icon = "🟢";
  if (topBug.severity === "high") {
    banner.classList.add("high-banner");
    icon = "🚨";
  } else if (topBug.severity === "medium") {
    banner.classList.add("medium-banner");
    icon = "⚡";
  } else {
    banner.classList.add("low-banner");
  }

  banner.innerHTML = `
    <h3>${icon} Recommended Next Task</h3>
    <p>You have <strong>${openBugs.length}</strong> open bug(s). Based on severity, we recommend you proceed with:</p>
    <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border-left: 4px solid var(--${topBug.severity === 'medium' ? 'med-sev' : topBug.severity === 'high' ? 'high-sev' : 'low-sev'});">
      <strong>${topBug.title}</strong>
    </div>
    <div class="banner-actions">
      <button onclick="document.getElementById('bug-card-${topBug._id}').scrollIntoView({behavior: 'smooth'})">Go to Bug</button>
      <button class="btn-idea" onclick="document.getElementById('bug-card-${topBug._id}').scrollIntoView({behavior: 'smooth'}); getIdea('${topBug._id}')">Get AI Solution Idea</button>
    </div>
  `;
}

async function getIdea(id) {
  const box = document.getElementById(`idea-${id}`);
  box.innerHTML = "Thinking...";
  box.classList.add("active");

  try {
    const res = await fetch(`${API}/${id}/suggest`, {
      headers: { Authorization: token }
    });
    const data = await res.json();
    if (res.ok) {
        box.innerHTML = `<strong>Suggestion:</strong> ${data.suggestion}`;
    } else {
        box.innerHTML = `<strong>Error:</strong> ${data.message}`;
    }
  } catch (e) {
    box.innerHTML = "<strong>Error:</strong> Failed to fetch idea.";
  }
}

async function createBug() {
  const title = document.getElementById("title").value;
  const severity = document.getElementById("severity").value;
  const codeSnippet = document.getElementById("codeSnippet").value;

  if (!title) {
    alert("Title is required");
    return;
  }
  if (!severity) {
    alert("Please select a severity");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ title, severity, codeSnippet, status: "open" })
  });

  document.getElementById("title").value = "";
  document.getElementById("severity").value = "";
  document.getElementById("codeSnippet").value = "";

  loadBugs();
}

async function deleteBug(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: token }
  });

  loadBugs();
}

async function updateStatus(id, status) {
  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ status })
  });

  loadBugs();
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

loadBugs();