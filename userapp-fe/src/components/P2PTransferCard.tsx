
import { useState } from "react";
import { Card } from "./card";
import { TextInput } from "./TextInput";
import { Button } from "./button";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { userAtom } from "../store/atoms/user";
import { useRecoilValue } from "recoil";
import { Spinner } from "./Spinner";



export default function P2PTransferCard({ onTransaction }: any) {
    const userState = useRecoilValue(userAtom);
    const [amount, setAmount] = useState(0);
    const [toNumber, setToNumber] = useState("");

    const userNumber = userState.usernumber;
    const [loading, setLoading] = useState(false);


    function handleAmountInputChange(value: number) {
        setAmount(value);
    }

    function handleToNumberInputChange(value: string) {
        setToNumber(value);
    }

    async function handleTransferMoneyClick() {
        try {
            if (Number(userNumber) === Number(toNumber)) {
                throw "Transfering money to the same account not allowed!";
            }


            const body = {
                to: toNumber.toString(),
                amount: Number(amount),
            };
            setLoading(true);
            const res: any = await axios.post(`${BACKEND_URL}/api/v1/transaction/startp2p`,
                body,
                {
                    headers: {
                        Authorization: "Bearer " + String(localStorage.getItem("token")),
                    }
                }
            );
            setLoading(false);





        } catch (error) {
            console.error("Error occurred while doing p2p Transfer:", error);
        } finally {
            setAmount(0);
            setToNumber("");
            // Once the transaction is completed, notifying the parent component
            onTransaction();
        }
    }

    return (
        <Card title="Add Money">
            <TextInput
                label="Number"
                placeholder="Number"
                value={toNumber}
                onChangeParent={handleToNumberInputChange}
            />

            <TextInput
                label="Amount"
                placeholder="Amount"
                value={amount}
                onChangeParent={handleAmountInputChange}
            />

            <div className="flex justify-center pt-2 text-base">
                <Button onClick={handleTransferMoneyClick}>
                    {loading === false ? (
                        "Transfer"
                    ) : (
                        <div className="flex w-full justify-center items-center">
                            <Spinner />
                        </div>
                    )}
                </Button>
            </div>
        </Card>
    );
}