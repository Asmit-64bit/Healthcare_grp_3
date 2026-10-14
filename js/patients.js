
/**
 * UroScan AI - Patient Management Controller (jQuery)
 * Includes dynamic DOB & Age auto-calculation logic.
 */

$(document).ready(function () {
  renderPatientsTable();

  // Search patients
  $("#patientSearchInput").on("keyup", function () {
    const query = $(this).val().toLowerCase();
    renderPatientsTable(query);
  });

  // Open patient registration modal
  const openRegisterModalBtn = document.getElementById("openRegisterModalBtn");

  if (openRegisterModalBtn) {
    openRegisterModalBtn.addEventListener("click", function () {
      const nextId = "P-" + (10240 + getPatients().length + 1);

      document.getElementById("regId").value = nextId;
      document.getElementById("regName").value = "";
      document.getElementById("regAge").value = "40";
      document.getElementById("regDob").value = "1986-05-15";
      document.getElementById("regContact").value = "";

      const registerModal = document.getElementById("registerModal");

      if (registerModal) {
        registerModal.style.display = "flex";
      }
    });
  }

  // Dynamic Age calculation from DOB
  $("#regDob").on("change", function () {
    const dobVal = $(this).val();

    if (dobVal) {
      const birthDate = new Date(dobVal);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      if (
        m < 0 ||
        (m === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age >= 0) {
        $("#regAge").val(age);
      }
    }
  });

  // Register new patient
  $("#registerPatientForm").on("submit", function (e) {
    e.preventDefault();

    const name = $("#regName").val().trim();
    const age = $("#regAge").val();
    const gender = $("#regGender").val();
    const dob = $("#regDob").val();
    const contact = $("#regContact").val().trim();
    const id = $("#regId").val();

    if (!name || !age || !contact || !dob) {
      showToast(
        "Validation Error",
        "Please fill in all required patient fields."
      );
      return;
    }

    const newPatient = {
      id: id,
      name: name,
      age: parseInt(age, 10),
      gender: gender,
      dob: dob,
      contact: contact,

      // Monthly sugar values (not entered yet)
      month1: null,
      month2: null,
      month3: null,

      regDate: getDeviceFormattedDate(0),
      status: "Active"
    };

    savePatient(newPatient);

    showToast(
      "Patient Registered",
      `Registered ${name} (${id}) successfully.`
    );

    closeModal("#registerModal");
    renderPatientsTable();
  });
});

// Calculate average sugar automatically
function calculateAverageSugar(patient) {
  const values = [
    patient.month1,
    patient.month2,
    patient.month3
  ];

  const validValues = values.filter(
    value =>
      value !== null &&
      value !== undefined &&
      value !== "" &&
      Number.isFinite(Number(value))
  );

  if (validValues.length !== 3) {
    return "-";
  }

  const total = validValues.reduce(
    (sum, value) => sum + Number(value),
    0
  );

  return (total / 3).toFixed(1);
}

// Render patient directory table
function renderPatientsTable(query = "") {
  const patients = getPatients();
  const tests = getTests();
  const tbody = $("#patientsTableBody");

  tbody.empty();

  let filtered = patients;

  if (query) {
    filtered = patients.filter(p =>
      p.id.toLowerCase().includes(query) ||
      p.name.toLowerCase().includes(query)
    );
  }

  $("#patientCountLabel").text(
    `Showing ${filtered.length} patients`
  );

  // No patients found
  if (filtered.length === 0) {
    tbody.append(`
      <tr>
        <td colspan="11"
            style="text-align: center; color: #718096; padding: 15px;">
          No matching patients found.
        </td>
      </tr>
    `);

    return;
  }

  // Generate each patient row
  filtered.forEach(p => {
    const pTests = tests.filter(
      t => t.patientId === p.id
    );

    const lastTest =
      pTests.length > 0
        ? pTests[0].timestamp
        : "No tests yet";

   
    const month1 = p.month1 ?? "-";
    const month2 = p.month2 ?? "-";
    const month3 = p.month3 ?? "-";

    const averageSugar = calculateAverageSugar(p);

    const tr = `
      <tr>
        <td>
          <strong>${escapeHtml(p.id)}</strong>
        </td>

        <td>
          <a href="patient-profile.html?id=${encodeURIComponent(p.id)}"
             style="font-weight: 600;">
            ${escapeHtml(p.name)}
          </a>
        </td>

        <td>
          ${p.age} yrs / ${escapeHtml(p.gender)}
        </td>

        <td>
          ${escapeHtml(p.contact)}
        </td>

        <td>
          ${escapeHtml(lastTest)}
        </td>

        <td>
          <span class="badge badge-normal">
            ${escapeHtml(p.status || "Active")}
          </span>
        </td>

        <td>
          <a href="patient-profile.html?id=${encodeURIComponent(p.id)}"
             class="btn btn-outline"
             style="padding: 3px 8px; font-size: 11px;">
            Profile
          </a>

          <a href="new-test.html?patientId=${encodeURIComponent(p.id)}"
             class="btn btn-primary"
             style="padding: 3px 8px; font-size: 11px;">
            Test
          </a>
        </td>

        <td>${escapeHtml(String(month1))}</td>
        <td>${escapeHtml(String(month2))}</td>
        <td>${escapeHtml(String(month3))}</td>
        <td>${averageSugar}</td>

      </tr>
    `;

    tbody.append(tr);
  });
}
