import { endOfWeek, format, startOfWeek } from "date-fns";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
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
export const fetchLatestCTRReport = async (ctrId) => {
  try {
    if (!ctrId) {
      console.error("Invalid CTR ID");
      return null;
    }

    // Reference Firestore collection
    const reportsRef = collection(db, "CTR-Reports");

    // Query for the most recent report, ordered by dateSubmitted descending
    const q = query(
      reportsRef,
      where("ctrId", "==", ctrId),
      orderBy("dateSubmitted", "desc"),
      limit(1)
    );

    // Fetch data from Firestore
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching latest CTR report:", error);
    return null;
  }
};
export const fetchPriorCTRReport = async (ctrId) => {
  try {
    if (!ctrId) {
      console.error("Invalid CTR ID");
      return null;
    }

    // Reference Firestore collection
    const reportsRef = collection(db, "CTR-Reports");

    // Query for the most recent report, ordered by dateSubmitted descending
    const q = query(
      reportsRef,
      where("ctrId", "==", ctrId),
      orderBy("dateSubmitted", "desc"),
      limit(2)
    );

    // Fetch data from Firestore
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[1].data();
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching latest CTR report:", error);
    return null;
  }
};
export const FetchCTRDetails = async (ctrId) => {
  try {
    if (!ctrId) {
      console.error("Invalid CTR ID");
      return null;
    }
    const descriptionRef = collection(db, "CTR-Inventories");

    // Query for the most recent report, ordered by dateSubmitted descending
    const q = query(
      descriptionRef,
      where("ctrId", "==", ctrId),
      limit(2)
    );

    // Fetch data from Firestore
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    
    return null;
  }
  catch (error) {
    console.error("Error fetching CTR Description", error);
    return null;
  }
}