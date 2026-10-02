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
const hikeRequestForm = document.querySelector("#hike-request-form");
const hikeRequestFields = {
    name: document.querySelector("#hiker-name"),
    email: document.querySelector("#hiker-email"),
    park: document.querySelector("#hike-park"),
    date: document.querySelector("#hike-date"),
    miles: document.querySelector("#hike-miles"),
    experience: document.querySelector("#hiking-experience")
};
const hikeRequestErrors = {
    name: document.querySelector("#hiker-name-error"),
    email: document.querySelector("#hiker-email-error"),
    park: document.querySelector("#hike-park-error"),
    date: document.querySelector("#hike-date-error"),
    miles: document.querySelector("#hike-miles-error"),
    experience: document.querySelector("#hiking-experience-error")
};
const hikeRequestFeedback = document.querySelector("#hike-request-feedback");
const postFeedStatus = document.querySelector("#post-feed-status");
const postFeedList = document.querySelector("#post-feed-list");
const trailPostForm = document.querySelector("#trail-post-form");
const postTitleInput = document.querySelector("#post-title");
const postBodyInput = document.querySelector("#post-body");
const postSubmitButton = document.querySelector("#post-submit-button");
const postSubmitFeedback = document.querySelector("#post-submit-feedback");
const postResponse = document.querySelector("#post-response");
const originalChecklistIntro = checklistIntro.textContent;
const allowedParks = new Set(featuredParks.map((park) => park.name));
const postsEndpoint = "https://jsonplaceholder.typicode.com/posts";

function getLocalDateString(date = new Date()) {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 10);
}

hikeRequestFields.date.min = getLocalDateString();

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

function readHikeRequest() {
    const milesValue = hikeRequestFields.miles.value.trim();

    return {
        name: hikeRequestFields.name.value.trim(),
        email: hikeRequestFields.email.value.trim(),
        park: hikeRequestFields.park.value,
        date: hikeRequestFields.date.value,
        miles: milesValue === "" ? null : Number(milesValue),
        experience: hikeRequestFields.experience.value
    };
}

function validateHikeRequest(values) {
    const errors = {};
    const experienceDistanceLimits = {
        beginner: 5,
        intermediate: 10,
        experienced: 15
    };

    if (!values.name) {
        errors.name = "Enter your name.";
    } else if (values.name.length > 60) {
        errors.name = "Use 60 characters or fewer.";
    }

    if (!values.email) {
        errors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Enter an email address in a valid format.";
    }

    if (!values.park) {
        errors.park = "Choose a featured park.";
    } else if (!allowedParks.has(values.park)) {
        errors.park = "Choose one of the featured parks.";
    }

    if (!values.date) {
        errors.date = "Choose a date for your hike.";
    } else if (Number.isNaN(new Date(`${values.date}T00:00:00`).getTime())) {
        errors.date = "Enter a valid hike date.";
    } else if (values.date < getLocalDateString()) {
        errors.date = "Choose today or a future date.";
    }

    if (values.miles === null || !Number.isFinite(values.miles)) {
        errors.miles = "Enter a planned distance.";
    } else if (values.miles < 0.5 || values.miles > 15) {
        errors.miles = "Choose a distance from 0.5 to 15 miles.";
    }

    if (!values.experience) {
        errors.experience = "Choose your hiking experience.";
    } else if (!experienceDistanceLimits[values.experience]) {
        errors.experience = "Choose a listed experience level.";
    } else if (Number.isFinite(values.miles) && values.miles > experienceDistanceLimits[values.experience]) {
        errors.miles = `For a ${values.experience} hiker, choose no more than ${experienceDistanceLimits[values.experience]} miles.`;
    }

    return errors;
}

function displayHikeRequestErrors(errors, fieldNames = Object.keys(hikeRequestFields)) {
    for (const fieldName of fieldNames) {
        const message = errors[fieldName] || "";
        hikeRequestErrors[fieldName].textContent = message;
        hikeRequestFields[fieldName].setAttribute("aria-invalid", String(Boolean(message)));
    }
}

function handleHikeRequestEdit(event) {
    const fieldName = event.target.name;
    if (!Object.hasOwn(hikeRequestFields, fieldName)) {
        return;
    }

    const values = readHikeRequest();
    const errors = validateHikeRequest(values);
    const fieldsToUpdate = fieldName === "experience" ? ["experience", "miles"] : [fieldName];
    displayHikeRequestErrors(errors, fieldsToUpdate);
    hikeRequestFeedback.textContent = "";
    hikeRequestFeedback.classList.remove("is-success");
}

hikeRequestForm.addEventListener("input", handleHikeRequestEdit);
hikeRequestForm.addEventListener("change", handleHikeRequestEdit);

hikeRequestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    hikeRequestFeedback.textContent = "";
    hikeRequestFeedback.classList.remove("is-success");

    const values = readHikeRequest();
    const errors = validateHikeRequest(values);
    displayHikeRequestErrors(errors);

    const firstInvalidField = Object.keys(errors)[0];
    if (firstInvalidField) {
        hikeRequestFeedback.textContent = "Please correct the highlighted fields to create your hike plan.";
        hikeRequestFields[firstInvalidField].focus();
        return;
    }

    const hikeRequest = {
        name: values.name,
        email: values.email.toLowerCase(),
        park: values.park,
        date: values.date,
        miles: values.miles,
        experience: values.experience
    };

    console.log("Hike plan request:", hikeRequest);
    hikeRequestFeedback.classList.add("is-success");
    hikeRequestFeedback.textContent = `Hike plan created for ${hikeRequest.name}: ${hikeRequest.miles} miles at ${hikeRequest.park} on ${hikeRequest.date}.`;
});

function createPostCard(post) {
    const article = document.createElement("article");
    article.classList.add("post-card");

    const recordLabel = document.createElement("p");
    recordLabel.classList.add("post-record-label");
    recordLabel.textContent = `JSONPlaceholder record #${post.id}`;

    const title = document.createElement("h3");
    title.textContent = post.title;

    const body = document.createElement("p");
    body.textContent = post.body;

    article.append(recordLabel, title, body);
    return article;
}

function renderPostList(posts) {
    const postItems = posts.map((post) => {
        const listItem = document.createElement("li");
        listItem.append(createPostCard(post));
        return listItem;
    });

    postFeedList.replaceChildren(...postItems);
}

async function loadTrailNotes() {
    postFeedStatus.textContent = "Loading sample trail notes...";
    postFeedList.replaceChildren();

    try {
        const response = await fetch(`${postsEndpoint}?_limit=5`);
        if (!response.ok) {
            throw new Error(`Trail notes request failed with status ${response.status}.`);
        }

        const posts = await response.json();
        if (!Array.isArray(posts)) {
            throw new Error("Trail notes response was not a list.");
        }

        renderPostList(posts);
        postFeedStatus.textContent = `Loaded ${posts.length} sample trail notes from JSONPlaceholder.`;
    } catch (error) {
        console.error("Could not load sample trail notes:", error);
        postFeedStatus.textContent = "Sample trail notes are unavailable right now. Please try again later.";
    }
}

trailPostForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    postSubmitFeedback.textContent = "";
    postResponse.replaceChildren();

    const payload = {
        title: postTitleInput.value.trim(),
        body: postBodyInput.value.trim(),
        userId: 1
    };

    if (!payload.title || !payload.body) {
        postSubmitFeedback.textContent = "Add a title and a trail update before submitting.";
        (!payload.title ? postTitleInput : postBodyInput).focus();
        return;
    }

    postSubmitButton.disabled = true;
    postSubmitFeedback.textContent = "Sending your trail note...";

    try {
        const response = await fetch(postsEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error(`Trail note request failed with status ${response.status}.`);
        }

        const createdPost = await response.json();
        if (!createdPost || !Number.isInteger(createdPost.id)) {
            throw new Error("Trail note response did not include a record ID.");
        }

        console.log("JSONPlaceholder POST response:", createdPost);
        postResponse.replaceChildren(createPostCard(createdPost));
        postSubmitFeedback.textContent = `JSONPlaceholder returned simulated record #${createdPost.id}.`;
        trailPostForm.reset();
    } catch (error) {
        console.error("Could not submit trail note:", error);
        postSubmitFeedback.textContent = "Your trail note could not be submitted. Please try again.";
    } finally {
        postSubmitButton.disabled = false;
    }
});

loadTrailNotes();