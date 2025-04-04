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


    if (querySnapshot.docs.length < 2) {
      return null;
    }

    // Return full report objects
    return {
      todayReport: querySnapshot.docs[0].data(),
      priorReport: querySnapshot.docs[1].data(),
    };
  } catch (error) {
    return null;
  }
};
export const fetchDeviceQuantityData = async () => {
  try {
    const deliveryRef = collection(db, "DeliveryTracker");
    const querySnapshot = await getDocs(deliveryRef);

    if (querySnapshot.empty) {
      console.warn("⚠️ No delivery data found.");
      return {};
    }

    const excludedNames = [
      "1318 Grand Lake Rd", "35 Rue Court", "454 KING GEORGE HWY",
      "55 Expansion Ave", "875 Bayside Drive Unit 3", "70 Assomption Bvd.",
      "1318 Grand Lake Road", "70 Assomption Blvd", "Acadian Peninsula (Caraquet)",
      "454 King George Hwy", "70 Assomption blvd", "106 Whalen Street",
      "2978 Rte 132", "875 Bayside Drive", "EDI Inc", "TRAN NF1_Newfoundland Warehouse",
      "Virtual Location", "1595 North Service Rd E CTDI", "MICHAEL BARNED", "246 Church St"
    ];

    let techOrders = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const techName = data.TechName?.trim() || "Unknown";
      const location = data.Location?.trim() || "Misc";

      // **Exclude specific TechNames**
      if (excludedNames.includes(techName)) return;

      if (!data.Devices || typeof data.Devices !== "object") return;

      // Sum up total devices
      const totalDevices = Object.values(data.Devices)
        .reduce((sum, qty) => sum + (Number(qty) || 0), 0);

      if (!techOrders[techName]) {
        techOrders[techName] = { TotalDevices: 0, Location: location };
      }

      techOrders[techName].TotalDevices += totalDevices;
    });

    return techOrders;
  } catch (error) {
    return {};
  }
};





export const fetchDeliveryTrackerData = async () => {
  try {
    const deliveryRef = collection(db, "DeliveryTracker");
    const querySnapshot = await getDocs(deliveryRef);

    if (querySnapshot.empty) {
      return null;
    }

    let techOrders = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const techName = data.TechName || "Unknown";
      const location = data.Location || "Misc"; // Default to Misc if missing

      if (!techOrders[techName]) {
        techOrders[techName] = {
          TotalOrders: 0,
          Location: location, // Store location for filtering
        };
      }

      techOrders[techName].TotalOrders += 1;
    });

    return techOrders;
  } catch (error) {
    return null;
  }
};
export const fetchWaybillData = async () => {
  try {
    const deliveryRef = collection(db, "DeliveryTracker");
    const querySnapshot = await getDocs(deliveryRef);

    if (querySnapshot.empty) {
      console.warn("⚠️ No delivery data found.");
      return [];
    }

    const excludedNames = [
      "1318 Grand Lake Rd", "35 Rue Court", "454 KING GEORGE HWY",
      "55 Expansion Ave", "875 Bayside Drive Unit 3", "70 Assomption Bvd.",
      "1318 Grand Lake Road", "70 Assomption Blvd", "Acadian Peninsula (Caraquet)",
      "454 King George Hwy", "70 Assomption blvd", "106 Whalen Street",
      "2978 Rte 132", "875 Bayside Drive", "EDI Inc", "TRAN NF1_Newfoundland Warehouse",
      "Virtual Location", "1595 North Service Rd E CTDI", "MICHAEL BARNED", "246 Church St"
    ];

    let waybillData = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const techName = data.TechName?.trim() || "Unknown";
      const location = data.Location?.trim() || "Misc";
      const waybill = data.Waybill; // Getting Waybill for grouping
      const boxes = data.Boxes; // Total number of boxes
      const weight = data.Weight; // Total weight for the waybill

      // Exclude specific TechNames
      if (excludedNames.includes(techName)) return;

      if (!waybill || !boxes || !weight) return;

      // Initialize waybill entry if it doesn't exist
      if (!waybillData[waybill]) {
        waybillData[waybill] = { totalWeight: 0, totalBoxes: 0 };
      }

      // Add the values for the current waybill
      waybillData[waybill].totalWeight += weight;
      waybillData[waybill].totalBoxes += boxes;
    });

    console.log("🔍 Fetched Waybill Data (Grouped):", waybillData);

    // Convert the grouped waybill data into a Treemap-friendly format
    const treemapData = Object.keys(waybillData).map((waybill) => ({
      name: waybill,
      size: waybillData[waybill].totalBoxes,  // Using Boxes as size
      totalWeight: waybillData[waybill].totalWeight,  // Display weight in tooltip
    }));

    return treemapData;
  } catch (error) {
    console.error("❌ Error fetching delivery tracker data:", error);
    return [];
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