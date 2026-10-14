# UroScan AI – Point-of-Care Urinalysis & Patient Management System

**Healthcare Group 3**  
*Department of Computer Engineering*  
*K. J. Somaiya School of Engineering (KJSSE)*  
*Second-Year B.Tech (Semester 3) – Web Development Lab (WDL) Mini-Project*  

---

## Project Overview

**UroScan AI** is an interactive, browser-based healthcare management prototype designed to simulate an automated point-of-care urinalysis workflow. The platform provides an integrated, end-to-end journey for laboratory technicians and pathologists—connecting patient records, automated 10-pad reagent strip scanning simulations, clinical review interfaces, diagnostic trend analytics, and exportable medical reports.

All clinical data is maintained locally using browser `localStorage` and JSON structures, ensuring a seamless multi-page workflow without requiring external server dependencies.

---

## Team Members & Contributions

| Member Name | Roll Number | Primary Roles & Contributions |
| :--- | :--- | :--- |
| **Asmit Samanta** | `16010125221` | Lead architecture & refactoring, authentication system, dashboard & analytics data visualization, patient profile trends, dynamic DOB-age calculation, and UI/UX styling. |
| **Om Rode** | `16010125212` | Patient directory management, monthly sugar tracking data model, automated average calculation logic, test workflow integration, and documentation. |
| **Rudraksh Sahane** | `16010125217` | Laboratory image & asset curation, sample patient dataset preparation, patient table sugar metrics, presentation slides preparation (`Healthcare Group-3.pptx`). |

---

## Key Features

### 1. Patient Directory & Longitudinal Sugar Tracking
* **Patient Records**: Search, filter, and view patient profiles with demographic details, contact numbers, and dynamically calculated age in years and months.
* **3-Month Sugar Monitoring**: Tracks Month 1, Month 2, and Month 3 blood glucose readings (mg/dL) per patient.
* **Automated Average Calculation**: Automatically computes the 3-month average sugar level with dynamic clinical risk badge indicators (`Normal`, `Review`, `Critical`).
* **Patient Registration Modal**: Modal dialog with dynamic age auto-calculation based on Date of Birth (DOB) selection.

### 2. Automated Urinalysis Simulation (10 Analytes)
* Standardized optical evaluation simulating an automated strip reader camera box across 10 vital parameters:
  * **Glucose (GLU)**
  * **Protein (PRO)**
  * **pH**
  * **Ketones (KET)**
  * **Blood (BLO)**
  * **Bilirubin (BIL)**
  * **Urobilinogen (URO)**
  * **Nitrite (NIT)**
  * **Leucocytes (LEU)**
  * **Specific Gravity (SG)**
* Color-coded digital reagent strip pad representation matching standard laboratory visual inspection charts.

### 3. Diagnostic Results & Clinical Review
* AI diagnostic confidence score (e.g., 94%–98%).
* Detailed analyte breakdown with reference ranges, pad codes, and condition alerts.
* Pathologist review interface with status updates (`Approved`, `Pending`, `Review`) and clinical recommendation notes.

### 4. Interactive Analytics & Longitudinal Trends
* Chart.js visualizations for test volume, analyte positivity rates, and patient glucose/protein trends over time.
* Patient-specific trend charts tracking historical test parameters across multiple visits.

### 5. Report Generation & Local Export
* Standardized clinical diagnostic reports linked to unique Test and Patient IDs.
* Standalone printable/downloadable HTML reports with full analyte panel results and pathologist sign-off.

### 6. Hardware Reader & Laboratory Facility Simulation
* Simulated device status interface for the UroScan Reader unit (optical sensor calibration, illumination checks, camera status).
* Gallery showcasing laboratory facilities and testing equipment.

---

## Technology Stack

* **Frontend**: HTML5, CSS3 (Custom Responsive Flexbox & Grid layouts)
* **Scripting & DOM Manipulation**: JavaScript (ES6+), jQuery 3.7.1
* **Data Visualization**: Chart.js
* **Iconography**: Font Awesome 6.4.2
* **Data Persistence**: Browser `localStorage` (structured JSON documents for patients, tests, reports, and auth state)

---

## Project Structure

```text
Healthcare_grp_3/
├── assets/                          # Medical equipment, lab facilities, and strip images
│   └── images/
├── css/                             # Stylesheets
│   ├── style.css                    # Main design system, colors, badges, components
│   └── responsive.css               # Mobile and tablet breakpoints
├── js/                              # Application controllers & data models
│   ├── app.js                       # Global auth, topbar profile, toast notifications
│   ├── mockData.js                  # Initial mock dataset, localStorage migrations, helpers
│   ├── dashboard.js                 # Dashboard metrics and charts
│   ├── patients.js                  # Patient table rendering, search, sugar calculation, registration
│   ├── patient-profile.js           # Patient history, profile metadata, trend graphs
│   ├── test.js                      # New test creation & strip simulation workflow
│   ├── results.js                   # Test results rendering & pathologist review actions
│   ├── reports.js                   # Report directory, filter, and report viewing
│   ├── analytics.js                 # Urinalysis distribution charts & statistics
│   └── device.js                    # Reader diagnostic status simulation
├── index.html                       # Login & role-based authentication portal
├── home.html                        # Project landing page & hardware showcase
├── dashboard.html                   # Central lab overview & recent activities
├── patients.html                    # Patient directory with 3-month sugar readings
├── patient-profile.html             # Detailed patient record & trend analytics
├── new-test.html                    # Patient selection & test initialization
├── test-processing.html             # Timed strip scanning simulation
├── results.html                     # Analyte results & clinical review
├── reports.html                     # Generated diagnostic reports archive
├── analytics.html                   # Statistical overview & charts
├── device.html                      # Optical strip reader hardware status
├── Healthcare Group-3.pptx          # Project presentation slides
└── README.md                        # Project documentation
```

---

## How to Run the Project

1. **Clone or Download the Repository**:
   ```bash
   git clone https://github.com/Asmit-64bit/Healthcare_grp_3.git
   ```
2. **Open in VS Code or Any Web Browser**:
   * Navigate to the project directory:
     ```bash
     cd Healthcare_grp_3
     ```
   * **Option A (Recommended)**: Right-click `index.html` and choose **"Open with Live Server"** in VS Code.
   * **Option B**: Run a simple local Python server:
     ```bash
     python -m http.server 8000
     ```
     Then open `http://localhost:8000` in your browser.
   * **Option C**: Directly open `index.html` in any modern web browser (Chrome, Firefox, Edge, Brave).
3. **Demo Credentials**:
   * **Email**: `doctor@uroscan.demo`
   * **Password**: `demo123`
   *(Or click "Quick Demo Login" on the login screen to enter immediately).*

---

## Detailed Individual Contributions

### Rudraksh Sahane (`16010125217`)
* **Image Collection & Integration**: Collected laboratory equipment, testing procedures, and urine strip images to enhance realistic interface presentation.
* **Patient Data Collection**: Curated sample patient records and contributed the monthly sugar data fields (Month 1, 2, 3) to the dataset.
* **Table Integration**: Added Month 1, 2, 3 and average sugar columns in the patient directory table.
* **Presentation**: Created and structured the project slides in [`Healthcare Group-3.pptx`](Healthcare%20Group-3.pptx).

### Om Rode (`16010125212`)
* **Sugar Tracking Logic**: Developed automated average calculation functions for patient monthly sugar values.
* **Patient Management**: Contributed to patient directory search, data filtering, and registration workflows.
* **Documentation**: Drafted initial project documentation and workflow descriptions.

### Asmit Samanta (`16010125221`)
* **System Architecture & Refactoring**: Designed the unified multi-page structure, navigation flow, and modular JavaScript architecture.
* **Authentication & Session Manager**: Implemented mock authentication, role-based topbar personalization, and localStorage persistence.
* **Longitudinal Trend Analytics**: Integrated Chart.js visualizations across dashboard metrics, analytics, and patient profile history.
* **Dynamic Calculations**: Implemented dynamic DOB-to-age and month conversions, status risk badge color-coding, and data migration routines in `mockData.js`.

---

## Academic Disclaimer & Limitations

> **Academic Prototype Notice**:  
> UroScan AI is an educational frontend prototype developed for the Web Development Lab (WDL) mini-project at K. J. Somaiya School of Engineering. All test results, optical readings, AI diagnostic confidence metrics, and device hardware telemetry are simulated using predetermined datasets. This application is intended solely for academic demonstration and not for actual clinical diagnosis.
