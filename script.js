const hikerName = "Alex";
const plannedHikes = Number("3");
const hasTrailMap = true;
let completedHikes = 1;

console.log("Trail Notes JavaScript started.");
console.log("Hiker name type:", typeof hikerName);
console.log("Planned hikes:", plannedHikes, "| Type:", typeof plannedHikes);
console.log("Has a downloaded trail map:", hasTrailMap);

if (hasTrailMap && plannedHikes > completedHikes) {
    console.log(`${hikerName} is ready for the next planned hike.`);
} else if (!hasTrailMap) {
    console.log(`${hikerName} should prepare a trail map before hiking.`);
} else {
    console.log(`${hikerName} has completed all planned hikes.`);
}

function describeParkVisit(parkName, trailMiles) {
    return `A ${trailMiles}-mile hike is planned at ${parkName}.`;
}

console.log(describeParkVisit("Yellowstone", 2));
console.log(describeParkVisit("Acadia", 4));

const featuredParks = [
    {
        name: "Yellowstone",
        knownFor: "Geysers and wildlife",
        activity: "Scenic walks"
    },
    {
        name: "Grand Canyon",
        knownFor: "Deep canyon views",
        activity: "Rim hiking"
    },
    {
        name: "Acadia",
        knownFor: "Coastline and forests",
        activity: "Mountain trails"
    }
];

console.log("First featured park:", featuredParks[0].name);
console.log("First park activity:", featuredParks[0].activity);

for (const park of featuredParks) {
    console.log(`${park.name}: ${park.knownFor}; try ${park.activity}.`);
}

console.log("Completed hikes before using the planner:", completedHikes);

const checklistTitle = document.querySelector("#checklist-title");
const checklistIntro = document.querySelector("#checklist-intro");
const packingList = document.querySelector("#packing-list");
const hikeStatus = document.querySelector("#hike-status");
const completeHikeButton = document.querySelector("#complete-hike");
const trailForm = document.querySelector("#trail-form");
const trailNameInput = document.querySelector("#trail-name");
const trailFeedback = document.querySelector("#trail-feedback");
const plannedTrails = document.querySelector("#planned-trails");
const originalChecklistIntro = checklistIntro.textContent;

console.log(`${checklistTitle.textContent} includes ${packingList.children.length} items.`);

completeHikeButton.addEventListener("click", () => {
    const isComplete = completeHikeButton.dataset.completed !== "true";
    completeHikeButton.dataset.completed = String(isComplete);
    completeHikeButton.setAttribute("aria-pressed", String(isComplete));
    completeHikeButton.textContent = isComplete ? "Undo completed hike" : "Mark a hike complete";
    hikeStatus.classList.toggle("is-complete", isComplete);
    hikeStatus.dataset.state = isComplete ? "complete" : "ready";

    if (isComplete) {
        completedHikes += 1;
        hikeStatus.textContent = `Hike complete. You have completed ${completedHikes} of ${plannedHikes} planned hikes.`;
        checklistIntro.textContent = "Nice work. Keep using the checklist to prepare for your next trail.";
    } else {
        completedHikes -= 1;
        hikeStatus.textContent = "Hike completion undone. Mark it complete when you are ready.";
        checklistIntro.textContent = originalChecklistIntro;
    }

    console.log(hikeStatus.textContent);
});

trailForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const trailName = trailNameInput.value.trim();

    if (!trailName) {
        trailNameInput.focus();
        return;
    }

    const duplicateTrail = [...plannedTrails.querySelectorAll("[data-trail-name]")]
        .some((trail) => trail.dataset.trailName.toLowerCase() === trailName.toLowerCase());

    if (duplicateTrail) {
        trailFeedback.textContent = `${trailName} is already on your trail list.`;
        console.log("Skipped duplicate trail:", trailName);
        return;
    }

    const trailItem = document.createElement("li");
    trailItem.textContent = trailName;
    trailItem.dataset.trailName = trailName;
    trailItem.classList.add("is-planned");
    plannedTrails.append(trailItem);
    trailFeedback.textContent = `Added ${trailName} to your trail ideas.`;
    trailNameInput.value = "";
    console.log("Added trail idea:", trailItem.dataset.trailName);
});