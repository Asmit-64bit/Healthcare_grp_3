/**
 * UrinaSense - Patient Management Controller (jQuery)
 */

$(document).ready(function () {
  renderPatientsTable();

  // jQuery Patient Search Filter
  $("#patientSearchInput").on("keyup", function () {
    const query = $(this).val().toLowerCase();
    renderPatientsTable(query);
  });

  // Open Register Modal via jQuery
  $("#openRegisterModalBtn").on("click", function () {
    const nextId = "P-" + (10240 + getPatients().length + 1);
    $("#regId").val(nextId);
    $("#regName").val("");
    $("#regAge").val("");
    $("#regContact").val("");
    $(".form-error").hide();
    
    $("#registerModal").fadeIn(200).css("display", "flex");
  });

  // Handle Form Submission with jQuery Validation
  $("#registerPatientForm").on("submit", function (e) {
    e.preventDefault();

    let isValid = true;
    const name = $("#regName").val().trim();
    const age = $("#regAge").val();
    const gender = $("#regGender").val();
    const dob = $("#regDob").val();
    const contact = $("#regContact").val().trim();
    const id = $("#regId").val();

    $(".form-error").hide();

    if (!name) {
      $("#regNameErr").fadeIn();
      isValid = false;
    }
    if (!age || age <= 0 || age > 120) {
      $("#regAgeErr").fadeIn();
      isValid = false;
    }
    if (!contact) {
      $("#regContactErr").fadeIn();
      isValid = false;
    }

    if (!isValid) return;

    // Save Patient Object
    const newPatient = {
      id: id,
      name: name,
      age: parseInt(age, 10),
      gender: gender,
      dob: dob || "1990-01-01",
      contact: contact,
      regDate: new Date().toISOString().split("T")[0],
      status: "Active"
    };

    savePatient(newPatient);

    showToast("Patient Registered", `Registered ${name} (${id}) successfully.`, "success");
    closeModal("#registerModal");
    renderPatientsTable();
  });
});

/**
 * Render Patients Table with jQuery
 */
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

  $("#patientCountLabel").text(`Showing ${filtered.length} patients`);

  if (filtered.length === 0) {
    tbody.append(`
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 24px;">
          No matching patients found.
        </td>
      </tr>
    `);
    return;
  }

  filtered.forEach(p => {
    // Find last test for patient
    const pTests = tests.filter(t => t.patientId === p.id);
    const lastTest = pTests.length > 0 ? pTests[0].timestamp : "No tests yet";

    const tr = `
      <tr>
        <td><strong>${escapeHtml(p.id)}</strong></td>
        <td>
          <a href="patient-profile.html?id=${encodeURIComponent(p.id)}" style="font-weight: 600; color: var(--primary-navy)">
            ${escapeHtml(p.name)}
          </a>
        </td>
        <td>${p.age} yrs / ${escapeHtml(p.gender)}</td>
        <td>${escapeHtml(p.contact)}</td>
        <td>${escapeHtml(lastTest)}</td>
        <td>
          <span class="badge badge-normal">
            <span class="badge-dot"></span> Active
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 8px;">
            <a href="patient-profile.html?id=${encodeURIComponent(p.id)}" class="btn btn-outline btn-sm" title="View Profile">
              <i class="fa-solid fa-id-card"></i> Profile
            </a>
            <a href="new-test.html?patientId=${encodeURIComponent(p.id)}" class="btn btn-accent btn-sm" title="Initiate New Test">
              <i class="fa-solid fa-vial"></i> Test
            </a>
          </div>
        </td>
      </tr>
    `;
    tbody.append(tr);
  });
}
