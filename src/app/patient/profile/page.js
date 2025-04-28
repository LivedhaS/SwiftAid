"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  PencilIcon,
  CheckIcon,
  XIcon,
  UserCircle,
  Save,
  AlertCircle,
  Activity,
  MapPin,
  Phone,
  Shield,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PatientProfileForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({});
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    contactNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relation: "",
    },
    medicalHistory: [""],
    allergies: [""],
    currentMedications: [""],
    insuranceProvider: "",
    insuranceNumber: "",
  });

  // Fetch existing profile data when component mounts
  useEffect(() => {
    async function fetchProfile() {
      if (session?.user?.id) {
        try {
          const response = await fetch(
            `/api/patient/profile?userId=${session.user.id}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.profile) {
              // Format date to YYYY-MM-DD for input[type="date"]
              const formattedData = {
                ...data.profile,
                dateOfBirth: data.profile.dateOfBirth
                  ? new Date(data.profile.dateOfBirth)
                      .toISOString()
                      .split("T")[0]
                  : "",
              };

              // Ensure arrays have at least one empty string if they're empty
              const ensureArrayWithValue = (arr = []) =>
                arr.length ? arr : [""];

              setFormData({
                ...formattedData,
                medicalHistory: ensureArrayWithValue(
                  formattedData.medicalHistory
                ),
                allergies: ensureArrayWithValue(formattedData.allergies),
                currentMedications: ensureArrayWithValue(
                  formattedData.currentMedications
                ),
              });

              // If profile exists, start with all fields in view mode
              const initialEditMode = {};
              Object.keys(formattedData).forEach((key) => {
                if (
                  typeof formattedData[key] !== "object" ||
                  Array.isArray(formattedData[key])
                ) {
                  initialEditMode[key] = false;
                }
              });

              // Add nested object fields
              initialEditMode["address"] = false;
              initialEditMode["emergencyContact"] = false;

              setEditMode(initialEditMode);
            } else {
              // If no profile exists, start with all fields in edit mode
              setEditMode({
                dateOfBirth: true,
                gender: true,
                bloodGroup: true,
                contactNumber: true,
                address: true,
                emergencyContact: true,
                medicalHistory: true,
                allergies: true,
                currentMedications: true,
                insuranceProvider: true,
                insuranceNumber: true,
              });
            }
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    if (status !== "loading") {
      fetchProfile();
    }
  }, [session, status]);

  const toggleEditMode = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id.includes(".")) {
      const [section, key] = id.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleArrayChange = (field, value, index = 0) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const handleAddArrayItem = (field) => {
    setFormData((prev) => {
      return {
        ...prev,
        [field]: [...prev[field], ""],
      };
    });
  };

  const handleRemoveArrayItem = (field, index) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [field]: newArray.length ? newArray : [""],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) return alert("User not logged in");

    try {
      setSaving(true);

      // Clean up empty values from arrays
      const cleanedData = {
        ...formData,
        medicalHistory: formData.medicalHistory.filter(
          (item) => item.trim() !== ""
        ),
        allergies: formData.allergies.filter((item) => item.trim() !== ""),
        currentMedications: formData.currentMedications.filter(
          (item) => item.trim() !== ""
        ),
      };

      const res = await fetch("/api/patient/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cleanedData, user: session.user.id }),
      });

      const data = await res.json();

      if (res.ok) {
        // Set all fields to view mode after successful save
        const newEditMode = {};
        Object.keys(editMode).forEach((key) => {
          newEditMode[key] = false;
        });
        setEditMode(newEditMode);

        alert(data.message || "Profile saved successfully!");
        router.push("/patient/dashboard");
      } else {
        throw new Error(data.error || "Failed to save profile");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Display a field in view or edit mode
  const renderField = (label, id, type = "text", options = null) => {
    const isEditing = editMode[id.split(".")[0]];
    const value = id.includes(".")
      ? formData[id.split(".")[0]][id.split(".")[1]]
      : formData[id];

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-300" htmlFor={id}>
            {label}
          </label>
          {formData._id && (
            <button
              type="button"
              onClick={() => toggleEditMode(id.split(".")[0])}
              className="p-1 text-teal-400 hover:text-teal-300 rounded-full hover:bg-gray-700 transition-colors duration-200"
            >
              <PencilIcon size={16} />
            </button>
          )}
        </div>

        {isEditing ? (
          options ? (
            <select
              id={id}
              value={value}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              id={id}
              value={value}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            />
          )
        ) : (
          <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
            <span className={value ? "text-gray-300" : "text-gray-500"}>
              {value || "Not provided"}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Render an array field (like medical history, allergies)
  const renderArrayField = (label, field) => {
    const isEditing = editMode[field];

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-300">{label}</label>
          {formData._id && (
            <button
              type="button"
              onClick={() => toggleEditMode(field)}
              className="p-1 text-teal-400 hover:text-teal-300 rounded-full hover:bg-gray-700 transition-colors duration-200"
            >
              <PencilIcon size={16} />
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            {formData[field].map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange(field, e.target.value, index)
                  }
                  className="flex-grow p-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder={`Add ${label.toLowerCase()}`}
                />
                {formData[field].length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(field, index)}
                    className="ml-2 p-1.5 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-full transition-colors duration-200"
                  >
                    <XIcon size={14} />
                  </button>
                )}
                {index === formData[field].length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem(field)}
                    className="ml-2 p-1.5 bg-teal-900/30 text-teal-400 hover:bg-teal-900/50 rounded-full transition-colors duration-200"
                  >
                    <CheckIcon size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
            {formData[field].filter((item) => item.trim() !== "").length > 0 ? (
              <ul className="list-disc pl-5">
                {formData[field]
                  .filter((item) => item.trim() !== "")
                  .map((item, index) => (
                    <li key={index} className="text-gray-300">
                      {item}
                    </li>
                  ))}
              </ul>
            ) : (
              <span className="text-gray-500">None provided</span>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render a section of fields (like address)
  const renderSection = (title, section, fields) => {
    const isEditing = editMode[section];

    return (
      <div className="mb-6 p-5 bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-700 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-teal-400 flex items-center">
            {section === "address" && <MapPin className="mr-2 h-5 w-5" />}
            {section === "emergencyContact" && (
              <Phone className="mr-2 h-5 w-5" />
            )}
            {title}
          </h3>
          {formData._id && (
            <button
              type="button"
              onClick={() => toggleEditMode(section)}
              className="p-1.5 text-teal-400 hover:text-teal-300 rounded-full hover:bg-gray-700 transition-colors duration-200"
            >
              <PencilIcon size={16} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(([key, label]) => (
            <div key={key} className="mb-2">
              <label className="text-sm font-medium text-gray-300 mb-1 block">
                {label}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id={`${section}.${key}`}
                  value={formData[section][key]}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                />
              ) : (
                <div className="p-3 bg-gray-700 rounded-lg border border-gray-600">
                  <span
                    className={
                      formData[section][key] ? "text-gray-300" : "text-gray-500"
                    }
                  >
                    {formData[section][key] || "Not provided"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-900">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-teal-500 border-r-transparent"></div>
          <p className="mt-4 text-lg text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 animate-fadeIn bg-gray-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-xl shadow-md border border-gray-700 mb-6">
        <div className="flex items-center">
          <UserCircle className="h-10 w-10 text-teal-400 mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-100">
              {formData._id ? "Medical Profile" : "Complete Your Profile"}
            </h1>
            <p className="text-gray-300">
              {formData._id
                ? "Your health information is kept secure and used to provide better care"
                : "Please provide your medical information for better emergency care"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md border border-gray-700 transition-all duration-300">
          <h3 className="text-lg font-semibold text-teal-400 mb-4 flex items-center">
            <UserCircle className="mr-2 h-5 w-5" />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField("Date of Birth", "dateOfBirth", "date")}
            {renderField("Gender", "gender", "select", [
              "Male",
              "Female",
              "Other",
            ])}
            {renderField("Blood Group", "bloodGroup", "select", [
              "A+",
              "A-",
              "B+",
              "B-",
              "O+",
              "O-",
              "AB+",
              "AB-",
            ])}
            {renderField("Contact Number", "contactNumber")}
          </div>
        </div>

        {/* Address Section */}
        {renderSection("Address Information", "address", [
          ["street", "Street Address"],
          ["city", "City"],
          ["state", "State/Province"],
          ["zip", "Postal/ZIP Code"],
          ["country", "Country"],
        ])}

        {/* Emergency Contact Section */}
        {renderSection("Emergency Contact", "emergencyContact", [
          ["name", "Contact Name"],
          ["relation", "Relationship"],
          ["phone", "Contact Number"],
        ])}

        {/* Medical Information */}
        <div className="bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md border border-gray-700 transition-all duration-300">
          <h3 className="text-lg font-semibold text-teal-400 mb-4 flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Medical Information
          </h3>

          <div className="space-y-5">
            {renderArrayField("Medical History", "medicalHistory")}
            {renderArrayField("Allergies", "allergies")}
            {renderArrayField("Current Medications", "currentMedications")}
          </div>
        </div>

        {/* Insurance Information */}
        <div className="bg-gray-800 p-5 rounded-xl shadow-sm hover:shadow-md border border-gray-700 transition-all duration-300">
          <h3 className="text-lg font-semibold text-teal-400 mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Insurance Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderField("Insurance Provider", "insuranceProvider")}
            {renderField("Insurance Number", "insuranceNumber")}
          </div>
        </div>

        {/* Note about information security */}
        <div className="bg-teal-900/20 p-4 rounded-lg border-l-4 border-teal-500 flex items-start">
          <AlertCircle className="h-5 w-5 text-teal-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-teal-300">
            Your medical information is encrypted and securely stored. It will
            only be accessed by authorized medical professionals in case of
            emergency.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className={`
              px-6 py-3 rounded-lg text-white font-medium 
              ${
                saving
                  ? "bg-teal-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-500 hover:to-cyan-600 shadow hover:shadow-md"
              } 
              transition-all duration-300 flex items-center
            `}
          >
            {saving ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                {formData._id ? "Save Changes" : "Create Profile"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
