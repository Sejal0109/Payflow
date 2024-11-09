import { useNavigate, useLocation } from "react-router-dom";


export const SidebarItem = ({
    name,
    Icon,
    href,
}: {
    name: string;
    href: string;
    Icon: JSX.Element;
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const selected: boolean = location.pathname === href;

    return (
        <div
            className={`flex pl-10 cursor-pointer p-2 hover:bg-gray-300`}
            onClick={() => {
                navigate(href);
            }}
        >
            <div
                className={`flex gap-x-4 ${selected ? "text-[#6a51a6]" : "text-slate-600"} `}
            >
                <div className="flex flex-col justify-center items-center">{Icon}</div>
                <div
                    className={`font-bold text-lg ${selected ? "text-[#6a51a6]" : "text-slate-600"}`}
                >
                    {name}
                </div>
            </div>
        </div>
    );
};
