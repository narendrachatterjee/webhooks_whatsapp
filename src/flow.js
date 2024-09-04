// Import functions from utility files
import { arrival_time_, stay_duration } from "../utils/timeAndDuration.js";
import { guestCount } from "../utils/total_guest.js";
import { staytypes } from "../utils/typeOfStay.js";
import { locations } from "../utils/location.js";

// Assign variables from imported functions
let location_ = locations;
let staytype_ = staytypes;
let guestCount_ = guestCount;
let arrivalTime_ = arrival_time_;
// Define the SCREEN_RESPONSES object with the necessary data
export const SCREEN_RESPONSES = {
  DETAILS: {
    version: "4.0",
    screen: "DETAILS",
    data: {
      staytype: staytype_,
      location: location_
    },
  },
  Stay: {
    version: "4.0",
    screen: "Stay",
  },
  Error:{
    version: "4.0",
    screen: "Error",
  },
  Availability: {
    version: "4.0",
    screen: "Availability",
  },
  Personal_details: {
    version: "4.0",
    screen: "Personal_details",
  },
  Guest_details: {
    version: "4.0",
    screen: "Guest_details",
  },
  summary: {
    version: "4.0",
    screen: "summary",
  },
  completeBooking:{
    version: "4.0",
    screen: "completeBooking",
  }
};
