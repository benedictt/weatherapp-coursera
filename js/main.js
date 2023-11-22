
const getCoordinates = async (data)=>{

    let coordinates

    let city_coordinates =  await fetch('../city_coordinates.csv')
    .then(response => response.text())
    .then(data => {  
        coordinates = data.split("\n")        
    })
    .catch(error => console.error('Error: ', error));
    return coordinates
}

const createOptions = async ()=>{
    const coordinates = await getCoordinates()
    for(let n = 1; n < coordinates.length; n++){
        let cityArry = coordinates[n].split(',')
        let optionTag = document.createElement('option')
        const citys = document.querySelector('#citys')
        citys.appendChild(optionTag)
        optionTag.setAttribute('value', `{"lat":"${cityArry[0]}", "lon":"${cityArry[1]}"}`)
        optionTag.innerHTML = `${cityArry[2]}, ${cityArry[3]}`

    }
}

const get7timerData = async (valueJSON)=>{
    document.getElementsByTagName('tbody')[0].innerHTML = 'getting data...'
    const data = await fetch(`http://www.7timer.info/bin/api.pl?lon=${valueJSON.lon}&lat=${valueJSON.lat}&product=civillight&output=json`)
    .then(resp=>resp.json())
    .then(data =>{
        renderData(data.dataseries)
    })
    .catch(error => console.error('Error: ', error));
}

const renderData = (dataseries) => {
    console.log(dataseries);
    const tbody = document.getElementsByTagName('tbody')[0]
    tbody.innerHTML = ''
    for(let n = 0; n < dataseries.length; n++){
        let trTag = document.createElement('tr');
        let thTag = document.createElement('th');
        let tdWeather = document.createElement('td');
        let tdMin = document.createElement('td');
        let tdMax = document.createElement('td');
        let imgWeather = document.createElement('img');

        let dateString = dataseries[n].date.toString();
        
        // Corrección: Asegúrate de que la cadena de fecha esté en formato 'yyyy-mm-dd'
        let dateParse = new Date(`${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`);

        let weekday = dateParse.getDay()
        const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        tbody.appendChild(trTag)
        trTag.appendChild(thTag)
        trTag.appendChild(tdWeather)
        trTag.appendChild(tdMin)
        trTag.appendChild(tdMax)

        thTag.innerHTML = dayName[weekday]

        tdWeather.appendChild(imgWeather)
        imgWeather.src = `../images/${dataseries[n].weather}.png`
        imgWeather.height = 35
        imgWeather.setAttribute('alt', `icon for ${dataseries[n].weather} weather`)

        tdMin.innerHTML = `${dataseries[n].temp2m.min}°`
        tdMax.innerHTML =`${dataseries[n].temp2m.max}°`
    }
}


createOptions()
document.querySelector('#citys').addEventListener('change', ()=>{
    let coordinates = JSON.parse(document.querySelector('#citys').value)
    get7timerData(coordinates)
})
