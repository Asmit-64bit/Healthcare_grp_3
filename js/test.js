/**
 * UroScan AI - Test Initiation Controller (jQuery)
 */

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedPatientId = urlParams.get("patientId");

  populatePatientsDropdown(preSelectedPatientId);
  renderInitialStrip();

  $("#selectPatientDropdown").on("change", function () {
    const pId = $(this).val();
    updatePatientPreviewCard(pId);
  });

  $("#startTestBtn").on("click", function () {
    const patientId = $("#selectPatientDropdown").val();
    const patients = getPatients();
    const patient = patients.find(p => p.id === patientId) || patients[0];

    const tests = getTests();
    const newTestId = "UT-10" + (47 + (tests.length - 20));

    const currentTestObj = {
      testId: newTestId,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      startTime: new Date().toISOString()
    };

    localStorage.setItem("uroscan_current_test", JSON.stringify(currentTestObj));

    showToast("Test Initiated", `Starting reaction timer for ${newTestId}...`, "info");

    setTimeout(function () {
      window.location.href = "test-processing.html";
    }, 600);
  });
});

function populatePatientsDropdown(preSelectedId) {
  const patients = getPatients();
  const dropdown = $("#selectPatientDropdown");
  dropdown.empty();

  patients.forEach(p => {
    const selected = p.id === preSelectedId ? "selected" : "";
    dropdown.append(`<option value="${p.id}" ${selected}>${escapeHtml(p.name)} (${p.id})</option>`);
  });

  const activeId = preSelectedId || (patients.length ? patients[0].id : "P-10241");
  updatePatientPreviewCard(activeId);
}

function updatePatientPreviewCard(patientId) {
  const patients = getPatients();
  const p = patients.find(item => item.id === patientId);
  if (!p) return;

  $("#spName").text(p.name);
  $("#spId").text(p.id);
  $("#spMeta").text(`Age: ${p.age} yrs • Gender: ${p.gender} • DOB: ${p.dob}`);
  $("#spContact").text(`Contact: ${p.contact}`);
}

function renderInitialStrip() {
  const initialAnalytes = {
    glucose: { val: "Ready", padCode: "GLU", status: "Normal", padColor: "#E2E8F0" },
    protein: { val: "Ready", padCode: "PRO", status: "Normal", padColor: "#E2E8F0" },
    ph: { val: "Ready", padCode: "pH", status: "Normal", padColor: "#059669" },
    ketones: { val: "Ready", padCode: "KET", status: "Normal", padColor: "#E2E8F0" },
    blood: { val: "Ready", padCode: "BLO", status: "Normal", padColor: "#E2E8F0" },
    bilirubin: { val: "Ready", padCode: "BIL", status: "Normal", padColor: "#E2E8F0" },
    urobilinogen: { val: "Ready", padCode: "URO", status: "Normal", padColor: "#93C5FD" },
    nitrite: { val: "Ready", padCode: "NIT", status: "Normal", padColor: "#E2E8F0" },
    leucocytes: { val: "Ready", padCode: "LEU", status: "Normal", padColor: "#E2E8F0" },
    specificGravity: { val: "Ready", padCode: "SG", status: "Normal", padColor: "#1E3A8A" }
  };

  $("#newTestStripPreview").html(renderUrineStripHtml(initialAnalytes, "newTestStrip"));
}
