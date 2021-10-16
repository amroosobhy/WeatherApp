/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+1+'.'+ d.getDate()+'.'+ d.getFullYear();
//store openWeatherMap API Key
const apiKey = "01f48274863c31c819774d76e555d94b&units=metric";

const generateBtn = document.querySelector('#generate');
generateBtn.addEventListener('click', async () => {
   //get zipCode and feelings from UI 
    const zipCode = document.querySelector('#zip').value;
    const content = document.querySelector('#feelings').value;
    //verify that zipCode is not empty
    if(!zipCode){
        alert('You must enter zip code!');
        return
    }
    //call functions in sequence using then()
    getWeather(zipCode)
    .then((temp)=>{
        postData(temp,content)
    })
    .then(()=>{
        return getData()
    })
    .then((finalData)=>{
        updateUI(finalData)
    })
    .catch(err => console.log('error', err)) 

});

//function to get temperature from OpenWeatherMap API 
async function getWeather(zipCode){    
    const fullUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}`;
    
    const res = await fetch(fullUrl); 
    const data = await res.json();    
    const temp = data.main.temp;
    return temp;
}

//function to post the data to the app endpoint thru '/saveData' 
async function postData(temp,content){
    await fetch('/saveData', {
        method : 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },  
        body: JSON.stringify({
            date: newDate,
            temp,
            content            
        })
    })
}

// function to fetch the data from the app endpoint thru '/getData'
async function getData(){
    const newRes = await fetch('/getData');
    const finalData = await newRes.json();
    return finalData;
}

//assign the fetched data to the div in the bottom of 'index.html' 
async function updateUI(finalData){
    document.querySelector('#date').innerText = `Date: ${finalData.date}`;
    document.querySelector('#temp').innerText = `Temperature: ${finalData.temp} (C)`;
    document.querySelector('#content').innerText = `Feelings: ${finalData.content}`;
}
