import { useRecoilValue } from "recoil"
import { AddMoneyCard } from "../components/AddMoneyCard"
import { Appbar } from "../components/Appbar"
import { BalanceCard } from "../components/BalanceCard"
import { OnRampTransactionsCard } from "../components/onRampTransactionsCard"
import { userAtom } from "../store/atoms/user"
import { Sidebars } from "../components/Sidebars"

export const OnRampPage = () => {

  const userState = useRecoilValue(userAtom);

  console.log(userState);


  return <div className="flex flex-col h-full w-full ">

    <Appbar />


    <div className="pt-20 flex gap-x-5 h-full w-full overflow-auto">
      <Sidebars />

      <div className=" flex flex-col h-full w-full px-2  ">

        <div className="font-bold rounded-lg text-3xl text-[#6d28d9] ">
          onRamp Transfer
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 max-h-fit ">
          <div className="flex flex-col">
            <AddMoneyCard />
          </div>
          <div className="flex flex-col gap-y-2">
            <div>
              <BalanceCard />
            </div>
            <div>
              <OnRampTransactionsCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}