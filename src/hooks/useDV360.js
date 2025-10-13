import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

export default function useDV360Data(db) {
  const [data, setData] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [insertionOrders, setInsertionOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAndMergeData() {
      try {
        // ✅ 1. Fetch from all THREE collections at the same time
        const dv360Promise = getDocs(collection(db, "DV_360_OCT"));
        const lineItemPromise = getDocs(collection(db, "Line_Item_data"));
        const dailyDataPromise = getDocs(collection(db, "Daily_Data_OCT")); // Updated promise name for clarity

        const [dv360Snap, lineItemSnap, dailyDataSnap] = await Promise.all([
          dv360Promise,
          lineItemPromise,
          dailyDataPromise,
        ]);

        // Create a lookup map for Line Items
        const lineItemsMap = new Map();
        lineItemSnap.forEach((doc) => {
          const lineItem = { id: doc.id, ...doc.data() };
          const ioName = lineItem.insertion_order;
          if (!lineItemsMap.has(ioName)) {
            lineItemsMap.set(ioName, []);
          }
          lineItemsMap.get(ioName).push(lineItem);
        });

        // ✅ 2. Create a lookup map for the Daily Data (Spend and Impressions)
        const dailyDataMap = new Map();
        dailyDataSnap.forEach((doc) => {
          const dailyDocData = doc.data();
          // Store an object with both revenue and impressions
          dailyDataMap.set(dailyDocData.insertion_order, {
            revenue: dailyDocData.revenue || 0,
            daily_impression: dailyDocData.daily_impression || 0,
          });
        });

        const rows = [];
        const campaignList = [];
        const insertionList = [];

        dv360Snap.forEach((d) => {
          const row = { id: d.id, ...d.data() };

          // Attach matching line items
          row.lineItems = lineItemsMap.get(row.insertion_order) || [];

          // ✅ 3. Attach the matching daily spend and impression values
          const dailyMetrics = dailyDataMap.get(row.insertion_order) || { revenue: 0, daily_impression: 0 };
          row.dailySpend = dailyMetrics.revenue;
          row.dailyImpressions = dailyMetrics.daily_impression; // New field added here

          rows.push(row);

          if (row.campaign) campaignList.push(row.campaign);
          if (row.insertion_order) insertionList.push(row.insertion_order);
        });

        const campCount = campaignList.reduce((a, c) => ({ ...a, [c]: (a[c] || 0) + 1 }), {});
        const insCount = insertionList.reduce((a, c) => ({ ...a, [c]: (a[c] || 0) + 1 }), {});

        setCampaigns(Object.keys(campCount).map((name) => ({ name, count: campCount[name] })));
        setInsertionOrders(Object.keys(insCount).map((name) => ({ name, count: insCount[name] })));
        setData(rows);
        setData(rows);

      } catch (e) {
        setError("Error fetching or merging data: " + e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAndMergeData();
  }, [db]);

  return { data, campaigns, insertionOrders, loading, error };
}