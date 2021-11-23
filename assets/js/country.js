(async () => {
    let global = await axios.get('https://api.covid19api.com/summary');
    loadInitial(global.data.Countries);
})();

function loadInitial(countries) {
    const cmbCountry =  document.getElementById('cmbCountry');
    cmbCountry.innerHTML = countries.map(country => {
        if (country.Slug === 'brazil')
            return `<option value=${country.Slug} selected=${country.Slug}>${country.Country}</option>`;

        return `<option value=${country.Slug}>${country.Country}</option>`;
    });
    getCountry(cmbCountry.value, '2021-05-01', '2021-05-26');
    document.getElementById('filtro').addEventListener('click', handleClick)
}

function handleClick() {
    const country = document.getElementById('cmbCountry').value;
    const startDate = document.getElementById('date_start').value;
    const endDate = document.getElementById('date_end').value;

    getCountry(country, startDate, endDate);
}

function getTotalConfirmed(data) {
    let total = 0;
    data.forEach(item => total += item.Confirmed);

    return total;
}

function getTotalDeaths(data) {
    let total = 0;
    data.forEach(item => total += item.Recovered);

    return total;
}

function getTotalRecovered(data) {
    let total = 0;
    data.forEach(item => total += item.Deaths);

    return total;
}

function getDados(country) {
    const option = document.getElementById('cmbData').value;
    const values = [];

    if (option === 'Deaths') {
        for (let i = 0; i < country.length - 1; i ++) {
            values.push(country[i+1].Deaths - country[i].Deaths);
        }
    }
    if (option === 'Confirmed') {
        for (let i = 0; i < country.length - 1; i ++) {
            values.push(country[i+1].Confirmed - country[i].Confirmed);
        }
    }
    if (option === 'Recovered') {
        for (let i = 0; i < country.length - 1; i ++) {
            values.push(country[i+1].Recovered - country[i].Recovered);
        }
    }
    return values;
}

function getMedia(country) {
    const option = document.getElementById('cmbData').value;
    let values = [];

    if (option === 'Deaths') {
        for (let i = 0; i < country.length - 1; i ++) {
            values.push(country[i+1].Deaths - country[i].Deaths);
        }
    }
    if (option === 'Confirmed') {
        for (let i = 0; i < country.length - 1; i ++) {
            values.push(country[i+1].Confirmed - country[i].Confirmed);
        }
    }
    if (option === 'Recovered') {
        for (let i = 0; i < country.length - 1; i ++) {
            values.push(country[i+1].Recovered - country[i].Recovered);
        }
    }

    const soma = values.reduce((prev, current) => {
        return prev + current;
    });

    return values.fill(soma/values.length, 0, values.length);
}

function getDates(country) {
    return country.map(item => {
        const date = new Date(item.Date);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate()}`;
    })
}

async function getCountry(slug, dateStart, dateEnd) {
    const country = await axios.get(`https://api.covid19api.com/country/${slug}?from=${dateStart}T00:00:00Z&to=${dateEnd}T00:00:00Z`);

    document.getElementById('kpiconfirmed').innerText = getTotalConfirmed(country.data);
    document.getElementById('kpideaths').innerText = getTotalDeaths(country.data);
    document.getElementById('kpirecovered').innerText = getTotalRecovered(country.data);

    loadChart(country.data);
}

let linhas = new Chart(document.getElementById('linhas'), null);

function loadChart(country) {
    linhas.destroy();
    linhas = new Chart(document.getElementById('linhas'), {
        type: 'line',
        data: {
            labels: getDates(country),
            datasets: [{
                label: 'Número de Mortes',
                data: getDados(country),
                backgroundColor: ['orange'],
                borderColor: 'orange'
            },
            {
                label: 'Média de Mortes',
                data: getMedia(country),
                backgroundColor: ['red'],
                borderColor: 'red'
            }]
        },
        options: {
            responsive: true
        }
    }) 
}