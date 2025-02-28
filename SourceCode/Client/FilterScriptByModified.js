document.getElementById('filter-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const days = document.getElementById('days').value;
    const page = document.getElementById('page').value;
    const url = `http://localhost:5000/api/cves/modified/${days}?page=${page}&limit=10`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayResults(data.cves);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

function displayResults(cves) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = cves.length ? cves.map(cve => `<h3>${cve.cve.id}</h3>`).join('') : `<p>No CVEs found.</p>`;
}

