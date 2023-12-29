import type { Business } from "../include/data.js";

export class FluentBusinesses {
  private data: Business[];

  constructor(data: Business[]) {
    this.data = data;
  }

  getData(): Business[] {
    return this.data;
  }
  
  hasProperty(business: Business, key: keyof Business) {
    return business[key] !== undefined;
  }

  fromCityInState(city: string, state: string): FluentBusinesses {
    const newData = this.data.filter(curObj => {
      return (
        this.hasProperty(curObj, "city") &&
        this.hasProperty(curObj, "state") &&
        curObj.city === city &&
        curObj.state === state
      );
    });
    return new FluentBusinesses(newData);
  }

  hasStarsGeq(stars: number): FluentBusinesses {
    const newData = this.data.filter(curObj => {
      return this.hasProperty(curObj, "stars") && curObj.stars! >= stars;
    });
    return new FluentBusinesses(newData);
  }

  inCategory(category: string): FluentBusinesses {
    const newData = this.data.filter(curObj => {
      return this.hasProperty(curObj, "categories") && curObj.categories!.some(curr => curr === category);
    });
    return new FluentBusinesses(newData);
  }

  hasHoursOnDays(days: string[]): FluentBusinesses {
    const newData = this.data.filter(curObj => {
      return (
        this.hasProperty(curObj, "hours") &&
        days.every(curDay => {
          return curObj.hours![curDay] !== undefined;
        })
      );
    });
    return new FluentBusinesses(newData);
  }

  hasAmbience(ambience: string): FluentBusinesses {
    const newData = this.data.filter(curObj => {
      if (this.hasProperty(curObj, "attributes") && curObj.attributes!.Ambience !== undefined) {
        return curObj.attributes!.Ambience[ambience];
      } else {
        return false;
      }
    });
    return new FluentBusinesses(newData);
  }

  bestPlace(): Business | undefined {
    if (this.data.length === 0) return undefined;
    const highestStars = this.highestCount(this.data, "stars");
    const busWithHighestStars = this.businessesWithCount(this.data, "stars", highestStars);

    if (busWithHighestStars.length === 1) {
      return busWithHighestStars[0];
    }
    if (busWithHighestStars.length === 0) {
      return undefined;
    }
    const highestNumOfReviews = this.highestCount(busWithHighestStars, "review_count");
    if (highestNumOfReviews === 0) {
      return busWithHighestStars[0];
    }
    const best = this.businessesWithCount(busWithHighestStars, "review_count", highestNumOfReviews);
    return best[0];
  }

  mostReviews(): Business | undefined {
    if (this.data.length === 0) return undefined;
    const highestReviews = this.highestCount(this.data, "review_count");
    const busWithHighestReviews = this.businessesWithCount(this.data, "review_count", highestReviews);
    if (busWithHighestReviews.length === 1) {
      return busWithHighestReviews[0];
    }
    if (busWithHighestReviews.length === 0) {
      return undefined;
    }
    const highestNumOfStars = this.highestCount(busWithHighestReviews, "stars");
    if (highestNumOfStars === 0) {
      return busWithHighestReviews[0];
    }
    const most = this.businessesWithCount(busWithHighestReviews, "stars", highestNumOfStars);
    return most[0];
  }

  //takes array of business objects and key -> returns the highest number associated with that key
  highestCount(arr: Business[], key: keyof Business): number {
    return arr.reduce((acc: any, curObj) => {
      if (this.hasProperty(curObj, key) && curObj[key]! > acc) {
        return curObj[key]!;
      } else {
        return acc;
      }
    }, 0);
  }

  //takes array of businesses, key, and count -> returns array with businesses with that count
  businessesWithCount(arr: Business[], key: keyof Business, count: number) {
    return this.data.filter(curObj => {
      return this.hasProperty(curObj, key) && curObj[key]! === count;
    });
  }
}