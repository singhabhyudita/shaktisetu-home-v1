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
import MapPicker from "../Common/MapPicker";
import "./OnboardingPage.css";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

interface FormManager {
  fullName: string;
  email: string;
}

interface FormOutlet {
  name: string;
  address: string;
  lat: number;
  lng: number;
  manager: FormManager;
}

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    logo: null as string | null,
    logoName: "",
    offerLetterTemplate: null as string | null,
    offerLetterName: "",
  });

  // 3. Outlets
  const [outlets, setOutlets] = useState<FormOutlet[]>([
    {
      name: "",
      address: "",
      lat: 19.076, // Mumbai default
      lng: 72.8777,
      manager: { fullName: "", email: "" },
    },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const handleAddOutlet = () => {
    setOutlets([
      ...outlets,
      {
        name: "",
        address: "",
        lat: 19.076,
        lng: 72.8777,
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
    value: any,
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

    // Clear field error on change
    const errorKey = `outlet-${index}-${field}`;
    if (fieldErrors[errorKey]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    let firstErrorSection = -1;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!token.trim()) {
      errors["token"] = true;
      if (firstErrorSection === -1) firstErrorSection = 0;
    }
    if (!adminInfo.fullName.trim()) {
      errors["adminInfo.fullName"] = true;
      if (firstErrorSection === -1) firstErrorSection = 0;
    }
    if (!adminInfo.email.trim() || !emailRegex.test(adminInfo.email)) {
      errors["adminInfo.email"] = true;
      if (firstErrorSection === -1) firstErrorSection = 0;
    }
    if (!orgDetails.name.trim()) {
      errors["orgDetails.name"] = true;
      if (firstErrorSection === -1) firstErrorSection = 1;
    }

    outlets.forEach((outlet, index) => {
      if (!outlet.name.trim()) {
        errors[`outlet-${index}-name`] = true;
        if (firstErrorSection === -1) firstErrorSection = 2;
      }
      if (!outlet.address.trim()) {
        errors[`outlet-${index}-address`] = true;
        if (firstErrorSection === -1) firstErrorSection = 2;
      }
      if (!outlet.manager.fullName.trim()) {
        errors[`outlet-${index}-managerName`] = true;
        if (firstErrorSection === -1) firstErrorSection = 2;
      }
      if (
        !outlet.manager.email.trim() ||
        !emailRegex.test(outlet.manager.email)
      ) {
        errors[`outlet-${index}-managerEmail`] = true;
        if (firstErrorSection === -1) firstErrorSection = 2;
      }
    });

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError(
        "Please fill in all required fields highlighted in red. Ensure emails are valid.",
      );
      if (firstErrorSection !== -1) setActiveSection(firstErrorSection);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }

    return true;
  };

  const handleAdminChange = (field: "fullName" | "email", value: string) => {
    setAdminInfo((prev) => ({ ...prev, [field]: value }));
    const errorKey = `adminInfo.${field}`;
    if (fieldErrors[errorKey]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const handleOrgChange = (field: "name", value: string) => {
    setOrgDetails((prev) => ({ ...prev, [field]: value }));
    const errorKey = `orgDetails.${field}`;
    if (fieldErrors[errorKey]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const handleTokenChange = (value: string) => {
    setToken(value.toUpperCase());
    if (fieldErrors["token"]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next["token"];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const adminUser: User = {
        name: adminInfo.fullName,
        email: adminInfo.email,
        role: UserRole.ORG_ADMIN,
      };

      const org: Org = {
        name: orgDetails.name,
        logo: orgDetails.logo,
        offerLetterPdf: orgDetails.offerLetterTemplate,
        adminUser: adminUser,
      };

      const onboardingOutlets: OnboardingOutlet[] = outlets.map((o) => ({
        name: o.name,
        location: {
          address: o.address,
          coordinates: {
            lat: o.lat,
            lng: o.lng,
          },
        },
        managerUser: {
          name: o.manager.fullName,
          email: o.manager.email,
          role: UserRole.MANAGER,
        },
      }));

      const finalPayload: OnboardingRequest = {
        token: token,
        outlets: onboardingOutlets,
        org: org,
      };

      const result = await onboardingService.submitOnboarding(finalPayload);
      if (result.success) {
        setStep(2);
      } else {
        setError(
          result.error || "Failed to submit registration. Please try again.",
        );
        window.scrollTo(0, 0);
      }
    } catch (err) {
      let friendlyMessage =
        "An unexpected error occurred. Please try again later.";
      if (err instanceof Error) {
        if (
          err.message.includes("Edge function") ||
          err.message.includes("non-2xx")
        ) {
          friendlyMessage =
            "Failed to process registration. Please check your data and try again.";
        } else {
          friendlyMessage = err.message;
        }
      }
      setError(friendlyMessage);
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 2) {
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
      <div className="onboarding-container">
        <div className="onboarding-header">
          <h1 className="text-gradient">Organization Onboarding</h1>
          <p>Setup your account, organization, and outlets in one place.</p>
        </div>

        <form onSubmit={handleSubmit} className="modern-form" noValidate>
          {/* SECTION 1: INVITATION & ADMIN */}
          <div
            className={`form-section ${activeSection === 0 ? "active" : ""}`}
          >
            <div className="section-header" onClick={() => setActiveSection(0)}>
              <span className="step-num">01</span>
              <h3>Invitation & Admin</h3>
              <span className="toggle-icon">
                {activeSection === 0 ? "−" : "+"}
              </span>
            </div>

            <div className="section-content">
              <div className="form-group invitation-group">
                <label>Invitation Code</label>
                <input
                  type="text"
                  className={`modern-input invitation-input ${
                    fieldErrors["token"] ? "invalid" : ""
                  }`}
                  placeholder="Enter your invitation code"
                  value={token}
                  onChange={(e) => handleTokenChange(e.target.value)}
                />
                <span className="helper-text">
                  Provided by ShaktiSetu team via email.
                </span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Admin Full Name</label>
                  <input
                    type="text"
                    className={
                      fieldErrors["adminInfo.fullName"] ? "invalid" : ""
                    }
                    value={adminInfo.fullName}
                    onChange={(e) =>
                      handleAdminChange("fullName", e.target.value)
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Admin Email Address</label>
                  <input
                    type="email"
                    className={fieldErrors["adminInfo.email"] ? "invalid" : ""}
                    value={adminInfo.email}
                    onChange={(e) => handleAdminChange("email", e.target.value)}
                    placeholder="john@organization.com"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Default Role</label>
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
            <div className="section-header" onClick={() => setActiveSection(1)}>
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
                  className={fieldErrors["orgDetails.name"] ? "invalid" : ""}
                  value={orgDetails.name}
                  onChange={(e) => handleOrgChange("name", e.target.value)}
                  placeholder="e.g. McDonald's India"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="org-logo">
                    Organization Logo (.png, .jpg)
                  </label>
                  <div className="file-upload-wrapper">
                    <input
                      id="org-logo"
                      data-testid="logo-input"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const base64 = await fileToBase64(file);
                          setOrgDetails((prev) => ({
                            ...prev,
                            logo: base64,
                            logoName: file.name,
                          }));
                        }
                      }}
                    />
                    <span className="file-label" data-testid="logo-name">
                      {orgDetails.logoName || "Choose Logo"}
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="offer-letter">
                    Offer Letter Template (PDF)
                  </label>
                  <div className="file-upload-wrapper">
                    <input
                      id="offer-letter"
                      data-testid="pdf-input"
                      type="file"
                      accept=".pdf"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const base64 = await fileToBase64(file);
                          setOrgDetails((prev) => ({
                            ...prev,
                            offerLetterTemplate: base64,
                            offerLetterName: file.name,
                          }));
                        }
                      }}
                    />
                    <span className="file-label" data-testid="pdf-name">
                      {orgDetails.offerLetterName || "Choose PDF"}
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
            <div className="section-header" onClick={() => setActiveSection(2)}>
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

                  <div className="outlet-form-column">
                    <div className="form-group">
                      <label>Outlet Name</label>
                      <input
                        type="text"
                        className={
                          fieldErrors[`outlet-${idx}-name`] ? "invalid" : ""
                        }
                        value={outlet.name}
                        onChange={(e) =>
                          updateOutlet(idx, "name", e.target.value)
                        }
                        placeholder="Andheri West Outlet"
                      />
                    </div>

                    <MapPicker
                      initialCenter={[outlet.lat, outlet.lng]}
                      onLocationSelect={(lat, lng) => {
                        updateOutlet(idx, "lat", lat);
                        updateOutlet(idx, "lng", lng);
                      }}
                    />

                    <div className="form-group">
                      <label>Complete Address</label>
                      <textarea
                        rows={2}
                        className={
                          fieldErrors[`outlet-${idx}-address`] ? "invalid" : ""
                        }
                        value={outlet.address}
                        onChange={(e) =>
                          updateOutlet(idx, "address", e.target.value)
                        }
                        placeholder="Street, Building, Landmark, Pincode"
                      />
                    </div>
                  </div>

                  <div className="manager-sub-section">
                    <h5>Assigned Outlet Manager</h5>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Manager Name</label>
                        <input
                          type="text"
                          className={
                            fieldErrors[`outlet-${idx}-managerName`]
                              ? "invalid"
                              : ""
                          }
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
                          className={
                            fieldErrors[`outlet-${idx}-managerEmail`]
                              ? "invalid"
                              : ""
                          }
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
            <button
              type="submit"
              className="onboarding-btn final-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting Registration..."
                : "Complete Onboarding Registration"}
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
    </div>
  );
};

export default OnboardingPage;
