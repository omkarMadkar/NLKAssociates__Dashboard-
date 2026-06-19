import { useEffect, useState } from "react";
import {
  Database,
  Search,
  Upload,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from "lucide-react";

import API from "../api/axios";

export default function MasterDB() {
  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const limit = 10;

  const fetchRecords = async (currentPage = page, searchText = search) => {
    try {
      setLoading(true);

      const { data } = await API.get(
        `/masterdb?page=${currentPage}&limit=${limit}&search=${searchText}`,
      );

      setRecords(data.data || []);
      setPages(data.pagination?.pages || 1);
      setTotalRecords(data.pagination?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an excel file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const { data } = await API.post("/masterdb/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(data.message);

      setFile(null);
      setPage(1);

      fetchRecords(1, search);
    } catch (error) {
      console.error(error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchRecords(1, search);
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              background: "var(--navy)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Database size={24} color="white" />
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                color: "#0f172a",
              }}
            >
              Master Database
            </h2>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Manage all uploaded master records
            </p>
          </div>
        </div>

        <div
          style={{
            padding: "8px 14px",
            borderRadius: "10px",
            background: "#fff",
            border: "1px solid #e2e8f0",
            fontWeight: 600,
          }}
        >
          Total Records : {totalRecords}
        </div>
      </div>

      {/* SEARCH + UPLOAD */}

      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: "350px",
              position: "relative",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "12px",
                color: "#94a3b8",
              }}
            />

            <input
              type="text"
              placeholder="Search Branch, Applicant, Co Applicant, Property..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{
                width: "100%",
                padding: "12px 12px 12px 40px",
                borderRadius: "10px",
                border: "1px solid #dbe2ea",
                outline: "none",
              }}
            />
          </div>

          <button
            onClick={handleSearch}
            style={{
              background: "var(--navy)",
              color: "#fff",
              border: "none",
              padding: "12px 18px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Search
          </button>

          <label
            style={{
              cursor: "pointer",
              border: "1px solid #dbe2ea",
              borderRadius: "10px",
              padding: "12px 16px",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FileSpreadsheet size={18} />

            {file ? file.name : "Choose Excel"}

            <input
              hidden
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
              background: "#16a34a",
              color: "#fff",
              border: "none",
              padding: "12px 18px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Excel
              </>
            )}
          </button>
        </div>
      </div>

      {/* TABLE */}

      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc",
                }}
              >
                {[
                  "Sr No",
                  "Author",
                  "Application No",
                  "Branch",
                  "Applicant",
                  "Co Applicant",
                  "Transaction Type",
                  "Property Details",
                  "Vet + CTC",
                  "CTC",
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      padding: "14px",
                      textAlign: "left",
                      borderBottom: "1px solid #e2e8f0",
                      color: "#334155",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "50px",
                    }}
                  >
                    <Loader2 size={24} className="animate-spin" />
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "50px",
                    }}
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                records.map((row, index) => (
                  <tr key={row._id}>
                    <td style={cellStyle}>{(page - 1) * limit + index + 1}</td>

                    <td style={cellStyle}>{row.author || "-"}</td>

                    <td style={cellStyle}>{row.applicationNo || "-"}</td>

                    <td style={cellStyle}>{row.branch || "-"}</td>

                    <td style={cellStyle}>
                      {Array.isArray(row.applicant)
                        ? row.applicant.join(", ")
                        : row.applicant || "-"}
                    </td>

                    <td style={cellStyle}>
                      {Array.isArray(row.coApplicant)
                        ? row.coApplicant.join(", ")
                        : row.coApplicant || "-"}
                    </td>

                    <td style={cellStyle}>{row.transactionType || "-"}</td>

                    <td style={cellStyle}>{row.propertyDetails || "-"}</td>

                    <td style={cellStyle}>{row.vetAndCTC || "-"}</td>

                    <td style={cellStyle}>{row.ctc || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <div>
            Page {page} of {pages}
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              style={paginationButton}
            >
              <ChevronLeft size={16} />
            </button>

            <button
              disabled={page === pages}
              onClick={() => setPage((prev) => prev + 1)}
              style={paginationButton}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const cellStyle = {
  padding: "14px",
  borderBottom: "1px solid #f1f5f9",
  color: "#334155",
  fontSize: "14px",
};

const paginationButton = {
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  border: "1px solid #dbe2ea",
  background: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
