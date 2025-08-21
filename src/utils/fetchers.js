
export const getAccessToken = async (instanceUrl, clientId, clientSecret) => {
  const tokenEndpoint = `${instanceUrl}/PRRestService/oauth2/v1/token`;

  const cachedTokenInfo = JSON.parse(localStorage.getItem("tokenInfo"));
  if (cachedTokenInfo && cachedTokenInfo.expiresAt > Date.now() + 60000) {
    console.log("Using cached access token.");
    return cachedTokenInfo.token;
  }

  const credentials = btoa(`${clientId}:${clientSecret}`);

  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Token Error: ${errorData.error_description || response.statusText}`
      );
    }

    const data = await response.json();

    const expiresAt = Date.now() + data.expires_in * 1000;
    const newTokenInfo = { token: data.access_token, expiresAt };

    localStorage.setItem("tokenInfo", JSON.stringify(newTokenInfo));

    return newTokenInfo.token;
  } catch (err) {
    throw new Error(`Authentication failed: ${err.message}`);
  }
};


export const getCaseDataWithToken = async (
  instanceUrl,
  accessToken,
  searchCaseId
) => {
  const encodedCaseId = encodeURIComponent(searchCaseId);
  const caseDetailsEndpoint = `${instanceUrl}/api/application/v2/cases/${encodedCaseId}`;
  const caseStagesEndpoint = `${instanceUrl}/api/application/v2/cases/${encodedCaseId}/stages`;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };


  const [detailsResponse, stagesResponse] = await Promise.all([
    fetch(caseDetailsEndpoint, { headers }),
    fetch(caseStagesEndpoint, { headers }),
  ]);

  if (!detailsResponse.ok || !stagesResponse.ok) {
    if (detailsResponse.status === 404 || stagesResponse.status === 404) {
      throw new Error(`Case with ID '${searchCaseId}' not found.`);
    }
    throw new Error("Failed to fetch case details or stages.");
  }

  const details = await detailsResponse.json();
  const stages = await stagesResponse.json();
  return { details, stages };
};

export const fetchCasesWithBasicAuth = async (
  instanceUrl,
  username,
  password
) => {
  const endpoint = `${instanceUrl}/api/v1/cases`;
  const credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Basic Auth fetch failed with status: ${response.status}`
      );
    }
    const data = await response.json();
    if(!data || !data.cases || data.cases.length === 0){
        throw new Error("No cases found or invalid response format.");
    }
    return data;
  } catch (err) {
    console.error(err);
    return err.message;
  }
};

export const fetchAuditLog = async (instanceUrl,username,password,caseId) =>{

  const endpoint = `${instanceUrl}/api/v1/data/D_pyWorkHistory?CaseInstanceKey=${caseId}`;
  const credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Basic Auth fetch failed with status: ${response.status}`
      );
    }
    const data = await response.json();
    if(!data || !data.pxResults || data.pxResults.length === 0){
        throw new Error("No log entries found or invalid response format.");
    }
    console.log("Fetched logs: ", data.pxResults)
    return data.pxResults;
  } catch (err) {
    console.error(err);
    return err.message;
  }

}