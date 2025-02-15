import { endOfWeek, format, startOfWeek } from "date-fns";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase"; // Firestore instance

/**
 * Fetches CTR reports for the given ctrId within the current week (Monday–Friday).
 * @param {string} ctrId - The CTR ID (e.g., "8019").
 * @returns {Promise<Object>} - Reports indexed by date.
 */
export const fetchCTRReportsForWeek = async (ctrId) => {
  try {
    if (!ctrId) {
      console.error("Invalid CTR ID");
      return;
    }

    // Get the start and end of the current week
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

    // Reference Firestore collection
    const reportsRef = collection(db, "CTR-Reports");

    // Convert weekStart and weekEnd to Firestore Timestamp format
    const weekStartTimestamp = new Date(weekStart).getTime();
    const weekEndTimestamp = new Date(weekEnd).getTime();

    const q = query(
      reportsRef,
      where("ctrId", "==", ctrId),
      where("dateSubmitted", ">=", weekStart),
      where("dateSubmitted", "<=", weekEnd)
    );

    // Fetch data from Firestore
    const querySnapshot = await getDocs(q);
    let reports = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const dateStr = format(data.dateSubmitted.toDate(), "yyyy-MM-dd"); // Format date for indexing
      reports[dateStr] = data;
      
    });

    return reports;
  } catch (error) {
    console.error("Error fetching CTR reports:", error);
    
    return {};
  }
};
