import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Outlet as OnboardingOutlet,
  Org,
  UserRole,
  OnboardingRequest,
} from "../../types/onboarding";
import { onboardingService } from "../../services/onboardingService";
import "./OnboardingPage.css";

interface FormManager {
  fullName: string;
  email: string;
}

interface FormOutlet {
  name: string;
  address: string;
  coordinates: string;
  manager: FormManager;
}

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1); // 1: Entry, 2: Form, 3: Success
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");

  // Form Sections State (Collapsible)
  const [activeSection, setActiveSection] = useState<number>(0);

  // 1. Organization Admin
  const [adminInfo, setAdminInfo] = useState({
    fullName: "",
    email: "",
    role: "ORGANISATION ADMIN", // Displays to user
  });

  // 2. Organization Details
  const [orgDetails, setOrgDetails] = useState({
    name: "",
    logo: null as File | null,
    offerLetterTemplate: null as File | null,
  });

  // 3. Outlets
  const [outlets, setOutlets] = useState<FormOutlet[]>([
    {
      name: "",
      address: "",
      coordinates: "",
      manager: { fullName: "", email: "" },
    },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step, activeSection]);

  useEffect(() => {
    const lastVerified = sessionStorage.getItem("lastVerifiedCode");
    const verificationTime = sessionStorage.getItem("verificationTime");

    if (lastVerified && verificationTime) {
      const timeDiff = Date.now() - parseInt(verificationTime);
      if (timeDiff < 60 * 60 * 1000) {
        // 60 minutes
        setStep(2);
      }
    }
  }, []);

  const handleVerifyCode = () => {
    const expectedCode = process.env.REACT_APP_ACCESS_CODE;
    if (accessCode.toUpperCase() === expectedCode?.toUpperCase()) {
      sessionStorage.setItem("lastVerifiedCode", accessCode);
      sessionStorage.setItem("verificationTime", Date.now().toString());
      setStep(2);
      setError("");
    } else {
      setError("Invalid access code. Please try again.");
    }
  };

  const handleAddOutlet = () => {
    setOutlets([
      ...outlets,
      {
        name: "",
        address: "",
        coordinates: "",
        manager: { fullName: "", email: "" },
      },
    ]);
  };

  const handleRemoveOutlet = (index: number) => {
    if (outlets.length > 1) {
      setOutlets(outlets.filter((_, i) => i !== index));
    }
  };

  const updateOutlet = (
    index: number,
    field: keyof FormOutlet | "managerName" | "managerEmail",
    value: string,
  ) => {
    const newOutlets = [...outlets];
    if (field === "managerName") {
      newOutlets[index].manager.fullName = value;
    } else if (field === "managerEmail") {
      newOutlets[index].manager.email = value;
    } else {
      (newOutlets[index] as any)[field] = value;
    }
    setOutlets(newOutlets);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the onboarding request object using the new types
    const adminUser: User = {
      name: adminInfo.fullName,
      email: adminInfo.email,
      role: UserRole.ORG_ADMIN,
    };

    const managerUsers: User[] = outlets.map((o) => ({
      name: o.manager.fullName,
      email: o.manager.email,
      role: UserRole.MANAGER,
    }));

    const org: Org = {
      name: orgDetails.name,
      logo: orgDetails.logo,
      offerLetterPdf: orgDetails.offerLetterTemplate,
    };

    const onboardingOutlets: OnboardingOutlet[] = outlets.map((o) => ({
      name: o.name,
      location: o.coordinates,
      address: o.address,
    }));

    const finalPayload: OnboardingRequest = {
      users: [adminUser, ...managerUsers],
      outlets: onboardingOutlets,
      org: org,
    };

    // Submit to backend
    const submitData = async () => {
      setError("");
      try {
        const result = await onboardingService.submitOnboarding(finalPayload);
        if (result.success) {
          setStep(3);
        } else {
          setError(
            result.error || "Failed to submit registration. Please try again.",
          );
          // Scroll to error if needed, or stay on form
          window.scrollTo(0, 0);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
        window.scrollTo(0, 0);
      }
    };

    submitData();
  };

  if (step === 3) {
    return (
      <div className="onboarding-page">
        <div className="onboarding-card success-card">
          <div className="success-icon">✓</div>
          <h2 className="text-gradient">Registration Successful!</h2>
          <p>
            Thank you for choosing ShaktiSetu. We have received your
            organization details. You will receive a confirmation email at{" "}
            <strong>{adminInfo.email}</strong> shortly.
          </p>
          <button
            className="onboarding-btn"
            onClick={() => (window.location.href = "/")}
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-page">
      {step === 1 ? (
        <div className="onboarding-card">
          <h2 className="text-gradient">Welcome Aboard</h2>
          <p>
            Enter your invitation code to begin the professional onboarding
            process.
          </p>
          <div className="form-group">
            <input
              type="text"
              className="modern-input"
              placeholder="Invitation Code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleVerifyCode()}
            />
            {error && <span className="error-text">{error}</span>}
          </div>
          <button className="onboarding-btn" onClick={handleVerifyCode}>
            Verify & Continue
          </button>
        </div>
      ) : (
        <div className="onboarding-container">
          <div className="onboarding-header">
            <h1 className="text-gradient">Organization Onboarding</h1>
            <p>Setup your account, organization, and outlets in one place.</p>
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            {/* SECTION 1: ADMIN INFO */}
            <div
              className={`form-section ${activeSection === 0 ? "active" : ""}`}
            >
              <div
                className="section-header"
                onClick={() => setActiveSection(0)}
              >
                <span className="step-num">01</span>
                <h3>Organization Admin User</h3>
                <span className="toggle-icon">
                  {activeSection === 0 ? "−" : "+"}
                </span>
              </div>

              <div className="section-content">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      required
                      value={adminInfo.fullName}
                      onChange={(e) =>
                        setAdminInfo({ ...adminInfo, fullName: e.target.value })
                      }
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      required
                      value={adminInfo.email}
                      onChange={(e) =>
                        setAdminInfo({ ...adminInfo, email: e.target.value })
                      }
                      placeholder="john@organization.com"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    value={adminInfo.role}
                    disabled
                    className="disabled-input"
                  />
                  <span className="helper-text">
                    Superuser: Access to all organization data on the portal.
                  </span>
                </div>
                <button
                  type="button"
                  className="next-section-btn"
                  onClick={() => setActiveSection(1)}
                >
                  Next Step: Organization Details
                </button>
              </div>
            </div>

            {/* SECTION 2: ORG DETAILS */}
            <div
              className={`form-section ${activeSection === 1 ? "active" : ""}`}
            >
              <div
                className="section-header"
                onClick={() => setActiveSection(1)}
              >
                <span className="step-num">02</span>
                <h3>Organization Details</h3>
                <span className="toggle-icon">
                  {activeSection === 1 ? "−" : "+"}
                </span>
              </div>

              <div className="section-content">
                <div className="form-group">
                  <label>Organization Name</label>
                  <input
                    type="text"
                    required
                    value={orgDetails.name}
                    onChange={(e) =>
                      setOrgDetails({ ...orgDetails, name: e.target.value })
                    }
                    placeholder="e.g. McDonald's India"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Organization Logo (.png, .jpg)</label>
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setOrgDetails({
                            ...orgDetails,
                            logo: e.target.files?.[0] || null,
                          })
                        }
                      />
                      <span className="file-label">
                        {orgDetails.logo ? orgDetails.logo.name : "Choose Logo"}
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Offer Letter Template (PDF)</label>
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) =>
                          setOrgDetails({
                            ...orgDetails,
                            offerLetterTemplate: e.target.files?.[0] || null,
                          })
                        }
                      />
                      <span className="file-label">
                        {orgDetails.offerLetterTemplate
                          ? orgDetails.offerLetterTemplate.name
                          : "Choose PDF"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="next-section-btn"
                  onClick={() => setActiveSection(2)}
                >
                  Next Step: Outlets & Managers
                </button>
              </div>
            </div>

            {/* SECTION 3: OUTLETS & MANAGERS */}
            <div
              className={`form-section ${activeSection === 2 ? "active" : ""}`}
            >
              <div
                className="section-header"
                onClick={() => setActiveSection(2)}
              >
                <span className="step-num">03</span>
                <h3>Outlets & Managers</h3>
                <span className="toggle-icon">
                  {activeSection === 2 ? "−" : "+"}
                </span>
              </div>

              <div className="section-content">
                {outlets.map((outlet, idx) => (
                  <div key={idx} className="outlet-card">
                    <div className="outlet-card-header">
                      <h4>Outlet #{idx + 1}</h4>
                      {outlets.length > 1 && (
                        <button
                          type="button"
                          className="remove-link"
                          onClick={() => handleRemoveOutlet(idx)}
                        >
                          Remove Outlet
                        </button>
                      )}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Outlet Name</label>
                        <input
                          type="text"
                          required
                          value={outlet.name}
                          onChange={(e) =>
                            updateOutlet(idx, "name", e.target.value)
                          }
                          placeholder="Andheri West Outlet"
                        />
                      </div>
                      <div className="form-group">
                        <label>Location Coordinates</label>
                        <input
                          type="text"
                          required
                          value={outlet.coordinates}
                          onChange={(e) =>
                            updateOutlet(idx, "coordinates", e.target.value)
                          }
                          placeholder="e.g. 19.1136, 72.8697"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Complete Address</label>
                      <textarea
                        required
                        rows={2}
                        value={outlet.address}
                        onChange={(e) =>
                          updateOutlet(idx, "address", e.target.value)
                        }
                        placeholder="Street, Building, Landmark, Pincode"
                      />
                    </div>

                    <div className="manager-sub-section">
                      <h5>Assigned Outlet Manager</h5>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Manager Name</label>
                          <input
                            type="text"
                            required
                            value={outlet.manager.fullName}
                            onChange={(e) =>
                              updateOutlet(idx, "managerName", e.target.value)
                            }
                            placeholder="Full Name"
                          />
                        </div>
                        <div className="form-group">
                          <label>Manager Email</label>
                          <input
                            type="email"
                            required
                            value={outlet.manager.email}
                            onChange={(e) =>
                              updateOutlet(idx, "managerEmail", e.target.value)
                            }
                            placeholder="manager@outlet.com"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Role</label>
                        <input
                          type="text"
                          value="MANAGER"
                          disabled
                          className="disabled-input"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="add-outlet-btn-modern"
                  onClick={handleAddOutlet}
                >
                  + Add Another Outlet
                </button>
              </div>
            </div>

            <div className="form-footer">
              {error && <div className="error-message-banner">{error}</div>}
              <button type="submit" className="onboarding-btn final-btn">
                Complete Onboarding Registration
              </button>
              <p className="privacy-notice">
                By submitting, you agree to ShaktiSetu's{" "}
                <Link to="/terms" target="_blank" rel="noopener noreferrer">
                  Terms and conditions for Employers
                </Link>
                .
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
