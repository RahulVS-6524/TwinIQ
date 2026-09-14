import { useState } from "react";
import { UploadIcon, SparklesIcon } from "../Icons";
import { API_BASE } from "../config/api";

export default function CsvImportModal({ isOpen, onClose, onImportSuccess, businessId }) {
  const [csvText, setCsvText] = useState("");
  const [parsedRows, setParsedRows] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const sampleCsv = `Revenue,ProfitMargin,CustomerRetention,CustomerAcquisitionCost,OperationalEfficiency
1250000,19.2,84.5,620,82.0
1300000,20.0,85.2,590,83.5
1380000,21.1,86.0,560,85.0`;

  const handleCopySample = () => {
    setCsvText(sampleCsv);
    parseCsv(sampleCsv);
  };

  const parseCsv = (content) => {
    const lines = content.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      setValidationErrors(["CSV must contain a header row and at least one data row."]);
      setParsedRows([]);
      return;
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const expectedHeaders = ["revenue", "profitmargin", "customerretention", "customeracquisitioncost", "operationalefficiency"];

    const missing = expectedHeaders.filter((exp) => !headers.includes(exp));
    if (missing.length > 0) {
      setValidationErrors([`Missing required column headers: ${missing.join(", ")}`]);
      setParsedRows([]);
      return;
    }

    const revIdx = headers.indexOf("revenue");
    const marginIdx = headers.indexOf("profitmargin");
    const retIdx = headers.indexOf("customerretention");
    const cacIdx = headers.indexOf("customeracquisitioncost");
    const effIdx = headers.indexOf("operationalefficiency");

    const rows = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",").map((p) => p.trim());
      if (parts.length < headers.length) {
        errors.push(`Row ${i}: Missing column values.`);
        continue;
      }

      const rev = parseFloat(parts[revIdx]);
      const margin = parseFloat(parts[marginIdx]);
      const ret = parseFloat(parts[retIdx]);
      const cac = parseFloat(parts[cacIdx]);
      const eff = parseFloat(parts[effIdx]);

      if (isNaN(rev) || rev <= 0) errors.push(`Row ${i}: Revenue must be a positive number.`);
      if (isNaN(margin) || margin < -100 || margin > 100) errors.push(`Row ${i}: Profit Margin must be between -100% and 100%.`);
      if (isNaN(ret) || ret < 0 || ret > 100) errors.push(`Row ${i}: Customer Retention must be between 0% and 100%.`);
      if (isNaN(cac) || cac < 0) errors.push(`Row ${i}: Customer Acquisition Cost cannot be negative.`);
      if (isNaN(eff) || eff < 0 || eff > 100) errors.push(`Row ${i}: Operational Efficiency must be between 0 and 100.`);

      rows.push({
        rowNum: i,
        revenue: rev,
        profitMargin: margin,
        customerRetention: ret,
        customerAcquisitionCost: cac,
        operationalEfficiency: eff,
      });
    }

    setValidationErrors(errors);
    setParsedRows(rows);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      setCsvText(content);
      parseCsv(content);
    };
    reader.readAsText(file);
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setCsvText(text);
    if (text.trim()) {
      parseCsv(text);
    } else {
      setParsedRows([]);
      setValidationErrors([]);
    }
  };

  const handleConfirmImport = async () => {
    if (parsedRows.length === 0 || validationErrors.length > 0) return;
    setIsSubmitting(true);

    try {
      // Create a new snapshot from the latest valid row
      const latestRow = parsedRows[parsedRows.length - 1];
      const token = localStorage.getItem("twiniq_token");

      // We call the existing snapshot creation endpoint
      const response = await fetch(`${API_BASE}/businesses/${businessId}/snapshots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onImportSuccess?.(latestRow);
        onClose();
      } else {
        alert("Server returned error during snapshot import.");
      }
    } catch (err) {
      alert("Error importing snapshot: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog csv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <UploadIcon size={20} color="var(--primary)" />
            <h3 className="modal-title">Import Business Metric Series (CSV)</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="text-secondary text-sm" style={{ marginBottom: "14px" }}>
            Upload or paste financial and operational metrics to validate against the Digital Twin schema. Verified data will be safely captured as a new baseline snapshot.
          </p>

          <div className="csv-action-buttons">
            <label className="secondary-btn file-upload-btn">
              <UploadIcon size={14} />
              <span>Choose CSV File</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: "none" }} />
            </label>
            <button type="button" className="secondary-btn" onClick={handleCopySample}>
              <SparklesIcon size={14} />
              <span>Load Sample Template</span>
            </button>
          </div>

          <div className="form-group" style={{ marginTop: "12px" }}>
            <label>CSV Content (Header + Rows)</label>
            <textarea
              className="csv-textarea font-mono"
              rows={5}
              placeholder="Revenue,ProfitMargin,CustomerRetention,CustomerAcquisitionCost,OperationalEfficiency&#10;1250000,19.2,84.5,620,82.0"
              value={csvText}
              onChange={handleTextChange}
            />
          </div>

          {/* Validation errors */}
          {validationErrors.length > 0 && (
            <div className="csv-errors-box">
              <span className="error-title">Validation Warning ({validationErrors.length})</span>
              <ul>
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Parsed preview table */}
          {parsedRows.length > 0 && validationErrors.length === 0 && (
            <div className="csv-preview-box">
              <div className="preview-title">
                <span>✓ Schema Verified ({parsedRows.length} valid records found)</span>
              </div>
              <div className="admin-biz-table-wrapper" style={{ maxHeight: "160px" }}>
                <table className="admin-table text-xs">
                  <thead>
                    <tr>
                      <th>Row</th>
                      <th>Revenue (₹)</th>
                      <th>Margin (%)</th>
                      <th>Retention (%)</th>
                      <th>CAC (₹)</th>
                      <th>Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((r, i) => (
                      <tr key={i}>
                        <td>#{r.rowNum}</td>
                        <td>₹{r.revenue.toLocaleString("en-IN")}</td>
                        <td>{r.profitMargin}%</td>
                        <td>{r.customerRetention}%</td>
                        <td>₹{r.customerAcquisitionCost}</td>
                        <td>{r.operationalEfficiency} pts</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="primary-btn"
            disabled={parsedRows.length === 0 || validationErrors.length > 0 || isSubmitting}
            onClick={handleConfirmImport}
          >
            {isSubmitting ? "Importing to Twin..." : `Import ${parsedRows.length} Verified Records`}
          </button>
        </div>
      </div>
    </div>
  );
}
