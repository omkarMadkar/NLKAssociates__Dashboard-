const fs = require('fs');
const file = '/Users/omkarmadkar07/Downloads/Internship Project/LAW Project/NLKAssociatesDashboard-main/Frontend/src/pages/NonLitigation/BusinessLegal/TSRInitiation.jsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add Import
code = code.replace(
  'import TSROtherProvisions from "../../../models/TSROtherProvision";',
  'import TSROtherProvisions from "../../../models/TSROtherProvision";\nimport TSRWaitingReport from "../../../models/TSRWaitingReport";'
);

// 2. Add INITIAL_WAITING_REPORT before INITIAL_OTHER_PROVISIONS
code = code.replace(
  'const INITIAL_OTHER_PROVISIONS = [',
  `const INITIAL_WAITING_REPORT = {
  chalanNo: "",
  date: "",
  reportSrNo: "",
  documents: [
    { srNo: 1, name: "Sale Deed / Conveyance Deed", available: "No", remarks: "" },
    { srNo: 2, name: "Index II", available: "No", remarks: "" },
    { srNo: 3, name: "7/12 Extract / Property Card", available: "No", remarks: "" },
    { srNo: 4, name: "Tax Receipt", available: "No", remarks: "" },
    { srNo: 5, name: "Mutation Entry", available: "No", remarks: "" },
  ],
};

const INITIAL_OTHER_PROVISIONS = [`
);

// 3. Add state and handlers
code = code.replace(
  'const [otherProvisions, setOtherProvisions] = useState(',
  `const [waitingReport, setWaitingReport] = useState(INITIAL_WAITING_REPORT);

  const handleAddDoc = () => {
    setWaitingReport(prev => ({
      ...prev,
      documents: [...prev.documents, { srNo: prev.documents.length + 1, name: "", available: "No", remarks: "" }]
    }));
  };
  const handleDocChange = (index, field, value) => {
    setWaitingReport(prev => {
      const updated = [...prev.documents];
      updated[index][field] = value;
      return { ...prev, documents: updated };
    });
  };
  const handleRemoveDoc = (index) => {
    setWaitingReport(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const [otherProvisions, setOtherProvisions] = useState(`
);

// 4. Update handleSubmit to submit waiting report too
code = code.replace(
  '// STEP 3 - SAVE PART III (Title Flow Excel, if uploaded)',
  `// STEP 3 - SAVE PART VI (Waiting Report)
      await API.post("/tsr-waiting-report/create", {
        tsrInitiationId: tsrId,
        ...waitingReport
      }, { headers: authHeader() });

      // STEP 4 - SAVE PART III (Title Flow Excel, if uploaded)`
);

// Reset waiting report on success
code = code.replace(
  'setOtherProvisions(INITIAL_OTHER_PROVISIONS);',
  'setOtherProvisions(INITIAL_OTHER_PROVISIONS);\n      setWaitingReport(INITIAL_WAITING_REPORT);'
);

// 5. Add tab button
code = code.replace(
  '{ key: "otherProvisions", label: "V. Other Provisions" },',
  '{ key: "otherProvisions", label: "V. Other Provisions" },\n            { key: "waitingReport", label: "VI. Waiting Report" },'
);

// 6. Render component
code = code.replace(
  '{/* Navigation / Submit Bar */}',
  `{activeTab === "waitingReport" && (
            <TSRWaitingReport
              waitingReport={waitingReport}
              setWaitingReport={setWaitingReport}
              handleAddDoc={handleAddDoc}
              handleDocChange={handleDocChange}
              handleRemoveDoc={handleRemoveDoc}
            />
          )}

          {/* Navigation / Submit Bar */}`
);

// 7. Update Action Buttons
code = code.replace(
  '<button\n                  type="submit"\n                  disabled={submitting}',
  `<button
                  type={activeTab === "waitingReport" ? "submit" : "button"}
                  disabled={submitting}`
);

code = code.replace(
  `{submitting ? "Initiating..." : "Initiate TSR ➔"}
                </button>`,
  `{activeTab === "waitingReport" 
                    ? (submitting ? "Initiating..." : "Initiate TSR Report ✓")
                    : "Next Section ➔"}
                </button>`
);

code = code.replace(
  `} else if (activeTab === "otherProvisions") {
                    setActiveTab("documents");
                  }
                }}`,
  `} else if (activeTab === "otherProvisions") {
                    setActiveTab("documents");
                  } else if (activeTab === "waitingReport") {
                    setActiveTab("otherProvisions");
                  }
                }}`
);

code = code.replace(
  `style={{
                  background: "var(--navy)",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {activeTab === "waitingReport" 
                    ? (submitting ? "Initiating..." : "Initiate TSR Report ✓")
                    : "Next Section ➔"}
                </button>`,
  `style={{
                  background: "var(--navy)",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  if (activeTab !== "waitingReport") {
                    e.preventDefault();
                    if (activeTab === "basic") setActiveTab("documents");
                    else if (activeTab === "documents") setActiveTab("otherProvisions");
                    else if (activeTab === "otherProvisions") setActiveTab("waitingReport");
                  }
                }}
              >
                {activeTab === "waitingReport" 
                    ? (submitting ? "Initiating..." : "Initiate TSR Report ✓")
                    : "Next Section ➔"}
                </button>`
);

fs.writeFileSync(file, code);
