/**
 * UrinaSense - Patient Profile Controller (jQuery & Chart.js)
 */

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get("id") || "P-10241";

  loadPatientProfile(patientId);
});

function loadPatientProfile(patientId) {
  const patients = getPatients();
  const patient = patients.find(p => p.id === patientId) || patients[0];
  const tests = getTests().filter(t => t.patientId === patient.id);

  const m1 = patient.month1 != null ? Number(patient.month1) : 100;
  const m2 = patient.month2 != null ? Number(patient.month2) : 105;
  const m3 = patient.month3 != null ? Number(patient.month3) : 95;
  const avgSugar = Math.round((m1 + m2 + m3) / 3);

  // Update Metadata Elements
  $("#pProfileName").text(patient.name);
  $("#pProfileMeta").text(`Patient ID: ${patient.id} • ${patient.gender} • ${patient.age} yrs • Registered: ${patient.regDate} • 3-Mo Avg Sugar: ${avgSugar} mg/dL (M1: ${m1}, M2: ${m2}, M3: ${m3})`);
  $("#pNewTestBtn").attr("href", `new-test.html?patientId=${patient.id}`);

  $("#pTotalTests").text(tests.length);
  $("#pLastTestDate").text(tests.length > 0 ? tests[0].timestamp.split(" ")[0] : "None");
  
  const currentStatus = tests.length > 0 ? tests[0].status : "Normal";
  $("#pCurrentStatus").text(currentStatus);

  // Populate Test History Table
  const tbody = $("#patientTestHistoryBody");
  tbody.empty();

  if (tests.length === 0) {
    tbody.append(`
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 20px;">
          No previous tests recorded for this patient.
        </td>
      </tr>
    `);
  } else {
    tests.forEach(t => {
      let badgeClass = "badge-normal";
      if (t.status === "Review") badgeClass = "badge-review";
      if (t.status === "Critical") badgeClass = "badge-critical";

      const tr = `
        <tr>
          <td><strong>${escapeHtml(t.testId)}</strong></td>
          <td>${escapeHtml(t.timestamp)}</td>
          <td>${t.analytes.glucose.val}</td>
          <td>${t.analytes.protein.val}</td>
          <td>${t.analytes.ph.val}</td>
          <td>
            <span class="badge ${badgeClass}">
              <span class="badge-dot"></span> ${escapeHtml(t.status)}
            </span>
          </td>
          <td>
            <a href="results.html?id=${encodeURIComponent(t.testId)}" class="btn btn-outline btn-sm">
              <i class="fa-solid fa-eye"></i> View Result
            </a>
          </td>
        </tr>
      `;
      tbody.append(tr);
    });
  }

  // Render Trend Charts
  renderPatientTrends(tests);
}

function renderPatientTrends(tests) {
  const dates = tests.slice().reverse().map(t => t.timestamp.split(" ")[0]);
  const glucoseVals = tests.slice().reverse().map(t => {
    const val = t.analytes.glucose.val;
    if (val.includes("Negative")) return 0;
    return parseInt(val, 10) || 30;
  });

  const proteinVals = tests.slice().reverse().map(t => {
    const val = t.analytes.protein.val;
    if (val.includes("Negative")) return 0;
    return parseInt(val, 10) || 15;
  });

  const phVals = tests.slice().reverse().map(t => parseFloat(t.analytes.ph.val) || 6.0);

  // Glucose Chart
  new Chart(document.getElementById("glucoseTrendChart"), {
    type: "line",
    data: {
      labels: dates.length ? dates : ["20 Sep", "25 Sep", "29 Sep"],
      datasets: [{
        label: "Glucose (mg/dL)",
        data: glucoseVals.length ? glucoseVals : [0, 0, 100],
        borderColor: "#0EA5E9",
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        fill: true,
        tension: 0.3
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // Protein Chart
  new Chart(document.getElementById("proteinTrendChart"), {
    type: "line",
    data: {
      labels: dates.length ? dates : ["20 Sep", "25 Sep", "29 Sep"],
      datasets: [{
        label: "Protein (mg/dL)",
        data: proteinVals.length ? proteinVals : [0, 15, 30],
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: true,
        tension: 0.3
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // pH Chart
  new Chart(document.getElementById("phTrendChart"), {
    type: "line",
    data: {
      labels: dates.length ? dates : ["20 Sep", "25 Sep", "29 Sep"],
      datasets: [{
        label: "pH Level",
        data: phVals.length ? phVals : [6.0, 6.5, 6.2],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.3
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}
