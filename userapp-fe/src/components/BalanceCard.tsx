import { useEffect, useState } from "react";
import { Card } from "./card";
import { BACKEND_URL } from "../config";
import axios from "axios";

export const BalanceCard = ({ newTransaction }: { newTransaction?: any }) => {
  const [totalBalance, setTotalBalance] = useState<number>(0);  // Using state for total balance
  const [lockedBalance, setLockedBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);


  useEffect(() => {

    const callUserBalanceFn = async () => {
      try {

        setLoading(true);
        const response: any = await axios.get(`${BACKEND_URL}/api/v1/user/balance`,

          {
            headers: {
              Authorization: "Bearer " + String(localStorage.getItem("token")),
            }
          }
        );
        setLoading(false);
        setTotalBalance(response?.data.totalBalance ?? 0);
        setLockedBalance(response?.data.lockedBalance ?? 0);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setTotalBalance(0);
        setLockedBalance(0);
      }
    };

    callUserBalanceFn();

  }, [newTransaction])

  return (
    <Card title="Balance">
      <div className="flex flex-col gap-y-3">
        <div className="flex py-2 border-b border-gray-300">
          <div className="flex-grow">Unlocked Balance</div>
          <div>{totalBalance - lockedBalance} INR</div>
        </div>

        <div className="flex pb-2 border-b border-gray-300">
          <div className="flex-grow">Total Locked Balance</div>
          <div>{lockedBalance} INR</div>
        </div>
        <div className="flex pb-2 border-b border-gray-300">
          <div className="flex-grow">Total Balance</div>
          <div>{totalBalance} INR</div>
        </div>
      </div>
    </Card>
  );
};
