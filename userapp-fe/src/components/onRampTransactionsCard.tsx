
import { RampStatus } from "@aditya0257/payflow-common";
import { ViewAllTransactionsButton } from "./ViewAllTransactionsButton";
import { useEffect, useState } from "react";
import { Card } from "./card";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface OnRampTransactionType {
  startTime: Date;
  amount: number;
  provider: string;
  status: RampStatus;
}

export const OnRampTransactionsCard = () => {
  const [transactions, setTransactions] = useState<OnRampTransactionType[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchRecentTransactions() {

    const response: any = await axios.get(`${BACKEND_URL}/api/v1/transaction/recentonramp`,

      {
        headers: {
          Authorization: "Bearer " + String(localStorage.getItem("token")),
        }
      }
    );

    if (response?.data.transactions) {
      // Convert each transaction's startTime to a Date object
      const transactionsWithDate = response.data.transactions.map((transaction: any) => ({
        ...transaction,
        startTime: new Date(transaction.startTime) // Convert startTime to Date
      }));
      setTransactions(transactionsWithDate);
    }
  }

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      try {
        await fetchRecentTransactions();
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  if (loading) {
    return <div className="mt-10 ml-10">Loading...</div>;
  }

  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="py-8 text-center">No Recent transactions</div>
      </Card>
    );
  }

  const maxTransactionsToShow = 6;
  const displayedTransactions = transactions.slice(0, maxTransactionsToShow);
  const showViewAllTx = transactions.length > maxTransactionsToShow;




  return (
    <Card title="Recent Transactions">
      <div className="pt-2  ">
        {displayedTransactions.map((trnsc, index) => (
          <div key={index} className="flex justify-between pb-1 px-1 border-b rounded-md  border-gray-300 mb-2 ">
            <div className="flex flex-col justify-center">
              <div className="text-sm">From {trnsc.provider}</div>
              <div className="text-slate-600 text-xs">
                Received on {trnsc.startTime.toDateString()}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div>+ Rs {trnsc.amount / 100}</div>
              <div className="text-xs text-right">{trnsc.status}</div>
            </div>
          </div>
        ))}
      </div>
      {showViewAllTx && (
        <div className="flex justify-center">
          <ViewAllTransactionsButton />
        </div>
      )}
    </Card>
  );
};
