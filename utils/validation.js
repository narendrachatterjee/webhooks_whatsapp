//import { stay_type } from "../src/data_exchange.js";
import { doubleRoom, privatePod, privateRoom } from "./countOfPodsAndRoom.js";
let validCheckin;
let validArrival;
let validCheckOut;

function isValidCheckin(checkinDate, currentDateIST) {
  // Convert checkinDate to IST
  checkinDate = new Date(
    new Date(checkinDate).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  // Extract the year, month, and day as a single value for comparison
  const checkinDateValue = new Date(
    checkinDate.getFullYear(),
    checkinDate.getMonth(),
    checkinDate.getDate()
  ).getTime();

  const currentDateValue = new Date(
    currentDateIST.getFullYear(),
    currentDateIST.getMonth(),
    currentDateIST.getDate()
  ).getTime();

  // Compare the two dates
  return checkinDateValue >= currentDateValue;
}

function isValidArrival(checkinDate, arrivalTime, currentDateIST) {
  if (validCheckin) {
    checkinDate = new Date(
      new Date(checkinDate).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );

    // Extract Date, Month, and Year from checkInDate
    const checkInDay = checkinDate.getDate();
    const checkInMonth = checkinDate.getMonth(); // Month is zero-based (0 = January)
    const checkInYear = checkinDate.getFullYear();

    // Extract Date, Month, Year, Hour from currentDate
    const currentDay = currentDateIST.getDate();
    const currentMonth = currentDateIST.getMonth();
    const currentYear = currentDateIST.getFullYear();
    const currentHour = currentDateIST.getHours();

    if (
      checkInYear == currentYear &&
      checkInMonth == currentMonth &&
      checkInDay == currentDay &&
      arrivalTime < currentHour
    ) {
      return false;
    }
    return true;
  }

  return false;
}

function isValidCheckOut(checkinDate, checkoutDate) {
  if (checkoutDate > checkinDate) return true;
  return false;
}

export const validateRoomCount = (totalAvailability, room_type) => {
  if (totalAvailability != undefined) {
    switch (room_type) {
      case "firstRoom":
        if (totalAvailability >= privatePod.length) return privatePod;
        else if (totalAvailability < privatePod.length) {
          return privatePod.slice(0, totalAvailability);
        }
      case "SecondRoom":
        if (totalAvailability >= privateRoom.length) return privateRoom;
        else if (totalAvailability < privateRoom.length) {
          return privateRoom.slice(0, totalAvailability);
        }
      case "ThirdRoom":
        if (totalAvailability >= doubleRoom.length) return doubleRoom;
        else if (totalAvailability < doubleRoom.length) {
          return doubleRoom.slice(0, totalAvailability);
        }
    }
  }
  return null;
};

export const validateStay = (data) => {
  // Get the current date in IST
  const currentDateIST = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  validCheckin = isValidCheckin(Number(data.check_in_date), currentDateIST);
  // Convert the checkinDate to a Date object and validate
  if (!validCheckin) {
    return {
      message: `Invalid Check In Date!! \n\n`,
      message1: `CheckIn Date should be greater or equal to ${currentDateIST.getDate()}-${
        currentDateIST.getMonth() + 1
      }-${currentDateIST.getFullYear()}`,
      status: true,
    };
  }

  validArrival = isValidArrival(
    Number(data.check_in_date),
    data.arrival_time,
    currentDateIST
  );
  if (!validArrival) {
    return {
      message: `Invalid Arrival Time!! \n\n`,
      message1: `Arrival Time for the ${currentDateIST.getDate()}-${
        currentDateIST.getMonth() + 1
      }-${currentDateIST.getFullYear()} should be greater than ${currentDateIST.getHours()}:${currentDateIST.getMinutes()}`,
      status: true,
    };
  }
  if (data.staytype === "nightstay") {
    validCheckOut = isValidCheckOut(
      Number(data.check_in_date),
      Number(data.check_out_date)
    );
    if (!validCheckOut) {
      return {
        message: `Invalid Check-Out Date!! \n\n`,
        message1: `Check-Out Date should be greater than Check-In Date`,
        status: true,
      };
    }
  }
  return false;
};

export const validGuestToRoomCount = (count_selection, total_guest) =>{
  if(count_selection != total_guest){
    return {
      message: `Invalid Pod Selection Count!! \n\n`,
      message1: `Selected Pod And Room's count should match. (please note if double pod room selected, make the count of guest as 2)`,
      status: true,
    };
  }
  else{
    return false;
  }
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com)$/;
  let check = emailRegex.test(email);
  if(!check){
    return {
      message: `Invalid Email Address!! \n\n`,
      message1: `Please use proper email address while filling the details)`,
      status: check,
    };
  }
  return check
}
