import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

export default function useDV360Data(db) {
  const [data, setData] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [insertionOrders, setInsertionOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const snap = await getDocs(collection(db, "DV_360Full"));
        const rows = [];
        const campaignList = [];
        const insertionList = [];

        snap.forEach((d) => {
          const row = { id: d.id, ...d.data() };
          rows.push(row);

          if (row.campaign) campaignList.push(row.campaign);
          if (row.insertion_order) insertionList.push(row.insertion_order);
        });

        // counts for dropdowns
        const campCount = campaignList.reduce((a, c) => ({ ...a, [c]: (a[c] || 0) + 1 }), {});
        const insCount = insertionList.reduce((a, c) => ({ ...a, [c]: (a[c] || 0) + 1 }), {});

        setCampaigns(Object.keys(campCount).map((name) => ({ name, count: campCount[name] })));
        setInsertionOrders(Object.keys(insCount).map((name) => ({ name, count: insCount[name] })));
        setData(rows);
      } catch (e) {
        setError("Error fetching data: " + e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [db]);

  return { data, campaigns, insertionOrders, loading, error };
}
