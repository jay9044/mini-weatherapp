// Display photographer credits in bottom right hand corner with link to their portfolio on Unsplash
//  Display white border around thumbnail of image currently displayed as main image using active class

//Initialise API's and css selectors
const weatherUrl = "84f0f2104760927b465acbf6cca0ab2f";
const client_id = "b899d09e04d42d7c4a5d5f0a06b3e406f9bb09e388bf70dd2e69f296a43a887e";
const inputElement = document.querySelector(".search__input");
const form = document.querySelector("form");
const mainPhotoContainer = document.querySelector(".photo");
const thumbContainer = document.querySelector(".thumbs");
const weatherDescription = document.querySelector("#conditions")
const credit = document.querySelector("#credit-user");
const unsplash = document.querySelector("#credit-platform");
// listen out for input value from submitted form
form.addEventListener("submit", function (event) {
    event.preventDefault()
    getWeather(inputElement.value);
})




// main function that fetches weather data
function getWeather(location) {
    // location is from user input(form event listener above)
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${weatherUrl}`)
        .then(response => response.json())
        .then(body => {
            // get weather description
            const locationWeather = body.weather[0].description.split(" ").join("+");
            getPhotos(location, locationWeather);
        })
}
//




function getPhotos(location, locationWeather) {
    const url = `https://api.unsplash.com/search/photos?query=${location}+${locationWeather}&client_id=${client_id}`;
    fetch(url)
        .then(response => response.json())
        .then(body => {
            console.log(body);
            //clear mainContainer node/selector
            mainPhotoContainer.innerHTML = "";
            loadFirstPhoto(body.results, locationWeather, location);
            renderThumbs(body.results);
            createThumbLinks(body.results);
        });
}



function loadFirstPhoto(resultsArray, locationWeather, location) {
    mainPhotoContainer.innerHTML = `<img src="${resultsArray[0].urls.regular}">`;
    credit.innerHTML = `${resultsArray[0].user.first_name} ${resultsArray[0].user.last_name}`;
    weatherDescription.innerHTML = `The weather in ${location} is ${locationWeather.split("+").join(" ")}`;
}

//creating the thumbnail images
function renderThumbs(resultsArray) {
    let hmtlOutput = "";
    resultsArray.forEach((result, index) => {
        // if image is main image give thumb and active class, otherwise just give give thumb class
        let thumbClass = index === 0 ? `thumb active` : `thumb`;
        hmtlOutput += `<div><img class="${thumbClass}" src="${result.urls.regular}"></div>`;
    });
    thumbContainer.innerHTML = hmtlOutput;
}

function createThumbLinks(resultsArray) {
    const thumbLinks = document.querySelectorAll(".thumb");
    thumbLinks.forEach((thumbImage, counter) => {
        let name = `${resultsArray[counter].user.first_name} ${resultsArray[counter].user.last_name}`;
        thumbImage.name = name;
        thumbImage.profile = `${resultsArray[counter].user.portfolio_url}`;
        thumbImage.unsplash =`${resultsArray[counter].user.links.self}`;
        console.log(thumbImage.unsplash);
        thumbImage.addEventListener("click", function(event){
            mainPhotoContainer.innerHTML = `<img src="${event.target.currentSrc}">`;
            credit.innerHTML = `<a href="${thumbImage.profile}" target= "_blank">${thumbImage.name}</a>`;
            unsplash.innerHTML = `<a href="${thumbImage.unsplash}" target= "_blank">Unsplash</a>`;
            const prevThumb = document.querySelector(".active");
            if (prevThumb !== null) {
                prevThumb.classList.remove("active")
                event.target.classList.add("active")
            }
        });
    })
}


    




getWeather("italy");

