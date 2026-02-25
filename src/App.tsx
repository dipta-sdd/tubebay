import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import ChannelLibrary from "./pages/ChannelLibrary";
import { HashRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/common/AppLayout";
import { WpabProvider } from "./store/wpabStore";
import { ToastProvider } from "./store/toast/use-toast";
import Logs from "./pages/Logs";

function App() {
  return (
    <WpabProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="logs" element={<Logs />} />
              <Route path="settings" element={<Settings />} />
              <Route path="library" element={<ChannelLibrary />} />
              {/* Add your routes here */}
            </Route>
          </Routes>
        </HashRouter>
      </ToastProvider>
    </WpabProvider>
  );
}

export default App;
