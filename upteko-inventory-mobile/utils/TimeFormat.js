export const formatFirestoreTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);

    // Format the date and time
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    return `${hours}:${minutes} - ${day}/${month}/${year}`;
}
