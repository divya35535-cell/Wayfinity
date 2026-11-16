
document.addEventListener("DOMContentLoaded", function () {

    console.log("TravelVista connected!");

    window.showPlanner = function () {
        const planner = document.getElementById("planner");

        if (planner) {
            planner.scrollIntoView({
                behavior: "smooth"
            });
        }
    };

    const createButton = document.querySelector(
        ".planner-section button"
    );

    if (createButton) {
        createButton.addEventListener("click", function () {
            alert("Welcome to TravelVista! Trip Planner coming next.");
        });
    }

});

// FEATURE 1: DESTINATION EXPLORER

const searchBox = document.getElementById("destinationSearch");
const categoryBox = document.getElementById("categoryFilter");

function filterDestinations() {

    const search = searchBox.value.toLowerCase();
    const category = categoryBox.value;

    const destinations = document.querySelectorAll(".destination");

    destinations.forEach(function (place) {

        const name = place.dataset.name.toLowerCase();
        const type = place.dataset.category;

        const matchesSearch = name.includes(search);
        const matchesCategory =
            category === "all" || category === type;

        place.style.display =
            matchesSearch && matchesCategory ? "block" : "none";

    });
}

if (searchBox && categoryBox) {
    searchBox.addEventListener("input", filterDestinations);
    categoryBox.addEventListener("change", filterDestinations);
}

// DESTINATION DETAILS

const destinationInfo = {
    Goa: "Explore beautiful beaches, water sports, seafood and sunset views.",
    Jaipur: "Discover historic forts, royal palaces and colourful markets.",
    Bangkok: "Experience street food, shopping and exciting city attractions.",
    Manali: "Enjoy mountain landscapes, trekking and beautiful valleys.",
    Paris: "Discover famous architecture, museums and romantic streets.",
    Bali: "Explore tropical beaches, temples and beautiful rice terraces."
};

function showDestination(name) {

    const details = document.getElementById("destinationDetails");

    details.style.display = "block";

    details.innerHTML = `
        <h2>${name}</h2>
        <p>${destinationInfo[name]}</p>
        <br>
        <button onclick="document.getElementById('destinationDetails').style.display='none'">
            Close
        </button>
    `;

    details.scrollIntoView({ behavior: "smooth" });
}

// FAVOURITES

function addFavourite(name) {

    let favourites = JSON.parse(
        localStorage.getItem("travelFavourites") || "[]"
    );

    if (favourites.includes(name)) {
        alert(name + " is already in your favourites!");
        return;
    }

    favourites.push(name);

    localStorage.setItem(
        "travelFavourites",
        JSON.stringify(favourites)
    );

    alert(name + " added to your favourites!");
}

// FEATURE 2: TRIP GENERATOR

function generateTrip() {

    const destination = document
        .getElementById("tripDestination")
        .value.trim();

    const days = Number(
        document.getElementById("tripDays").value
    );

    const budget = Number(
        document.getElementById("tripBudget").value
    );

    const pace = document.getElementById("tripPace").value;

    const interests = Array.from(
        document.querySelectorAll(
            ".interest-options input:checked"
        )
    ).map(item => item.value);

    const results = document.getElementById("tripResults");

    if (!destination) {
        alert("Please enter your destination!");
        return;
    }

    if (!Number.isInteger(days) || days < 1 || days > 14) {
        alert("Please enter between 1 and 14 days.");
        return;
    }

    if (!Number.isFinite(budget) || budget < 500) {
        alert("Please enter a valid budget of at least ₹500.");
        return;
    }

    const activities = {
        Adventure: [
            "Try a local adventure activity",
            "Explore an exciting outdoor attraction"
        ],
        Nature: [
            "Visit a beautiful nature spot",
            "Enjoy a scenic viewpoint"
        ],
        Food: [
            "Explore local food streets",
            "Try traditional regional cuisine"
        ],
        Culture: [
            "Visit a historical landmark",
            "Explore a cultural attraction"
        ],
        Shopping: [
            "Explore local markets",
            "Visit popular shopping streets"
        ],
        Relaxation: [
            "Enjoy a relaxing afternoon",
            "Discover a peaceful local spot"
        ]
    };

    const selectedActivities = interests.length
        ? interests
        : ["Nature", "Culture"];
        window.latestTravelPlan = {
    destination: destination,
    days: days,
    budget: budget,
    pace: pace,
    interests: selectedActivities
};

    const paceCount = {
        Relaxed: 2,
        Balanced: 3,
        Packed: 4
    }[pace];

    const destinationIdeas = {
        goa: ["Explore a local beach", "Discover a coastal viewpoint", "Visit a popular market"],
        jaipur: ["Explore a historic fort", "Visit a royal palace", "Discover local bazaars"],
        paris: ["Visit a famous landmark", "Explore an art museum", "Discover a beautiful neighbourhood"],
        bali: ["Explore a tropical beach", "Visit a local temple", "Discover rice terraces"],
        manali: ["Explore mountain scenery", "Visit a valley viewpoint", "Discover a local market"]
    };

    const ideas = destinationIdeas[destination.toLowerCase()] ||
        ["Explore a popular local attraction", "Discover the city centre", "Visit a local landmark"];

    const costPerDay = Math.round(budget / days);

    let itinerary = "";

    for (let day = 1; day <= days; day++) {

        let activitiesForDay = [];

        for (let j = 0; j < paceCount; j++) {

            const category = selectedActivities[
                (day + j - 1) % selectedActivities.length
            ];

            const options = activities[category];

            activitiesForDay.push(
                options[(day + j) % options.length]
            );
        }

        activitiesForDay.unshift(ideas[(day - 1) % ideas.length]);

        itinerary += `
            <div class="itinerary-day">
                <h3>Day ${day} – ${destination}</h3>
                <p>🌅 Morning: ${activitiesForDay[0]}</p>
                <p>☀️ Afternoon: ${activitiesForDay[1]}</p>
                <p>🌆 Evening: ${activitiesForDay[2] || activitiesForDay[0]}</p>
                ${pace === "Packed" ? `<p>🌙 Extra: ${activitiesForDay[3] || activitiesForDay[1]}</p>` : ""}
                <p>Estimated daily budget: ₹${costPerDay.toLocaleString("en-IN")}</p>
            </div>
        `;
    }

    results.innerHTML = `
        <div class="trip-summary">
            <p class="eyebrow">YOUR PERSONALIZED TRIP PLAN</p>
            <h2>${destination} Adventure</h2>
            <p>Duration: ${days} days</p>
            <p>Total budget: ₹${budget.toLocaleString("en-IN")}</p>
            <p>Travel pace: ${pace}</p>
            <p>Interests: ${selectedActivities.join(", ")}</p>
        </div>
        ${itinerary}
        <button type="button" onclick="saveCurrentTrip()">
            ❤️ Save This Trip
        </button>
    `;

    results.scrollIntoView({ behavior: "smooth" });

}
// FEATURE 3: SMART BUDGET CALCULATOR

let travelExpenses = [];

function formatRupees(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

function addExpense() {
    const nameInput = document.getElementById("expenseName");
    const amountInput = document.getElementById("expenseAmount");

    const name = nameInput.value.trim();
    const amount = Number(amountInput.value);
    const budget = Number(document.getElementById("totalBudget").value);

    if (!Number.isFinite(budget) || budget <= 0) {
        alert("Please enter your total budget first!");
        return;
    }

    if (!name || !Number.isFinite(amount) || amount <= 0) {
        alert("Enter a valid expense name and amount!");
        return;
    }

    travelExpenses.push({
        id: Date.now() + Math.random(),
        name: name,
        amount: amount
    });

    nameInput.value = "";
    amountInput.value = "";

    updateBudget();
    localStorage.setItem("travelVistaExpenses", JSON.stringify(travelExpenses));
    localStorage.setItem("travelVistaExpenses", JSON.stringify(travelExpenses));
}

function removeExpense(id) {
    travelExpenses = travelExpenses.filter(expense => expense.id !== id);
    updateBudget();
}

function updateBudget() {
    const budget = Number(document.getElementById("totalBudget").value) || 0;
    const totalSpent = travelExpenses.reduce(
        (total, expense) => total + expense.amount, 0
    );

    const remaining = budget - totalSpent;

    document.getElementById("budgetDisplay").textContent =
        formatRupees(budget);

    document.getElementById("spentDisplay").textContent =
        formatRupees(totalSpent);

    document.getElementById("remainingDisplay").textContent =
        formatRupees(remaining);

    const percentage = budget > 0
        ? Math.min((totalSpent / budget) * 100, 100)
        : 0;

    document.getElementById("budgetProgressBar").style.width =
        percentage + "%";

    const message = document.getElementById("budgetMessage");

    if (budget <= 0) {
        message.textContent = "Enter your total budget to begin.";
    } else if (remaining < 0) {
        message.textContent =
            "⚠️ You exceeded your budget by " + formatRupees(Math.abs(remaining));
    } else if (remaining === 0) {
        message.textContent = "Your entire travel budget has been used.";
    } else {
        message.textContent =
            "✓ You are within budget! You have " + formatRupees(remaining) + " remaining.";
    }

    const list = document.getElementById("expenseList");

    list.innerHTML = travelExpenses.map(expense => `
        <div class="expense-item">
            <span>${escapeBudgetText(expense.name)}</span>
            <strong>${formatRupees(expense.amount)}</strong>
            <button type="button" onclick="removeExpense(${expense.id})">
                Remove
            </button>
        </div>
    `).join("");
}

function escapeBudgetText(value) {
    return value.replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

document.addEventListener("DOMContentLoaded", function () {
    const budgetInput = document.getElementById("totalBudget");

    if (budgetInput) {
        budgetInput.addEventListener("input", updateBudget);
    }
});
// FEATURE 4: LIVE WEATHER FORECAST

function getWeatherDescription(code) {
    const conditions = {
        0: ["Clear Sky", "☀️"],
        1: ["Mainly Clear", "🌤️"],
        2: ["Partly Cloudy", "⛅"],
        3: ["Overcast", "☁️"],
        45: ["Foggy", "🌫️"],
        48: ["Rime Fog", "🌫️"],
        51: ["Light Drizzle", "🌦️"],
        53: ["Drizzle", "🌦️"],
        55: ["Heavy Drizzle", "🌧️"],
        61: ["Light Rain", "🌦️"],
        63: ["Moderate Rain", "🌧️"],
        65: ["Heavy Rain", "🌧️"],
        71: ["Light Snow", "🌨️"],
        73: ["Snow", "❄️"],
        75: ["Heavy Snow", "❄️"],
        80: ["Rain Showers", "🌧️"],
        81: ["Heavy Showers", "🌧️"],
        82: ["Violent Showers", "⛈️"],
        95: ["Thunderstorm", "⛈️"],
        96: ["Thunderstorm with Hail", "⛈️"],
        99: ["Severe Thunderstorm", "⛈️"]
    };

    return conditions[code] || ["Weather Unavailable", "🌍"];
}

async function getWeather() {
    const cityInput = document.getElementById("weatherCity");
    const status = document.getElementById("weatherStatus");
    const currentBox = document.getElementById("weatherCurrent");
    const forecastBox = document.getElementById("weatherForecast");

    const city = cityInput.value.trim();

    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    status.textContent = "Loading live weather...";
    currentBox.innerHTML = "";
    forecastBox.innerHTML = "";

    try {
        // Find city coordinates
        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Could not search for this city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please check the spelling.");
        }

        const place = geoData.results[0];

        // Get weather forecast
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=5`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Weather information is temporarily unavailable.");
        }

        const data = await weatherResponse.json();
        const current = data.current;
        const daily = data.daily;

        const condition = getWeatherDescription(current.weather_code);

        status.textContent =
            `Weather for ${place.name}, ${place.country}`;

        currentBox.innerHTML = `
            <div class="weather-current">
                <div class="weather-main">
                    <div>
                        <h2>${place.name}, ${place.country}</h2>
                        <p>${condition[0]}</p>
                        <div class="weather-temperature">
                            ${Math.round(current.temperature_2m)}°C
                        </div>
                        <p>Feels like ${Math.round(current.apparent_temperature)}°C</p>
                    </div>
                    <div class="weather-icon">${condition[1]}</div>
                </div>

                <div class="weather-details">
                    <div class="weather-detail">
                        <span>Humidity</span>
                        <h3>${current.relative_humidity_2m}%</h3>
                    </div>

                    <div class="weather-detail">
                        <span>Wind Speed</span>
                        <h3>${current.wind_speed_10m} km/h</h3>
                    </div>

                    <div class="weather-detail">
                        <span>Precipitation</span>
                        <h3>${current.precipitation} mm</h3>
                    </div>
                </div>
            </div>
        `;

        // Display five-day forecast
        forecastBox.innerHTML = "<h2>5-Day Forecast</h2>";

        for (let i = 0; i < daily.time.length; i++) {
            const forecastCondition =
                getWeatherDescription(daily.weather_code[i]);

            const date = new Date(daily.time[i] + "T00:00:00");

            const dayName = date.toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short"
            });

            forecastBox.innerHTML += `
                <div class="forecast-card">
                    <p>${dayName}</p>
                    <div class="weather-icon">${forecastCondition[1]}</div>
                    <h3>${forecastCondition[0]}</h3>
                    <p>
                        ${Math.round(daily.temperature_2m_max[i])}° /
                        ${Math.round(daily.temperature_2m_min[i])}°
                    </p>
                    <p>Rain: ${daily.precipitation_probability_max[i] ?? "—"}%</p>
                </div>
            `;
        }

    } catch (error) {
        status.textContent = error.message;
    }
}
// FEATURE 5: INTERACTIVE TRAVEL MAP

let travelMap = null;
let mapMarkers = {};

const mapDestinations = {
    Goa: {
        lat: 15.2993,
        lng: 74.1240,
        country: "India",
        description: "Beautiful beaches and coastal adventures."
    },
    Jaipur: {
        lat: 26.9124,
        lng: 75.7873,
        country: "India",
        description: "Historic forts, palaces and colourful markets."
    },
    Manali: {
        lat: 32.2432,
        lng: 77.1892,
        country: "India",
        description: "Mountain landscapes and scenic valleys."
    },
    Paris: {
        lat: 48.8566,
        lng: 2.3522,
        country: "France",
        description: "Art, architecture and famous landmarks."
    },
    Bali: {
        lat: -8.3405,
        lng: 115.0920,
        country: "Indonesia",
        description: "Tropical beaches, temples and rice terraces."
    },
    Tokyo: {
        lat: 35.6762,
        lng: 139.6503,
        country: "Japan",
        description: "Modern city life and Japanese culture."
    }
};

function initializeTravelMap() {
    const mapElement = document.getElementById("travelMapView");

    if (!mapElement || typeof L === "undefined") {
        return;
    }

    if (travelMap) {
        travelMap.invalidateSize();
        return;
    }

    travelMap = L.map("travelMapView").setView([20, 10], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(travelMap);

    Object.keys(mapDestinations).forEach(function (name) {
        const place = mapDestinations[name];

        const marker = L.marker([place.lat, place.lng]).addTo(travelMap);

        marker.bindPopup(`
            <strong>${name}, ${place.country}</strong>
            <p>${place.description}</p>
        `);

        mapMarkers[name] = marker;
    });

    setTimeout(function () {
        travelMap.invalidateSize();
    }, 300);
}

function focusDestination(name) {
    const place = mapDestinations[name];

    if (!place || !travelMap) return;

    travelMap.setView([place.lat, place.lng], 10);
    mapMarkers[name].openPopup();

    document.getElementById("mapStatus").textContent =
        `Showing ${name}, ${place.country}`;
}

async function searchMapCity() {
    const input = document.getElementById("mapCitySearch");
    const status = document.getElementById("mapStatus");
    const city = input.value.trim();

    if (!city) {
        status.textContent = "Please enter a city name.";
        return;
    }

    status.textContent = "Searching for location...";

    try {
        const url =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Location search failed.");
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error("City not found. Check the spelling.");
        }

        const place = data.results[0];

        travelMap.setView([place.latitude, place.longitude], 10);

        L.marker([place.latitude, place.longitude])
            .addTo(travelMap)
            .bindPopup(`<strong>${place.name}, ${place.country || ""}</strong>`)
            .openPopup();

        status.textContent =
            `Location found: ${place.name}, ${place.country || ""}`;

    } catch (error) {
        status.textContent = error.message;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const mapSection = document.getElementById("travelMap");

    if (!mapSection) return;

    if ("IntersectionObserver" in window) {
        const mapObserver = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                initializeTravelMap();
                mapObserver.disconnect();
            }
        });

        mapObserver.observe(mapSection);
    } else {
        initializeTravelMap();
    }
});
// FEATURE 6: SAVED TRIPS

function getSavedTrips() {
    try {
        return JSON.parse(localStorage.getItem("travelVistaSavedTrips")) || [];
    } catch (error) {
        return [];
    }
}

function saveCurrentTrip() {
    const plan = window.latestTravelPlan;

    if (!plan) {
        alert("Generate a trip before saving!");
        return;
    }

    const savedTrips = getSavedTrips();

    const newTrip = {
        id: Date.now(),
        destination: plan.destination,
        days: plan.days,
        budget: plan.budget,
        pace: plan.pace,
        interests: plan.interests
    };

    savedTrips.push(newTrip);

    localStorage.setItem(
        "travelVistaSavedTrips",
        JSON.stringify(savedTrips)
    );

    alert("❤️ Your trip has been saved!");

    displaySavedTrips();
}

function displaySavedTrips() {
    const container = document.getElementById("savedTripsList");

    if (!container) return;

    const savedTrips = getSavedTrips();

    container.innerHTML = "";

    if (savedTrips.length === 0) {
        container.innerHTML =
            '<p id="emptyTripsMessage">You haven\'t saved any trips yet.</p>';
        return;
    }

    savedTrips.forEach(function (trip) {
        const card = document.createElement("div");
        card.className = "saved-trip-card";

        const heading = document.createElement("h3");
        heading.textContent = "✈️ " + trip.destination;

        const duration = document.createElement("p");
        duration.textContent = "Duration: " + trip.days + " days";

        const budget = document.createElement("p");
        budget.textContent =
            "Budget: ₹" + Number(trip.budget).toLocaleString("en-IN");

        const pace = document.createElement("p");
        pace.textContent = "Travel pace: " + trip.pace;

        const interests = document.createElement("p");
        interests.textContent =
            "Interests: " + trip.interests.join(", ");

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.type = "button";
        removeButton.addEventListener("click", function () {
            deleteSavedTrip(trip.id);
        });

        card.append(
            heading,
            duration,
            budget,
            pace,
            interests,
            removeButton
        );

        container.appendChild(card);
    });
}

function deleteSavedTrip(id) {
    const updatedTrips = getSavedTrips().filter(function (trip) {
        return trip.id !== id;
    });

    localStorage.setItem(
        "travelVistaSavedTrips",
        JSON.stringify(updatedTrips)
    );

    displaySavedTrips();
}

document.addEventListener("DOMContentLoaded", displaySavedTrips);
// FEATURE 7: SMART PACKING ASSISTANT

let packingItems = [];

function generatePackingList() {
    const destination = document.getElementById("packingDestination").value.trim();
    const days = Number(document.getElementById("packingDays").value);
    const type = document.getElementById("packingType").value;

    if (!destination) {
        alert("Please enter your destination!");
        return;
    }

    if (!Number.isInteger(days) || days < 1 || days > 60) {
        alert("Enter a trip duration between 1 and 60 days.");
        return;
    }

    const categories = {
        "Clothing": [
            { name: "T-shirts", quantity: Math.min(days, 10) },
            { name: "Trousers / jeans", quantity: Math.min(Math.ceil(days / 2), 5) },
            { name: "Underwear", quantity: days },
            { name: "Socks", quantity: days },
            { name: "Comfortable shoes", quantity: 1 },
            { name: "Sleepwear", quantity: 1 }
        ],
        "Travel Essentials": [
            { name: "Identity proof", quantity: 1 },
            { name: "Wallet and cash", quantity: 1 },
            { name: "Phone and charger", quantity: 1 },
            { name: "Travel tickets / booking details", quantity: 1 },
            { name: "Reusable water bottle", quantity: 1 }
        ],
        "Personal Care": [
            { name: "Toothbrush and toothpaste", quantity: 1 },
            { name: "Shampoo and soap", quantity: 1 },
            { name: "Sunscreen", quantity: 1 },
            { name: "Personal medicines", quantity: 1 },
            { name: "Hand sanitizer", quantity: 1 }
        ]
    };

    if (type === "beach") {
        categories["Beach Essentials"] = [
            { name: "Swimwear", quantity: 2 },
            { name: "Sunglasses", quantity: 1 },
            { name: "Beach towel", quantity: 1 },
            { name: "Flip-flops", quantity: 1 },
            { name: "Waterproof phone pouch", quantity: 1 }
        ];
    }

    if (type === "adventure") {
        categories["Adventure Gear"] = [
            { name: "Hiking shoes", quantity: 1 },
            { name: "Backpack", quantity: 1 },
            { name: "Flashlight", quantity: 1 },
            { name: "First-aid kit", quantity: 1 },
            { name: "Rain jacket", quantity: 1 }
        ];
    }

    if (type === "business") {
        categories["Business Essentials"] = [
            { name: "Formal outfits", quantity: Math.min(days, 5) },
            { name: "Laptop and charger", quantity: 1 },
            { name: "Notebook and pens", quantity: 1 },
            { name: "Business documents", quantity: 1 },
            { name: "Formal shoes", quantity: 1 }
        ];
    }

    if (type === "winter") {
        categories["Winter Essentials"] = [
            { name: "Winter jackets", quantity: 1 },
            { name: "Warm sweaters", quantity: 2 },
            { name: "Gloves", quantity: 1 },
            { name: "Woollen cap", quantity: 1 },
            { name: "Thermal wear", quantity: 2 },
            { name: "Warm socks", quantity: days }
        ];
    }

    packingItems = [];

    Object.entries(categories).forEach(([category, items]) => {
        items.forEach(item => {
            packingItems.push({
                id: packingItems.length,
                category: category,
                name: item.name,
                quantity: item.quantity,
                packed: false
            });
        });
    });

    displayPackingList(destination, days);
}

function displayPackingList(destination, days) {
    const results = document.getElementById("packingResults");

    results.innerHTML = `
        <div class="packing-category">
            <p class="eyebrow">YOUR PERSONAL CHECKLIST</p>
            <h2>${escapePackingText(destination)} Packing List</h2>
            <p>${days}-day trip</p>

            <h3 class="packing-summary" id="packingCount">
                0 / ${packingItems.length} items packed
            </h3>

            <div class="packing-progress">
                <div id="packingProgressBar"></div>
            </div>
        </div>

        <div id="packingChecklist"></div>
    `;

    const checklist = document.getElementById("packingChecklist");
    const grouped = {};

    packingItems.forEach(item => {
        if (!grouped[item.category]) {
            grouped[item.category] = [];
        }
        grouped[item.category].push(item);
    });

    Object.entries(grouped).forEach(([category, items]) => {
        const categoryBox = document.createElement("div");
        categoryBox.className = "packing-category";

        const heading = document.createElement("h3");
        heading.textContent = category;
        categoryBox.appendChild(heading);

        items.forEach(item => {
            const label = document.createElement("label");
            label.className = "packing-check";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.addEventListener("change", function () {
                item.packed = checkbox.checked;
                updatePackingProgress();
            });

            const text = document.createElement("span");
            text.textContent = `${item.name} × ${item.quantity}`;

            label.append(checkbox, text);
            categoryBox.appendChild(label);
        });

        checklist.appendChild(categoryBox);
    });

    updatePackingProgress();

    results.scrollIntoView({ behavior: "smooth" });
}

function updatePackingProgress() {
    const packed = packingItems.filter(item => item.packed).length;
    const total = packingItems.length;

    const percentage = total ? (packed / total) * 100 : 0;

    document.getElementById("packingCount").textContent =
        `${packed} / ${total} items packed`;

    document.getElementById("packingProgressBar").style.width =
        percentage + "%";
}

function escapePackingText(value) {
    return value.replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}
// FEATURE 8: TRAVEL SAFETY ASSISTANT

const safetyGuides = {
    general: [
        "Keep your passport or identity documents secure.",
        "Save copies of important travel documents.",
        "Research local laws and customs before travelling.",
        "Keep your accommodation address available.",
        "Share your itinerary with someone you trust."
    ],
    transport: [
        "Use licensed and reputable transport services.",
        "Check the route and fare before starting a journey.",
        "Avoid sharing your live location publicly.",
        "Keep your belongings secure in crowded places."
    ],
    health: [
        "Carry necessary personal medicines.",
        "Check whether travel insurance covers your activities.",
        "Know how to contact nearby medical services.",
        "Carry drinking water and basic first-aid supplies."
    ],
    digital: [
        "Use secure networks for sensitive transactions.",
        "Avoid sharing booking details publicly.",
        "Keep your phone charged during travel.",
        "Enable a screen lock on your devices."
    ]
};

function generateSafetyTips() {
    const destination = document.getElementById("safetyDestination").value.trim();
    const results = document.getElementById("safetyResults");

    if (!destination) {
        alert("Please enter your destination!");
        return;
    }

    let output = `
        <div class="safety-category">
            <p class="eyebrow">PERSONAL SAFETY GUIDE</p>
            <h2>${escapeSafetyText(destination)}</h2>
            <p>Review these precautions before and during your trip.</p>
        </div>
    `;

    Object.entries(safetyGuides).forEach(([category, tasks]) => {
        const heading = {
            general: "🧳 General Safety",
            transport: "🚕 Transport Safety",
            health: "🏥 Health & Wellbeing",
            digital: "📱 Digital Safety"
        }[category];

        output += `
            <div class="safety-category">
                <h3>${heading}</h3>
                ${tasks.map((task, index) => `
                    <label class="safety-task">
                        <input type="checkbox">
                        <span>${task}</span>
                    </label>
                `).join("")}
            </div>
        `;
    });

    output += `
        <div class="safety-category">
            <h3>🚨 Before You Travel</h3>
            <p>
                Check the official emergency number, local travel advisories,
                and nearby hospitals for your destination.
                This general checklist is not a live safety alert.
            </p>
        </div>
    `;

    results.innerHTML = output;
    results.scrollIntoView({ behavior: "smooth" });
}

function escapeSafetyText(value) {
    return value.replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function getSafetyContacts() {
    try {
        return JSON.parse(localStorage.getItem("travelVistaSafetyContacts")) || [];
    } catch (error) {
        return [];
    }
}

function saveSafetyContact() {
    const nameInput = document.getElementById("contactName");
    const numberInput = document.getElementById("contactNumber");

    const name = nameInput.value.trim();
    const number = numberInput.value.trim();

    if (!name || !number) {
        alert("Enter both contact name and phone number.");
        return;
    }

    const contacts = getSafetyContacts();

    contacts.push({
        id: Date.now(),
        name: name,
        number: number
    });

    localStorage.setItem(
        "travelVistaSafetyContacts",
        JSON.stringify(contacts)
    );

    nameInput.value = "";
    numberInput.value = "";

    displaySafetyContacts();
}

function displaySafetyContacts() {
    const container = document.getElementById("safetyContactList");
    if (!container) return;

    const contacts = getSafetyContacts();
    container.innerHTML = "";

    if (contacts.length === 0) {
        container.textContent = "No emergency contacts saved yet.";
        return;
    }

    contacts.forEach(contact => {
        const item = document.createElement("div");
        item.className = "safety-contact-item";

        const details = document.createElement("div");
        const name = document.createElement("strong");
        name.textContent = contact.name;

        const number = document.createElement("p");
        number.textContent = contact.number;

        details.append(name, number);

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Remove";

        remove.addEventListener("click", function () {
            const updated = getSafetyContacts().filter(
                entry => entry.id !== contact.id
            );

            localStorage.setItem(
                "travelVistaSafetyContacts",
                JSON.stringify(updated)
            );

            displaySafetyContacts();
        });

        item.append(details, remove);
        container.appendChild(item);
    });
}

document.addEventListener("DOMContentLoaded", displaySafetyContacts);
// FEATURE 9: DESTINATION COMPARISON

const comparisonData = {
    Goa: {
        budget: "₹8,000–₹15,000",
        style: "Beach and relaxation",
        duration: "3–5 days",
        attractions: "Beaches, forts and water sports",
        bestFor: "Beach lovers"
    },

    Jaipur: {
        budget: "₹6,000–₹12,000",
        style: "Culture and heritage",
        duration: "2–4 days",
        attractions: "Amber Fort, Hawa Mahal and markets",
        bestFor: "History enthusiasts"
    },

    Manali: {
        budget: "₹8,000–₹16,000",
        style: "Mountains and adventure",
        duration: "4–6 days",
        attractions: "Solang Valley, mountains and trekking",
        bestFor: "Nature lovers"
    },

    Paris: {
        budget: "₹70,000–₹1,20,000",
        style: "Art and city exploration",
        duration: "4–6 days",
        attractions: "Eiffel Tower, museums and cafés",
        bestFor: "Culture enthusiasts"
    },

    Bali: {
        budget: "₹35,000–₹65,000",
        style: "Tropical and relaxation",
        duration: "5–7 days",
        attractions: "Beaches, temples and rice terraces",
        bestFor: "Relaxation seekers"
    },

    Tokyo: {
        budget: "₹55,000–₹90,000",
        style: "Modern city and culture",
        duration: "5–7 days",
        attractions: "Shibuya, temples and shopping",
        bestFor: "City explorers"
    }
};

function compareDestinations() {
    const first = document.getElementById("compareFirst").value;
    const second = document.getElementById("compareSecond").value;

    const results = document.getElementById("comparisonResults");

    if (first === second) {
        alert("Please select two different destinations!");
        return;
    }

    const destinations = [
        { name: first, ...comparisonData[first] },
        { name: second, ...comparisonData[second] }
    ];

    const fields = [
        ["Estimated budget", "budget"],
        ["Travel experience", "style"],
        ["Suggested duration", "duration"],
        ["Popular attractions", "attractions"],
        ["Best suited for", "bestFor"]
    ];

    results.innerHTML = `
        <div class="comparison-grid">
            ${destinations.map(place => `
                <div class="comparison-card">
                    <h3>${place.name}</h3>

                    ${fields.map(([label, key]) => `
                        <div class="comparison-row">
                            <span>${label}</span>
                            <strong>${place[key]}</strong>
                        </div>
                    `).join("")}
                </div>
            `).join("")}
        </div>

        <div class="comparison-verdict">
            <h3>Travel Decision Guide</h3>
            <p>
                Choose ${first} if you prefer ${comparisonData[first].style.toLowerCase()}.
            </p>
            <p>
                Choose ${second} if you prefer ${comparisonData[second].style.toLowerCase()}.
            </p>
            <p>
                Compare your personal interests, travel dates and budget
                before making your final decision.
            </p>
        </div>
    `;

    results.scrollIntoView({ behavior: "smooth" });
}

// FEATURE 10: GROUP TRIP PLANNER

let groupTrips = JSON.parse(
    localStorage.getItem("travelVistaGroups") || "[]"
);

function saveGroupTrips() {
    localStorage.setItem(
        "travelVistaGroups",
        JSON.stringify(groupTrips)
    );
}

function createGroupTrip() {
    const name = document.getElementById("groupTripName").value.trim();
    const destination = document.getElementById("groupDestination").value.trim();
    const budget = Number(document.getElementById("groupBudget").value);

    if (!name || !destination || !budget || budget <= 0) {
        alert("Please enter a trip name, destination and valid budget!");
        return;
    }

    const newTrip = {
        id: Date.now(),
        name: name,
        destination: destination,
        budget: budget,
        members: []
    };

    groupTrips.push(newTrip);

    saveGroupTrips();
    displayGroupTrips();

    document.getElementById("groupTripName").value = "";
    document.getElementById("groupDestination").value = "";
    document.getElementById("groupBudget").value = "";

    alert("Your group trip was created successfully!");
}

function addGroupMember() {
    const memberName = document.getElementById("groupMemberName").value.trim();
    const tripId = Number(document.getElementById("groupMemberCount").value);

    if (!memberName || !tripId) {
        alert("Enter a member name and select a group trip!");
        return;
    }

    const trip = groupTrips.find(item => item.id === tripId);

    if (!trip) {
        alert("Please select a valid group trip!");
        return;
    }

    const alreadyExists = trip.members.some(
        member => member.toLowerCase() === memberName.toLowerCase()
    );

    if (alreadyExists) {
        alert("This member is already in the group!");
        return;
    }

    trip.members.push(memberName);

    saveGroupTrips();
    displayGroupTrips();

    document.getElementById("groupMemberName").value = "";

    alert(memberName + " added to your travel group!");
}

function removeGroupMember(tripId, memberIndex) {
    const trip = groupTrips.find(item => item.id === tripId);

    if (!trip) return;

    trip.members.splice(memberIndex, 1);

    saveGroupTrips();
    displayGroupTrips();
}

function deleteGroupTrip(tripId) {
    if (!confirm("Are you sure you want to delete this group trip?")) {
        return;
    }

    groupTrips = groupTrips.filter(item => item.id !== tripId);

    saveGroupTrips();
    displayGroupTrips();
}

function displayGroupTrips() {
    const results = document.getElementById("groupTripResults");
    const selector = document.getElementById("groupMemberCount");

    if (!results || !selector) return;

    const previousSelection = selector.value;

    selector.innerHTML = '<option value="">Select a trip</option>';

    groupTrips.forEach(trip => {
        selector.innerHTML += `
            <option value="${trip.id}">
                ${escapeGroupText(trip.name)} - ${escapeGroupText(trip.destination)}
            </option>
        `;
    });

    if (groupTrips.some(trip => String(trip.id) === previousSelection)) {
        selector.value = previousSelection;
    }

    if (groupTrips.length === 0) {
        results.innerHTML = `
            <p class="group-empty">
                No group trips yet. Create your first group trip above!
            </p>
        `;
        return;
    }

    results.innerHTML = groupTrips.map(trip => {
        const memberCount = trip.members.length;
        const totalPeople = memberCount + 1;
        const share = trip.budget / totalPeople;

        return `
            <div class="group-trip-card">

                <h3>${escapeGroupText(trip.name)}</h3>
                <p>📍 ${escapeGroupText(trip.destination)}</p>

                <div class="group-trip-info">

                    <div class="group-trip-stat">
                        <span>Total Budget</span>
                        <strong>${formatRupees(trip.budget)}</strong>
                    </div>

                    <div class="group-trip-stat">
                        <span>Group Members</span>
                        <strong>${totalPeople} People</strong>
                    </div>

                    <div class="group-trip-stat">
                        <span>Estimated Share</span>
                        <strong>${formatRupees(share)}</strong>
                    </div>

                </div>

                <h4>Travel Members</h4>

                <div class="group-member-list">

                    <div class="group-member-item">
                        <span>👤 Trip Organizer</span>
                        <strong>Organizer</strong>
                    </div>

                    ${trip.members.map((member, index) => `
                        <div class="group-member-item">
                            <span>👤 ${escapeGroupText(member)}</span>

                            <button
                                type="button"
                                onclick="removeGroupMember(${trip.id}, ${index})">
                                Remove
                            </button>
                        </div>
                    `).join("")}

                </div>

                <p class="group-budget-share">
                    Each person's estimated share:
                    ${formatRupees(share)}
                </p>

                <button
                    type="button"
                    class="delete-group-btn"
                    onclick="deleteGroupTrip(${trip.id})">
                    Delete Group Trip
                </button>

            </div>
        `;
    }).join("");
}

function escapeGroupText(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

document.addEventListener("DOMContentLoaded", function () {
    displayGroupTrips();
});

// FEATURE 11: TRAVEL JOURNAL

let travelJournalEntries = JSON.parse(
    localStorage.getItem("travelVistaJournal") || "[]"
);

let editingJournalId = null;

function saveJournalData() {
    localStorage.setItem(
        "travelVistaJournal",
        JSON.stringify(travelJournalEntries)
    );
}

function saveJournalEntry() {
    const title = document.getElementById("journalTitle").value.trim();
    const destination = document.getElementById("journalDestination").value.trim();
    const date = document.getElementById("journalDate").value;
    const rating = Number(document.getElementById("journalRating").value);
    const memory = document.getElementById("journalMemory").value.trim();

    if (!title || !destination || !date || !memory) {
        alert("Please complete all travel journal fields!");
        return;
    }

    if (editingJournalId !== null) {
        const entry = travelJournalEntries.find(
            item => item.id === editingJournalId
        );

        if (entry) {
            entry.title = title;
            entry.destination = destination;
            entry.date = date;
            entry.rating = rating;
            entry.memory = memory;
        }

        editingJournalId = null;
    } else {
        travelJournalEntries.unshift({
            id: Date.now(),
            title,
            destination,
            date,
            rating,
            memory
        });
    }

    saveJournalData();
    displayJournalEntries();
    clearJournalForm();

    alert("Your travel memory has been saved!");
}

function displayJournalEntries() {
    const container = document.getElementById("journalEntries");
    const count = document.getElementById("journalCount");

    if (!container || !count) return;

    count.textContent =
        travelJournalEntries.length +
        (travelJournalEntries.length === 1 ? " Memory" : " Memories");

    if (travelJournalEntries.length === 0) {
        container.innerHTML =
            '<p class="journal-empty">Your travel stories will appear here. Start writing your first memory!</p>';
        return;
    }

    container.innerHTML = travelJournalEntries.map(entry => `
        <article class="journal-card">
            <h3>${escapeJournalText(entry.title)}</h3>

            <div class="journal-meta">
                📍 ${escapeJournalText(entry.destination)}
                <br>
                📅 ${escapeJournalText(entry.date)}
            </div>

            <div class="journal-rating">
                ${"⭐".repeat(entry.rating)}
            </div>

            <p>${escapeJournalText(entry.memory).replace(/\n/g, "<br>")}</p>

            <div class="journal-actions">
                <button class="journal-edit"
                    type="button"
                    onclick="editJournalEntry(${entry.id})">
                    Edit
                </button>

                <button class="journal-delete"
                    type="button"
                    onclick="deleteJournalEntry(${entry.id})">
                    Delete
                </button>
            </div>
        </article>
    `).join("");
}

function editJournalEntry(id) {
    const entry = travelJournalEntries.find(item => item.id === id);

    if (!entry) return;

    editingJournalId = id;

    document.getElementById("journalTitle").value = entry.title;
    document.getElementById("journalDestination").value = entry.destination;
    document.getElementById("journalDate").value = entry.date;
    document.getElementById("journalRating").value = entry.rating;
    document.getElementById("journalMemory").value = entry.memory;

    document.getElementById("journalSaveButton").textContent = "Update Memory";
    document.getElementById("journalCancelButton").style.display = "inline-block";

    document.getElementById("travelJournal").scrollIntoView({
        behavior: "smooth"
    });
}

function deleteJournalEntry(id) {
    if (!confirm("Are you sure you want to delete this memory?")) return;

    travelJournalEntries = travelJournalEntries.filter(
        item => item.id !== id
    );

    if (editingJournalId === id) {
        cancelJournalEdit();
    }

    saveJournalData();
    displayJournalEntries();
}

function clearJournalForm() {
    document.getElementById("journalTitle").value = "";
    document.getElementById("journalDestination").value = "";
    document.getElementById("journalDate").value = "";
    document.getElementById("journalRating").value = "5";
    document.getElementById("journalMemory").value = "";

    document.getElementById("journalSaveButton").textContent = "Save Travel Memory";
    document.getElementById("journalCancelButton").style.display = "none";
}

function cancelJournalEdit() {
    editingJournalId = null;
    clearJournalForm();
}

function escapeJournalText(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

document.addEventListener("DOMContentLoaded", function () {
    displayJournalEntries();
});

/* FEATURE 12: PDF ITINERARY EXPORT */

function downloadTravelPDF() {

    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("PDF library could not load. Check your internet connection and refresh!");
        return;
    }

    const plan = window.latestTravelPlan;

    if (!plan) {
        alert("Please generate a trip itinerary first!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    let y = 25;

    function addText(text, size = 11, color = [40, 40, 40]) {
        pdf.setFontSize(size);
        pdf.setTextColor(...color);

        const lines = pdf.splitTextToSize(
            String(text),
            pageWidth - 35
        );

        if (y + lines.length * 7 > pageHeight - 20) {
            pdf.addPage();
            y = 25;
        }

        pdf.text(lines, 18, y);
        y += lines.length * 7 + 4;
    }

    pdf.setFillColor(11, 20, 32);
    pdf.rect(0, 0, pageWidth, 48, "F");

    pdf.setTextColor(214, 183, 123);
    pdf.setFontSize(24);
    pdf.text("TRAVELVISTA", 18, 22);

    pdf.setFontSize(11);
    pdf.setTextColor(255, 255, 255);
    pdf.text("YOUR PERSONAL TRAVEL ITINERARY", 18, 33);

    y = 62;

    addText("TRIP DETAILS", 16, [150, 115, 55]);
    addText("Destination: " + plan.destination);
    addText("Duration: " + plan.days + " days");
    addText("Estimated Budget: Rs. " + Number(plan.budget).toLocaleString("en-IN"));
    addText("Travel Pace: " + plan.pace);
    addText("Interests: " + plan.interests.join(", "));

    y += 8;

    addText("DAILY TRAVEL PLAN", 16, [150, 115, 55]);

    const result = document.getElementById("tripResults");

    if (result) {
        const dayCards = result.querySelectorAll(".itinerary-day");

        if (dayCards.length > 0) {
            dayCards.forEach(card => {
                const heading = card.querySelector("h3");
                const paragraphs = card.querySelectorAll("p");

                addText(
                    heading ? heading.innerText : "Travel Day",
                    13,
                    [150, 115, 55]
                );

                paragraphs.forEach(paragraph => {
                    addText(paragraph.innerText);
                });

                y += 4;
            });
        } else {
            addText("Your generated daily itinerary is not available.");
        }
    }

    y += 8;

    addText(
        "TravelVista | Plan your journey, create memories.",
        10,
        [120, 120, 120]
    );

    const safeDestination = plan.destination
        .replace(/[^a-z0-9]/gi, "_");

    pdf.save("TravelVista_" + safeDestination + "_Itinerary.pdf");
}

// FEATURE 13: FLIGHT & HOTEL ORGANIZER

let travelBookings = JSON.parse(
    localStorage.getItem("travelVistaBookings") || "[]"
);

function saveTravelBookings() {
    localStorage.setItem(
        "travelVistaBookings",
        JSON.stringify(travelBookings)
    );
}

function addTravelBooking() {
    const type = document.getElementById("bookingType").value;
    const name = document.getElementById("bookingName").value.trim();
    const reference = document.getElementById("bookingReference").value.trim();
    const startDate = document.getElementById("bookingStartDate").value;
    const endDate = document.getElementById("bookingEndDate").value;
    const cost = Number(document.getElementById("bookingCost").value);
    const notes = document.getElementById("bookingNotes").value.trim();

    if (!name || !reference || !startDate || !endDate ||
        document.getElementById("bookingCost").value === "" ||
        !Number.isFinite(cost) || cost < 0) {
        alert("Please complete all required booking fields correctly!");
        return;
    }

    if (endDate < startDate) {
        alert("The arrival or check-out date cannot be before the start date!");
        return;
    }

    const booking = {
        id: Date.now(),
        type,
        name,
        reference,
        startDate,
        endDate,
        cost,
        notes
    };

    travelBookings.unshift(booking);

    saveTravelBookings();
    displayTravelBookings();

    document.getElementById("bookingName").value = "";
    document.getElementById("bookingReference").value = "";
    document.getElementById("bookingStartDate").value = "";
    document.getElementById("bookingEndDate").value = "";
    document.getElementById("bookingCost").value = "";
    document.getElementById("bookingNotes").value = "";

    alert(type + " booking saved successfully!");
}

function deleteTravelBooking(id) {
    if (!confirm("Are you sure you want to delete this booking?")) {
        return;
    }

    travelBookings = travelBookings.filter(
        booking => booking.id !== id
    );

    saveTravelBookings();
    displayTravelBookings();
}

function displayTravelBookings() {
    const list = document.getElementById("bookingList");
    const summary = document.getElementById("bookingSummary");

    if (!list || !summary) return;

    const flightCount = travelBookings.filter(
        booking => booking.type === "Flight"
    ).length;

    const hotelCount = travelBookings.filter(
        booking => booking.type === "Hotel"
    ).length;

    const totalCost = travelBookings.reduce(
        (sum, booking) => sum + booking.cost,
        0
    );

    summary.innerHTML = `
        <div class="booking-stat">
            <span>Total Bookings</span>
            <strong>${travelBookings.length}</strong>
        </div>

        <div class="booking-stat">
            <span>Flights</span>
            <strong>${flightCount}</strong>
        </div>

        <div class="booking-stat">
            <span>Total Booking Cost</span>
            <strong>${formatRupees(totalCost)}</strong>
        </div>
    `;

    if (travelBookings.length === 0) {
        list.innerHTML = `
            <p class="booking-empty">
                No reservations saved yet. Add your first flight or hotel booking!
            </p>
        `;
        return;
    }

    list.innerHTML = travelBookings.map(booking => `
        <div class="booking-card">

            <span class="booking-type">
                ${escapeBookingText(booking.type)}
            </span>

            <h3>${escapeBookingText(booking.name)}</h3>

            <p>
                <strong>Booking Reference:</strong>
                ${escapeBookingText(booking.reference)}
            </p>

            <p>
                <strong>Start Date:</strong>
                ${escapeBookingText(booking.startDate)}
            </p>

            <p>
                <strong>End Date:</strong>
                ${escapeBookingText(booking.endDate)}
            </p>

            <p>
                <strong>Cost:</strong>
                ${formatRupees(booking.cost)}
            </p>

            ${booking.notes ? `
                <p>
                    <strong>Details:</strong>
                    ${escapeBookingText(booking.notes)}
                </p>
            ` : ""}

            <button
                type="button"
                class="booking-delete"
                onclick="deleteTravelBooking(${booking.id})">
                Delete Booking
            </button>

        </div>
    `).join("");
}

function escapeBookingText(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

document.addEventListener("DOMContentLoaded", function () {
    displayTravelBookings();
});

/* FEATURE 14: DIGITAL TRAVEL WALLET */

let travelWalletDocuments = JSON.parse(
    localStorage.getItem("travelVistaWallet") || "[]"
);

let editingWalletId = null;

function saveWalletData() {
    localStorage.setItem(
        "travelVistaWallet",
        JSON.stringify(travelWalletDocuments)
    );
}

function saveWalletDocument() {
    const type = document.getElementById("walletType").value;
    const title = document.getElementById("walletTitle").value.trim();
    const reference = document.getElementById("walletReference").value.trim();
    const issueDate = document.getElementById("walletIssueDate").value;
    const expiryDate = document.getElementById("walletExpiryDate").value;
    const notes = document.getElementById("walletNotes").value.trim();

    if (!title || !reference) {
        alert("Please enter the document name and reference number!");
        return;
    }

    if (issueDate && expiryDate && expiryDate < issueDate) {
        alert("Expiry date cannot be before the issue date!");
        return;
    }

    const documentData = {
        id: editingWalletId || Date.now(),
        type,
        title,
        reference,
        issueDate,
        expiryDate,
        notes
    };

    if (editingWalletId !== null) {
        const index = travelWalletDocuments.findIndex(
            item => item.id === editingWalletId
        );

        if (index !== -1) {
            travelWalletDocuments[index] = documentData;
        }

        editingWalletId = null;
    } else {
        travelWalletDocuments.unshift(documentData);
    }

    saveWalletData();
    displayWalletDocuments();

    clearWalletForm();

    alert("Travel document saved successfully!");
}

function displayWalletDocuments() {
    const container = document.getElementById("walletDocuments");
    const summary = document.getElementById("walletSummary");
    const searchBox = document.getElementById("walletSearch");

    if (!container || !summary) return;

    const search = searchBox ? searchBox.value.toLowerCase() : "";

    const filtered = travelWalletDocuments.filter(documentData => {
        return [
            documentData.title,
            documentData.type,
            documentData.reference,
            documentData.notes
        ].join(" ").toLowerCase().includes(search);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiredCount = travelWalletDocuments.filter(item => {
        if (!item.expiryDate) return false;

        const expiry = new Date(item.expiryDate + "T00:00:00");
        return expiry < today;
    }).length;

    summary.innerHTML = `
        <div class="wallet-stat">
            <span>Total Documents</span>
            <strong>${travelWalletDocuments.length}</strong>
        </div>

        <div class="wallet-stat">
            <span>Expired Documents</span>
            <strong>${expiredCount}</strong>
        </div>

        <div class="wallet-stat">
            <span>Document Categories</span>
            <strong>${new Set(travelWalletDocuments.map(item => item.type)).size}</strong>
        </div>
    `;

    if (filtered.length === 0) {
        container.innerHTML = `
            <p class="wallet-empty">
                ${travelWalletDocuments.length
                    ? "No matching documents found."
                    : "Your travel wallet is empty. Add your first document!"}
            </p>
        `;
        return;
    }

    container.innerHTML = filtered.map(item => {
        let expiryMessage = "Expiry date not provided";

        if (item.expiryDate) {
            const expiry = new Date(item.expiryDate + "T00:00:00");

            if (expiry < today) {
                expiryMessage = "⚠ Expired";
            } else {
                expiryMessage = "Expires: " + item.expiryDate;
            }
        }

        return `
            <div class="wallet-card">

                <span class="wallet-type">
                    ${escapeWalletText(item.type)}
                </span>

                <h3>${escapeWalletText(item.title)}</h3>

                <p>
                    <strong>Reference:</strong>
                    ${escapeWalletText(item.reference)}
                </p>

                <p>
                    <strong>Issue Date:</strong>
                    ${item.issueDate
                        ? escapeWalletText(item.issueDate)
                        : "Not provided"}
                </p>

                <p class="wallet-expiry">
                    ${escapeWalletText(expiryMessage)}
                </p>

                ${item.notes ? `
                    <p>
                        <strong>Notes:</strong>
                        ${escapeWalletText(item.notes)}
                    </p>
                ` : ""}

                <div class="wallet-actions">

                    <button class="wallet-edit"
                        type="button"
                        onclick="editWalletDocument(${item.id})">
                        Edit
                    </button>

                    <button class="wallet-delete"
                        type="button"
                        onclick="deleteWalletDocument(${item.id})">
                        Delete
                    </button>

                </div>

            </div>
        `;
    }).join("");
}

function editWalletDocument(id) {
    const item = travelWalletDocuments.find(
        documentData => documentData.id === id
    );

    if (!item) return;

    editingWalletId = id;

    document.getElementById("walletType").value = item.type;
    document.getElementById("walletTitle").value = item.title;
    document.getElementById("walletReference").value = item.reference;
    document.getElementById("walletIssueDate").value = item.issueDate;
    document.getElementById("walletExpiryDate").value = item.expiryDate;
    document.getElementById("walletNotes").value = item.notes;

    document.getElementById("walletSaveButton").textContent = "Update Document";
    document.getElementById("walletCancelButton").style.display = "inline-block";

    document.getElementById("travelWallet").scrollIntoView({
        behavior: "smooth"
    });
}

function deleteWalletDocument(id) {
    if (!confirm("Delete this travel document?")) return;

    travelWalletDocuments = travelWalletDocuments.filter(
        item => item.id !== id
    );

    if (editingWalletId === id) {
        cancelWalletEdit();
    }

    saveWalletData();
    displayWalletDocuments();
}

function clearWalletForm() {
    document.getElementById("walletType").value = "Passport";
    document.getElementById("walletTitle").value = "";
    document.getElementById("walletReference").value = "";
    document.getElementById("walletIssueDate").value = "";
    document.getElementById("walletExpiryDate").value = "";
    document.getElementById("walletNotes").value = "";

    document.getElementById("walletSaveButton").textContent =
        "+ Add to Travel Wallet";

    document.getElementById("walletCancelButton").style.display = "none";
}

function cancelWalletEdit() {
    editingWalletId = null;
    clearWalletForm();
}

function escapeWalletText(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

document.addEventListener("DOMContentLoaded", function () {
    displayWalletDocuments();

    const searchBox = document.getElementById("walletSearch");

    if (searchBox) {
        searchBox.addEventListener("input", displayWalletDocuments);
    }
});

/* FEATURE 15: SMART TRAVEL CALENDAR */

let travelCalendarEvents = JSON.parse(
    localStorage.getItem("travelVistaCalendar") || "[]"
);

let calendarCurrentDate = new Date();
let calendarSelectedDate = getCalendarToday();
let editingCalendarEventId = null;

function getCalendarToday() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function saveCalendarData() {
    localStorage.setItem(
        "travelVistaCalendar",
        JSON.stringify(travelCalendarEvents)
    );
}

function changeCalendarMonth(direction) {
    calendarCurrentDate.setMonth(
        calendarCurrentDate.getMonth() + direction
    );

    displayTravelCalendar();
}

function selectCalendarDate(date) {
    calendarSelectedDate = date;

    document.getElementById("calendarEventDate").value = date;

    displayTravelCalendar();
    displayCalendarEvents();
}

function displayTravelCalendar() {
    const grid = document.getElementById("calendarGrid");
    const heading = document.getElementById("calendarMonthLabel");

    if (!grid || !heading) return;

    const year = calendarCurrentDate.getFullYear();
    const month = calendarCurrentDate.getMonth();

    heading.textContent = calendarCurrentDate.toLocaleDateString(
        "en-IN",
        {
            month: "long",
            year: "numeric"
        }
    );

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = getCalendarToday();

    let calendarHTML = "";

    for (let i = 0; i < firstDay; i++) {
        calendarHTML += `
            <div class="calendar-day empty"></div>
        `;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = [
            year,
            String(month + 1).padStart(2, "0"),
            String(day).padStart(2, "0")
        ].join("-");

        const hasEvents = travelCalendarEvents.some(
            event => event.date === date
        );

        const isToday = date === today;
        const isSelected = date === calendarSelectedDate;

        calendarHTML += `
            <button
                type="button"
                class="calendar-day
                    ${isToday ? "today" : ""}
                    ${isSelected ? "selected" : ""}"
                onclick="selectCalendarDate('${date}')">

                <span class="day-number">${day}</span>

                ${hasEvents
                    ? '<span class="calendar-event-dot">●</span>'
                    : ""}

            </button>
        `;
    }

    grid.innerHTML = calendarHTML;

    displayCalendarEvents();
}

function saveCalendarEvent() {
    const title = document.getElementById("calendarEventTitle").value.trim();
    const date = document.getElementById("calendarEventDate").value;
    const time = document.getElementById("calendarEventTime").value;
    const type = document.getElementById("calendarEventType").value;
    const notes = document.getElementById("calendarEventNotes").value.trim();

    if (!title || !date) {
        alert("Please enter an event name and date!");
        return;
    }

    const eventData = {
        id: editingCalendarEventId || Date.now(),
        title,
        date,
        time,
        type,
        notes
    };

    if (editingCalendarEventId !== null) {
        const index = travelCalendarEvents.findIndex(
            event => event.id === editingCalendarEventId
        );

        if (index !== -1) {
            travelCalendarEvents[index] = eventData;
        }

        editingCalendarEventId = null;
    } else {
        travelCalendarEvents.push(eventData);
    }

    calendarSelectedDate = date;

    const selected = new Date(date + "T00:00:00");

    calendarCurrentDate = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        1
    );

    saveCalendarData();
    clearCalendarForm();
    displayTravelCalendar();

    alert("Travel event saved successfully!");
}

function displayCalendarEvents() {
    const container = document.getElementById("calendarEventList");
    const heading = document.getElementById("calendarSelectedHeading");

    if (!container || !heading) return;

    const selectedDate = calendarSelectedDate;

    heading.textContent = "Events for " + new Date(
        selectedDate + "T00:00:00"
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const events = travelCalendarEvents
        .filter(event => event.date === selectedDate)
        .sort((a, b) => a.time.localeCompare(b.time));

    if (events.length === 0) {
        container.innerHTML = `
            <p class="calendar-empty">
                No events scheduled for this date. Add your first travel event!
            </p>
        `;
        return;
    }

    container.innerHTML = events.map(event => `
        <div class="calendar-event-card">

            <h4>${escapeCalendarText(event.title)}</h4>

            <p>
                <strong>Category:</strong>
                ${escapeCalendarText(event.type)}
            </p>

            <p>
                <strong>Date:</strong>
                ${escapeCalendarText(event.date)}
            </p>

            <p>
                <strong>Time:</strong>
                ${event.time
                    ? escapeCalendarText(event.time)
                    : "Not specified"}
            </p>

            ${event.notes ? `
                <p>
                    <strong>Notes:</strong>
                    ${escapeCalendarText(event.notes)}
                </p>
            ` : ""}

            <div class="calendar-event-actions">

                <button
                    type="button"
                    class="calendar-edit-btn"
                    onclick="editCalendarEvent(${event.id})">
                    Edit
                </button>

                <button
                    type="button"
                    class="calendar-delete-btn"
                    onclick="deleteCalendarEvent(${event.id})">
                    Delete
                </button>

            </div>

        </div>
    `).join("");
}

function editCalendarEvent(id) {
    const event = travelCalendarEvents.find(
        item => item.id === id
    );

    if (!event) return;

    editingCalendarEventId = id;

    document.getElementById("calendarEventTitle").value = event.title;
    document.getElementById("calendarEventDate").value = event.date;
    document.getElementById("calendarEventTime").value = event.time;
    document.getElementById("calendarEventType").value = event.type;
    document.getElementById("calendarEventNotes").value = event.notes;

    document.getElementById("calendarFormHeading").textContent =
        "Edit Travel Event";

    document.getElementById("calendarSaveButton").textContent =
        "Update Event";

    document.getElementById("calendarCancelButton").style.display =
        "inline-block";

    document.getElementById("travelCalendar").scrollIntoView({
        behavior: "smooth"
    });
}

function deleteCalendarEvent(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    travelCalendarEvents = travelCalendarEvents.filter(
        event => event.id !== id
    );

    if (editingCalendarEventId === id) {
        cancelCalendarEdit();
    }

    saveCalendarData();
    displayTravelCalendar();
}

function clearCalendarForm() {
    document.getElementById("calendarEventTitle").value = "";
    document.getElementById("calendarEventDate").value = calendarSelectedDate;
    document.getElementById("calendarEventTime").value = "";
    document.getElementById("calendarEventType").value = "Trip";
    document.getElementById("calendarEventNotes").value = "";

    document.getElementById("calendarFormHeading").textContent =
        "Add Travel Event";

    document.getElementById("calendarSaveButton").textContent =
        "+ Add Event";

    document.getElementById("calendarCancelButton").style.display =
        "none";
}

function cancelCalendarEdit() {
    editingCalendarEventId = null;
    clearCalendarForm();
}

function escapeCalendarText(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("calendarEventDate");

    if (dateInput) {
        dateInput.value = calendarSelectedDate;
    }

    displayTravelCalendar();
});

/* FEATURE 16: ROUTE OPTIMIZER */

const routeCoordinates = {
    Goa: [15.2993, 74.1240],
    Jaipur: [26.9124, 75.7873],
    Manali: [32.2396, 77.1887],
    Paris: [48.8566, 2.3522],
    Bali: [-8.4095, 115.1889],
    Tokyo: [35.6762, 139.6503]
};

let routeOptimizerMap = null;
let routeOptimizerLayer = null;

function calculateRouteDistance(pointA, pointB) {
    const earthRadius = 6371;
    const toRadians = value => value * Math.PI / 180;

    const lat1 = toRadians(pointA[0]);
    const lat2 = toRadians(pointB[0]);
    const differenceLat = toRadians(pointB[0] - pointA[0]);
    const differenceLng = toRadians(pointB[1] - pointA[1]);

    const a =
        Math.sin(differenceLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(differenceLng / 2) ** 2;

    return earthRadius * 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );
}

function initializeRouteOptimizerMap() {
    const mapElement = document.getElementById("routeOptimizerMap");

    if (!mapElement || typeof L === "undefined") {
        return;
    }

    if (!routeOptimizerMap) {
        routeOptimizerMap = L.map("routeOptimizerMap").setView(
            [20.5937, 78.9629], 3
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(routeOptimizerMap);
    }

    setTimeout(() => routeOptimizerMap.invalidateSize(), 200);
}

function calculateOptimizedRoute() {
    const start = document.getElementById("routeStart").value;
    const checkboxes = document.querySelectorAll(
        '#routeOptimizer input[type="checkbox"]:checked'
    );

    let selectedPlaces = [...checkboxes].map(box => box.value);

    selectedPlaces = [...new Set(selectedPlaces)]
        .filter(place => place !== start);

    if (selectedPlaces.length === 0) {
        document.getElementById("routeResults").innerHTML =
            '<p class="route-result-card">Please select at least one destination other than your starting point.</p>';
        return;
    }

    let remaining = [...selectedPlaces];
    let route = [start];
    let current = start;
    let totalDistance = 0;
    let legs = [];

    while (remaining.length > 0) {
        let nearest = remaining[0];
        let nearestDistance = calculateRouteDistance(
            routeCoordinates[current],
            routeCoordinates[nearest]
        );

        remaining.forEach(place => {
            const distance = calculateRouteDistance(
                routeCoordinates[current],
                routeCoordinates[place]
            );

            if (distance < nearestDistance) {
                nearest = place;
                nearestDistance = distance;
            }
        });

        legs.push({
            from: current,
            to: nearest,
            distance: nearestDistance
        });

        totalDistance += nearestDistance;
        route.push(nearest);
        current = nearest;
        remaining = remaining.filter(place => place !== nearest);
    }

    displayOptimizedRoute(route, legs, totalDistance);
}

function displayOptimizedRoute(route, legs, totalDistance) {
    const results = document.getElementById("routeResults");

    let html = `
        <div class="route-result-card">
            <h3>✈ Your Optimized Travel Plan</h3>
            <p class="route-distance">
                Estimated total distance: ${Math.round(totalDistance).toLocaleString("en-IN")} km
            </p>
            <p>Number of destinations: ${route.length}</p>
            <h4>Your visiting order</h4>
    `;

    route.forEach((place, index) => {
        html += `
            <div class="route-stop">
                <span>${index + 1}.</span> ${place}
                ${index === 0 ? "(Starting point)" : ""}
            </div>
        `;
    });

    html += "<h4>Distance between stops</h4>";

    legs.forEach(leg => {
        html += `
            <div class="route-stop">
                ${leg.from} → ${leg.to}
                <strong>${Math.round(leg.distance).toLocaleString("en-IN")} km</strong>
            </div>
        `;
    });

    html += `
        <p class="route-note">
            This route uses a nearest-neighbour estimate based on straight-line
            distances. Actual road, flight and travel distances may differ.
        </p>
        </div>
    `;

    results.innerHTML = html;

    initializeRouteOptimizerMap();

    if (routeOptimizerMap) {
        if (routeOptimizerLayer) {
            routeOptimizerMap.removeLayer(routeOptimizerLayer);
        }

        const coordinates = route.map(place => routeCoordinates[place]);

        routeOptimizerLayer = L.layerGroup();

        coordinates.forEach((coordinate, index) => {
            L.marker(coordinate)
                .bindPopup(`${index + 1}. ${route[index]}`)
                .addTo(routeOptimizerLayer);
        });

        L.polyline(coordinates, {
            color: "#d4af69",
            weight: 4,
            opacity: 0.9
        }).addTo(routeOptimizerLayer);

        routeOptimizerLayer.addTo(routeOptimizerMap);

        routeOptimizerMap.fitBounds(coordinates, {
            padding: [35, 35]
        });

        setTimeout(() => routeOptimizerMap.invalidateSize(), 200);
    }
}

/* FEATURE 17: FLIGHT AND HOTEL SEARCH */

function searchTravelFlights() {
    const origin = document.getElementById("flightOrigin").value.trim();
    const destination = document.getElementById("flightDestination").value.trim();
    const departure = document.getElementById("flightDeparture").value;
    const returning = document.getElementById("flightReturn").value;
    const travellers = Number(document.getElementById("flightTravellers").value);

    const message = document.getElementById("travelSearchMessage");

    if (!origin || !destination || !departure || !returning) {
        message.textContent = "Please complete all flight search fields.";
        return;
    }

    if (new Date(returning) < new Date(departure)) {
        message.textContent = "Return date cannot be before departure date.";
        return;
    }

    if (!Number.isInteger(travellers) || travellers < 1 || travellers > 20) {
        message.textContent = "Please enter between 1 and 20 travellers.";
        return;
    }

    const query = `Flights from ${origin} to ${destination} on ${departure} through ${returning} for ${travellers} passengers`;

    const url = "https://www.google.com/travel/flights?q=" +
        encodeURIComponent(query);

    message.textContent = "Opening flight search results...";

    window.open(url, "_blank", "noopener");
}

function searchTravelHotels() {
    const destination = document.getElementById("hotelDestination").value.trim();
    const checkin = document.getElementById("hotelCheckin").value;
    const checkout = document.getElementById("hotelCheckout").value;
    const guests = Number(document.getElementById("hotelGuests").value);

    const message = document.getElementById("travelSearchMessage");

    if (!destination || !checkin || !checkout) {
        message.textContent = "Please complete all hotel search fields.";
        return;
    }

    if (new Date(checkout) <= new Date(checkin)) {
        message.textContent = "Check-out must be after check-in.";
        return;
    }

    if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
        message.textContent = "Please enter between 1 and 20 guests.";
        return;
    }

    const url = new URL("https://www.booking.com/searchresults.html");

    url.searchParams.set("ss", destination);
    url.searchParams.set("checkin", checkin);
    url.searchParams.set("checkout", checkout);
    url.searchParams.set("group_adults", guests);
    url.searchParams.set("no_rooms", "1");

    message.textContent = "Opening hotel search results...";

    window.open(url.toString(), "_blank", "noopener");
}

/* FEATURE 18: AI TRAVEL ASSISTANT */

function getTravelAssistantReply(message) {
    const text = message.toLowerCase();

    if (text.includes("goa")) {
        return "🏝 GOA TRAVEL GUIDE\n\n• Visit Baga and Palolem beaches.\n• Explore Fort Aguada.\n• Enjoy local Goan food.\n• Try water sports if conditions are safe.\n\nSuggested duration: 3–4 days.\n\nTip: Compare accommodation prices before booking.";
    }

    if (text.includes("jaipur")) {
        return "🏰 JAIPUR TRAVEL GUIDE\n\n• Visit Amber Fort.\n• Explore Hawa Mahal.\n• Discover City Palace.\n• Shop for traditional handicrafts.\n\nSuggested duration: 2–3 days.\n\nTip: Carry comfortable footwear for sightseeing.";
    }

    if (text.includes("manali")) {
        return "🏔 MANALI TRAVEL GUIDE\n\n• Explore Solang Valley.\n• Visit Hadimba Temple.\n• Discover Old Manali.\n• Enjoy mountain views and local food.\n\nSuggested duration: 3–5 days.\n\nTip: Check local weather and road conditions before travelling.";
    }

    if (text.includes("paris")) {
        return "🗼 PARIS TRAVEL GUIDE\n\n• Visit the Eiffel Tower.\n• Explore the Louvre Museum.\n• Walk along the Seine.\n• Discover Montmartre.\n\nSuggested duration: 3–4 days.\n\nTip: Book popular attractions in advance.";
    }

    if (text.includes("bali")) {
        return "🌴 BALI TRAVEL GUIDE\n\n• Visit Ubud.\n• Explore the famous rice terraces.\n• Relax at Seminyak Beach.\n• Discover beautiful temples.\n\nSuggested duration: 4–6 days.\n\nTip: Respect local customs when visiting temples.";
    }

    if (text.includes("tokyo")) {
        return "🗾 TOKYO TRAVEL GUIDE\n\n• Explore Shibuya Crossing.\n• Visit Senso-ji Temple.\n• Discover Shinjuku.\n• Try authentic Japanese food.\n\nSuggested duration: 4–5 days.\n\nTip: Learn a few basic Japanese phrases.";
    }

    if (text.includes("budget") || text.includes("money") || text.includes("cheap") || text.includes("save")) {
        return "💰 SMART TRAVEL BUDGET TIPS\n\n1. Set a daily spending limit.\n2. Compare transport and accommodation prices.\n3. Travel during less busy periods when possible.\n4. Try affordable local restaurants.\n5. Keep an emergency fund.\n6. Track your expenses using the TravelVista Budget Calculator.";
    }

    if (text.includes("pack") || text.includes("packing") || text.includes("luggage")) {
        return "🎒 PACKING CHECKLIST\n\n• Clothes suitable for your destination.\n• Comfortable shoes.\n• Phone and charger.\n• Identification and travel documents.\n• Personal medicines and toiletries.\n• Reusable water bottle.\n• Weather-appropriate accessories.\n\nUse the TravelVista Smart Packing Assistant to create a checklist for your trip!";
    }

    if (text.includes("safety") || text.includes("safe") || text.includes("emergency")) {
        return "🛡 TRAVEL SAFETY TIPS\n\n• Keep copies of important documents.\n• Save local emergency numbers.\n• Share your itinerary with someone you trust.\n• Use trusted transport providers.\n• Keep valuables secure.\n• Check official travel advisories.\n\nFor emergencies, contact local emergency services.";
    }

    if (text.includes("weather") || text.includes("rain") || text.includes("temperature")) {
        return "🌦 WEATHER TRAVEL TIP\n\nCheck the destination forecast before departure. Pack according to expected temperatures and rainfall.\n\nYou can use the TravelVista Live Weather Forecast section to check current weather information.";
    }

    if (text.includes("itinerary") || text.includes("trip plan") || text.includes("days")) {
        return "🗓 TRIP PLANNING GUIDE\n\n1. Choose your destination.\n2. Decide the number of travel days.\n3. Set your budget.\n4. List the attractions you want to visit.\n5. Organize transport and accommodation.\n6. Keep some free time for unexpected discoveries.\n\nTry the TravelVista AI Trip Generator to create a sample day-by-day itinerary.";
    }

    if (text.includes("flight") || text.includes("hotel") || text.includes("booking")) {
        return "✈️ FLIGHT & HOTEL TIP\n\nCompare prices and travel conditions before booking. Check baggage allowances, cancellation policies, hotel reviews and location.\n\nUse the TravelVista Flight & Hotel Search section to open external search results.";
    }

    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
        return "Hello, traveller! 👋 Welcome to TravelVista. Where would you like to go? I can help with destinations, budgets, itineraries, packing and travel safety.";
    }

    if (text.includes("thank")) {
        return "You're very welcome! 😊 Have a wonderful journey. TravelVista is always ready to help you plan!";
    }

    return "I'd love to help with your trip! ✈️\n\nTry asking me about:\n• A destination such as Goa, Jaipur, Bali or Paris\n• Travel budgets and money-saving tips\n• Packing checklists\n• Travel safety\n• Weather preparation\n• Itinerary planning\n• Flight and hotel bookings\n\nTry one of the suggested questions above!";
}

function addTravelChatMessage(message, sender) {
    const chat = document.getElementById("assistantChat");
    const messageElement = document.createElement("div");

    messageElement.className =
        sender === "user"
            ? "chat-message user-message"
            : "chat-message assistant-message";

    const heading = document.createElement("strong");
    heading.textContent =
        sender === "user" ? "You" : "TravelVista Assistant";

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    messageElement.appendChild(heading);
    messageElement.appendChild(paragraph);

    chat.appendChild(messageElement);
    chat.scrollTop = chat.scrollHeight;
}

function sendTravelMessage() {
    const input = document.getElementById("assistantInput");
    const message = input.value.trim();

    if (!message) {
        return;
    }

    addTravelChatMessage(message, "user");

    const reply = getTravelAssistantReply(message);

    addTravelChatMessage(reply, "assistant");

    input.value = "";
    input.focus();
}

function askTravelSuggestion(question) {
    document.getElementById("assistantInput").value = question;
    sendTravelMessage();
}

function clearTravelChat() {
    const chat = document.getElementById("assistantChat");

    chat.innerHTML = `
        <div class="chat-message assistant-message">
            <strong>TravelVista Assistant</strong>
            <p>Hello again! 👋 What would you like help planning today?</p>
        </div>
    `;
}

/* FEATURE 19: TRAVEL ANALYTICS DASHBOARD */

let travelExpenseChart = null;
let travelBookingChart = null;

function getAnalyticsStorage(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

function refreshTravelAnalytics() {
    const trips = getAnalyticsStorage("travelVistaSavedTrips");
    const bookings = getAnalyticsStorage("travelVistaBookings");
    const journal = getAnalyticsStorage("travelVistaJournal");
    const expenses = getAnalyticsStorage("travelVistaExpenses");

    const totalExpenses = expenses.reduce((sum, item) => {
        const amount = Number(item.amount);
        return sum + (Number.isFinite(amount) && amount > 0 ? amount : 0);
    }, 0);

    document.getElementById("analyticsTrips").textContent = trips.length;
    document.getElementById("analyticsBookings").textContent = bookings.length;
    document.getElementById("analyticsJournal").textContent = journal.length;

    document.getElementById("analyticsExpenses").textContent =
        "₹" + totalExpenses.toLocaleString("en-IN");

    createExpenseAnalyticsChart(expenses);
    createBookingAnalyticsChart(bookings);
    createTravelAnalyticsOverview(trips, bookings, journal, totalExpenses);
}

function createExpenseAnalyticsChart(expenses) {
    const canvas = document.getElementById("expenseAnalyticsChart");
    const message = document.getElementById("expenseChartMessage");

    if (typeof Chart === "undefined") {
        message.textContent = "Chart library could not load. Check your internet connection.";
        return;
    }

    const categories = {};

    expenses.forEach(item => {
        const category = item.name || item.category || "Other";
        const amount = Number(item.amount);

        if (Number.isFinite(amount) && amount > 0) {
            categories[category] = (categories[category] || 0) + amount;
        }
    });

    const labels = Object.keys(categories);
    const values = Object.values(categories);

    if (travelExpenseChart) {
        travelExpenseChart.destroy();
    }

    if (labels.length === 0) {
        message.textContent = "Add expenses in the Smart Budget Calculator to see your chart.";
        return;
    }

    message.textContent = "Based on expenses saved in your budget calculator.";

    travelExpenseChart = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#d4af69",
                    "#6d91b8",
                    "#9a80b9",
                    "#66a995",
                    "#d27d76",
                    "#c2a6a0"
                ],
                borderWidth: 2,
                borderColor: "#111c2e"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: "#f4f0e8"
                    }
                }
            }
        }
    });
}

function createBookingAnalyticsChart(bookings) {
    const canvas = document.getElementById("bookingAnalyticsChart");
    const message = document.getElementById("bookingChartMessage");

    if (typeof Chart === "undefined") {
        message.textContent = "Chart library could not load. Check your internet connection.";
        return;
    }

    const categories = {};

    bookings.forEach(item => {
        const category = item.type || "Other";
        categories[category] = (categories[category] || 0) + 1;
    });

    const labels = Object.keys(categories);
    const values = Object.values(categories);

    if (travelBookingChart) {
        travelBookingChart.destroy();
    }

    if (labels.length === 0) {
        message.textContent = "Add flight or hotel records in your booking organizer to see your chart.";
        return;
    }

    message.textContent = "Based on your saved booking records.";

    travelBookingChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Number of bookings",
                data: values,
                backgroundColor: "#d4af69",
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    ticks: { color: "#f4f0e8" },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "#f4f0e8",
                        precision: 0
                    },
                    grid: {
                        color: "rgba(255,255,255,0.08)"
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: "#f4f0e8"
                    }
                }
            }
        }
    });
}

function createTravelAnalyticsOverview(trips, bookings, journal, totalExpenses) {
    const overview = document.getElementById("analyticsOverview");

    const destinationNames = trips
        .map(trip => trip.destination)
        .filter(Boolean);

    const uniqueDestinations = [...new Set(destinationNames)];

    overview.innerHTML = `
        <div class="analytics-overview-item">
            <span>Unique saved destinations</span>
            <strong>${uniqueDestinations.length}</strong>
        </div>

        <div class="analytics-overview-item">
            <span>Total travel records</span>
            <strong>${trips.length + bookings.length + journal.length}</strong>
        </div>

        <div class="analytics-overview-item">
            <span>Saved trip plans</span>
            <strong>${trips.length}</strong>
        </div>

        <div class="analytics-overview-item">
            <span>Travel journal entries</span>
            <strong>${journal.length}</strong>
        </div>

        <div class="analytics-overview-item">
            <span>Total recorded expenses</span>
            <strong>₹${totalExpenses.toLocaleString("en-IN")}</strong>
        </div>

        <div class="analytics-overview-item">
            <span>Booking records</span>
            <strong>${bookings.length}</strong>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", function () {
    refreshTravelAnalytics();
});
