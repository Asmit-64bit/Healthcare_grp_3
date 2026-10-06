/**
 * UroScan AI - Reports Archive & Saved Report Manager (jQuery)
 */

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const targetTestId = urlParams.get("id");

  renderReportsTable();

  if (targetTestId) {
    showReportDetails(targetTestId);
  }

  $("#reportSearchInput").on("keyup", function () {
    const q = $(this).val().toLowerCase();
    renderReportsTable(q);
  });

  $("#backToReportsBtn").on("click", function () {
    $("#printableReportCard").slideUp(200);
    $("#reportsListCard").slideDown(200);
  });

  $("#triggerPrintBtn").on("click", function () {
    window.print();
  });

  // Save / Download Report HTML File
  $(document).on("click", ".btn-download-report", function () {
    const reportId = $(this).attr("data-report-id");
    downloadReportFile(reportId);
    showToast("Report Saved", `Report ${reportId} downloaded to your local device.`);
  });
});

function renderReportsTable(query = "") {
  const reports = getReports();
  const tbody = $("#reportsTableBody");
  tbody.empty();

  let filtered = reports;
  if (query) {
    filtered = reports.filter(r => 
      r.reportId.toLowerCase().includes(query) ||
      r.testId.toLowerCase().includes(query) ||
      r.patientId.toLowerCase().includes(query) ||
      r.patientName.toLowerCase().includes(query)
    );
  }

  if (filtered.length === 0) {
    tbody.append(`
      <tr>
        <td colspan="6" style="text-align: center; color: #718096; padding: 15px;">
          No saved reports found.
        </td>
      </tr>
    `);
    return;
  }

  filtered.forEach(r => {
    let bClass = "badge-normal";
    if (r.status === "Review") bClass = "badge-review";
    if (r.status === "Critical") bClass = "badge-critical";

    const tr = `
      <tr>
        <td><strong>${escapeHtml(r.reportId)}</strong></td>
        <td>
          <a href="patient-profile.html?id=${encodeURIComponent(r.patientId)}" style="font-weight: 600;">
            ${escapeHtml(r.patientName)}
          </a>
        </td>
        <td>${escapeHtml(r.testId)}</td>
        <td>${escapeHtml(r.timestamp)}</td>
        <td>
          <span class="badge ${bClass}">${escapeHtml(r.status)}</span>
        </td>
        <td>
          <button class="btn btn-outline" style="padding: 3px 8px; font-size: 11px;" onclick="showReportDetails('${r.testId}')">View</button>
          <button class="btn btn-primary btn-download-report" style="padding: 3px 8px; font-size: 11px;" data-report-id="${r.reportId}">Save File</button>
        </td>
      </tr>
    `;
    tbody.append(tr);
  });
}

function showReportDetails(testId) {
  const reports = getReports();
  const patients = getPatients();
  const currentUser = getCurrentUser();

  const report = reports.find(r => r.testId === testId || r.reportId === testId) || reports[0];
  const patient = patients.find(p => p.id === report.patientId) || { age: report.patientAge || 45, gender: report.patientGender || "Male" };

  $("#repViewReportId").text(report.reportId);
  $("#repViewPatientName").text(report.patientName);
  $("#repViewPatientId").text(report.patientId);
  $("#repViewAgeGender").text(`${patient.age} yrs / ${patient.gender}`);
  $("#repViewTestId").text(report.testId);
  $("#repViewTimestamp").text(report.timestamp);
  $("#repViewConfidence").text(`${report.confidence}%`);
  $("#repViewReviewStatus").text(`Status: ${report.reviewStatus || 'Approved'} (Reviewed by ${currentUser.name})`);
  $("#repViewNotes").text(report.notes ? `"${report.notes}"` : "No special clinical observations.");

  $(".btn-download-active-report").attr("data-report-id", report.reportId);

  const tbody = $("#repViewAnalytesBody");
  tbody.empty();

  const namesMap = {
    glucose: "Glucose", protein: "Protein", ph: "pH Level", ketones: "Ketones",
    blood: "Blood", bilirubin: "Bilirubin", urobilinogen: "Urobilinogen",
    nitrite: "Nitrite", leucocytes: "Leucocytes", specificGravity: "Specific Gravity"
  };

  Object.keys(report.analytes).forEach(key => {
    const item = report.analytes[key];
    const name = namesMap[key] || key;

    let bClass = "badge-normal";
    if (item.status === "Review") bClass = "badge-review";
    if (item.status === "Critical") bClass = "badge-critical";

    const tr = `
      <tr>
        <td><strong>${escapeHtml(name)}</strong></td>
        <td>${escapeHtml(item.val)}</td>
        <td>${escapeHtml(item.padCode || 'Neg')}</td>
        <td><span class="badge ${bClass}">${escapeHtml(item.status)}</span></td>
        <td>${escapeHtml(item.ref || 'Normal')}</td>
      </tr>
    `;
    tbody.append(tr);
  });

  $("#reportsListCard").slideUp(200);
  $("#printableReportCard").slideDown(200);
}
