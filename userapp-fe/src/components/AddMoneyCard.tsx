import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Card } from "./card";
import { TextInput } from "./TextInput";
import { Select } from "./Select";
import { Button } from "./button";
import { Spinner } from "./Spinner";

const SUPPORTED_BANKS = [
  {
    id: 1,
    name: "TestBank",
    href: "http://localhost:7080/netbanking",
  },
  {
    id: 2,
    name: "HDFC",
    href: "https://netbanking.hdfcbank.com",
  },
  {
    id: 3,
    name: "Axis",
    href: "https://www.axisbank.com/",
  },
  {
    id: 4,
    name: "ICICI",
    href: "https://www.icicibank.com/",
  },
];

export function AddMoneyCard() {
  const [amount, setAmount] = useState(0);
  const [provider, setProvider] = useState("TestBank");
  const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.href);
  const [loading, setLoading] = useState(false);

  function handleInputChange(value: number) {
    setAmount(value);
  }

  async function handleAddMoneyClick() {
    try {
      const body = {
        provider: provider,
        amount: Number(amount),
      };
      setLoading(true);
      const res: any = await axios.post(`${BACKEND_URL}/api/v1/transaction/startonramp`,
        body,
        {
          headers: {
            Authorization: "Bearer " + String(localStorage.getItem("token")),
          }
        }
      ); 
      setLoading(false);
      // startOnRampTransaction(provider, Number(amount));
      const href_url = redirectUrl;
      // console.log(res);
      if (!res.data.batoken) {
        console.log("no batoken returned");
      } else {
        console.log(res.data.batoken);
      }

      // console.log("Going to bankservice-fe application!");
      // console.log(`url is: ${href_url}batoken=${res.data.batoken}`);

      // await new Promise((resolve) => {
      //   setTimeout(() => {resolve}, 10000);
      // });

      
      
      window.location.href = `${href_url}?batoken=${res.data.batoken}`;
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }

  return (
    <Card title="Add Money">
      <TextInput
        label="Amount"
        placeholder="Amount"
        value={amount}
        onChangeParent={handleInputChange}
      />
      <div className="text-sm font-medium text-gray-900">Bank</div>
      <Select
        options={SUPPORTED_BANKS.map(function (bank) {
          return { id: bank.id, key: bank.name, value: bank.name };
        })}
        onSelectParent={(value) => {
          setRedirectUrl(
            SUPPORTED_BANKS.find((x) => x.name === value)?.href || "",
          );
          setProvider(
            SUPPORTED_BANKS.find((x) => x.name === value)?.name || "TestBank",
          );
        }}
      />

      <div className="flex justify-center pt-6 text-base">
        <Button onClick={handleAddMoneyClick}>
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
