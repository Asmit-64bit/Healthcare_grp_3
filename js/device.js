/**
 * UrinaSense - Device Monitoring Controller (jQuery)
 */

$(document).ready(function () {

  // jQuery Test Camera Action
  $("#btnTestCamera").on("click", function () {
    const btn = $(this);
    btn.prop("disabled", true).html('<i class="fa-solid fa-spinner fa-spin"></i> Testing Camera...');
    $("#camStatus").text("Capturing Test Frame...").css("color", "var(--color-review)");
    $("#cardCam").text("Testing...").css("color", "var(--color-review)");

    showToast("Camera Diagnostic", "Initiating 12MP optical sensor test...", "info");

    setTimeout(function () {
      btn.prop("disabled", false).html('<i class="fa-solid fa-camera"></i> Test Camera');
      $("#camStatus").text("12MP Autofocus: OK").css("color", "rgba(255,255,255,0.7)");
      $("#cardCam").text("Ready").css("color", "var(--primary-navy)");
      showToast("Diagnostic Complete", "Camera optical sensor passed self-test.", "success");
    }, 1800);
  });

  // jQuery Test Illumination Action
  $("#btnTestLED").on("click", function () {
    const btn = $(this);
    btn.prop("disabled", true).html('<i class="fa-solid fa-spinner fa-spin"></i> Calibrating LED...');
    $("#ledStatus").text("Measuring Lux Output...").css("color", "var(--color-review)");
    $("#cardLED").text("Calibrating...").css("color", "var(--color-review)");
    $("#mainLedDot").removeClass("led-on").addClass("led-testing");

    showToast("Illumination Test", "Testing 5500K LED array uniformity...", "info");

    setTimeout(function () {
      btn.prop("disabled", false).html('<i class="fa-solid fa-lightbulb"></i> Test Illumination');
      $("#ledStatus").text("5500K CRI>95: Ready").css("color", "rgba(255,255,255,0.7)");
      $("#cardLED").text("Ready").css("color", "var(--primary-navy)");
      $("#mainLedDot").removeClass("led-testing").addClass("led-on");
      showToast("Diagnostic Complete", "LED illumination array output calibrated.", "success");
    }, 1800);
  });

  // Simulate Test Action
  $("#btnSimulateTest").on("click", function () {
    showToast("Simulating Test", "Redirecting to test initiation workflow...", "info");
    setTimeout(function () {
      window.location.href = "new-test.html";
    }, 600);
  });
});
