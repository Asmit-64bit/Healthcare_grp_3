
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


  $("#openRegisterModalBtn").on("click", function () {
    const nextId = "P-" + (10240 + getPatients().length + 1);
    $("#regId").val(nextId);
    $("#regName").val("");
    $("#regAge").val("40");
    $("#regDob").val("1986-05-15");
    $("#regContact").val("");
    $("#regMonth1").val("100");
    $("#regMonth2").val("105");
    $("#regMonth3").val("95");
    
    $("#registerModal").fadeIn(200).css("display", "flex");
  });

  // Dynamic Age calculation from DOB date selection
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
    const month1 = Number($("#regMonth1").val()) || 100;
    const month2 = Number($("#regMonth2").val()) || 105;
    const month3 = Number($("#regMonth3").val()) || 95;

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
      month1: month1,
      month2: month2,
      month3: month3,
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
        <td colspan="11" style="text-align: center; color: #718096; padding: 15px;">
          No matching patients found.
        </td>
      </tr>
    `);

    return;
  }

  // Generate each patient row
  filtered.forEach(p => {
    const pTests = tests.filter(t => t.patientId === p.id);
    const lastTest = pTests.length > 0 ? pTests[0].timestamp : "No tests yet";

    const m1 = p.month1 != null ? Number(p.month1) : 100;
    const m2 = p.month2 != null ? Number(p.month2) : 105;
    const m3 = p.month3 != null ? Number(p.month3) : 95;
    const avgSugarVal = calculateAverageSugar(p);
    const avgSugar = avgSugarVal !== "-" ? Math.round(Number(avgSugarVal)) : Math.round((m1 + m2 + m3) / 3);

    let sugarBadgeClass = "badge-normal";
    if (avgSugar > 140) {
      sugarBadgeClass = "badge-critical";
    } else if (avgSugar >= 115) {
      sugarBadgeClass = "badge-review";
    }

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
        <td>${p.age} yrs / ${getPatientAgeInMonths(p)} mos / ${escapeHtml(p.gender)}</td>
        <td>${escapeHtml(p.contact)}</td>
        <td><strong style="color: #2b6cb0;">${m1}</strong> <span style="font-size: 11px; color: #718096;">mg/dL</span></td>
        <td><strong style="color: #2b6cb0;">${m2}</strong> <span style="font-size: 11px; color: #718096;">mg/dL</span></td>
        <td><strong style="color: #2b6cb0;">${m3}</strong> <span style="font-size: 11px; color: #718096;">mg/dL</span></td>
        <td>
          <span class="badge ${sugarBadgeClass}">
            <span class="badge-dot"></span> ${avgSugar} mg/dL
          </span>
        </td>
        <td>${escapeHtml(lastTest)}</td>
        <td>
          <span class="badge badge-normal">${escapeHtml(p.status || 'Active')}</span>
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
      </tr>
    `;

    tbody.append(tr);
  });
}

function getPatientAgeInMonths(patient) {
  if (!patient.dob) return Math.max(0, Number(patient.age) || 0) * 12;

  const birthDate = new Date(`${patient.dob}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return Math.max(0, Number(patient.age) || 0) * 12;

  const today = new Date();
  let months = (today.getFullYear() - birthDate.getFullYear()) * 12 +
    today.getMonth() - birthDate.getMonth();
  if (today.getDate() < birthDate.getDate()) months--;
  return Math.max(0, months);
}
