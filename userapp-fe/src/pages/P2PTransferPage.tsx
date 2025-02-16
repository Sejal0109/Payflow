import { useState } from "react";
import { BalanceCard } from "../components/BalanceCard"
import P2PTransferCard from "../components/P2PTransferCard"
import { RecentP2PTransactionsCard } from "../components/RecentP2PTransactionsCard"
import { Appbar } from "../components/Appbar";
import { Sidebars } from "../components/Sidebars";

export const P2PTransferPage = () => {

    const [newTransaction, setNewTransaction] = useState(false);

    const handleNewTransaction = () => {
        setNewTransaction((prev) => !prev);  // Toggle state to trigger a re-render
    };


    return <div className="flex flex-col h-full w-full">

        <Appbar />

        <div className="pt-20 flex gap-x-5 h-full w-full overflow-auto">
            <Sidebars />

            <div className="flex flex-col h-full w-full px-2">

                <div className="font-bold rounded-lg text-3xl text-[#6d28d9] ">
                    p2p Transfer
                </div>
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 max-h-fit ">
                    <div className="flex flex-col">
                        <P2PTransferCard onTransaction={handleNewTransaction} />
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <div>
                            <BalanceCard newTransaction={newTransaction} />
                        </div>
                        <div>
                            <RecentP2PTransactionsCard newTransaction={newTransaction} />
                        </div>
                    </div>
                </div>
            </div>
        </div>



    </div>
}