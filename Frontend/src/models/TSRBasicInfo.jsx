// TSRBasicInfo.jsx
// PART I - Basic application / property details.
// Props:
//   form        - current form state object (from parent)
//   errors      - validation errors object
//   handleChange - generic input change handler from parent
//   addParcel, removeParcel, handleParcelChange - land parcel array handlers from parent

import { inp, lbl, errTxt, grid3, sectionBox } from "../components/TSRShared";

export default function TSRBasicInfo({
  form,
  errors,
  handleChange,
  addParcel,
  removeParcel,
  handleParcelChange,
}) {
  return (
    <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={grid3}>
        <div>
          <label style={lbl}>Author</label>
          <select name="author" value={form.author} onChange={handleChange} style={inp}>
            {["Narayan", "Priya Kulkarni", "Arun Patil", "Rohan Sane"].map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={lbl}>
            Application ID <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            name="appId"
            value={form.appId}
            onChange={handleChange}
            placeholder="e.g. 77000244168"
            style={{ ...inp, borderColor: errors.appId ? "#dc2626" : "var(--border)" }}
          />
          {errors.appId && <span style={errTxt}>{errors.appId}</span>}
        </div>
        <div>
          <label style={lbl}>Ref. No.</label>
          <input
            name="refNo"
            value={form.refNo}
            onChange={handleChange}
            placeholder="e.g. IHFC/TSR/691/2026"
            style={inp}
          />
        </div>
      </div>

      <div style={grid3}>
        <div>
          <label style={lbl}>
            Initiation Date <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            type="date"
            name="initiationDate"
            value={form.initiationDate}
            onChange={handleChange}
            style={{ ...inp, borderColor: errors.initiationDate ? "#dc2626" : "var(--border)" }}
          />
          {errors.initiationDate && <span style={errTxt}>{errors.initiationDate}</span>}
        </div>
        <div>
          <label style={lbl}>
            Applicant <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            name="applicant"
            value={form.applicant}
            onChange={handleChange}
            placeholder="Primary applicant name"
            style={{ ...inp, borderColor: errors.applicant ? "#dc2626" : "var(--border)" }}
          />
          {errors.applicant && <span style={errTxt}>{errors.applicant}</span>}
        </div>
        <div>
          <label style={lbl}>Co-Applicant</label>
          <input
            name="coApplicant"
            value={form.coApplicant}
            onChange={handleChange}
            placeholder="e.g. Mr. Subhash Ganpat Sarak"
            style={inp}
          />
        </div>
      </div>

      <div style={grid3}>
        <div>
          <label style={lbl}>Existing Owner (Title Holder)</label>
          <input
            name="existingOwner"
            value={form.existingOwner}
            onChange={handleChange}
            placeholder="e.g. Mr. Subhash Ganpat Sarak"
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>Transaction Type</label>
          <input
            name="transactionType"
            value={form.transactionType}
            onChange={handleChange}
            placeholder="e.g. LAP or Home Loan"
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>Bank Branch Office</label>
          <input
            name="bankBranch"
            value={form.bankBranch}
            onChange={handleChange}
            placeholder="e.g. Hadapsar Branch, Pune"
            style={inp}
          />
        </div>
      </div>

      <div style={grid3}>
        <div>
          <label style={lbl}>Branch Office</label>
          <select name="branch" value={form.branch} onChange={handleChange} style={inp}>
            {["Main", "Pune", "Mumbai", "Nashik", "Nagpur"].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={lbl}>Executive Mobile</label>
          <input
            name="executiveMobile"
            value={form.executiveMobile}
            onChange={handleChange}
            placeholder="10-digit mobile"
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>Executive Email</label>
          <input
            type="email"
            name="executiveEmail"
            value={form.executiveEmail}
            onChange={handleChange}
            placeholder="exec@company.com"
            style={inp}
          />
        </div>
      </div>

      <div style={grid3}>
        <div>
          <label style={lbl}>Municipal Property No.</label>
          <input
            name="municipalPropertyNo"
            value={form.municipalPropertyNo}
            onChange={handleChange}
            placeholder="e.g. P/M/83/01239000"
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>RCC Construction standing area</label>
          <input
            name="rccConstructionArea"
            value={form.rccConstructionArea}
            onChange={handleChange}
            placeholder="e.g. 750 sq. ft."
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>Municipal Council Limits</label>
          <input
            name="municipalCouncil"
            value={form.municipalCouncil}
            onChange={handleChange}
            placeholder="e.g. Fursungi-Uruli Devachi Municipal Council"
            style={inp}
          />
        </div>
      </div>

      <div style={grid3}>
        <div>
          <label style={lbl}>Village</label>
          <input
            name="village"
            value={form.village}
            onChange={handleChange}
            placeholder="e.g. Uruli Devachi"
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>Taluka</label>
          <input
            name="taluka"
            value={form.taluka}
            onChange={handleChange}
            placeholder="e.g. Haveli"
            style={inp}
          />
        </div>
        <div>
          <label style={lbl}>District</label>
          <input
            name="district"
            value={form.district}
            onChange={handleChange}
            placeholder="e.g. Pune"
            style={inp}
          />
        </div>
      </div>

      {/* Land Parcels */}
      <div>
        <label style={lbl}>Detailed Survey / Hissa No descriptions</label>
        <div style={sectionBox}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--black)" }}>
              Land Parcels
            </h4>
            <button
              type="button"
              onClick={addParcel}
              style={{
                background: "var(--black)",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              + Add Survey/Hissa
            </button>
          </div>

          {form.landParcels.map((parcel, index) => (
            <div
              key={index}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: 16,
                marginBottom: 16,
                background: "white",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <strong style={{ fontSize: 13 }}>Parcel #{index + 1}</strong>
                {form.landParcels.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParcel(index)}
                    style={{
                      background: "#f3f4f6",
                      color: "var(--black)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "6px 10px",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
                <input
                  placeholder="Survey / Gat No"
                  value={parcel.surveyNo}
                  onChange={(e) => handleParcelChange(index, "surveyNo", e.target.value)}
                  style={inp}
                />
                <input
                  placeholder="Hissa No"
                  value={parcel.hissaNo}
                  onChange={(e) => handleParcelChange(index, "hissaNo", e.target.value)}
                  style={inp}
                />
                <input
                  placeholder="Area Value"
                  value={parcel.area}
                  onChange={(e) => handleParcelChange(index, "area", e.target.value)}
                  style={inp}
                />
                <select
                  value={parcel.unit}
                  onChange={(e) => handleParcelChange(index, "unit", e.target.value)}
                  style={inp}
                >
                  <option value="">Select Unit</option>
                  <option value="Sq. Mtr">Sq. Mtr</option>
                  <option value="Sq. Ft">Sq. Ft</option>
                  <option value="Are">Are</option>
                  <option value="Hectare">Hectare</option>
                  <option value="Acre">Acre</option>
                  <option value="Guntha">Guntha</option>
                </select>
              </div>

              <textarea
                placeholder="Remarks"
                value={parcel.remarks}
                onChange={(e) => handleParcelChange(index, "remarks", e.target.value)}
                style={{ ...inp, marginTop: 12, minHeight: 60 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Boundaries */}
      <div style={sectionBox}>
        <h4 style={{ margin: "0 0 16px 0", fontSize: 15, color: "var(--black)" }}>
          Physical Boundaries (Legal descriptions)
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={lbl}>Boundary East</label>
            <input
              name="boundaryEast"
              value={form.boundaryEast}
              onChange={handleChange}
              placeholder="On or towards East"
              style={inp}
            />
          </div>
          <div>
            <label style={lbl}>Boundary West</label>
            <input
              name="boundaryWest"
              value={form.boundaryWest}
              onChange={handleChange}
              placeholder="On or towards West"
              style={inp}
            />
          </div>
          <div>
            <label style={lbl}>Boundary South</label>
            <input
              name="boundarySouth"
              value={form.boundarySouth}
              onChange={handleChange}
              placeholder="On or towards South"
              style={inp}
            />
          </div>
          <div>
            <label style={lbl}>Boundary North</label>
            <input
              name="boundaryNorth"
              value={form.boundaryNorth}
              onChange={handleChange}
              placeholder="On or towards North"
              style={inp}
            />
          </div>
        </div>
      </div>
    </div>
  );
}