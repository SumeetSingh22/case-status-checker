import React, { useContext, useState, useRef, useEffect, useCallback } from "react";
import {
  Button,
  TextField,
  Flex,
  Text,
  Switch,
  DropdownMenu,
  Separator,
  Heading,
  Spinner,
} from "@radix-ui/themes";
import { Search as SearchIcon } from "react-feather";
import "./search.css";
import { InstanceContext } from "../../utils/context";
import { fetchAuditLog, fetchCasesWithBasicAuth, getAccessToken, getCaseDataWithToken } from "../../utils/fetchers";

const Search = ({ setCaseDetails, setCaseStages, loading, setError,setLogs }) => {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [inter, setInter] = useState("15");
  const [caseId, setCaseId] = useState("");
  const inputRef = useRef(null);

  const [cases, setCases] = useState([]);
  const [isFetchingCases, setIsFetchingCases] = useState(true); // Start in loading state
  const [fetchCasesError, setFetchCasesError] = useState(null);

  const [instanceDetails] = useContext(InstanceContext);
  const [isLoading, setIsLoading] = loading;
  const { instanceUrl, clientId, clientSecret, username, password } = instanceDetails;

  /**
   * Sorts cases by last update time in descending order.
   */
  const sortByLastUpdateTime = (casesToSort) => {
    const sortedCases = [...casesToSort];
    sortedCases.sort((a, b) => new Date(b.lastUpdateTime) - new Date(a.lastUpdateTime));
    return sortedCases;
  };

  /**
   * Fetches details for a single selected case.
   */
  const handleSearch = useCallback(async (isAutoRefresh = false) => {
    if (!caseId.trim()) {
      if (!isAutoRefresh) {
        setError("Please select or enter a Case ID.");
        setIsLoading(false);
      }
      return;
    }

    if (!isAutoRefresh) {
      setIsLoading(true);
      setCaseDetails(null);
      setCaseStages(null);
      setLogs([])
    }
    setError(null);

    try {
      if(!instanceUrl || !username || !password || !clientId || !clientSecret){
        throw new Error("Configuration details are missing. Please check your configuration")
      }
      console.log("Fetching access token...");
      const accessToken = await getAccessToken(instanceUrl, clientId, clientSecret);
      console.log(`Fetching data for case: ${caseId}`);
      const { details, stages } = await getCaseDataWithToken(instanceUrl, accessToken, caseId);
      console.log("Fetching logs for case: ",caseId )
      const logs = await fetchAuditLog(instanceUrl, username, password, caseId);
      setCaseDetails(details);
      setCaseStages(stages);
      setLogs(logs || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      if (!isAutoRefresh) {
        setIsLoading(false);
      }
    }
  }, [caseId, clientId, clientSecret, instanceUrl, password, setCaseDetails, setCaseStages, setError, setIsLoading, setLogs, username]);

  /**
   * Effect for auto-refresh functionality.
   */
  useEffect(() => {
    let intervalId = null;
    if (autoRefresh && caseId) {
      handleSearch(true); 
      intervalId = setInterval(() => handleSearch(true), parseInt(inter, 10) * 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, inter, caseId, handleSearch]);

  /**
   * Effect to fetch the initial list of cases on component mount.
   */
  useEffect(() => {
    const fetchInitialCases = async () => {
      setIsFetchingCases(true);
      setFetchCasesError(null);

      if (!instanceUrl || !username || !password) {
        console.error("Could not fetch cases: Missing instance details.");
        setFetchCasesError("Configuration details are missing.");
        setIsFetchingCases(false);
        return;
      }

      try {
        const caseData = await fetchCasesWithBasicAuth(instanceUrl, username, password);
        if (caseData?.cases?.length > 0) {
          const sortedCases = sortByLastUpdateTime(caseData.cases);
          const filteredCases = sortedCases.filter(c => !c.parentCaseID);
          setCases(filteredCases);
        } else {
          console.warn("No cases found or invalid response format.");
          setCases([]); // Set to empty array if no cases are found
          setFetchCasesError("Failed to load recent cases. Please enter one manually.");
        }
      } catch (err) {
        console.error("Error fetching cases:", err);
        setFetchCasesError("Failed to load recent cases. Please enter one manually.");
      } finally {
        setIsFetchingCases(false);
      }
    };
    fetchInitialCases();
  }, [instanceUrl, password, username]);

  return (
    <Flex className="container search-container" direction="column" align="start" gap="4" p="4">
      <Flex direction="column" gap="3" width="100%" style={{ maxWidth: "600px" }}>
        <Heading as="h1" size="5" weight="medium" className="serif main-heading">Check case status</Heading>
        <Flex gap="3" align="center">
          {/* CONDITIONAL RENDERING BLOCK */}
          {isFetchingCases ? (
            <Flex align="center" gap="2" style={{ flexGrow: 1, height: "36px", paddingLeft: '8px' }}>
              <Spinner />
              <Text size="2" color="gray">Fetching recent cases...</Text>
            </Flex>
          ) : fetchCasesError ? (
            <TextField.Root
              placeholder="Could not load cases. Enter Case ID."
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              ref={inputRef}
              style={{ flexGrow: 1 }}
              size="2"
              color="red"
              onKeyPress={(e) => { if (e.key === "Enter") handleSearch(); }}
            />
          ) : (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger style={{ flexGrow: 1}}>
                <Button variant="outline" style={{  justifyContent: 'space-between' }} size="2" className="dropdown-menu">
                  {caseId || "Select a recent case"}
                  <DropdownMenu.TriggerIcon />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size="2" style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
                {cases.length > 0 ? (
                  cases.map((c) => (
                    <DropdownMenu.Item key={c.ID} onSelect={() => setCaseId(c.ID)}>
                      {c.ID}
                    </DropdownMenu.Item>
                  ))
                ) : (
                  <DropdownMenu.Item disabled>No recent cases found</DropdownMenu.Item>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}

          <Button
            variant="solid"
            onClick={() => handleSearch()}
            disabled={isLoading || !caseId}
          >
            <SearchIcon size={16}/> Search
          </Button>
        </Flex>

        <Flex gap="3" align="center" height="32px" className="auto-refresh-controls">
          <Text as="label" size="2">
            <Flex gap="2">
              <Switch size="1" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              Auto refresh
            </Flex>
          </Text>
          {autoRefresh && (
            <>
              <Separator orientation="vertical" />
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="soft" size="1" className="dropdown-menu">
                    {inter} sec <DropdownMenu.TriggerIcon />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  {["5", "10", "15", "20", "30"].map((sec) => (
                    <DropdownMenu.Item key={sec} onSelect={() => setInter(sec)}>
                      {sec} sec
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Search;
