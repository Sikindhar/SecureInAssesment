
const urlParams = new URLSearchParams(window.location.search);
const cveId = urlParams.get("cveId");

async function fetchCVEData() {
    try {
        const response = await fetch(`http://localhost:5000/api/cves/getById/${cveId}`);
        const data = await response.json();

        const detailsDiv = document.querySelector(".details-container");

        if (data.message) {
            detailsDiv.innerHTML = `<p>${data.message}</p>`;
            return;
        }

        
        let severity = "Unknown";
        let severityClass = "low"; 
        let cvssScore = data.cve.metrics.cvssMetricV2?.[0]?.cvssData?.baseScore;

        if (cvssScore !== undefined) {
            if (cvssScore < 4.0) {
                severity = "LOW";
                severityClass = "low";
            } else if (cvssScore < 7.0) {
                severity = "MEDIUM";
                severityClass = "medium";
            } else if (cvssScore < 9.0) {
                severity = "HIGH";
                severityClass = "high";
            } else {
                severity = "CRITICAL";
                severityClass = "critical";
            }
        }

        detailsDiv.innerHTML = `
            <h2>${data.cve.id}</h2>
            <p><strong>Published Date:</strong> ${new Date(data.cve.published).toLocaleDateString()}</p>
            <p><strong>Last Modified:</strong> ${new Date(data.cve.lastModified).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${data.cve.vulnStatus}</p>

            <h3>Description</h3>
            <p>${data.cve.descriptions.find(desc => desc.lang === 'en')?.value || "No Description Available"}</p>

            <h3>CVSS v2 Score</h3>
            <p><span class="severity ${severityClass}">${cvssScore !== undefined ? cvssScore + " - " + severity : "Not Available"}</span></p>

            <h3>Weaknesses</h3>
            <ul>
                ${data.cve.weaknesses?.map(weakness => `<li>${weakness.description[0]?.value}</li>`).join("") || "<li>No Weaknesses Recorded</li>"}
            </ul>

            <h3>References</h3>
            <ul>
                ${data.cve.references?.map(ref => `<li><a href="${ref.url}" target="_blank">${ref.url}</a></li>`).join("") || "<li>No References Available</li>"}
            </ul>
        `;
    } catch (error) {
        console.error("Error fetching CVE details:", error);
    }
}

function goBack() {
    window.history.back();
}

fetchCVEData();
