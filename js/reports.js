/**
 * UrinaSense - Reports Archive & Printable Report Controller (jQuery)
 */

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const targetTestId = urlParams.get("id");

  renderReportsTable();

  if (targetTestId) {
    showReportDetails(targetTestId);
  }

  // Live filter reports search
  $("#reportSearchInput").on("keyup", function () {
    const q = $(this).val().toLowerCase();
    renderReportsTable(q);
  });

  // Back button
  $("#backToReportsBtn").on("click", function () {
    $("#printableReportCard").slideUp(200);
    $("#reportsListCard").slideDown(200);
  });

  // Trigger window.print()
  $("#triggerPrintBtn").on("click", function () {
    window.print();
  });
});

function renderReportsTable(query = "") {
  const tests = getTests();
  const tbody = $("#reportsTableBody");
  tbody.empty();

  let filtered = tests;
  if (query) {
    filtered = tests.filter(t => 
      t.testId.toLowerCase().includes(query) ||
      t.patientId.toLowerCase().includes(query) ||
      t.patientName.toLowerCase().includes(query)
    );
  }

  if (filtered.length === 0) {
    tbody.append(`
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 24px;">
          No reports found matching criteria.
        </td>
      </tr>
    `);
    return;
  }

  filtered.forEach(t => {
    const reportId = "REP-" + t.testId.split("-")[1];
    let bClass = "badge-normal";
    if (t.status === "Review") bClass = "badge-review";
    if (t.status === "Critical") bClass = "badge-critical";

    const tr = `
      <tr>
        <td><strong>${escapeHtml(reportId)}</strong></td>
        <td>
          <a href="patient-profile.html?id=${encodeURIComponent(t.patientId)}" style="font-weight: 600; color: var(--primary-navy)">
            ${escapeHtml(t.patientName)}
          </a>
          <div style="font-size: 0.75rem; color: var(--text-secondary);">${escapeHtml(t.patientId)}</div>
        </td>
        <td>${escapeHtml(t.testId)}</td>
        <td>${escapeHtml(t.timestamp)}</td>
        <td>
          <span class="badge ${bClass}">
            <span class="badge-dot"></span> ${escapeHtml(t.status)}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline btn-sm" onclick="showReportDetails('${t.testId}')">
              <i class="fa-solid fa-eye"></i> View Report
            </button>
            <button class="btn btn-primary btn-sm" onclick="printSingleReport('${t.testId}')">
              <i class="fa-solid fa-print"></i> Print
            </button>
          </div>
        </td>
      </tr>
    `;
    tbody.append(tr);
  });
}

function showReportDetails(testId) {
  const tests = getTests();
  const patients = getPatients();

  const test = tests.find(t => t.testId === testId) || tests[0];
  const patient = patients.find(p => p.id === test.patientId) || { age: 45, gender: "Male" };

  const reportId = "REP-" + test.testId.split("-")[1];

  $("#repViewReportId").text(reportId);
  $("#repViewPatientName").text(test.patientName);
  $("#repViewPatientId").text(test.patientId);
  $("#repViewAgeGender").text(`${patient.age} yrs / ${patient.gender}`);
  $("#repViewTestId").text(test.testId);
  $("#repViewTimestamp").text(test.timestamp);
  $("#repViewConfidence").text(`${test.confidence}%`);
  $("#repViewReviewStatus").text(`Status: ${test.reviewStatus || 'Approved'} (Reviewed by Dr. Ninad)`);
  $("#repViewNotes").text(test.notes ? `"${test.notes}"` : "No special clinical observations.");

  // Populate Analytes Table
  const tbody = $("#repViewAnalytesBody");
  tbody.empty();

  const namesMap = {
    glucose: "Glucose",
    protein: "Protein",
    ph: "pH Level",
    ketones: "Ketones",
    blood: "Blood",
    bilirubin: "Bilirubin",
    urobilinogen: "Urobilinogen",
    nitrite: "Nitrite",
    leucocytes: "Leucocytes",
    specificGravity: "Specific Gravity"
  };

  Object.keys(test.analytes).forEach(key => {
    const item = test.analytes[key];
    const name = namesMap[key] || key;

    let bClass = "badge-normal";
    if (item.status === "Review") bClass = "badge-review";
    if (item.status === "Critical") bClass = "badge-critical";

    const tr = `
      <tr>
        <td><strong>${escapeHtml(name)}</strong></td>
        <td>${escapeHtml(item.val)}</td>
        <td>${escapeHtml(item.padCode || 'Neg')}</td>
        <td>
          <span class="badge ${bClass}">${escapeHtml(item.status)}</span>
        </td>
        <td>${escapeHtml(item.ref || 'Normal')}</td>
      </tr>
    `;
    tbody.append(tr);
  });

  $("#reportsListCard").slideUp(200);
  $("#printableReportCard").slideDown(200);
}

function printSingleReport(testId) {
  showReportDetails(testId);
  setTimeout(function () {
    window.print();
  }, 300);
}
