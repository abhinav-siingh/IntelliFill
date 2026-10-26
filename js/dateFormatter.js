/**
 * IntelliFill Date Formatter
 * Version: 1.0
 */

function formatDate(dateString, format = "YYYY-MM-DD") {

    if (!dateString) {
        return "";
    }

    // Split date (supports DD-MM-YYYY, DD/MM/YYYY)
    const parts = dateString.split(/[-/]/);

    if (parts.length !== 3) {
        return dateString;
    }

    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    const year = parts[2];

    switch (format) {

        case "DD-MM-YYYY":
            return `${day}-${month}-${year}`;

        case "DD/MM/YYYY":
            return `${day}/${month}/${year}`;

        case "YYYY-MM-DD":
            return `${year}-${month}-${day}`;

        case "YYYY/MM/DD":
            return `${year}/${month}/${day}`;

        case "MM/DD/YYYY":
            return `${month}/${day}/${year}`;

        default:
            return dateString;

    }

}