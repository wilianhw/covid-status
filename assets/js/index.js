(async function load() {
    let global = await axios.get('https://api.covid19api.com/summary');

    document.getElementById('confirmed').innerText = global.data.Global.TotalConfirmed;
    document.getElementById('death').innerText = global.data.Global.TotalDeaths;
    document.getElementById('recovered').innerText = global.data.Global.TotalRecovered;
    document.getElementById('date').innerText += formatDate(global.data.Global.Date);

    loadPie(global);
    const topTenCountries = topTenDeaths(global.data.Countries);
    loadBar(topTenCountries);

})();

function formatDate(date) {
    const dateFormat =  new Date(date);
    return `${dateFormat.getFullYear()}.${dateFormat.getMonth()}.${dateFormat.getDate()} ${dateFormat.getHours()}:${dateFormat.getMinutes()}`;
}

function topTenDeaths(countries) {
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

function loadPie(global) {
    const pizza = new Chart(
        document.getElementById('pizza'), {
            type: 'pie',
            data: {
                labels: ["Confirmados", "Recuperados", "Mortes"],
                datasets: [
                    {
                        data: [global.data.Global.NewConfirmed, global.data.Global.NewDeaths, global.data.Global.NewRecovered],
                        backgroundColor: ["red", "yellow", "blue"]
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

function loadBar(topTenCountries) {
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

