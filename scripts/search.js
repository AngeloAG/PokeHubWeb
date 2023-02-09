//This script handles the search to the Pokemon TCG API

var results_list = [];

function search() {
  showElementByIdAsBlock("searching-container");

  let searchTerm = document.querySelector("#search-term").value;

  document.getElementById("search-results").innerHTML = "";

  getCardInfo(searchTerm);
}

async function getCardInfo(searchTerm) {
  let url = "https://api.pokemontcg.io/v2/cards";
  url += `?q=name:${searchTerm}*&pageSize=42`; //The search is passed as a param in the url
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
      results_list = jsonResponse.data;
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
    let cardPrice;
    try {
      cardPrice = result.cardmarket.prices.averageSellPrice;
    } catch {
      cardPrice = "Unkown";
    }
    searchResultsElement.innerHTML += `<div class="card-container"><img class="search-card-img" src=${result.images.small} alt=${result.id}><h2 class="search-prices">Market Avg Price $${cardPrice}</h2></div>`;
  });

  let cardImages = document.getElementsByClassName("search-card-img");

  for (element of cardImages) {
    element.addEventListener("click", (event) => {
      focusImage(event.target.alt);
    });
  }
}

function orderByPrice(order) {
  if (order == "Ascending") {
    results_list.sort((current, next) => {
      let currentPrice, nextPrice;
      try {
        currentPrice = current.cardmarket.prices.averageSellPrice;
      } catch {
        currentPrice = 0;
      }
      try {
        nextPrice = next.cardmarket.prices.averageSellPrice;
      } catch {
        nextPrice = 0;
      }
      if (currentPrice > nextPrice) {
        return -1;
      }
      if (currentPrice < nextPrice) {
        return 1;
      }
      return 0;
    });
  } else {
    results_list.sort((current, next) => {
      let currentPrice, nextPrice;
      try {
        currentPrice = current.cardmarket.prices.averageSellPrice;
      } catch {
        currentPrice = 0;
      }
      try {
        nextPrice = next.cardmarket.prices.averageSellPrice;
      } catch {
        nextPrice = 0;
      }

      if (currentPrice < nextPrice) {
        return -1;
      }
      if (currentPrice > nextPrice) {
        return 1;
      }
      return 0;
    });
  }
  document.getElementById("search-results").innerHTML = "";
  populateResults(results_list);
}

function filterByCardType(type) {
  let filtered_list = [];
  filtered_list = results_list.filter((card) => {
    try {
      if (card.subtypes.includes(type)) {
        return true;
      }
    } catch {
      return false;
    }
  });
  document.getElementById("search-results").innerHTML = "";
  populateResults(filtered_list);
}

function hideElementById(id) {
  document.getElementById(id).style.display = "none";
}

function showElementByIdAsBlock(id) {
  document.getElementById(id).style.display = "block";
}

function focusImage(cardId) {
  let card = results_list.filter((card) => card.id == cardId)[0];
  console.log("Card: ", card);
  let attacksHTML = `<p class="select-card-info select-card-text">Attacks</p>`;
  try {
    card.attacks.forEach((attack) => {
      attacksHTML += `
              <p class="select-card-info select-card-text">${attack.name}</p>
              <p class="select-card-info select-card-text">Cost: ${attack.convertedEnergyCost}</p>
              <p class="select-card-info select-card-text">Damage: ${attack.damage}</p>
              <p class="select-card-info select-card-text">${attack.text}</p>`;
    });
  } catch {
    attacksHTML = "";
  }

  let cardPrice;
  try {
    cardPrice = card.cardmarket.prices.averageSellPrice;
  } catch {
    cardPrice = "Unkown";
  }

  document.getElementById(
    "search-results"
  ).innerHTML = `<div id="select-result-container">
          <div id="select-card-img-container">
            <img id="select-card-img" src="${card.images.small}" alt="${card.id}">
          </div>
          <div id="select-card-info-container">
            <h2 class="select-card-info">Card Name: ${card.name}</h3>
              <p class="select-card-info select-card-text">Supertype: ${card.supertype}</p>
              <p class="select-card-info select-card-text">Subtypes: ${card.subtypes}</p>
              ${attacksHTML}
              <p class="select-card-info select-card-text">Average price: $${cardPrice}</p>
          </div>
        </div>`;
}

document.querySelector("#orderby-price").addEventListener("change", (event) => {
  orderByPrice(event.target.value);
});

document
  .querySelector("#filterby-cardtype")
  .addEventListener("change", (event) => {
    filterByCardType(event.target.value);
  });
