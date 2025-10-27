const { render } = require("sass");

let headerList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
}

const jobURL = "http://localhost:9000/api/jobs";

window.onload = () => {
    getJob().then(result => {
        renderJob(result)
    })

    document.querySelector("form").addEventListener("submit", formValue);
}

//hämta in jobben
async function getJob() {
    try {
        const response = await fetch(jobURL, {
            method: "GET",
            headers: headerList
        });

        //validering
        if(!response.ok) {
            throw new Error(`Det har inträffat ett HTTP-fel. Status: ${response.status}`);
        }   

        const result = await response.json();

        return result;
    } catch (error) {
        console.log("Det uppstod ett fel vid hämtningen av jobben: ", error);
        return [];
    }
}

//skapa nya jobb 
async function createJob(jobTitle, companyName, endDate, description) {
    try {
        let jobs = {
            jobTitle,
            companyName,
            endDate,
            description
        }

        const response = await fetch(jobURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jobs),
        });

        const data = await response.json();
    } catch (error) {
        console.log("Det uppstod ett fel vid skapandet av jobben: ", error);
    }
}


//radera jobben
async function deleteJob(id) {
    try {
        const response = await fetch(`${jobURL}/${id}`, {
            method: "DELETE",
            headers: headerList
        });

        return response.ok;

    } catch (error) {
        console.log("Det uppstod ett fel vid borttagning av jobb: ", error);
    }
}

//värdena från formuläret
function formValue(event) {
    event.preventDefault();

    const jobTitle = document.getElementById("jobTitle").value;
    const companyName = document.getElementById("companyName").value;
    const endDate = document.getElementById("endDate").value;
    const description = document.getElementById("description").value;

    createJob(jobTitle, companyName, endDate, description);
}

//skriv ut jobben 
function renderJob(jobs) {
    const divEl = document.getElementById("jobsHere");
    divEl.innerHTML = "";

    jobs.forEach(job => { 
        //article
        const articleEl = document.createElement("article");

        //jobTitle
        const jobTitleEl = document.createElement("h2");
        jobTitleEl.textContent = job.jobTitle;

        //companyName
        const companyNameTitleEl = document.createElement("p");
        companyNameTitleEl.innerHTML = "<b>Företagsnamn: </b>";

        const companyNameEl = document.createElement("p");
        companyNameEl.textContent = job.companyName;

        //endDate
        const endDateTitleEl = document.createElement("p");
        endDateTitleEl.innerHTML = "<b>Slutdatum: </b>";

        const endDateEl = document.createElement("p");
        endDateEl.textContent = job.endDate;

        //description
        const descriptionTitleEl = document.createElement("p");
        descriptionTitleEl.innerHTML = "<b>Beskrivning:</b>"

        const descriptionEl = document.createElement("p");
        descriptionEl.textContent = job.description;

        //br-element
        const newLineEl = document.createElement("br");

        //delete-knapp
        const deleteJobEl = document.createElement("button");
        deleteJobEl.textContent = "Ta bort";

        
        //lägger till allt i containerEl
        articleEl.appendChild(jobTitleEl);
        articleEl.appendChild(companyNameTitleEl);
        articleEl.appendChild(companyNameEl);
        articleEl.appendChild(endDateTitleEl);
        articleEl.appendChild(endDateEl);
        articleEl.appendChild(descriptionTitleEl);
        articleEl.appendChild(newLineEl);
        articleEl.appendChild(descriptionEl);
        articleEl.appendChild(newLineEl);
        articleEl.appendChild(deleteJobEl);

        divEl.appendChild(articleEl);

        //klicka på knappen -> radera jobb -> uppdatera divven
        deleteJobEl.onclick = () => {
            deleteJob(job._id).then(() => {
                getJob().then(renderJob);
            });
        }
    });
}