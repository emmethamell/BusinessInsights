import assert from "assert";
import { Business } from "../include/data.js";
import { FluentBusinesses } from "./FluentBusinesses";

const testData: Business[] = [
  {
    business_id: "abcd",
    name: "Applebee's",
    city: "Charlotte",
    state: "NC",
    stars: 4,
    review_count: 6,
    categories: ["American"],
    hours: {
      Monday: "8:0-18:30",
      Wednesday: "8:0-17:40",
      Friday: "8:0-17:40",
    },
    attributes: {
      Ambience: {
        Loud: false,
        Music: false,
        Busy: true,
      },
    },
  },
  {
    business_id: "abcd",
    name: "China Garden",
    state: "NC",
    city: "Charlotte",
    stars: 4,
    review_count: 10,
    categories: ["Asian", "Italian"],
    hours: {
      Monday: "8:0-18:30",
      Tuesday: "8:0-17:40",
      Wednesday: "8:0-17:40",
    },
    attributes: {
      Ambience: {
        Loud: false,
        Music: true,
        Busy: true,
      },
    },
  },
  {
    business_id: "abcd",
    name: "Beach Ventures Roofing",
    state: "AZ",
    city: "Phoenix",
    stars: 3,
    review_count: 30,
    hours: {
      Monday: "8:0-18:30",
      Tuesday: "8:0-17:40",
      Wednesday: "8:0-17:40",
      Thursday: "8:0-18:30",
    },
  },
  {
    business_id: "abcd",
    name: "Alpaul Automobile Wash",
    city: "Charlotte",
    state: "NC",
    stars: 3,
    review_count: 30,
    categories: ["Italian", "American"],
  },
];

describe("fromCityInState", () => {
  it("filters correctly", () => {
    const list = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").getData();

    assert(list.length === 3);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
    assert(list[2].name === "Alpaul Automobile Wash");
  });
});

describe("hasStarsGeq", () => {
  it("filters correctly", () => {
    const list = new FluentBusinesses(testData).hasStarsGeq(4).getData();
    assert(list.length === 2);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
  });
});

describe("inCategory", () => {
  it("filters correctly", () => {
    const list = new FluentBusinesses(testData).inCategory("American").getData();

    assert(list.length === 2);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "Alpaul Automobile Wash");
  });
});

describe("hasHoursOnDays", () => {
  it("filters correctly", () => {
    const list = new FluentBusinesses(testData).hasHoursOnDays(["Monday", "Tuesday", "Wednesday"]).getData();
    assert(list.length === 2);
    assert(list[0].name === "China Garden");
    assert(list[1].name === "Beach Ventures Roofing");
  });
});

describe("hasAmbience", () => {
  it("filters correctly", () => {
    const list = new FluentBusinesses(testData).hasAmbience("Music").getData();

    assert(list.length === 1);
    assert(list[0].name === "China Garden");
  });
});

describe("bestPlace", () => {
  it("break tie with review count", () => {
    const best = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").bestPlace();

    assert(best);
    assert(best.name === "China Garden");
  });
});

describe("mostReviews", () => {
  it("breaks tie by for both by return the first", () => {
    const most = new FluentBusinesses(testData).mostReviews();
    assert(most);
    assert(most.name === "Beach Ventures Roofing");
  });
});
