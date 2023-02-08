//This script handles the search to the Pokemon TCG API

//This global variable is to handle the pagin of results

function search() {
  showElementByIdAsBlock("searching-container");

  let searchTerm = document.querySelector("#search-term").value;

  document.getElementById("search-results").innerHTML = "";

  getCardInfo(searchTerm);
}

async function getCardInfo(searchTerm) {
  let url = "https://api.pokemontcg.io/v2/cards";
  url += `?q=name:${searchTerm}*&pageSize=24`; //The search is passed as a param in the url
  let response = await fetch(url);
  if (response.ok) {
    hideElementById("search-not-found-container");

    let jsonResponse = await response.json();
    console.log(jsonResponse);
    hideElementById("searching-container");
    hideElementById("search-results");

    if (jsonResponse.count == 0) {
      //in case nothing is found in the search
      showElementByIdAsBlock("search-not-found-container");
    } else {
      document.getElementById("search-results").style.display = "flex";
      populateResults(jsonResponse.data);
    }
  } else {
    console.log(response.status);
    hideElementById("search-results");
    hideElementById("searching-container");
    showElementByIdAsBlock("search-not-found-container");
  }
}

function populateResults(results) {
  let searchResultsElement = document.getElementById("search-results");
  results.forEach((result) => {
    searchResultsElement.innerHTML += `<div class="card-container"><img class="search-card-img" src=${
      result.images.small
    } alt=${result.name}><h2 class="search-prices">Market Avg Price $${
      result.cardmarket.prices.averageSellPrice
        ? result.cardmarket.prices.averageSellPrice
        : "Uknown"
    }</h2></div>`;
  });
}

function hideElementById(id) {
  document.getElementById(id).style.display = "none";
}

function showElementByIdAsBlock(id) {
  document.getElementById(id).style.display = "block";
}
