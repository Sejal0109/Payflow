import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./Avatar";
import { useRecoilState } from "recoil";
import { userAtom } from "../store/atoms/user";
import { Button } from "./button";
import { useEffect } from "react";

export const Appbar = () => {
    const navigate = useNavigate();
    const [userState, setUserState] = useRecoilState(userAtom);

    // Load the user from localStorage on mount, if it's not already in Recoil state
    useEffect(() => {
        const storedUser = localStorage.getItem('user_state');
        if (storedUser) {
            setUserState(JSON.parse(storedUser));
        } else {
            localStorage.setItem('user_state', JSON.stringify(userState));
        }
    }, []);

    function handleOnSignIn() {

        localStorage.removeItem('user_state');
        localStorage.removeItem('token');
        setUserState({ username: "", userId: "", usernumber: "", isAuthenticated: false });

        navigate("/signin")
    }
    function handleOnSignOut() {

        localStorage.removeItem('user_state');
        localStorage.removeItem('token');
        setUserState({ username: "", userId: "", usernumber: "", isAuthenticated: false });

        navigate("/signup");
    }

    return (

        <div className="fixed bg-white w-full top-0 h-14 z-50 shadow-sm flex justify-between pt-4 py-2 items-center border-b border-slate-300 px-10">
            <div className="flex flex-col justify-center text-lg font-semibold cursor-pointer">
                <Link to={"/transfer"}>Payflow</Link>
            </div>
            <div className="flex justify-between w-full  max-w-52 ">

                <Button onClick={userState.username !== "" ? handleOnSignOut : handleOnSignIn}>
                    {userState.username !== "" ? "Logout" : "Login"}
                </Button>
                <Avatar
                    name={userState.username !== "" ? userState.username : "Anonymous"}
                    size="big"
                />
            </div>
        </div>
    );
};
