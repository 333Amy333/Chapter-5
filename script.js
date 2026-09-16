/* ========================================
   CHAPTER 5
   Main JavaScript
   ======================================== */


/* ========================================
   CHECK-IN
   ======================================== */


/* ---------- CHECK-IN DATA ---------- */

let checkInData = {
    capacity: "",
    sleep: 0,
    energy: 0,
    mood: 0,
    focus: 0,
    overwhelm: 0
};


/* ---------- SELECT CAPACITY ---------- */

function selectCapacity(capacity) {

    // Save the selected capacity
    checkInData.capacity = capacity;

    // Find all capacity buttons
    let buttons = document.querySelectorAll(
        ".zone-buttons button"
    );

    // Remove the selected style from all buttons
    buttons.forEach(function(button) {
        button.classList.remove("capacity-selected");
    });

    // Find the button that was just selected
    let selectedButton = document.querySelector(
        ".zone-buttons ." + capacity.toLowerCase()
    );

    // Add the selected style
    if (selectedButton) {
        selectedButton.classList.add("capacity-selected");
    }
}


/* ---------- SET A RATING ---------- */

function setRating(category, score) {

    // Store the selected score
    checkInData[category] = score;

    // Find the correct rating row
    let rating = document.querySelector(
        '.rating[data-category="' + category + '"]'
    );

    // Safety check
    if (!rating) {
        return;
    }

    // Find all five buttons in that row
    let buttons = rating.querySelectorAll("button");

    // Colour every dot up to the selected score
    buttons.forEach(function(button, index) {

        if (index < score) {
            button.classList.add("selected");
        }

        else {
            button.classList.remove("selected");
        }
    });
}


/* ---------- CHECK-IN HISTORY ---------- */

// Load previous check-ins.
// If none exist yet, start with an empty array.

let checkInHistory =
    JSON.parse(localStorage.getItem("checkInHistory")) || [];


/* ---------- SAVE TODAY'S CHECK-IN ---------- */

function saveCheckIn() {

    let message = document.getElementById("message");


    // Make sure capacity has been selected

    if (checkInData.capacity === "") {

        message.textContent =
            "Choose your capacity before saving.";

        return;
    }


    // Make sure all five ratings have been completed

    if (
        checkInData.sleep === 0 ||
        checkInData.energy === 0 ||
        checkInData.mood === 0 ||
        checkInData.focus === 0 ||
        checkInData.overwhelm === 0
    ) {

        message.textContent =
            "Complete all five ratings before saving.";

        return;
    }


    // Get the optional note

    let note =
        document.getElementById("checkinNote").value.trim();


    // Get today's local calendar date

    let today =
        new Date().toLocaleDateString("en-CA");


    // Build today's check-in record

    let record = {

        date: today,

        capacity: checkInData.capacity,

        sleep: checkInData.sleep,

        energy: checkInData.energy,

        mood: checkInData.mood,

        focus: checkInData.focus,

        overwhelm: checkInData.overwhelm,

        note: note
    };


    // Look for an existing record for today

    let existingIndex = checkInHistory.findIndex(
        function(item) {
            return item.date === today;
        }
    );


    // If today does NOT already exist...

    if (existingIndex === -1) {

        checkInHistory.push(record);

        message.textContent =
            "Today's check-in has been saved ✓";
    }


    // If today DOES already exist...

    else {

        checkInHistory[existingIndex] = record;

        message.textContent =
            "Today's check-in has been updated ✓";
    }


    // Save the updated history

    localStorage.setItem(
        "checkInHistory",
        JSON.stringify(checkInHistory)
    );
}


/* ========================================
   BRAIN DUMP
   ======================================== */


/* ---------- BRAIN DUMP DATA ---------- */

// Load previous Brain Dump items.
// If none exist yet, start with an empty array.

let brainDump =
    JSON.parse(localStorage.getItem("brainDump")) || [];


/* ---------- ADD A THOUGHT ---------- */

function addBrainDump() {

    // Find the input
    let input =
        document.getElementById("brainInput");

    // Get the text and remove extra spaces
    let thought =
        input.value.trim();


    // Don't allow blank entries

    if (thought === "") {
        return;
    }


    // Add the thought to our array

    brainDump.push(thought);


    // Save the updated Brain Dump

    saveBrainDump();


    // Redraw the list

    displayBrainDump();


    // Clear the input

    input.value = "";
}


/* ---------- SAVE BRAIN DUMP ---------- */

function saveBrainDump() {

    localStorage.setItem(
        "brainDump",
        JSON.stringify(brainDump)
    );
}


/* ---------- DISPLAY BRAIN DUMP ---------- */

function displayBrainDump() {

    let list =
        document.getElementById("brainList");


    // Safety check

    if (!list) {
        return;
    }


    // Clear the current display

    list.innerHTML = "";


    // Create one list item for every saved thought

    brainDump.forEach(function(thought, index) {

        let newItem =
            document.createElement("li");


        // Thought text

        let thoughtText =
            document.createElement("span");

        thoughtText.textContent = thought;


        // Container for Edit + Delete

        let buttonContainer =
            document.createElement("div");


        /* ----- EDIT BUTTON ----- */

        let editButton =
            document.createElement("button");

        editButton.textContent = "Edit";

        editButton.onclick = function() {
            editBrainDump(index);
        };


        /* ----- DELETE BUTTON ----- */

        let deleteButton =
            document.createElement("button");

        deleteButton.textContent = "×";

        deleteButton.onclick = function() {
            deleteBrainDump(index);
        };


        // Assemble the buttons

        buttonContainer.appendChild(editButton);

        buttonContainer.appendChild(deleteButton);


        // Assemble the list item

        newItem.appendChild(thoughtText);

        newItem.appendChild(buttonContainer);


        // Add it to the screen

        list.appendChild(newItem);
    });
}


/* ---------- DELETE A THOUGHT ---------- */

function deleteBrainDump(index) {

    // Remove one item from the array

    brainDump.splice(index, 1);


    // Save the change

    saveBrainDump();


    // Redraw the list

    displayBrainDump();
}


/* ---------- EDIT A THOUGHT ---------- */

function editBrainDump(index) {

    // Show the existing thought in an edit box

    let updatedThought = prompt(
        "Edit this thought:",
        brainDump[index]
    );


    // User clicked Cancel

    if (updatedThought === null) {
        return;
    }


    // Remove accidental spaces

    updatedThought =
        updatedThought.trim();


    // Don't allow an empty thought

    if (updatedThought === "") {
        return;
    }


    // Update the item in our array

    brainDump[index] =
        updatedThought;


    // Save the change

    saveBrainDump();


    // Redraw the list

    displayBrainDump();
}

/* ---------- LOAD TODAY'S CHECK-IN ---------- */

function loadTodaysCheckIn() {

    // Get today's local date

    let today =
        new Date().toLocaleDateString("en-CA");


    // Find today's saved check-in

    let todaysRecord = checkInHistory.find(
        function(item) {
            return item.date === today;
        }
    );


    // If there isn't one, there's nothing to restore

    if (!todaysRecord) {
        return;
    }


    // Restore our JavaScript data

    checkInData.capacity = todaysRecord.capacity;
    checkInData.sleep = todaysRecord.sleep;
    checkInData.energy = todaysRecord.energy;
    checkInData.mood = todaysRecord.mood;
    checkInData.focus = todaysRecord.focus;
    checkInData.overwhelm = todaysRecord.overwhelm;


    // Restore the capacity button

    selectCapacity(todaysRecord.capacity);


    // Restore all five rating displays

    setRating("sleep", todaysRecord.sleep);
    setRating("energy", todaysRecord.energy);
    setRating("mood", todaysRecord.mood);
    setRating("focus", todaysRecord.focus);
    setRating("overwhelm", todaysRecord.overwhelm);


    // Restore the optional note

    document.getElementById("checkinNote").value =
        todaysRecord.note || "";


    // Tell the user this is already saved

    document.getElementById("message").textContent =
        "Today's check-in is saved ✓";
}
/* ---------- DISPLAY CHECK-IN HISTORY ---------- */

function displayCheckInHistory() {

    let container =
        document.getElementById("checkInHistoryList");

    if (!container) {
        return;
    }

    // Clear what's currently displayed
    container.innerHTML = "";


    // If there are no saved check-ins
    if (checkInHistory.length === 0) {

        container.textContent =
            "No check-ins yet.";

        return;
    }


    // Copy the history and put newest entries first
    let recentCheckIns =
        [...checkInHistory].reverse();


    // Show the five most recent check-ins
    recentCheckIns
        .slice(0, 5)
        .forEach(function(record) {

            let item =
                document.createElement("div");

            item.classList.add("history-item");


            // Capacity
            let capacity =
                document.createElement("div");

            capacity.classList.add(
                "history-capacity",
                record.capacity.toLowerCase()
            );

            capacity.textContent =
                record.capacity;


            // Main information
            let details =
                document.createElement("div");

            details.classList.add("history-details");


            // Date
            let date =
                document.createElement("strong");

            date.textContent =
                formatCheckInDate(record.date);


            // Ratings
            let ratings =
                document.createElement("span");

            ratings.textContent =
                "Sleep " + record.sleep +
                " · Energy " + record.energy +
                " · Mood " + record.mood +
                " · Focus " + record.focus +
                " · Overwhelm " + record.overwhelm;


            details.appendChild(date);
            details.appendChild(ratings);


            // Optional note
            if (record.note) {

                let note =
                    document.createElement("p");

                note.textContent =
                    record.note;

                details.appendChild(note);
            }


            // Build the history item
            item.appendChild(capacity);
            item.appendChild(details);

            container.appendChild(item);
        });
}/* ---------- FORMAT CHECK-IN DATE ---------- */

function formatCheckInDate(dateString) {

    let date =
        new Date(dateString);

    return date.toLocaleDateString(
        "en-AU",
        {
            day: "numeric",
            month: "short"
        }
    );
}
/* ---------- SHOW CAPACITY PATTERN ---------- */

function showPattern(capacity) {

    let result =
        document.getElementById("patternResult");


    // Find only check-ins with this capacity

    let matchingCheckIns =
        checkInHistory.filter(function(record) {

            return record.capacity === capacity;

        });


    // No matching data yet

    if (matchingCheckIns.length === 0) {

        result.innerHTML =
            "<strong>No " + capacity +
            " check-ins yet.</strong>" +
            "<p>Keep checking in and your patterns will appear here.</p>";

        return;
    }


    // Work out the averages

    let totalSleep = 0;
    let totalEnergy = 0;
    let totalMood = 0;
    let totalFocus = 0;
    let totalOverwhelm = 0;


    matchingCheckIns.forEach(function(record) {

        totalSleep += record.sleep;
        totalEnergy += record.energy;
        totalMood += record.mood;
        totalFocus += record.focus;
        totalOverwhelm += record.overwhelm;

    });


    let count =
        matchingCheckIns.length;


    let averageSleep =
        (totalSleep / count).toFixed(1);

    let averageEnergy =
        (totalEnergy / count).toFixed(1);

    let averageMood =
        (totalMood / count).toFixed(1);

    let averageFocus =
        (totalFocus / count).toFixed(1);

    let averageOverwhelm =
        (totalOverwhelm / count).toFixed(1);


    // Display the results

    result.innerHTML = `
        <div class="pattern-heading">
            <span class="pattern-dot ${capacity.toLowerCase()}"></span>

            <div>
                <strong>Your ${capacity} pattern</strong>
                <small>${count} check-in${count === 1 ? "" : "s"}</small>
            </div>
        </div>

        <div class="pattern-stats">

            <div>
                <span>🌙 Sleep</span>
                <strong>${averageSleep}</strong>
            </div>

            <div>
                <span>☀️ Energy</span>
                <strong>${averageEnergy}</strong>
            </div>

            <div>
                <span>♡ Mood</span>
                <strong>${averageMood}</strong>
            </div>

            <div>
                <span>🧠 Focus</span>
                <strong>${averageFocus}</strong>
            </div>

            <div>
                <span>〰️ Overwhelm</span>
                <strong>${averageOverwhelm}</strong>
            </div>

        </div>
    `;
}
/* ========================================
   LOAD APP
   ======================================== */


// Display previously saved Brain Dump items
// when Chapter 5 opens.

displayBrainDump();
loadTodaysCheckIn();
displayCheckInHistory();