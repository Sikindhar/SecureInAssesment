let currentPage = 1;
let resultsPerPage = 10;

async function fetchCVEData(url = `http://localhost:5000/api/cves/list?page=${currentPage}&limit=${resultsPerPage}`) {
    try {
        const response = await fetch(url);
        const data = await response.json();


        document.getElementById("totalRecords").textContent = data.totalRecords || "Filtered Results";

        const tableBody = document.getElementById("cveTableBody");
        tableBody.innerHTML = ""; 
        data.results?.forEach(cve => {
            const row = document.createElement("tr");

            row.onclick = () => {
                window.location.href = `details.html?cveId=${cve.cve.id}`;
            };

            row.innerHTML = `
                <td>${cve.cve.id}</td>
                <td>${new Date(cve.cve.published).toLocaleDateString()}</td>
                <td>${new Date(cve.cve.lastModified).toLocaleDateString()}</td>
                <td>${cve.cve.vulnStatus}</td>
            `;
            tableBody.appendChild(row);
        });

        document.getElementById("currentPage").textContent = `Page ${currentPage}`;
    } catch (error) {
        console.error("Error fetching CVE data:", error);
    }
}


document.getElementById("resultsPerPage").addEventListener("change", function() {
    resultsPerPage = this.value;
    currentPage = 1; 
    fetchCVEData();
});


document.getElementById("prevPage").addEventListener("click", function() {
    if (currentPage > 1) {
        currentPage--;
        fetchCVEData();
    }
});

document.getElementById("nextPage").addEventListener("click", function() {
    currentPage++;
    fetchCVEData();
});

async function fetchTotalCVEs() {
    try {
        const response = await fetch('http://localhost:5000/api/cves/count');
        const data = await response.json();

        document.getElementById("totalRecords").textContent = data.totalCves || "0";
    } catch (error) {
        console.error('Error fetching total CVEs:', error);
        document.getElementById('totalRecords').textContent = "Error";
    }
}

document.addEventListener('DOMContentLoaded', fetchTotalCVEs);

fetchCVEData();
