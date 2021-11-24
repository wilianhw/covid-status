(async () => {
    let response = await axios.get('https://api.covid19api.com/summary');
    loadSummary(response.data);
})();

function loadSummary(json) {
    loadKPI(json);
    loadBarChart(json);
    loadPieChart(json);
}

function loadKPI(json) {
    document.getElementById('confirmed').innerText = json.Global.TotalConfirmed.toLocaleString('PT');
    document.getElementById('death').innerText = json.Global.TotalDeaths.toLocaleString('PT');
    document.getElementById('recovered').innerText = json.Global.TotalRecovered.toLocaleString('PT');
    document.getElementById('date').innerText += formatDate(json.Global.Date);
}

function formatDate(date) {
    const dateFormat =  new Date(date);
    return `${dateFormat.getFullYear()}.${(dateFormat.getMonth() + 1).toString().padStart(2, '0')}.${dateFormat.getDate()} ${dateFormat.getHours()}:${dateFormat.getMinutes().toString().padStart(2, '0')}`;
}

function getTopTenDeaths(countries) {
    const sortCountries = countries.sort((a, b) => {
        return a.TotalDeaths < b.TotalDeaths ? 1 : a.TotalDeaths > b.TotalDeaths ? -1 : 0;
    })

    return sortCountries.slice(0,10);
}

function extrairDeaths(countries) {
    return countries.map(country => country.TotalDeaths);
}

function extrairLabels(countries) {
    return countries.map(country => country.Country);
}

function loadPieChart(json) {
    const pizza = new Chart(
        document.getElementById('pizza'), {
            type: 'pie',
            data: {
                labels: ["Confirmados", "Mortes", "Recuperados"],
                datasets: [
                    {
                        data: [json.Global.NewConfirmed, json.Global.NewDeaths, json.Global.NewRecovered],
                        backgroundColor: ["yellow", "red", "blue"]
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribuição de novos casos',
                        font: {
                            size: 20
                        }
                    }
                }
            }
        }
    )
}

function loadBarChart(json) {
    const topTenCountries = getTopTenDeaths(json.Countries);
    const barras = new Chart(
        document.getElementById('barras'), {
            type: 'bar',
            data: {
                labels: extrairLabels(topTenCountries),
                datasets: [{
                    data: extrairDeaths(topTenCountries),
                    backgroundColor: ["red", "yellow", "blue", "green", "gray", "beige", "orange", "purple", "pink", "brown"]
                }]
            },
            options: {
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Total de Mortes por país - Top 10',
                        font: {
                            size: 20
                        }
                    }
                }
            }
        }
    )
}

