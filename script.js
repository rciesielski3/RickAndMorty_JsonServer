const characterContainer = document.querySelector(".character-container");
const noResult = document.querySelector(".no-results-message");
const filterRadios = document.querySelectorAll('input[name="status"]');
const count = document.getElementById("countCharacter");
const characterForm = document.getElementById("characterForm");
const searchInput = document.getElementById("search-input");
const prevButton = document.getElementById("btnPrev");
const nextButton = document.getElementById("btnNext");

let modal = document.getElementById("modalBox");
let modalText = document.getElementById("modalText");
let currentPage = 0;
const pageSize = 5;

const updateCharacters = () => {
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const charactersToShow = dataResults.slice(startIndex, endIndex);

  characterContainer.innerHTML = "";

  if (charactersToShow.length === 0) {
    characterContainer.innerHTML = "";
    noResult.style.display = "block";
  } else {
    noResult.style.display = "none";
    charactersToShow.forEach((character) => {
      const characterTile = document.createElement("div");
      characterTile.classList.add("character-tile");

      const characterDetails = document.createElement("div");
      characterDetails.classList.add("character-details");
      characterDetails.innerHTML = `
      <img src="${character.image}" class="character-photo" alt="${character.name}">
        <h2>${character.name}</h2>
        <p>Species: ${character.species}</p>
        <p>Status: ${character.status}</p>
      `;

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        deleteCharacter(character.id, character.name);
      });

      characterTile.appendChild(characterDetails);
      characterTile.appendChild(deleteButton);

      characterContainer.appendChild(characterTile);
    });
  }

  const totalCharacters = dataResults.length;
  const totalPages = Math.ceil(totalCharacters / pageSize);

  if (currentPage === 0) {
    prevButton.disabled = true;
  } else {
    prevButton.disabled = false;
  }

  if (currentPage >= totalPages - 1) {
    nextButton.disabled = true;
  } else {
    nextButton.disabled = false;
  }
};

filterRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    currentPage = 0;
    currentStatus = radio.value;
    fetchDataAndDisplayCharacters();
  });
});

searchInput.addEventListener("input", () => {
  currentPage = 0;
  fetchDataAndDisplayCharacters();
});

nextButton.addEventListener("click", () => {
  currentPage++;
  fetchDataAndDisplayCharacters();
});

prevButton.addEventListener("click", () => {
  currentPage--;
  fetchDataAndDisplayCharacters();
});

function showModal(text) {
  modalText.innerHTML = text;
  modal.style.display = "block";
}

async function deleteCharacter(characterId, characterName) {
  try {
    showModal(`Deleted character ${characterName}...`);
    setTimeout(function () {
      const response = fetch(
        "http://localhost:3000/characters/" + characterId,
        {
          method: "DELETE",
        }
      );
      modal.style.display = "none";
    }, 1000);
  } catch (error) {
    console.log(`Error fetching data from API: ${error}`);
  }
}

characterForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const formData = new FormData(this);
  const characterData = {};
  formData.forEach((value, key) => {
    characterData[key] = value;
  });

  characterData.image =
    "https://rickandmortyapi.com/api/character/avatar/3.jpeg";

  try {
    const response = await fetch("http://localhost:3000/characters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(characterData),
    });
    fetchDataAndDisplayCharacters();
  } catch (error) {
    alert("Error adding new character. Please try again.");
  }
});

async function fetchDataAndDisplayCharacters() {
  try {
    let apiUrl = "http://localhost:3000/characters";
    const params = new URLSearchParams();

    const search = searchInput.value.toLowerCase();
    const status = document.querySelector('input[name="status"]:checked').value;

    if (status) params.set("status", status);
    if (search) params.set("name_like", search);

    apiUrl += "?" + params.toString();

    const response = await fetch(apiUrl);
    dataResults = await response.json();

    updateCharacters();
  } catch (error) {
    console.log(`Error fetching data from API: ${error}`);
  }
}

fetchDataAndDisplayCharacters();
