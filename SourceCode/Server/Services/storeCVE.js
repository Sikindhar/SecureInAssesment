import axios from "axios";
import NVD_CVE from "../Models/NVD_CVE.js";

const CVE_API_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";
const PAGE_SIZE = 1000; 

const getLastStoredCVEIndex = async () => {``
  const count = await NVD_CVE.countDocuments();
  return count; 
};

export const fetchAndStoreFullCVEData = async () => {
  try {
    let startIndex = await getLastStoredCVEIndex(); 
    let totalResults = null;

    console.log(`🔄 Resuming CVE fetch from index: ${startIndex}...`);

    while (totalResults === null || startIndex < totalResults) {
      try {
        const params = { startIndex, resultsPerPage: PAGE_SIZE };
        console.log(`Fetching from: ${CVE_API_URL}?${new URLSearchParams(params)}`);

        const response = await axios.get(CVE_API_URL, { params });

        const cveData = response.data.vulnerabilities;
        totalResults = response.data.totalResults;

        for (const cve of cveData) {
          await NVD_CVE.findOneAndUpdate(
            { "cve.id": cve.cve.id },
            cve,
            { upsert: true }
          );
        }

        console.log(` Fetched ${startIndex + PAGE_SIZE} of ${totalResults} CVEs.`);
        startIndex += PAGE_SIZE;

        await new Promise(resolve => setTimeout(resolve, 3000));

      } catch (error) {
        console.error(`Error fetching at index ${startIndex}:`, error.message);
        console.log("Retrying in 5 seconds...");
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    console.log("Full NVD database successfully stored in MongoDB!");
  } catch (error) {
    console.error("Error fetching NVD data:", error.message);
  }
};

fetchAndStoreFullCVEData();



