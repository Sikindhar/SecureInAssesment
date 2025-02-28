import cron from "node-cron";
import { fetchUpdatedCVEs } from "./updateCVE.js";

console.log(" Starting CVE update scheduler...");

// Run every 24 hours
cron.schedule("0 0 * * *", async () => {
  console.log(" Running daily CVE sync...");
  await fetchUpdatedCVEs();
});
