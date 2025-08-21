import {
  Box,
  Heading,
  Flex,
  Text,
  VisuallyHidden,
  Spinner,
  Callout,
  Skeleton,
  ScrollArea,
} from "@radix-ui/themes";
import "./statusDisplay.css";
import {
  CheckIcon,
  CircleIcon,
  Pencil1Icon,
  CrossCircledIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import { getAccessToken, getCaseDataWithToken } from "../../utils/fetchers";
import { useEffect, useState } from "react"; 
import {
  Accordion,
  AccordionHeader,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "@radix-ui/react-accordion";
import { AssignmentIcon, FlowIcon, SubFlowIcon, WaitIcon } from "../icons/Icons";
import Logs from './Logs.jsx'
import { Drawer } from "vaul";

const StatusDisplay = ({ caseData, stageData, isLoading, error, logs }) => {
  const [childCases, setChildCases] = useState([]);
  const [childCasesLoading, setChildCasesLoading] = useState(false);
  const [childCasesError, setChildCasesError] = useState(null);

  const primary = stageData?.stages.filter((stage) => stage.type === "Primary");
  const alternate = stageData?.stages.filter(
    (stage) => stage.type === "Alternate"
  );


  useEffect(() => {
    const fetchChildCases = async () => {
      if (caseData?.data?.caseInfo?.childCases?.length > 0) {
        setChildCasesLoading(true);
        setChildCasesError(null);
        try {
          const childCaseIds = caseData.data.caseInfo.childCases.map(
            (childCase) => childCase.ID
          );
          const instanceDetails = JSON.parse(
            localStorage.getItem("instanceDetails")
          );
          const { instanceUrl, clientId, clientSecret } = instanceDetails;

          const token = await getAccessToken(
            instanceUrl,
            clientId,
            clientSecret
          );

          const childCasePromises = childCaseIds.map((childCaseId) =>
            getCaseDataWithToken(instanceUrl, token, childCaseId)
          );

          const childCaseDataRaw = await Promise.all(childCasePromises);

          const formattedChildCases = childCaseDataRaw.map((data) => ({
            Id: data.details.data.caseInfo.ID,
            Name: data.details.data.caseInfo.name,
            stages: data.stages.stages,
          }));

          setChildCases(formattedChildCases);
        } catch (err) {
          console.error(err);
          setChildCasesError("Failed to load related cases.");
        } finally {
          setChildCasesLoading(false);
        }
      }
      else{
        setChildCases([])
      }
    };

    fetchChildCases();
  }, [caseData]);

  if (error) {
    return (
      <Box className="status-display-container container text-center">
        <Callout.Root
          color="red"
          role="alert"
          style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}
        >
          <Callout.Icon>
            <CrossCircledIcon />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box className=" status-display-container container">
        <Heading as="h2" weight="medium" size="5">
          <Skeleton>Example Case Id (For skeleton)</Skeleton>
        </Heading>
        <Box className="case-status">
          <Box className="case-status-type">
            <Heading as="h4" weight="regular" size="4">
              <Skeleton>Primary</Skeleton>
            </Heading>
            <Flex className="case-status-type-display" gap="2">
              <Box className="stage">
                <Skeleton>
                  <Box className={`stage-display first`}>Stage Name</Box>
                </Skeleton>
                <Box className="process">
                  <Skeleton>
                    <Text className="process-text">Process Name</Text>
                  </Skeleton>

                  <Skeleton>
                    <Flex className={`step`} gap="2" align="center">
                      <Box style={{ minWidth: "fit-content" }}>
                        <CircleIcon className="step-icon" />
                      </Box>
                      <Box>Step name</Box>
                    </Flex>
                  </Skeleton>
                  <Skeleton>
                    <Flex className={`step`} gap="2" align="center">
                      <Box style={{ minWidth: "fit-content" }}>
                        <CircleIcon className="step-icon" />
                      </Box>
                      <Box>Step name</Box>
                    </Flex>
                  </Skeleton>
                  <Skeleton>
                    <Flex className={`step`} gap="2" align="center">
                      <Box style={{ minWidth: "fit-content" }}>
                        <CircleIcon className="step-icon" />
                      </Box>
                      <Box>Step name</Box>
                    </Flex>
                  </Skeleton>
                </Box>
              </Box>
              <Box className="stage">
                <Skeleton>
                  <Box className={`stage-display common`}>Stage Name</Box>
                </Skeleton>
                <Box className="process">
                  <Skeleton>
                    <Text className="process-text">Process Name</Text>
                  </Skeleton>

                  <Skeleton>
                    <Flex className={`step`} gap="2" align="center">
                      <Box style={{ minWidth: "fit-content" }}>
                        <CircleIcon className="step-icon" />
                      </Box>
                      <Box>Step name</Box>
                    </Flex>
                  </Skeleton>
                </Box>
              </Box>
              <Box className="stage">
                <Skeleton>
                  <Box className={`stage-display first`}>Stage Name</Box>
                </Skeleton>
                <Box className="process">
                  <Skeleton>
                    <Text className="process-text">Process Name</Text>
                  </Skeleton>

                  <Skeleton>
                    <Flex className={`step`} gap="2" align="center">
                      <Box style={{ minWidth: "fit-content" }}>
                        <CircleIcon className="step-icon" />
                      </Box>
                      <Box>Step name</Box>
                    </Flex>
                  </Skeleton>
                  <Skeleton>
                    <Flex className={`step`} gap="2" align="center">
                      <Box style={{ minWidth: "fit-content" }}>
                        <CircleIcon className="step-icon" />
                      </Box>
                      <Box>Step name</Box>
                    </Flex>
                  </Skeleton>
                </Box>
              </Box>
              <Box className="stage">
                <Skeleton>
                  <Box className={`stage-display first`}>Stage Name</Box>
                </Skeleton>
                <Box className="process">
                  <Skeleton>
                    <Text className="process-text">Process Name</Text>
                  </Skeleton>

                  <Skeleton>
                    <Flex className={`step`} gap="2" align="center">
                      <Box style={{ minWidth: "fit-content" }}>
                        <CircleIcon className="step-icon" />
                      </Box>
                      <Box>Step name</Box>
                    </Flex>
                  </Skeleton>
                  <Skeleton>
                    <Flex className={`step`} gap="2" align="center">
                      <Box style={{ minWidth: "fit-content" }}>
                        <CircleIcon className="step-icon" />
                      </Box>
                      <Box>Step name</Box>
                    </Flex>
                  </Skeleton>
                  <Skeleton>
                    <Flex className={`step`} gap="2" align="center">
                      <Box style={{ minWidth: "fit-content" }}>
                        <CircleIcon className="step-icon" />
                      </Box>
                      <Box>Step name</Box>
                    </Flex>
                  </Skeleton>
                </Box>
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>
    );
  }

  if (!stageData || !caseData) {
    return null; // Return null instead of an empty string
  }

  return (
    <>
      <Box className=" status-display-container container">
        <Heading as="h2" weight="medium" size="5">
          {caseData.data.caseInfo.name} ({caseData.data.caseInfo.ID})
        </Heading>
        <Logs logs={logs}/>
        <Flex gap={3} align="start" justify="between">
          <Box className="case-status">
          <Box className="case-status-type">
            <Heading as="h4" weight="regular" size="4">
              Primary
            </Heading>
            <StatusRow rowData={primary} type="primary" />
          </Box>
          {alternate.length > 0 && (
            <Box className="case-status-type">
              <Heading as="h4" weight="regular" size="4">
                Alternate
              </Heading>
              <StatusRow rowData={alternate} type="alternate" />
            </Box>
          )}
        </Box>
          <Box>

          </Box>
        </Flex>
        {childCasesLoading && <Text>Loading related cases...</Text>}
        {childCasesError && <Text>{childCasesError}</Text>}
        {childCases.length > 0 && (
          <Box className="related-cases">
            <Accordion type="single" collapsible className="accordion">
              <AccordionItem value="item-1">
                <AccordionHeader className="accordion-header">
                  <AccordionTrigger className="accordion-trigger">
                    <Heading as="h2" weight="medium" size="4">
                      Child Cases
                    </Heading>
                    <ChevronDownIcon className="accordion-icon" />
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent className="accordion-content">
                  {childCases.map((childCase) => (
                    <Box className="case-status" key={childCase.Id}>
                      <Box className="case-status-type">
                        <Heading as="h4" weight="regular" size="4">
                          {childCase.Name} ({childCase.Id})
                        </Heading>
                        <StatusRow rowData={childCase.stages} type="primary" />
                      </Box>
                    </Box>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* <Heading as="h2" weight="medium" size="5">
              Related Cases
            </Heading>
            {childCases.map((childCase) => (
              <Box className="case-status" key={childCase.Id}>
                <Box className="case-status-type">
                  <Heading as="h4" weight="regular" size="4">
                    {childCase.Name} ({childCase.Id})
                  </Heading>
                  <StatusRow rowData={childCase.stages} type="primary" />
                </Box>
              </Box>
            ))} */}
          </Box>
        )}
      </Box>
    </>
  );
};

export const StatusRow = ({ rowData, type }) => {
  return (
    <ScrollArea type="auto" >
<Flex className="case-status-type-display" gap="2">
      {rowData?.map((stage, index) => {
        return (
          <Box className="stage" key={stage.ID}>
            <Flex gap="2" align="center" justify="center"
              className={`stage-display ${
                type === "alternate"
                  ? ""
                  : index == 0
                  ? "first"
                  : index == rowData.length - 1
                  ? "last"
                  : "common"
              }`}
            >
              {stage.visited_status === "completed" ? <CheckIcon /> : stage.visited_status === "active" ? <Pencil1Icon/> : <CircleIcon/>}
              {stage.name}
            </Flex>
            {stage.processSequences?.[0]?.processes?.map((process) => {
              return (
                <Box className="process" key={process.ID}>
                  <Text className="process-text">{process.name}</Text>
                  {process.steps?.map((step) => {
                    console.log(step.ID,'-->',step.name);
                    return (
                      <Flex
                        className={`step ${step.visited_status}`}
                        key={step.ID}
                        gap="2"
                        align="center"
                      >
                        <VisuallyHidden>{step.visited_status}</VisuallyHidden>
                        <Box style={{ minWidth: "fit-content" }}>
                          {step.ID.toLowerCase().startsWith("assignment") ? (
                            <AssignmentIcon className="step-icon"/>
                          ) : step.ID.toLowerCase().startsWith("wait") ? (
                            <WaitIcon className="step-icon"/>
                          ) : step.ID.toLowerCase().startsWith("subprocess")?
                          (
                            <SubFlowIcon className="step-icon"/>
                          ):
                          step.ID.toLowerCase().startsWith("flow")?(
                            <FlowIcon className="step-icon"/>
                          ):<CircleIcon className="step-icon"/>
                          }
                        </Box>
                        <Box>{step.name}</Box>
                      </Flex>
                    );
                  })}
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Flex>
    </ScrollArea>
    
  );
};

export default StatusDisplay;
