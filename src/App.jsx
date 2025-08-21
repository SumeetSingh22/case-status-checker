import React from "react";
import { Separator, Theme } from "@radix-ui/themes";
import Header from "./components/Header/Header.jsx";
import Search from "./components/Search/Search.jsx";
import StatusDisplay from "./components/StatusDisplay/StatusDisplay.jsx";
import "./App.css";
import { InstanceContextProvider } from "./utils/provider.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Help from "./components/Help/Help.jsx";

function App() {
  const [caseDetails, setCaseDetails] = React.useState(null);
  const [caseStages, setCaseStages] = React.useState(null);
  const [logs, setLogs] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);


  return (
    <InstanceContextProvider>
      <Theme accentColor="blue">
        <Router>
          <Header />
          <Routes>
            
            <Route>
              <Route path="/" element={<div className="app-content">
          <Search
            setCaseDetails={setCaseDetails}
            setCaseStages={setCaseStages}
            loading={[isLoading, setIsLoading]}
            setError={setError}
            setLogs = {setLogs}
          />
          <hr />
          <StatusDisplay
            error={error}
            logs={logs}
            isLoading={isLoading}
            caseData={caseDetails}
            stageData={caseStages}
          />
        </div>}/>
        <Route path="/help" element={
          <Help />
        } />
            </Route>
          </Routes>
        </Router>
      </Theme>
    </InstanceContextProvider>
  );
}

export default App;
