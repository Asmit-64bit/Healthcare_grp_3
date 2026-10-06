/**
 * UrinaSense - Dashboard Controller (jQuery & Chart.js)
 */

$(document).ready(function () {
  renderRecentTestsTable();
  initActivityChart();

  // jQuery Table Filter by status
  $("#statusFilter").on("change", function () {
    const val = $(this).val();
    renderRecentTestsTable(val, $("#dashboardSearch").val());
  });

  // jQuery Search filter
  $("#dashboardSearch").on("keyup", function () {
    const query = $(this).val();
    renderRecentTestsTable($("#statusFilter").val(), query);
  });
});

/**
 * Render Recent Tests Table dynamically using jQuery
 */
function renderRecentTestsTable(statusFilter = "all", searchQuery = "") {
  const tests = getTests();
  const tbody = $("#recentTestsBody");
  tbody.empty();

  let filtered = tests;

  if (statusFilter !== "all") {
    filtered = filtered.filter(t => t.status === statusFilter);
  }

  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(t => 
      t.testId.toLowerCase().includes(q) ||
      t.patientId.toLowerCase().includes(q) ||
      t.patientName.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    tbody.append(`
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-secondary); padding: 24px;">
          No matching test records found.
        </td>
      </tr>
    `);
    return;
  }

  filtered.slice(0, 10).forEach(test => {
    let badgeClass = "badge-normal";
    if (test.status === "Review") badgeClass = "badge-review";
    if (test.status === "Critical") badgeClass = "badge-critical";

    let reviewBadgeClass = "badge-pending";
    if (test.reviewStatus === "Approved") reviewBadgeClass = "badge-normal";
    if (test.reviewStatus === "Retest") reviewBadgeClass = "badge-critical";

    const tr = `
      <tr>
        <td><strong>${escapeHtml(test.testId)}</strong></td>
        <td>
          <a href="patient-profile.html?id=${encodeURIComponent(test.patientId)}" style="font-weight: 600; color: var(--primary-navy)">
            ${escapeHtml(test.patientName)}
          </a>
          <div style="font-size: 0.75rem; color: var(--text-secondary);">${escapeHtml(test.patientId)}</div>
        </td>
        <td>${escapeHtml(test.timestamp)}</td>
        <td>
          <span class="badge ${badgeClass}">
            <span class="badge-dot"></span> ${escapeHtml(test.status)}
          </span>
        </td>
        <td>
          <span class="badge ${reviewBadgeClass}">
            ${escapeHtml(test.reviewStatus || 'Pending')}
          </span>
        </td>
        <td>
          <a href="results.html?id=${encodeURIComponent(test.testId)}" class="btn btn-outline btn-sm">
            <i class="fa-solid fa-eye"></i> View
          </a>
        </td>
      </tr>
    `;
    tbody.append(tr);
  });
}

/**
 * Initialize 7-Day Activity Chart using Chart.js CDN
 */
function initActivityChart() {
  const ctx = document.getElementById("dashboardChart");
  if (!ctx) return;

  const labels = ["23 Sep", "24 Sep", "25 Sep", "26 Sep", "27 Sep", "28 Sep", "29 Sep"];
  const normalData = [14, 18, 16, 20, 22, 19, 18];
  const reviewData = [4, 5, 3, 6, 4, 7, 6];

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Normal Results",
          data: normalData,
          backgroundColor: "#10B981",
          borderRadius: 6
        },
        {
          label: "Requires Review",
          data: reviewData,
          backgroundColor: "#F59E0B",
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            font: { family: 'Inter', size: 12 }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false }
        },
        y: {
          stacked: true,
          grid: { color: '#E2E8F0' },
          ticks: { stepSize: 5 }
        }
      }
    }
  });
}
