import { Navigate, Route, Routes } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Topbar } from "@/components/layout/Topbar";
import { DatePage } from "@/pages/DatePage";
import { FullBriefPage } from "@/pages/FullBriefPage";
import { HomePage } from "@/pages/HomePage";
import { QuickBriefPage } from "@/pages/QuickBriefPage";

export default function App() {
  return (
    <div className="shell">
      <Topbar />
      <main className="pt-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:date" element={<DatePage />} />
          <Route path="/:date/quick" element={<QuickBriefPage />} />
          <Route path="/:date/full" element={<FullBriefPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
