import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { P2PTransferPage } from "./pages/P2PTransferPage";
import { OnRampPage } from "./pages/OnRampPage";
import { TransactionsPage } from "./pages/TransactionsPage";

import { SignupPage } from "./pages/SignupPage";
import { SigninPage } from "./pages/SigninPage";
import { RecoilRoot } from "recoil";

function App() {

  return (
    <div className="bg-[#ebe6e6] min-h-screen min-w-screen">
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/p2ptransfer" element={<P2PTransferPage />} />
            <Route path="/transfer" element={<OnRampPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />{" "}
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </div>
  )
}

export default App
