import axios from "axios";
import NVD_CVE from "../Models/NVD_CVE.js";

const CVE_UPDATE_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";

export const fetchUpdatedCVEs = async (days = 7) => {
  try {
    const lastModifiedDate = new Date();
    lastModifiedDate.setDate(lastModifiedDate.getDate() - days);
    const formattedDate = lastModifiedDate.toISOString().split("T")[0];

    console.log(`🔄 Fetching updated CVEs since: ${formattedDate}`);

    const response = await axios.get(CVE_UPDATE_URL, {
      params: { lastModStartDate: formattedDate, resultsPerPage: 1000 },
    });

    const updatedCVEData = response.data.vulnerabilities;

    for (const cve of updatedCVEData) {
      await NVD_CVE.findOneAndUpdate(
        { "cve.id": cve.cve.id },
        cve,
        { upsert: true }
      );
    }

    console.log(` Updated ${updatedCVEData.length} CVEs in MongoDB.`);
  } catch (error) {
    console.error(" Error updating CVEs:", error.message);
  }
};
