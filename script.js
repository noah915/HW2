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

completedHikes += 1;
console.log("Completed hikes after today's trail:", completedHikes);