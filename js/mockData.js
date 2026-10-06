/**
 * UroScan AI - Mock Data & LocalStorage Reports Management
 * Uses Local Device Time (new Date()) for all timestamps, tests, and reports.
 */

function getDeviceFormattedDateTime(offsetMinutes = 0) {
  const now = new Date(Date.now() - offsetMinutes * 60 * 1000);
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

function getDeviceFormattedDate(offsetDays = 0) {
  const now = new Date(Date.now() - offsetDays * 24 * 60 * 60 * 1000);
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const INITIAL_PATIENTS = [
  { id: "P-10241", name: "Ramesh Sharma", age: 45, gender: "Male", dob: "1981-05-14", contact: "+91 98201 44512", regDate: getDeviceFormattedDate(30), status: "Active" },
  { id: "P-10242", name: "Ananya Iyer", age: 29, gender: "Female", dob: "1997-11-22", contact: "+91 98192 33410", regDate: getDeviceFormattedDate(28), status: "Active" },
  { id: "P-10243", name: "Vikram Malhotra", age: 58, gender: "Male", dob: "1968-03-05", contact: "+91 98334 11299", regDate: getDeviceFormattedDate(25), status: "Active" },
  { id: "P-10244", name: "Priya Deshmukh", age: 34, gender: "Female", dob: "1992-07-19", contact: "+91 97690 88214", regDate: getDeviceFormattedDate(20), status: "Active" },
  { id: "P-10245", name: "Suresh Gupta", age: 62, gender: "Male", dob: "1964-12-01", contact: "+91 99205 66781", regDate: getDeviceFormattedDate(18), status: "Active" },
  { id: "P-10246", name: "Sneha Patel", age: 24, gender: "Female", dob: "2002-02-28", contact: "+91 98210 55432", regDate: getDeviceFormattedDate(15), status: "Active" },
  { id: "P-10247", name: "Rajesh Varma", age: 51, gender: "Male", dob: "1975-09-14", contact: "+91 98691 22345", regDate: getDeviceFormattedDate(10), status: "Active" },
  { id: "P-10248", name: "Meera Joshi", age: 41, gender: "Female", dob: "1985-04-10", contact: "+91 97022 44321", regDate: getDeviceFormattedDate(8), status: "Active" },
  { id: "P-10249", name: "Karan Mehta", age: 37, gender: "Male", dob: "1989-10-30", contact: "+91 98200 99887", regDate: getDeviceFormattedDate(5), status: "Active" },
  { id: "P-10250", name: "Sunita Rao", age: 53, gender: "Female", dob: "1973-06-25", contact: "+91 99304 77654", regDate: getDeviceFormattedDate(1), status: "Active" }
];

const INITIAL_TESTS = [
  {
    testId: "UT-1046",
    patientId: "P-10241",
    patientName: "Ramesh Sharma",
    timestamp: getDeviceFormattedDateTime(15), // 15 mins ago from local device clock
    status: "Review",
    reviewStatus: "Pending",
    confidence: 94,
    notes: "Elevated protein and glucose detected. Clinical confirmation advised.",
    analytes: {
      glucose: { val: "100 mg/dL", padCode: "+", status: "Review", padColor: "#D97706", ref: "Negative" },
      protein: { val: "30 mg/dL", padCode: "+", status: "Review", padColor: "#F59E0B", ref: "Negative (<15 mg/dL)" },
      ph: { val: "6.2", padCode: "6.2", status: "Normal", padColor: "#059669", ref: "5.0 - 7.5" },
      ketones: { val: "0 mg/dL", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      blood: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      bilirubin: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      urobilinogen: { val: "1.0 mg/dL", padCode: "1.0", status: "Normal", padColor: "#93C5FD", ref: "0.2 - 1.0 mg/dL" },
      nitrite: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      leucocytes: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      specificGravity: { val: "1.015", padCode: "1.015", status: "Normal", padColor: "#1E3A8A", ref: "1.005 - 1.030" }
    }
  },
  {
    testId: "UT-1045",
    patientId: "P-10242",
    patientName: "Ananya Iyer",
    timestamp: getDeviceFormattedDateTime(120), // 2 hours ago from local device clock
    status: "Normal",
    reviewStatus: "Approved",
    confidence: 98,
    notes: "All 10 analyte parameters within normal physiological reference ranges.",
    analytes: {
      glucose: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      protein: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative (<15 mg/dL)" },
      ph: { val: "6.5", padCode: "6.5", status: "Normal", padColor: "#059669", ref: "5.0 - 7.5" },
      ketones: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      blood: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      bilirubin: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      urobilinogen: { val: "0.2 mg/dL", padCode: "0.2", status: "Normal", padColor: "#93C5FD", ref: "0.2 - 1.0 mg/dL" },
      nitrite: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      leucocytes: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      specificGravity: { val: "1.020", padCode: "1.020", status: "Normal", padColor: "#1E3A8A", ref: "1.005 - 1.030" }
    }
  },
  {
    testId: "UT-1044",
    patientId: "P-10243",
    patientName: "Vikram Malhotra",
    timestamp: getDeviceFormattedDateTime(360), // 6 hours ago from local device clock
    status: "Critical",
    reviewStatus: "Pending",
    confidence: 91,
    notes: "High glucose (250 mg/dL) and positive ketones (15 mg/dL). High risk of metabolic acidosis.",
    analytes: {
      glucose: { val: "250 mg/dL", padCode: "++", status: "Critical", padColor: "#DC2626", ref: "Negative" },
      protein: { val: "100 mg/dL", padCode: "++", status: "Review", padColor: "#D97706", ref: "Negative (<15 mg/dL)" },
      ph: { val: "5.5", padCode: "5.5", status: "Normal", padColor: "#EAB308", ref: "5.0 - 7.5" },
      ketones: { val: "15 mg/dL", padCode: "+", status: "Critical", padColor: "#DC2626", ref: "Negative" },
      blood: { val: "Trace", padCode: "+/-", status: "Review", padColor: "#D97706", ref: "Negative" },
      bilirubin: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      urobilinogen: { val: "0.2 mg/dL", padCode: "0.2", status: "Normal", padColor: "#93C5FD", ref: "0.2 - 1.0 mg/dL" },
      nitrite: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      leucocytes: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      specificGravity: { val: "1.025", padCode: "1.025", status: "Normal", padColor: "#1E3A8A", ref: "1.005 - 1.030" }
    }
  }
];

function buildInitialReports() {
  return INITIAL_TESTS.map(t => ({
    reportId: "REP-" + t.testId.split("-")[1],
    testId: t.testId,
    patientId: t.patientId,
    patientName: t.patientName,
    timestamp: t.timestamp,
    status: t.status,
    reviewStatus: t.reviewStatus || "Approved",
    confidence: t.confidence,
    notes: t.notes,
    analytes: t.analytes,
    savedDate: t.timestamp
  }));
}

function initMockData() {
  if (!localStorage.getItem("uroscan_patients")) {
    localStorage.setItem("uroscan_patients", JSON.stringify(INITIAL_PATIENTS));
  }
  if (!localStorage.getItem("uroscan_tests")) {
    localStorage.setItem("uroscan_tests", JSON.stringify(INITIAL_TESTS));
  }
  if (!localStorage.getItem("uroscan_reports")) {
    localStorage.setItem("uroscan_reports", JSON.stringify(buildInitialReports()));
  }
}

function resetDemoData() {
  localStorage.setItem("uroscan_patients", JSON.stringify(INITIAL_PATIENTS));
  localStorage.setItem("uroscan_tests", JSON.stringify(INITIAL_TESTS));
  localStorage.setItem("uroscan_reports", JSON.stringify(buildInitialReports()));
  localStorage.removeItem("uroscan_current_test");
  return true;
}

function getPatients() {
  initMockData();
  return JSON.parse(localStorage.getItem("uroscan_patients") || "[]");
}

function getTests() {
  initMockData();
  return JSON.parse(localStorage.getItem("uroscan_tests") || "[]");
}

function getReports() {
  initMockData();
  return JSON.parse(localStorage.getItem("uroscan_reports") || "[]");
}

function savePatient(patientObj) {
  const patients = getPatients();
  if (!patientObj.regDate) patientObj.regDate = getDeviceFormattedDate(0);
  patients.unshift(patientObj);
  localStorage.setItem("uroscan_patients", JSON.stringify(patients));
}

function saveTest(testObj) {
  const tests = getTests();
  if (!testObj.timestamp) testObj.timestamp = getDeviceFormattedDateTime(0);
  tests.unshift(testObj);
  localStorage.setItem("uroscan_tests", JSON.stringify(tests));

  const reportObj = {
    reportId: "REP-" + testObj.testId.split("-")[1],
    testId: testObj.testId,
    patientId: testObj.patientId,
    patientName: testObj.patientName,
    timestamp: testObj.timestamp,
    status: testObj.status,
    reviewStatus: testObj.reviewStatus || "Pending",
    confidence: testObj.confidence,
    notes: testObj.notes || "",
    analytes: testObj.analytes,
    savedDate: getDeviceFormattedDateTime(0)
  };
  saveReport(reportObj);
}

function saveReport(reportObj) {
  const reports = getReports();
  const index = reports.findIndex(r => r.reportId === reportObj.reportId || r.testId === reportObj.testId);
  if (index !== -1) {
    reports[index] = { ...reports[index], ...reportObj };
  } else {
    reports.unshift(reportObj);
  }
  localStorage.setItem("uroscan_reports", JSON.stringify(reports));
}

function updateTestReview(testId, status, notes) {
  const tests = getTests();
  const index = tests.findIndex(t => t.testId === testId);
  if (index !== -1) {
    tests[index].reviewStatus = status;
    if (notes) tests[index].notes = notes;
    localStorage.setItem("uroscan_tests", JSON.stringify(tests));
    
    const reportId = "REP-" + testId.split("-")[1];
    saveReport({
      reportId: reportId,
      testId: testId,
      reviewStatus: status,
      notes: notes || tests[index].notes
    });
  }
}

function downloadReportFile(reportId) {
  const reports = getReports();
  const report = reports.find(r => r.reportId === reportId || r.testId === reportId) || reports[0];

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${report.reportId} - Urinalysis Report</title>
  <style>
    body { font-family: sans-serif; padding: 20px; color: #1a365d; }
    h1 { color: #1a365d; margin-bottom: 5px; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { border: 1px solid #cbd5e0; padding: 8px; text-align: left; }
    th { background: #edf2f7; }
    .badge { padding: 3px 8px; border-radius: 10px; font-size: 12px; font-weight: bold; background: #c6f6d5; color: #276749; }
  </style>
</head>
<body>
  <h1>UROSCAN AI - URINALYSIS REPORT</h1>
  <p><strong>Report ID:</strong> ${report.reportId} | <strong>Test ID:</strong> ${report.testId}</p>
  <p><strong>Patient:</strong> ${report.patientName} (${report.patientId}) | <strong>Device Time:</strong> ${report.timestamp}</p>
  <hr>
  <h3>10 Analyte Results</h3>
  <table>
    <thead>
      <tr><th>Analyte</th><th>Result Value</th><th>Code</th><th>Status</th></tr>
    </thead>
    <tbody>
      ${Object.keys(report.analytes).map(key => {
        const item = report.analytes[key];
        return `<tr><td>${key.toUpperCase()}</td><td>${item.val}</td><td>${item.padCode || 'Neg'}</td><td>${item.status}</td></tr>`;
      }).join('')}
    </tbody>
  </table>
  <p style="margin-top: 20px;"><strong>AI Confidence Score:</strong> ${report.confidence}%</p>
  <p><strong>Clinical Review:</strong> ${report.reviewStatus || 'Approved'} - "${report.notes || 'Normal'}"</p>
  <hr>
  <p style="font-size: 11px; color: #718096;">Academic prototype using simulated data. Not intended for clinical diagnosis. KJS-HC-03.</p>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${report.reportId}_${report.patientId}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

initMockData();
