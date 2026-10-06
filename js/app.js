/**
 * UroScan AI - Global Application Controller (jQuery)
 * Handles global navigation, auth session checks, toast alerts, settings modal, and layout responsiveness.
 */

$(document).ready(function () {
  // 1. Check Authentication Session
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

  // 2. Highlight Active Navigation Menu Item
  $(".nav-item").removeClass("active");
  $(`.nav-item[href="${currentPage}"]`).addClass("active");

  // 3. Mobile Sidebar Toggle
  $(".mobile-menu-toggle").on("click", function (e) {
    e.stopPropagation();
    $(".sidebar").toggleClass("mobile-open");
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest(".sidebar, .mobile-menu-toggle").length) {
      $(".sidebar").removeClass("mobile-open");
    }
  });

  // 4. Notification Icon Popover Toggle
  $("#notificationBtn").on("click", function (e) {
    e.stopPropagation();
    showToast("Notifications", "You have 2 pending clinical reviews requiring approval.", "info");
  });

  // 5. Global Settings Modal
  $("#settingsNavBtn").on("click", function (e) {
    e.preventDefault();
    openSettingsModal();
  });

  // 6. Global Logout Handler
  $("#logoutNavBtn, #logoutBtn").on("click", function (e) {
    e.preventDefault();
    if (confirm("Are you sure you want to sign out of UroScan AI?")) {
      localStorage.removeItem("uroscan_auth");
      showToast("Signed Out", "Redirecting to login...", "success");
      setTimeout(function () {
        window.location.href = "index.html";
      }, 800);
    }
  });
});

/**
 * Global Toast Notification Generator
 */
function showToast(title, message, type = "info") {
  let container = $(".toast-container");
  if (!container.length) {
    $("body").append('<div class="toast-container"></div>');
    container = $(".toast-container");
  }

  const iconMap = {
    success: "fa-circle-check",
    warning: "fa-triangle-exclamation",
    error: "fa-circle-xmark",
    info: "fa-circle-info"
  };

  const iconClass = iconMap[type] || iconMap.info;
  const toastId = "toast-" + Date.now();

  const toastHtml = `
    <div id="${toastId}" class="toast toast-${type}">
      <i class="fa-solid ${iconClass} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${escapeHtml(title)}</div>
        <div class="toast-message">${escapeHtml(message)}</div>
      </div>
    </div>
  `;

  container.append(toastHtml);

  setTimeout(function () {
    $(`#${toastId}`).fadeOut(300, function () { $(this).remove(); });
  }, 4000);
}

/**
 * Renders settings modal dynamically using jQuery
 */
function openSettingsModal() {
  let modal = $("#settingsModal");
  if (!modal.length) {
    const modalHtml = `
      <div id="settingsModal" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title"><i class="fa-solid fa-gear me-2"></i> System Settings</h3>
            <button class="modal-close" onclick="closeModal('#settingsModal')">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group mb-4">
              <label class="form-label">Reader Device Name</label>
              <input type="text" class="form-control" value="UroScan Reader (UR-PI-001)" readonly>
            </div>
            <div class="form-group mb-4">
              <label class="form-label">Academic Prototype Notice</label>
              <div class="medical-disclaimer-box">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>All data in this dashboard is simulated for academic demonstration purposes under Use Case ID: KJS-HC-03.</div>
              </div>
            </div>
            <hr class="my-4" style="border-color: var(--border-color)">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong style="color: var(--primary-navy)">Reset Demo Dataset</strong>
                <p style="font-size: 0.8rem; color: var(--text-secondary)">Restore default fictional patients & test history.</p>
              </div>
              <button id="resetDataBtn" class="btn btn-warning btn-sm">
                <i class="fa-solid fa-rotate-left"></i> Reset Data
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="closeModal('#settingsModal')">Close</button>
          </div>
        </div>
      </div>
    `;
    $("body").append(modalHtml);
    modal = $("#settingsModal");
  }

  modal.fadeIn(200).css("display", "flex");

  $("#resetDataBtn").off("click").on("click", function () {
    if (confirm("Reset all patient data and test history back to factory demo defaults?")) {
      resetDemoData();
      showToast("Data Reset", "Demo dataset restored successfully.", "success");
      closeModal("#settingsModal");
      setTimeout(function () {
        window.location.reload();
      }, 600);
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

/**
 * Reusable HTML generator for the 10-pad Reagent Strip Component (Clean Matte Colors)
 */
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
    const color = item ? item.padColor : "#E2E8F0";
    const val = item ? item.val : "Ready";
    const tooltip = `${p.name}: ${val}`;

    padsHtml += `
      <div class="reagent-pad-item" title="${tooltip}">
        <div class="reagent-pad-color pad-${p.code.toLowerCase()}" style="background-color: ${color}"></div>
        <span class="reagent-pad-label">${p.code}</span>
        <span class="reagent-pad-val">${item ? (item.padCode || val) : '-'}</span>
      </div>
    `;
  });

  return `
    <div id="${stripId}" class="urine-strip-container">
      <div class="strip-handle-wrapper">
        <span class="strip-handle-tag">STRIP</span>
        <div class="reagent-pads-row">
          ${padsHtml}
        </div>
      </div>
    </div>
  `;
}
