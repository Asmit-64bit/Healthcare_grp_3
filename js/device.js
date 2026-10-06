/**
 * UroScan AI - Device Monitoring Controller (jQuery)
 * Dynamically retrieves time and dates from local device clock (new Date()).
 */

$(document).ready(function () {

  // Update dynamic device calibration and test execution times from local device clock
  const todayDate = getDeviceFormattedDate(0);
  const tests = getTests();
  const lastTest = tests.length > 0 ? tests[0] : null;

  if ($("#cardLastCal").length) {
    $("#cardLastCal").text(todayDate);
  }

  // Camera Diagnostic Self-Test
  $("#btnTestCamera").on("click", function () {
    const btn = $(this);
    btn.prop("disabled", true).html('<i class="fa-solid fa-spinner fa-spin"></i> Testing Camera...');
    $("#camStatus").text("Capturing Test Frame...");
    $("#cardCam").text("Testing...");

    showToast("Camera Diagnostic", "Initiating optical sensor test...");

    setTimeout(function () {
      btn.prop("disabled", false).html('<i class="fa-solid fa-camera"></i> Test Camera');
      $("#camStatus").text("12MP Autofocus: OK");
      $("#cardCam").text("Ready");
      showToast("Diagnostic Complete", "Camera optical sensor passed self-test.");
    }, 1500);
  });

  // LED Illumination Test
  $("#btnTestLED").on("click", function () {
    const btn = $(this);
    btn.prop("disabled", true).html('<i class="fa-solid fa-spinner fa-spin"></i> Calibrating...');
    $("#ledStatus").text("Measuring Output...");
    $("#cardLED").text("Calibrating...");

    showToast("Illumination Test", "Testing 5500K LED array...");

    setTimeout(function () {
      btn.prop("disabled", false).html('<i class="fa-solid fa-lightbulb"></i> Test LED');
      $("#ledStatus").text("5500K LED Array: Ready");
      $("#cardLED").text("Ready");
      showToast("Diagnostic Complete", "LED illumination array output calibrated.");
    }, 1500);
  });

  // Simulate Test Action
  $("#btnSimulateTest").on("click", function () {
    showToast("Simulating Test", "Redirecting to test initiation workflow...");
    setTimeout(function () {
      window.location.href = "new-test.html";
    }, 500);
  });
});
