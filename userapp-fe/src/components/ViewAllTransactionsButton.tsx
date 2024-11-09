import { useNavigate } from 'react-router-dom';
import { TransactionType } from "./AllTransactions";

export function ViewAllTransactionsButton({ isP2P }: { isP2P?: boolean }) {
    const navigate = useNavigate();

    return <div onClick={() => {

        if (isP2P) {
            const query = new URLSearchParams({ initialTrnxType: TransactionType.Peer2Peer }).toString();
            navigate(`/transactions?${query}`);
        } else {
            navigate("/transactions");
        }
    }} className="cursor-pointer mt-2 px-2 py-1.5 font-semibold rounded-lg text-base text-[#6d28d9] bg-[#ddd6fe] hover:bg-[#c4b5fd]">
        View All Transactions
    </div>
}