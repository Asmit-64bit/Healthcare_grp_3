/**
 * UrinaSense - Results & Clinical Review Controller (jQuery)
 */

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const testId = urlParams.get("id") || "UT-1046";

  loadTestResults(testId);

  // jQuery Toggle active class on Review Action Buttons
  $("#reviewActionButtons .action-btn").on("click", function () {
    $("#reviewActionButtons .action-btn").removeClass("btn-primary").addClass("btn-outline");
    $(this).removeClass("btn-outline").addClass("btn-primary");
    $(this).data("selected", true);
  });

  // Submit Review Handler
  $("#submitReviewBtn").on("click", function () {
    const activeBtn = $("#reviewActionButtons .action-btn.btn-primary");
    const action = activeBtn.attr("data-action") || "Approved";
    const notes = $("#clinicalNotes").val().trim();

    updateTestReview(testId, action, notes);

    showToast("Clinical Review Submitted", `Test ${testId} marked as ${action}.`, "success");

    setTimeout(function () {
      window.location.href = `reports.html?id=${encodeURIComponent(testId)}`;
    }, 1000);
  });
});

function loadTestResults(testId) {
  const tests = getTests();
  const test = tests.find(t => t.testId === testId) || tests[0];

  // Update Header Metadata
  $("#resHeaderTestId").text(`Urinalysis Result • ${test.testId}`);
  $("#resHeaderMeta").text(`Patient: ${test.patientName} (${test.patientId}) • Date: ${test.timestamp}`);

  let statusBadgeClass = "badge-normal";
  if (test.status === "Review") statusBadgeClass = "badge-review";
  if (test.status === "Critical") statusBadgeClass = "badge-critical";

  $("#resHeaderStatus")
    .attr("class", `badge ${statusBadgeClass}`)
    .text(test.status === "Normal" ? "Normal Result" : "Review Required");

  // Render Visual Strip
  $("#resultsStripContainer").html(renderUrineStripHtml(test.analytes, "resultsStrip"));

  // Populate 10 Analyte Table
  const tbody = $("#analytesTableBody");
  tbody.empty();

  let reviewCount = 0;

  const analyteNamesMap = {
    glucose: "Glucose",
    protein: "Protein",
    ph: "pH Level",
    ketones: "Ketones",
    blood: "Blood (Hemoglobin)",
    bilirubin: "Bilirubin",
    urobilinogen: "Urobilinogen",
    nitrite: "Nitrite",
    leucocytes: "Leucocytes",
    specificGravity: "Specific Gravity"
  };

  Object.keys(test.analytes).forEach(key => {
    const item = test.analytes[key];
    const name = analyteNamesMap[key] || key;

    let bClass = "badge-normal";
    if (item.status === "Review") {
      bClass = "badge-review";
      reviewCount++;
    } else if (item.status === "Critical") {
      bClass = "badge-critical";
      reviewCount++;
    }

    const tr = `
      <tr>
        <td><strong>${escapeHtml(name)}</strong></td>
        <td>
          <div style="font-weight: 700; color: var(--primary-navy)">${escapeHtml(item.val)}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary)">Pad Code: ${escapeHtml(item.padCode || 'Neg')}</div>
        </td>
        <td>
          <span class="badge ${bClass}">
            <span class="badge-dot"></span> ${escapeHtml(item.status)}
          </span>
        </td>
        <td><strong style="color: var(--accent-cyan)">${test.confidence}%</strong></td>
        <td style="font-size: 0.82rem; color: var(--text-secondary)">${escapeHtml(item.ref || 'Normal')}</td>
      </tr>
    `;
    tbody.append(tr);
  });

  // AI Summary Progress
  $("#resOverallConfidence").text(`${test.confidence}%`);
  $("#confidenceProgressBar").css("width", `${test.confidence}%`);
  $("#flaggedCountSummary").html(`<i class="fa-solid fa-triangle-exclamation text-warning me-1"></i> ${reviewCount} parameters require clinical review.`);
  if (test.notes) {
    $("#clinicalNotes").val(test.notes);
  }
}
