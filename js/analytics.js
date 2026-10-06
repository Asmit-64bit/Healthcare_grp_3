/**
 * UrinaSense - Analytics Dashboard Controller (jQuery & Chart.js)
 */

let chartInstances = {};

$(document).ready(function () {
  initAnalyticsDashboard("7");

  // Time Range Filter Change Event via jQuery
  $("#timeRangeFilter").on("change", function () {
    const days = $(this).val();
    initAnalyticsDashboard(days);
    showToast("Analytics Filtered", `Displaying metrics for last ${days} days.`, "info");
  });
});

function initAnalyticsDashboard(days = "7") {
  const tests = getTests();
  const numDays = parseInt(days, 10);

  // Filter tests roughly by date or take slice
  const filteredTests = tests.slice(0, Math.min(tests.length, numDays === 7 ? 10 : numDays === 30 ? 18 : 25));

  // Compute KPI Statistics
  const total = filteredTests.length;
  const normal = filteredTests.filter(t => t.status === "Normal").length;
  const review = total - normal;
  const avgConf = (filteredTests.reduce((acc, t) => acc + t.confidence, 0) / total).toFixed(1);

  $("#kpiTotalTests").text(total);
  $("#kpiNormalCount").text(normal);
  $("#kpiReviewCount").text(review);
  $("#kpiAvgConfidence").text(`${avgConf}%`);

  // Destroy previous charts if existing
  Object.keys(chartInstances).forEach(key => {
    if (chartInstances[key]) chartInstances[key].destroy();
  });

  // 1. Tests Performed Over Time
  const dates = ["23 Sep", "24 Sep", "25 Sep", "26 Sep", "27 Sep", "28 Sep", "29 Sep"];
  const counts = [3, 5, 4, 6, 8, 7, 6];
  chartInstances.overTime = new Chart(document.getElementById("chartOverTime"), {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: "Daily Scans",
        data: counts,
        borderColor: "#0EA5E9",
        backgroundColor: "rgba(14, 165, 233, 0.15)",
        fill: true,
        tension: 0.3
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // 2. Normal vs Review Ratio (Doughnut)
  chartInstances.distribution = new Chart(document.getElementById("chartDistribution"), {
    type: "doughnut",
    data: {
      labels: ["Normal Results", "Review Required", "Critical"],
      datasets: [{
        data: [normal, Math.max(1, review - 1), 1],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"]
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // 3. Glucose Trend
  chartInstances.glucose = new Chart(document.getElementById("chartGlucoseTrend"), {
    type: "bar",
    data: {
      labels: dates,
      datasets: [{
        label: "Glucose (mg/dL Avg)",
        data: [10, 25, 15, 40, 30, 20, 50],
        backgroundColor: "#0EA5E9",
        borderRadius: 4
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // 4. Protein Trend
  chartInstances.protein = new Chart(document.getElementById("chartProteinTrend"), {
    type: "bar",
    data: {
      labels: dates,
      datasets: [{
        label: "Protein (mg/dL Avg)",
        data: [5, 12, 8, 25, 15, 10, 30],
        backgroundColor: "#F59E0B",
        borderRadius: 4
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // 5. pH Level Distribution
  chartInstances.ph = new Chart(document.getElementById("chartPhTrend"), {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: "Mean pH Level",
        data: [6.0, 6.2, 6.5, 6.1, 6.4, 6.3, 6.2],
        borderColor: "#84CC16",
        backgroundColor: "rgba(132, 204, 22, 0.1)",
        fill: true,
        tension: 0.2
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // 6. Frequently Flagged Parameters (Horizontal Bar)
  chartInstances.flagged = new Chart(document.getElementById("chartFlaggedParams"), {
    type: "bar",
    data: {
      labels: ["Protein", "Glucose", "Leucocytes", "Nitrite", "Blood"],
      datasets: [{
        axis: 'y',
        label: "Flagged Count",
        data: [12, 9, 7, 5, 4],
        backgroundColor: ["#EF4444", "#F59E0B", "#A855F7", "#F472B6", "#D97706"],
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false
    }
  });
}
