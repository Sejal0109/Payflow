import { SidebarItem } from "./SidebarItem"

export const Sidebars = () => {
    return <div className="flex flex-col border-r border-gray-300 h-3/5 justify-center w-72 p-4 gap-y-4">


        <SidebarItem
            href={"/transfer"}
            name="Transfer"
            Icon={<TransferIcon />}
        />
        <SidebarItem
            href={"/p2ptransfer"}
            name="p2pTransfer"
            Icon={<P2PTransferIcon />}
        />
        <SidebarItem
            href={"/transactions"}
            name="Transactions"
            Icon={<TransactionsIcon />}
        />


    </div>
}


function TransferIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
            />
        </svg>
    );
}

function TransactionsIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
        </svg>
    );
}

function P2PTransferIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
            />
        </svg>
    );
}