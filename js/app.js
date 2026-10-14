/**
 * UroScan AI - Global Application Controller (jQuery)
 * Authentication, Registration Logic, LocalStorage User Manager & Dynamic Profile UI
 */

const DEFAULT_USERS = [
  { id: "USR-1001", name: "Dr. default", email: "doctor@uroscan.demo", password: "demo123", role: "Lead Pathologist" },
  { id: "USR-1002", name: "Dr. Anjali Rao", email: "pathologist@uroscan.demo", password: "demo123", role: "Senior Consultant" }
];

function initUsers() {
  if (!localStorage.getItem("uroscan_users")) {
    localStorage.setItem("uroscan_users", JSON.stringify(DEFAULT_USERS));
  }
}

function getRegisteredUsers() {
  initUsers();
  return JSON.parse(localStorage.getItem("uroscan_users") || "[]");
}

function registerUser(name, email, password, role = "Pathologist") {
  const users = getRegisteredUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (existing) {
    return { success: false, message: "An account with this email address already exists." };
  }

  const newUser = {
    id: "USR-" + Date.now(),
    name: name,
    email: email.toLowerCase(),
    password: password,
    role: role,
    regDate: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem("uroscan_users", JSON.stringify(users));
  return { success: true, user: newUser };
}

function authenticateUser(email, password) {
  const users = getRegisteredUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  
  if (user) {
    localStorage.setItem("uroscan_auth", "true");
    localStorage.setItem("uroscan_auth_user", JSON.stringify(user));
    return { success: true, user: user };
  } else {
    return { success: false, message: "Invalid email or password." };
  }
}

function getCurrentUser() {
  const userStr = localStorage.getItem("uroscan_auth_user");
  if (userStr) {
    try { return JSON.parse(userStr); } catch (e) { }
  }
  return { name: "Dr. default", email: "doctor@uroscan.demo", role: "Lead Pathologist" };
}

$(document).ready(function () {
  initUsers();

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const isAuthenticated = localStorage.getItem("uroscan_auth") === "true";

  if (currentPage !== "index.html" && currentPage !== "" && !isAuthenticated) {
    window.location.href = "index.html";
    return;
  }

  if (currentPage === "index.html" && isAuthenticated) {
    window.location.href = "dashboard.html";
    return;
  }

  // Update Topbar Profile Elements dynamically
  const currentUser = getCurrentUser();
  $(".user-name").text(currentUser.name);
  if ($(".user-role").length) $(".user-role").text(currentUser.role);
  
  // Dynamic Welcome Header
  if ($("#welcomeHeader").length) {
    const hour = new Date().getHours();
    let greeting = "Good Morning";
    if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
    else if (hour >= 17) greeting = "Good Evening";
    
    $("#welcomeHeader").text(`${greeting}, ${currentUser.name}`);
  }

  // Avatar Initials from current user name
  const nameParts = currentUser.name.trim().split(" ").filter(p => p.length > 0);
  let initials = "DN";
  if (nameParts.length >= 2) {
    initials = nameParts[0][0] + nameParts[nameParts.length - 1][0];
  } else if (nameParts.length === 1) {
    initials = nameParts[0].substring(0, 2);
  }
  $(".user-avatar").text(initials.toUpperCase());

  // Navigation Active Class
  $(".nav-item").removeClass("active");
  $(`.nav-item[href="${currentPage}"]`).addClass("active");

  // Mobile Menu Toggle
  $(".mobile-menu-toggle").on("click", function (e) {
    e.stopPropagation();
    $(".sidebar").toggleClass("mobile-open");
  });

  // Notification Icon Popover
  $("#notificationBtn").on("click", function () {
    showToast("Notifications", "You have 2 pending clinical reviews requiring approval.");
  });

  // Settings Modal Nav
  $("#settingsNavBtn").on("click", function (e) {
    e.preventDefault();
    openSettingsModal();
  });

  // Logout Handler
  $("#logoutNavBtn, #logoutBtn").on("click", function (e) {
    e.preventDefault();
    if (confirm("Are you sure you want to sign out of UroScan AI?")) {
      localStorage.removeItem("uroscan_auth");
      localStorage.removeItem("uroscan_auth_user");
      showToast("Signed Out", "Redirecting to login...");
      setTimeout(function () {
        window.location.href = "index.html";
      }, 500);
    }
  });
});

function showToast(title, message) {
  let container = $(".toast-container");
  if (!container.length) {
    $("body").append('<div class="toast-container"></div>');
    container = $(".toast-container");
  }

  const toastId = "toast-" + Date.now();
  const toastHtml = `
    <div id="${toastId}" class="toast">
      <div style="font-weight: bold;">${escapeHtml(title)}</div>
      <div style="color: #718096; margin-top: 2px;">${escapeHtml(message)}</div>
    </div>
  `;

  container.append(toastHtml);
  setTimeout(function () {
    $(`#${toastId}`).fadeOut(300, function () { $(this).remove(); });
  }, 3500);
}

function openSettingsModal() {
  let modal = $("#settingsModal");
  if (!modal.length) {
    const modalHtml = `
      <div id="settingsModal" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="page-header" style="margin-bottom: 15px;">
            <h3>System Settings</h3>
            <button onclick="closeModal('#settingsModal')" style="background:none; border:none; font-size:18px; cursor:pointer;">&times;</button>
          </div>
          <div class="form-group">
            <label class="form-label">Reader Device</label>
            <input type="text" class="form-control" value="UroScan Reader (UR-PI-001)" readonly>
          </div>
          <div class="form-group">
            <label class="form-label">Logged In User</label>
            <input type="text" class="form-control" value="${escapeHtml(getCurrentUser().name)} (${escapeHtml(getCurrentUser().email)})" readonly>
          </div>
          <div style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">
            <button id="resetDataBtn" class="btn btn-outline" style="color: #c05621;">Reset Demo Data</button>
            <button class="btn btn-primary" onclick="closeModal('#settingsModal')">Close</button>
          </div>
        </div>
      </div>
    `;
    $("body").append(modalHtml);
    modal = $("#settingsModal");
  }

  modal.fadeIn(200).css("display", "flex");

  $("#resetDataBtn").off("click").on("click", function () {
    if (confirm("Reset all patient data and test history back to defaults?")) {
      resetDemoData();
      showToast("Data Reset", "Demo dataset restored.");
      closeModal("#settingsModal");
      setTimeout(function () { window.location.reload(); }, 500);
    }
  });
}

function closeModal(selector) {
  $(selector).fadeOut(200);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
  });
}

function renderUrineStripHtml(analytesObj, stripId = "urineStrip") {
  const padKeys = [
    { key: "glucose", code: "GLU", name: "Glucose" },
    { key: "protein", code: "PRO", name: "Protein" },
    { key: "ph", code: "pH", name: "pH" },
    { key: "ketones", code: "KET", name: "Ketones" },
    { key: "blood", code: "BLO", name: "Blood" },
    { key: "bilirubin", code: "BIL", name: "Bilirubin" },
    { key: "urobilinogen", code: "URO", name: "Urobilinogen" },
    { key: "nitrite", code: "NIT", name: "Nitrite" },
    { key: "leucocytes", code: "LEU", name: "Leucocytes" },
    { key: "specificGravity", code: "SG", name: "Specific Gravity" }
  ];

  let padsHtml = "";
  padKeys.forEach(p => {
    const item = analytesObj ? analytesObj[p.key] : null;
    const color = item ? item.padColor : "#e2e8f0";
    const val = item ? item.val : "Ready";

    padsHtml += `
      <div class="reagent-pad-item" title="${p.name}: ${val}">
        <div class="reagent-pad-color" style="background-color: ${color}"></div>
        <span>${p.code}</span>
        <span style="font-size: 9px; color: #718096;">${item ? (item.padCode || val) : '-'}</span>
      </div>
    `;
  });

  return `
    <div id="${stripId}" class="urine-strip-container">
      <div class="reagent-pads-row">
        ${padsHtml}
      </div>
    </div>
  `;
}
