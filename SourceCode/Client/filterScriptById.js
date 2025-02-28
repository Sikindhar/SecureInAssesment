document.getElementById('filter-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const cveId = document.getElementById('cveId').value;
  const url = `http://localhost:5000/api/cves/getById/${cveId}`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("API Response:", data); 
      displayResults(data);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
});

function displayResults(cve) {
  const resultsDiv = document.getElementById('results');

  if (!cve) {
      resultsDiv.innerHTML = `<p>No CVE found.</p>`;
      return;
  }


  resultsDiv.innerHTML = `
      <h2>Full CVE Data</h2>
      <pre>${JSON.stringify(cve, null, 4)}</pre>
  `;
}
