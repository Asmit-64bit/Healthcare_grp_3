/**
 * UroScan AI - Mock Data & LocalStorage Management
 * Provides 10 fictional patients, 20+ detailed urinalysis tests with 10 analytes each.
 */

const INITIAL_PATIENTS = [
  { id: "P-10241", name: "Ramesh Sharma", age: 45, gender: "Male", dob: "1981-05-14", contact: "+91 98201 44512", regDate: "2026-08-10", status: "Active" },
  { id: "P-10242", name: "Ananya Iyer", age: 29, gender: "Female", dob: "1997-11-22", contact: "+91 98192 33410", regDate: "2026-08-12", status: "Active" },
  { id: "P-10243", name: "Vikram Malhotra", age: 58, gender: "Male", dob: "1968-03-05", contact: "+91 98334 11299", regDate: "2026-08-15", status: "Active" },
  { id: "P-10244", name: "Priya Deshmukh", age: 34, gender: "Female", dob: "1992-07-19", contact: "+91 97690 88214", regDate: "2026-08-20", status: "Active" },
  { id: "P-10245", name: "Suresh Gupta", age: 62, gender: "Male", dob: "1964-12-01", contact: "+91 99205 66781", regDate: "2026-08-22", status: "Active" },
  { id: "P-10246", name: "Sneha Patel", age: 24, gender: "Female", dob: "2002-02-28", contact: "+91 98210 55432", regDate: "2026-09-01", status: "Active" },
  { id: "P-10247", name: "Rajesh Varma", age: 51, gender: "Male", dob: "1975-09-14", contact: "+91 98691 22345", regDate: "2026-09-05", status: "Active" },
  { id: "P-10248", name: "Meera Joshi", age: 41, gender: "Female", dob: "1985-04-10", contact: "+91 97022 44321", regDate: "2026-09-12", status: "Active" },
  { id: "P-10249", name: "Karan Mehta", age: 37, gender: "Male", dob: "1989-10-30", contact: "+91 98200 99887", regDate: "2026-09-18", status: "Active" },
  { id: "P-10250", name: "Sunita Rao", age: 53, gender: "Female", dob: "1973-06-25", contact: "+91 99304 77654", regDate: "2026-09-25", status: "Active" }
];

const INITIAL_TESTS = [
  {
    testId: "UT-1046",
    patientId: "P-10241",
    patientName: "Ramesh Sharma",
    timestamp: "2026-09-29 22:32",
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
    timestamp: "2026-09-29 20:15",
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
    timestamp: "2026-09-29 18:40",
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
  },
  {
    testId: "UT-1043",
    patientId: "P-10244",
    patientName: "Priya Deshmukh",
    timestamp: "2026-09-28 16:10",
    status: "Normal",
    reviewStatus: "Approved",
    confidence: 96,
    notes: "Routine prenatal screen normal.",
    analytes: {
      glucose: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      protein: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      ph: { val: "6.0", padCode: "6.0", status: "Normal", padColor: "#059669", ref: "5.0 - 7.5" },
      ketones: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      blood: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      bilirubin: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      urobilinogen: { val: "0.2 mg/dL", padCode: "0.2", status: "Normal", padColor: "#93C5FD", ref: "0.2 - 1.0 mg/dL" },
      nitrite: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      leucocytes: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      specificGravity: { val: "1.018", padCode: "1.018", status: "Normal", padColor: "#1E3A8A", ref: "1.005 - 1.030" }
    }
  },
  {
    testId: "UT-1042",
    patientId: "P-10245",
    patientName: "Suresh Gupta",
    timestamp: "2026-09-28 11:25",
    status: "Review",
    reviewStatus: "Approved",
    confidence: 93,
    notes: "Positive Nitrite and Leucocytes suggest urinary tract infection.",
    analytes: {
      glucose: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      protein: { val: "30 mg/dL", padCode: "+", status: "Review", padColor: "#F59E0B", ref: "Negative" },
      ph: { val: "7.5", padCode: "7.5", status: "Normal", padColor: "#059669", ref: "5.0 - 7.5" },
      ketones: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      blood: { val: "Moderate", padCode: "++", status: "Review", padColor: "#D97706", ref: "Negative" },
      bilirubin: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      urobilinogen: { val: "1.0 mg/dL", padCode: "1.0", status: "Normal", padColor: "#93C5FD", ref: "0.2 - 1.0 mg/dL" },
      nitrite: { val: "Positive", padCode: "Pos", status: "Review", padColor: "#E11D48", ref: "Negative" },
      leucocytes: { val: "75 leu/µL", padCode: "++", status: "Review", padColor: "#9333EA", ref: "Negative" },
      specificGravity: { val: "1.022", padCode: "1.022", status: "Normal", padColor: "#1E3A8A", ref: "1.005 - 1.030" }
    }
  }
];

// Add historical records programmatically
for (let i = 41; i >= 27; i--) {
  const pIndex = (41 - i) % INITIAL_PATIENTS.length;
  const p = INITIAL_PATIENTS[pIndex];
  const dayOffset = Math.floor((41 - i) / 2) + 2;
  const isReview = i % 3 === 0;
  
  INITIAL_TESTS.push({
    testId: `UT-10${i}`,
    patientId: p.id,
    patientName: p.name,
    timestamp: `2026-09-${Math.max(1, 28 - dayOffset)} 10:${(i * 3) % 60 < 10 ? '0' : ''}${(i * 3) % 60}`,
    status: isReview ? "Review" : "Normal",
    reviewStatus: "Approved",
    confidence: 90 + (i % 9),
    notes: isReview ? "Mild parameter deviation reviewed by physician." : "Normal routine analysis.",
    analytes: {
      glucose: { val: isReview ? "50 mg/dL" : "Negative", padCode: isReview ? "+/-" : "Neg", status: isReview ? "Review" : "Normal", padColor: isReview ? "#D97706" : "#E2E8F0", ref: "Negative" },
      protein: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      ph: { val: (6.0 + (i % 4) * 0.4).toFixed(1), padCode: (6.0 + (i % 4) * 0.4).toFixed(1), status: "Normal", padColor: "#059669", ref: "5.0 - 7.5" },
      ketones: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      blood: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      bilirubin: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      urobilinogen: { val: "0.2 mg/dL", padCode: "0.2", status: "Normal", padColor: "#93C5FD", ref: "0.2 - 1.0 mg/dL" },
      nitrite: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      leucocytes: { val: "Negative", padCode: "Neg", status: "Normal", padColor: "#E2E8F0", ref: "Negative" },
      specificGravity: { val: "1.015", padCode: "1.015", status: "Normal", padColor: "#1E3A8A", ref: "1.005 - 1.030" }
    }
  });
}

/**
 * Initializes localStorage with default mock data if empty.
 */
function initMockData() {
  if (!localStorage.getItem("uroscan_patients")) {
    localStorage.setItem("uroscan_patients", JSON.stringify(INITIAL_PATIENTS));
  }
  if (!localStorage.getItem("uroscan_tests")) {
    localStorage.setItem("uroscan_tests", JSON.stringify(INITIAL_TESTS));
  }
}

/**
 * Resets local storage to initial mock dataset.
 */
function resetDemoData() {
  localStorage.setItem("uroscan_patients", JSON.stringify(INITIAL_PATIENTS));
  localStorage.setItem("uroscan_tests", JSON.stringify(INITIAL_TESTS));
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

function savePatient(patientObj) {
  const patients = getPatients();
  patients.unshift(patientObj);
  localStorage.setItem("uroscan_patients", JSON.stringify(patients));
}

function saveTest(testObj) {
  const tests = getTests();
  tests.unshift(testObj);
  localStorage.setItem("uroscan_tests", JSON.stringify(tests));
}

function updateTestReview(testId, status, notes) {
  const tests = getTests();
  const index = tests.findIndex(t => t.testId === testId);
  if (index !== -1) {
    tests[index].reviewStatus = status;
    if (notes) tests[index].notes = notes;
    localStorage.setItem("uroscan_tests", JSON.stringify(tests));
  }
}

initMockData();
