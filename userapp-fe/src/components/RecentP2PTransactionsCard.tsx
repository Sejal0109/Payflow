import { ViewAllTransactionsButton } from "./ViewAllTransactionsButton";
import { useEffect, useState } from "react";
import { P2PMappedTransactionType } from "./AllTransactions";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms/user";
import { Card } from "./card";
import axios from "axios";
import { BACKEND_URL } from "../config";


export interface P2PTransactionType {
    amount: number;
    fromUserId: number;
    toUserId: number;
    timestamp: Date;
}

export const RecentP2PTransactionsCard = ({ newTransaction }: any) => {
    const userState = useRecoilValue(userAtom);
    const [transactions, setTransactions] = useState<P2PMappedTransactionType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const userId = userState.userId;

    async function fetchRecentTransactions() {

        const response: any = await axios.get(`${BACKEND_URL}/api/v1/transaction/recentp2p`,

            {
                headers: {
                    Authorization: "Bearer " + String(localStorage.getItem("token")),
                }
            }
        );
        if (!response?.data.success) {
            setError(response?.data.message); // Set error if success is not true
        } else {
            setTransactions(response?.data.transactions || []); // Set transactions if they exist
            
        }
        // console.log("Transactions: ", response.transactions);
    }

    useEffect(() => {
        const loadTransactions = async () => {
            setLoading(true);
            try {
                await fetchRecentTransactions();
            } catch (e) {
                console.log(e);
                setError("Failed to load transactions. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadTransactions();
    }, [newTransaction]);



    if (loading) {
        return <div className="mt-10 ml-10">Loading...</div>;
    }

    if (!transactions.length) {
        return (
            <Card title="Recent Transactions">
                <div className="py-8 text-center">No Recent p2p transactions</div>
            </Card>
        );
    }



    const maxTransactionsToShow = 5;
    const displayedTransactions = transactions.slice(0, maxTransactionsToShow);
    const showViewAllTx = transactions.length > maxTransactionsToShow;

    return (
        <Card title="Recent Transactions">
            <div className="pt-2  ">
                {displayedTransactions.map((trnsc, index) => (

                    <div key={index}>
                        {Number(trnsc.toUserId) === Number(userId) ? (
                            <div className="flex justify-between pb-1 px-1 border-b rounded-md  border-gray-300 mb-2 ">
                                <div className="flex flex-col justify-center">

                                    <div className="text-sm">Received INR</div>
                                    <div className="text-slate-600 text-xs">
                                        From: {(trnsc as P2PMappedTransactionType).fromUserName} ({(trnsc as P2PMappedTransactionType).fromUserContactNo})
                                    </div>

                                    <div className="text-slate-600 text-xs">
                                        Date: {(trnsc as P2PMappedTransactionType).timestamp
                                            ? new Date((trnsc as P2PMappedTransactionType).timestamp).toLocaleString()
                                            : "N/A"}
                                    </div>

                                </div>
                                <div className="flex flex-col justify-center">
                                    + Rs {trnsc.amount / 100}
                                </div>


                            </div>
                        ) : (
                            <div className="flex justify-between pb-1 px-1 border-b rounded-md  border-gray-300 mb-2 ">

                                <div className="flex flex-col justify-center">

                                    <div className="text-sm">Sent INR</div>
                                    <div className="text-slate-600 text-xs">
                                        To: {(trnsc as P2PMappedTransactionType).toUserName} ({(trnsc as P2PMappedTransactionType).toUserContactNo})
                                    </div>

                                    <div className="text-slate-600 text-xs">
                                        Date: {(trnsc as P2PMappedTransactionType).timestamp
                                            ? new Date((trnsc as P2PMappedTransactionType).timestamp).toLocaleString()
                                            : "N/A"}
                                    </div>

                                </div>
                                <div className="flex flex-col justify-center">
                                    - Rs {trnsc.amount / 100}
                                </div>



                            </div>
                        )}
                    </div>
                ))}
            </div>
            {showViewAllTx && (
                <div className="flex justify-center">
                    <ViewAllTransactionsButton isP2P={true} />
                </div>
            )}
        </Card>
    );
};
