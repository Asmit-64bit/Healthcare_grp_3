/**
 * UroScan AI - Patient Management Controller (jQuery)
 * Includes dynamic DOB & Age auto-calculation logic.
 */

$(document).ready(function () {
  renderPatientsTable();

  $("#patientSearchInput").on("keyup", function () {
    const query = $(this).val().toLowerCase();
    renderPatientsTable(query);
  });


  const RegisterBtn = document.getElementById("openRegisterModalBtn");
  if(openRegisterModalBtn){
    openRegisterModalBtn.addEventListener("click",function(){
      const nextId="P-"+(10240+getPatients().length+1);
      document.getElementById("regId").value=nextId;
      document.getElementById("regName").value="";
      document.getElementById("regAge").value="40";
      document.getElementById("regDob").value="1986-05-15";
      document.getElementById("regContact").value="";

      const registerModal=document.getElementById("registerModal");
      if(registerModal){
        registerModal.style.display="flex";
      }
    });
  }

  /*$("#openRegisterModalBtn").on("click", function () {
    const nextId = "P-" + (10240 + getPatients().length + 1);
    $("#regId").val(nextId);
    $("#regName").val("");
    $("#regAge").val("40");
    $("#regDob").val("1986-05-15");
    $("#regContact").val("");
    
    $("#registerModal").fadeIn(200).css("display", "flex");
  });*/
  // Dynamic Age calculation from DOB date selection
  $("#regDob").on("change", function () {
    const dobVal = $(this).val();
    if (dobVal) {
      const birthDate = new Date(dobVal);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age >= 0) {
        $("#regAge").val(age);
      }
    }
  });

  // Handle Form Submission with jQuery Validation
  $("#registerPatientForm").on("submit", function (e) {
    e.preventDefault();

    const name = $("#regName").val().trim();
    const age = $("#regAge").val();
    const gender = $("#regGender").val();
    const dob = $("#regDob").val();
    const contact = $("#regContact").val().trim();
    const id = $("#regId").val();

    if (!name || !age || !contact || !dob) {
      showToast("Validation Error", "Please fill in all required patient fields.");
      return;
    }

    const newPatient = {
      id: id,
      name: name,
      age: parseInt(age, 10),
      gender: gender,
      dob: dob,
      contact: contact,
      regDate: getDeviceFormattedDate(0),
      status: "Active"
    };

    savePatient(newPatient);

    showToast("Patient Registered", `Registered ${name} (${id}) successfully.`);
    closeModal("#registerModal");
    renderPatientsTable();
  });
});

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
        <td colspan="7" style="text-align: center; color: #718096; padding: 15px;">
          No matching patients found.
        </td>
      </tr>
    `);
    return;
  }

  filtered.forEach(p => {
    const pTests = tests.filter(t => t.patientId === p.id);
    const lastTest = pTests.length > 0 ? pTests[0].timestamp : "No tests yet";

    const tr = `
      <tr>
        <td><strong>${escapeHtml(p.id)}</strong></td>
        <td>
          <a href="patient-profile.html?id=${encodeURIComponent(p.id)}" style="font-weight: 600;">
            ${escapeHtml(p.name)}
          </a>
        </td>
        <td>${p.age} yrs / ${escapeHtml(p.gender)}</td>
        <td>${escapeHtml(p.contact)}</td>
        <td>${escapeHtml(lastTest)}</td>
        <td>
          <span class="badge badge-normal">Active</span>
        </td>
        <td>
          <a href="patient-profile.html?id=${encodeURIComponent(p.id)}" class="btn btn-outline" style="padding: 3px 8px; font-size: 11px;">Profile</a>
          <a href="new-test.html?patientId=${encodeURIComponent(p.id)}" class="btn btn-primary" style="padding: 3px 8px; font-size: 11px;">Test</a>
        </td>
      </tr>
    `;
    tbody.append(tr);
  });
}
