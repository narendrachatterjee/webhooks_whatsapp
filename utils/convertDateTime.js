export const convertTimestampToDate = (timestamp, arrivalTime, stayDuration) => {
    // Create a Date object from the timestamp and convert it to IST
    const date = new Date(timestamp).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const dateObj = new Date(date);
    
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const year = dateObj.getFullYear();

    // Format the arrival time to "HH:00:00"
    const formattedArrivalTime = String(arrivalTime).padStart(2, '0') + ":00:00";

    // Initialize the result with the date and arrival time
    let result = `${day}-${month}-${year} ${formattedArrivalTime}`;

    // If stayDuration is provided, add it to the result
    if (stayDuration !== undefined) {
        // Create a new Date object using the correct format for parsing
        const newDateObj = new Date(`${year}-${month}-${day}T${formattedArrivalTime}`);
        newDateObj.setHours(newDateObj.getHours() + parseInt(stayDuration));
        
        // Format the updated date with the added stayDuration
        const updatedDay = String(newDateObj.getDate()).padStart(2, '0');
        const updatedMonth = String(newDateObj.getMonth() + 1).padStart(2, '0');
        const updatedYear = newDateObj.getFullYear();
        const updatedHours = String(newDateObj.getHours()).padStart(2, '0');
        
        result = `${updatedDay}-${updatedMonth}-${updatedYear} ${updatedHours}:00:00`;
    }

    // Return the final formatted result
    return result;
};
