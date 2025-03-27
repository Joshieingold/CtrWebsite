import { endOfWeek, format, startOfWeek, eachDayOfInterval, isWithinInterval } from "date-fns";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "./firebase"; // Firestore instance


/**
 * Fetches CTR reports for the given ctrId within the current week (Monday–Friday).
 * @param {string} ctrId - The CTR ID (e.g., "8019").
 * @returns {Promise<Object>} - Reports indexed by date.
**/

export const fetchCTRReportsForWeek = async (ctrId, startDate, endDate) => {
  try {
    if (!ctrId || !startDate || !endDate) {
      console.error("Invalid parameters: ctrId, startDate, and endDate are required.");
      return {};
    }

    // Convert startDate and endDate to Date objects, in case they are passed as strings
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Reference Firestore collection
    const reportsRef = collection(db, "CTR-Reports");

    // Firestore query to fetch reports between the start and end dates
    const q = query(
      reportsRef,
      where("ctrId", "==", ctrId),
      where("dateSubmitted", ">=", start),
      where("dateSubmitted", "<=", end)
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
export const fetchCTRReports = async (ctrId) => {
  try {
    if (!ctrId) {
      console.error("Invalid CTR ID");
      return null;
    }

    const reportsRef = collection(db, "CTR-Reports");

    const q = query(
      reportsRef,
      where("ctrID", "==", ctrId), // Ensure field name matches Firestore
      orderBy("dateSubmitted", "desc"),
      limit(2)
    );

    const querySnapshot = await getDocs(q);

    console.log("Number of reports found:", querySnapshot.docs.length);

    if (querySnapshot.docs.length < 2) {
      console.warn("Not enough reports found.");
      return null;
    }

    // Return full report objects
    return {
      todayReport: querySnapshot.docs[0].data(),
      priorReport: querySnapshot.docs[1].data(),
    };
  } catch (error) {
    console.error("Error fetching CTR reports:", error);
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
export const GetAllCTRReports = async (ctrId) => {
  try {
    if (!ctrId) {
      console.error("Invalid CTR ID");
      return [];
    }

    // Reference Firestore collection
    const reportsRef = collection(db, "CTR-Reports");

    // Query for the first and last report
    const firstReportQuery = query(
      reportsRef,
      where("ctrId", "==", ctrId),
      orderBy("dateSubmitted", "asc"),
      limit(1)
    );
    const lastReportQuery = query(
      reportsRef,
      where("ctrId", "==", ctrId),
      orderBy("dateSubmitted", "desc"),
      limit(1)
    );

    const [firstReportSnapshot, lastReportSnapshot] = await Promise.all([
      getDocs(firstReportQuery),
      getDocs(lastReportQuery),
    ]);

    if (firstReportSnapshot.empty || lastReportSnapshot.empty) {
      console.log("No reports found for CTR ID:", ctrId);
      return [];
    }

    const firstReport = firstReportSnapshot.docs[0].data();
    const lastReport = lastReportSnapshot.docs[0].data();

    // Determine the start and end dates
    const startDate = firstReport.dateSubmitted.toDate();
    const endDate = lastReport.dateSubmitted.toDate();

    // Generate a sequence of dates for each day within the interval
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });
    const reports = [];


    // Iterate through each day and create a report
    for (const date of allDates) {
      const dayStart = startOfWeek(date, { weekStartsOn: 1 });
      const dayEnd = endOfWeek(date, { weekStartsOn: 1 });
      // Check if the current date falls within a weekday (Monday-Friday)
      if (isWithinInterval(date, { start: dayStart, end: dayEnd })) {
        const report = {
          ctrId: ctrId,
          dateSubmitted: date,
          dateString: format(date, "yyyy-MM-dd"),
          data: {},
        };
        reports.push(report);
      }
    }
    
    return reports;
  } catch (error) {
    console.error("Error fetching all CTR reports:", error);
    return [];
  }

}