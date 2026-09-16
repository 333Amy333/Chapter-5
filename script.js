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
/* ---------- VIEWING MODE ---------- */

let viewingRecord = null;

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
updatePlanForCapacity(capacity);}


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
   SUPPORT PLANS
   ======================================== */


/* ---------- SUPPORT PLAN DATA ---------- */

let supportPlans =
    JSON.parse(localStorage.getItem("supportPlans")) || {

        red: {
            need: [],
            cannotDo: [],
            practicalSupport: [],
            decisionSupport: []
        },

        yellow: {
            helps: [],
            limiting: [],
            practicalSupport: []
        },

        green: {
            steady: [],
            protect: [],
            tooMuch: []
        }

    };


/* ---------- SAVE SUPPORT PLANS ---------- */

function saveSupportPlans() {

    localStorage.setItem(
        "supportPlans",
        JSON.stringify(supportPlans)
    );
}
/* ---------- DISPLAY SUPPORT PLAN ---------- */

function displaySupportPlan(capacity) {

    let title =
        document.getElementById("supportPlanTitle");

    let content =
        document.getElementById("supportPlanContent");


    if (!title || !content) {
        return;
    }


    content.innerHTML = "";
    content.classList.add("collapsed");

let toggleButton =
    document.getElementById("toggleSupportButton");

if (toggleButton) {

    toggleButton.textContent =
        "View my plan ↓";
}


    /* RED */

    if (capacity === "Red") {

        title.textContent =
            "Minimum Day support";

        drawSupportSection(
            content,
            "What I need today",
            supportPlans.red.need
        );

        drawSupportSection(
            content,
            "Things I cannot do today",
            supportPlans.red.cannotDo
        );

        drawSupportSection(
            content,
            "People & practical support",
            supportPlans.red.practicalSupport
        );

        drawSupportSection(
            content,
            "If I'm struggling to make decisions",
            supportPlans.red.decisionSupport
        );
    }


    /* YELLOW */

    else if (capacity === "Yellow") {

        title.textContent =
            "Gentle Day support";

        drawSupportSection(
            content,
            "What helps me",
            supportPlans.yellow.helps
        );

        drawSupportSection(
            content,
            "What I'm limiting today",
            supportPlans.yellow.limiting
        );

        drawSupportSection(
            content,
            "People & practical support",
            supportPlans.yellow.practicalSupport
        );
    }


    /* GREEN */

    else if (capacity === "Green") {

        title.textContent =
            "Open Day support";

        drawSupportSection(
            content,
            "What keeps me steady",
            supportPlans.green.steady
        );

        drawSupportSection(
            content,
            "What I want to protect",
            supportPlans.green.protect
        );

        drawSupportSection(
            content,
            "Signs I'm doing too much",
            supportPlans.green.tooMuch
        );
    }
}
/* ---------- TOGGLE SUPPORT PLAN ---------- */

function toggleSupportPlan() {

    let content =
        document.getElementById("supportPlanContent");

    let button =
        document.getElementById("toggleSupportButton");


    if (!content || !button) {
        return;
    }


    let isCollapsed =
        content.classList.contains("collapsed");


    if (isCollapsed) {

        content.classList.remove("collapsed");

        button.textContent =
            "Hide my plan ↑";

    } else {

        content.classList.add("collapsed");

        button.textContent =
            "View my plan ↓";
    }
}
/* ---------- DRAW SUPPORT SECTION ---------- */

function drawSupportSection(
    container,
    heading,
    items
) {

    let section =
        document.createElement("div");

    section.classList.add("support-section");


    let headingElement =
        document.createElement("h4");

    headingElement.textContent =
        heading;


    let list =
        document.createElement("ul");


    if (items.length === 0) {

        let empty =
            document.createElement("li");

        empty.classList.add("support-empty");

        empty.textContent =
            "Nothing added yet.";

        list.appendChild(empty);
    }

    else {

        items.forEach(function(item) {

            let listItem =
                document.createElement("li");

            listItem.textContent =
                item;

            list.appendChild(listItem);
        });
    }


    section.appendChild(
        headingElement
    );

    section.appendChild(
        list
    );

    container.appendChild(
        section
    );
}
/* ---------- EDIT SUPPORT PLAN ---------- */

function openSupportPlanEditor() {

    let capacity =
        checkInData.capacity;


    if (!capacity) {

        alert(
            "Choose your capacity first."
        );

        return;
    }


    if (capacity === "Red") {

        editSupportField(
            "red",
            "need",
            "What do you need on a Red day?"
        );

        editSupportField(
            "red",
            "cannotDo",
            "What can you NOT do on a Red day?"
        );

        editSupportField(
            "red",
            "practicalSupport",
            "Who or what can provide practical support?"
        );

        editSupportField(
            "red",
            "decisionSupport",
            "What should Chapter 5 remind you when making decisions feels hard?"
        );
    }


    else if (capacity === "Yellow") {

        editSupportField(
            "yellow",
            "helps",
            "What helps on a Yellow day?"
        );

        editSupportField(
            "yellow",
            "limiting",
            "What are you limiting on a Yellow day?"
        );

        editSupportField(
            "yellow",
            "practicalSupport",
            "Who or what can provide practical support?"
        );
    }


    else if (capacity === "Green") {

        editSupportField(
            "green",
            "steady",
            "What helps keep you steady on a Green day?"
        );

        editSupportField(
            "green",
            "protect",
            "What do you want to protect on a Green day?"
        );

        editSupportField(
            "green",
            "tooMuch",
            "What are your signs that you're doing too much?"
        );
    }


    saveSupportPlans();

    displaySupportPlan(capacity);
}
/* ---------- EDIT SUPPORT FIELD ---------- */

function editSupportField(
    capacity,
    field,
    question
) {

    let currentItems =
        supportPlans[capacity][field];


    let currentText =
        currentItems.join("\n");


    let response =
        prompt(
            question +
            "\n\nEnter one item per line:",
            currentText
        );


    // Cancel means keep existing information

    if (response === null) {
        return;
    }


    let newItems =
        response
            .split("\n")
            .map(function(item) {
                return item.trim();
            })
            .filter(function(item) {
                return item !== "";
            });


    supportPlans[capacity][field] =
        newItems;
}
/* ========================================
   TODAY'S PLAN
   ======================================== */
/* ---------- ADAPT PLAN TO CAPACITY ---------- */

function updatePlanForCapacity(capacity) {

    let banner =
        document.getElementById("capacityPlanBanner");

    let mustSection =
        document.querySelector(".plan-section.must");

    let helpSection =
        document.querySelector(".plan-section.help");

    let couldSection =
        document.querySelector(".plan-section.could");


    // Reset everything first

    mustSection.classList.remove("deemphasised");
    helpSection.classList.remove("deemphasised");
    couldSection.classList.remove("deemphasised");


    // RED — MINIMUM DAY

    if (capacity === "Red") {

        banner.innerHTML = `
            <span class="plan-mode">Minimum Day</span>

            <strong>Only what matters.</strong>

            <p>
                Focus on what genuinely needs you today.
            </p>
        `;

        banner.className =
            "capacity-plan-banner red-plan";

        helpSection.classList.add("deemphasised");
        couldSection.classList.add("deemphasised");
    }


    // YELLOW — GENTLE DAY

    else if (capacity === "Yellow") {

        banner.innerHTML = `
            <span class="plan-mode">Gentle Day</span>

            <strong>Steady does it.</strong>

            <p>
                Make some room for what would help.
            </p>
        `;

        banner.className =
            "capacity-plan-banner yellow-plan";

        couldSection.classList.add("deemphasised");
    }


    // GREEN — OPEN DAY

    else if (capacity === "Green") {

        banner.innerHTML = `
            <span class="plan-mode">Open Day</span>

            <strong>There's room to move things forward.</strong>

            <p>
                Use the capacity you have without borrowing from tomorrow.
            </p>
        `;

        banner.className =
            "capacity-plan-banner green-plan";
    }
displaySupportPlan(capacity);}

/* ---------- PLAN DATA ---------- */

let planTasks =
    JSON.parse(localStorage.getItem("planTasks")) || [];

    /* ---------- MIGRATE OLD TASKS ---------- */

let tasksWereUpdated = false;

planTasks.forEach(function(task) {

    if (!task.id) {
        task.id =
            Date.now() + Math.random();
        tasksWereUpdated = true;
    }

    if (!task.date) {
        task.date =
            getTodayDate();
        tasksWereUpdated = true;
    }

});

if (tasksWereUpdated) {

    localStorage.setItem(
        "planTasks",
        JSON.stringify(planTasks)
    );
}
/* ---------- GET TODAY'S DATE ---------- */

function getTodayDate() {

    return new Date().toLocaleDateString("en-CA");
}
/* ---------- ADD PLAN TASK ---------- */

function addPlanTask(category) {

    let input =
        document.getElementById(category + "Input");

    let taskText =
        input.value.trim();


    // Don't add blank tasks

    if (taskText === "") {
        return;
    }


    // Create the task

 let task = {
    id: Date.now(),
    text: taskText,
    date: getTodayDate(),
    category: category,
    completed: false
};


    // Add it to our plan

    planTasks.push(task);


    // Save

    savePlanTasks();


    // Redraw

    displayPlanTasks();


    // Clear the input

    input.value = "";
}


/* ---------- SAVE PLAN TASKS ---------- */

function savePlanTasks() {

    localStorage.setItem(
        "planTasks",
        JSON.stringify(planTasks)
    );
}


/* ---------- DISPLAY PLAN TASKS ---------- */

function displayPlanTasks() {

    let categories =
        ["must", "help", "could"];


    categories.forEach(function(category) {

        let list =
            document.getElementById(category + "List");


        // Clear the current list

        list.innerHTML = "";


        // Find tasks belonging to this category

       let today =
    getTodayDate();

let categoryTasks =
    planTasks.filter(function(task) {

        return (
            task.category === category &&
            task.date === today
        );

    });


        // Draw each task

        categoryTasks.forEach(function(task) {

            let item =
                document.createElement("li");

            item.classList.add("plan-task");


            // Checkbox

            let checkbox =
                document.createElement("button");

            checkbox.classList.add("task-checkbox");

            checkbox.textContent =
                task.completed ? "✓" : "";


            // Task text

            let text =
                document.createElement("span");

            text.textContent =
                task.text;


            // Completed appearance

            if (task.completed) {
                item.classList.add("completed");
            }


            // Clicking checkbox changes the Boolean

            checkbox.onclick = function() {

                task.completed =
                    !task.completed;

                savePlanTasks();

                displayPlanTasks();
            };


            // Build the row

            item.appendChild(checkbox);

            item.appendChild(text);

            list.appendChild(item);
        });
    });
}
/* ---------- DISPLAY WAITING TASKS ---------- */

function displayWaitingTasks() {

    let section =
        document.getElementById("waitingSection");

    let list =
        document.getElementById("waitingList");


    if (!section || !list) {
        return;
    }


    let today =
        getTodayDate();


    // Find today's tasks that haven't been classified yet

    let waitingTasks =
        planTasks.filter(function(task) {

            return (
                task.date === today &&
                task.category === null
            );

        });


    // Nothing waiting? Hide the whole section.

    if (waitingTasks.length === 0) {

        section.style.display = "none";

        return;
    }


    // We have something waiting

    section.style.display = "block";

    list.innerHTML = "";


    waitingTasks.forEach(function(task) {

        let item =
            document.createElement("div");

        item.classList.add("waiting-task");


        let text =
            document.createElement("span");

        text.classList.add("waiting-task-text");

        text.textContent =
            task.text;


        let choices =
            document.createElement("div");

        choices.classList.add("waiting-choices");


        // Must happen

        let mustButton =
            document.createElement("button");

        mustButton.textContent =
            "Must happen";

        mustButton.onclick = function() {
            classifyWaitingTask(task.id, "must");
        };


        // Would help

        let helpButton =
            document.createElement("button");

        helpButton.textContent =
            "Would help";

        helpButton.onclick = function() {
            classifyWaitingTask(task.id, "help");
        };


        // Could do

        let couldButton =
            document.createElement("button");

        couldButton.textContent =
            "Could do";

        couldButton.onclick = function() {
            classifyWaitingTask(task.id, "could");
        };


        // Not today

        let laterButton =
            document.createElement("button");

        laterButton.textContent =
            "Not today →";

        laterButton.classList.add("later-button");

        laterButton.onclick = function() {
            moveWaitingTask(task.id);
        };


        choices.appendChild(mustButton);
        choices.appendChild(helpButton);
        choices.appendChild(couldButton);
        choices.appendChild(laterButton);

        item.appendChild(text);
        item.appendChild(choices);

        list.appendChild(item);
    });
}
/* ---------- CLASSIFY WAITING TASK ---------- */

function classifyWaitingTask(taskId, category) {

    let task =
        planTasks.find(function(task) {

            return task.id === taskId;

        });


    if (!task) {
        return;
    }


    task.category =
        category;


    savePlanTasks();

    displayWaitingTasks();

    displayPlanTasks();
}
/* ---------- MOVE WAITING TASK ---------- */

function moveWaitingTask(taskId) {

    let choice =
        prompt(
            "When should this come back?\n\n" +
            "1 for Tomorrow\n" +
            "2 to Pick a date"
        );


    if (choice === null) {
        return;
    }


    // Tomorrow

    if (choice === "1") {

        let tomorrow =
            new Date();

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        moveTaskToDate(
            taskId,
            tomorrow.toLocaleDateString("en-CA")
        );

        return;
    }


    // Pick a date

    if (choice === "2") {

        let chosenDate =
            prompt("Enter a date as YYYY-MM-DD");


        if (chosenDate === null) {
            return;
        }


        chosenDate =
            chosenDate.trim();


        let datePattern =
            /^\d{4}-\d{2}-\d{2}$/;


        if (!datePattern.test(chosenDate)) {

            alert("Please use YYYY-MM-DD.");

            return;
        }


        moveTaskToDate(
            taskId,
            chosenDate
        );
    }
}
/* ---------- MOVE TASK TO DATE ---------- */

function moveTaskToDate(taskId, newDate) {

    let task =
        planTasks.find(function(task) {

            return task.id === taskId;

        });


    if (!task) {
        return;
    }


    task.date =
        newDate;

    task.category =
        null;


    savePlanTasks();

    displayWaitingTasks();

    displayPlanTasks();
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

            /* ----- PLAN BUTTON ----- */

let planButton =
    document.createElement("button");

planButton.textContent = "Plan →";

planButton.onclick = function() {
    processBrainDump(index);
};

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

    buttonContainer.appendChild(planButton);

buttonContainer.appendChild(editButton);

buttonContainer.appendChild(deleteButton);

        // Assemble the list item

        newItem.appendChild(thoughtText);

        newItem.appendChild(buttonContainer);


        // Add it to the screen

        list.appendChild(newItem);
    });
}
/* ---------- PROCESS BRAIN DUMP ---------- */

function processBrainDump(index) {

    let thought =
        brainDump[index];

    let choice =
        prompt(
            "When do you want to think about this again?\n\n" +
            "Type:\n" +
            "1 for Today\n" +
            "2 for Tomorrow\n" +
            "3 to Pick a date"
        );


    // Cancel = do absolutely nothing

    if (choice === null) {
        return;
    }


    // TODAY

    if (choice === "1") {

        chooseTodayCategory(index);

        return;
    }


    // TOMORROW

    if (choice === "2") {

        let tomorrow =
            new Date();

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        let tomorrowDate =
            tomorrow.toLocaleDateString("en-CA");

        scheduleBrainDumpItem(
            index,
            tomorrowDate
        );

        return;
    }


    // PICK A DATE

    if (choice === "3") {

        chooseBrainDumpDate(index);

        return;
    }
}
/* ---------- SCHEDULE BRAIN DUMP ITEM ---------- */

function scheduleBrainDumpItem(index, date) {

    let thought =
        brainDump[index];


    let task = {

        id: Date.now(),

        text: thought,

        date: date,

        category: null,

        completed: false
    };


    // Move it into the task store

    planTasks.push(task);

    savePlanTasks();


    // Remove it from Brain Dump

    brainDump.splice(index, 1);

    saveBrainDump();


    // Redraw Brain Dump

    displayBrainDump();
}
/* ---------- PICK BRAIN DUMP DATE ---------- */

function chooseBrainDumpDate(index) {

    let chosenDate =
        prompt(
            "Enter a date as YYYY-MM-DD"
        );


    // Cancel

    if (chosenDate === null) {
        return;
    }


    chosenDate =
        chosenDate.trim();


    // Basic date format check

    let datePattern =
        /^\d{4}-\d{2}-\d{2}$/;


    if (!datePattern.test(chosenDate)) {

        alert(
            "Please use YYYY-MM-DD."
        );

        return;
    }


    scheduleBrainDumpItem(
        index,
        chosenDate
    );
}
/* ---------- TODAY CATEGORY ---------- */

function chooseTodayCategory(index) {

    scheduleBrainDumpItem(
        index,
        getTodayDate()
    );

    displayWaitingTasks();
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
            item.addEventListener("click", function() {
    viewCheckIn(record);
});


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
/* ---------- VIEW SAVED CHECK-IN ---------- */

function viewCheckIn(record) {
viewingRecord = record;
    // Put the saved values back into our working data

    checkInData.capacity = record.capacity;
    checkInData.sleep = record.sleep;
    checkInData.energy = record.energy;
    checkInData.mood = record.mood;
    checkInData.focus = record.focus;
    checkInData.overwhelm = record.overwhelm;


    // Restore the capacity button

    selectCapacity(record.capacity);


    // Restore the five rating rows

    setRating("sleep", record.sleep);
    setRating("energy", record.energy);
    setRating("mood", record.mood);
    setRating("focus", record.focus);
    setRating("overwhelm", record.overwhelm);


    // Restore the note

    let noteBox =
        document.getElementById("checkinNote");

    noteBox.value =
        record.note || "";


    // Update the status message

    let message =
        document.getElementById("message");

    message.textContent =
        "Looking back at " +
        formatCheckInDate(record.date);
            document.getElementById("returnTodayButton").style.display =
        "block";


    // Scroll smoothly back to the check-in

    document.querySelector(".checkin-card").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}
/* ---------- RETURN TO TODAY ---------- */

function returnToToday() {

    // We are no longer viewing a historical record

    viewingRecord = null;


    // Find today's date

    let today =
        new Date().toLocaleDateString("en-CA");


    // Find today's saved check-in

    let todaysRecord =
        checkInHistory.find(function(record) {

            return record.date === today;

        });


    // If today has a saved check-in, restore it

    if (todaysRecord) {

        checkInData.capacity =
            todaysRecord.capacity;

        checkInData.sleep =
            todaysRecord.sleep;

        checkInData.energy =
            todaysRecord.energy;

        checkInData.mood =
            todaysRecord.mood;

        checkInData.focus =
            todaysRecord.focus;

        checkInData.overwhelm =
            todaysRecord.overwhelm;


        selectCapacity(
            todaysRecord.capacity
        );


        setRating(
            "sleep",
            todaysRecord.sleep
        );

        setRating(
            "energy",
            todaysRecord.energy
        );

        setRating(
            "mood",
            todaysRecord.mood
        );

        setRating(
            "focus",
            todaysRecord.focus
        );

        setRating(
            "overwhelm",
            todaysRecord.overwhelm
        );


        document.getElementById("checkinNote").value =
            todaysRecord.note || "";


        document.getElementById("message").textContent =
            "Today's check-in is saved ✓";
    }


    // Hide the return button

    document.getElementById("returnTodayButton").style.display =
        "none";


    // Scroll to the check-in

    document.querySelector(".checkin-card").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}
/* ========================================
   LOAD APP
   ======================================== */


// Display previously saved Brain Dump items
// when Chapter 5 opens.

displayBrainDump();
loadTodaysCheckIn();
displayCheckInHistory();
displayPlanTasks();
displayWaitingTasks();