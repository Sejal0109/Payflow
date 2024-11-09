import { useEffect, useState } from "react";
import { AllTransactions, TransactionType } from "../components/AllTransactions";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Appbar } from "../components/Appbar";
import { Sidebars } from "../components/Sidebars";

export const TransactionsPage = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialTrnxType = searchParams.get('initialTrnxType');

    // console.log("initialTrnxType: ", initialTrnxType);

    const [selectedType, setSelectedType] = useState<TransactionType>(
        (typeof initialTrnxType === "string" && initialTrnxType === TransactionType.Peer2Peer.toString()) ? TransactionType.Peer2Peer : TransactionType.OnRamp
    );

    useEffect(() => {
        if (typeof initialTrnxType === "string") {
            // Make sure we convert the string to the corresponding TransactionType
            const type = initialTrnxType as TransactionType;
            setSelectedType(type);
        }
    }, [initialTrnxType]);


    return <div className="flex flex-col h-full w-full">

        <Appbar />

        <div className="pt-20 flex gap-x-5 h-full w-full overflow-auto">

            <Sidebars />

            <div className=" flex flex-col h-full w-full px-2">
                <div className="font-bold rounded-lg text-3xl text-[#6d28d9] ">
                    Transactions
                </div>
                <div className="flex gap-x-4 mt-3">
                    <div
                        onClick={() => {

                            setSelectedType(TransactionType.OnRamp);
                            navigate(`?initialTrnxType=${TransactionType.OnRamp}`);
                        }}
                        className={`cursor-pointer ${selectedType === TransactionType.OnRamp ? "bg-white" : "bg-[#ebe6e6]"} hover:bg-sky-50 text-sm font-semibold py-2 px-3 rounded-full text-[#1c1917]`}
                    >
                        OnRamp
                    </div>
                    <div
                        onClick={() => {
                            setSelectedType(TransactionType.Peer2Peer);
                            navigate(`?initialTrnxType=${TransactionType.Peer2Peer}`);
                        }}
                        className={`cursor-pointer ${selectedType === TransactionType.Peer2Peer ? "bg-white" : "bg-[#ebe6e6]"} hover:bg-sky-50 text-sm font-semibold py-2 px-3 rounded-full text-[#1c1917]`}
                    >
                        Peer2Peer
                    </div>
                </div>
                <AllTransactions
                    type={
                        selectedType === TransactionType.OnRamp
                            ? TransactionType.OnRamp
                            : TransactionType.Peer2Peer
                    }
                />
            </div>


        </div>



    </div>
}