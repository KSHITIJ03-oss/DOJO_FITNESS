/**
 * Member detail page showing full member information.
 * Allows viewing and editing member details.
 */
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getMemberById,
  updateMember,
  deleteMember,
  uploadMemberImage,
  deleteMemberImage,
} from "../api/members";
import Loading from "../components/Loading";
import Button from "../components/forms/Button";
import Input from "../components/forms/Input";
import { formatDate } from "../utils/formatters";

const MemberDetail = () => {
  // const isDojoMember = member?.membership_type === "Dojo Membership";

  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
    membership_type: "",
    membership_start: "",
    membership_end: "",
  });

  useEffect(() => {
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    try {
      setLoading(true);
      const data = await getMemberById(id);
      setMember(data);
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        age: data.age || "",
        gender: data.gender || "",
        address: data.address || "",
        membership_type: data.membership_type || "",
        membership_start: data.membership_start || "",
        membership_end: data.membership_end || "",
      });
    } catch (error) {
      setError("Failed to load member. Please try again.");
      console.error("Error fetching member:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      // Prepare data for API (convert empty strings to null for optional fields)
      const updateData = {
        name: formData.name || null,
        phone: formData.phone || null,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        address: formData.address || null,
        membership_type: formData.membership_type || null,
        membership_start: formData.membership_start || null,
        membership_end: formData.membership_end || null,
      };

      const updated = await updateMember(id, updateData);
      setMember(updated);
      setEditing(false);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Failed to update member. Please try again.",
      );
      console.error("Error updating member:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this member? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await deleteMember(id);
      navigate("/members");
    } catch (error) {
      setError("Failed to delete member. Please try again.");
      console.error("Error deleting member:", error);
      setDeleting(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload JPG or PNG only.");
      return;
    }

    try {
      setUploadingImage(true);
      setError("");
      const updatedMember = await uploadMemberImage(id, file);
      setMember(updatedMember);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Failed to upload image. Please try again.",
      );
      console.error("Error uploading image:", error);
    } finally {
      setUploadingImage(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteImage = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this member's profile image?",
      )
    ) {
      return;
    }

    try {
      setUploadingImage(true);
      setError("");
      const updatedMember = await deleteMemberImage(id);
      setMember(updatedMember);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Failed to delete image. Please try again.",
      );
      console.error("Error deleting image:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading member..." />;
  }

  if (error && !member) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Member Not Found
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/members">
            <Button variant="primary">Back to Members</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/members"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <span className="mr-2">←</span>
          Back to Members
        </Link>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Member Header */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-6 flex-1">
              {/* Member Profile Image */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-700 border border-gray-600 flex items-center justify-center mb-3">
                  {member?.image_url ? (
                    <img
                      src={`http://localhost:8000/${member.image_url}`}
                      alt={member?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl">👤</div>
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    size="sm"
                    variant="primary"
                    // className="px-3 py-1 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImage ? "Uploading..." : "Add/Change"}
                  </Button>
                  {member?.image_url && (
                    <Button
                      onClick={handleDeleteImage}
                      disabled={uploadingImage}
                      size="sm"
                      variant="danger"
                      // className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Member Info */}
              {/* <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {editing ? "Edit Member" : member?.name || "Member Details"}
                </h1>
                {member?.id && (
                  <p className="text-gray-400">Member ID: #{member.id}</p>
                )}
              </div> */}

              <div className="flex items-center gap-3">
                {/* Member Name */}
                <h1 className="text-3xl font-bold text-white">
                  {editing ? "Edit Member" : member?.name || "Member Details"}
                </h1>

                {/* This runs ONLY if membership is Dojo */}
                {member?.membership_type === "Dojo Membership" && (
                  <span
                    className="px-3 py-1 text-sm font-semibold rounded-full 
                     bg-yellow-500/20 text-yellow-400 
                     border border-yellow-500/40"
                  >
                    🥋 DOJO MEMBER
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {!editing ? (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleting}
                    loading={deleting}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        name: member.name || "",
                        phone: member.phone || "",
                        age: member.age || "",
                        gender: member.gender || "",
                        address: member.address || "",
                        membership_type: member.membership_type || "",
                        membership_start: member.membership_start || "",
                        membership_end: member.membership_end || "",
                      });
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    loading={saving}
                    disabled={saving}
                  >
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Member Details Form */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={!editing}
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1234567890"
              disabled={!editing}
            />

            <Input
              label="Age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="25"
              disabled={!editing}
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <Input
                label="Address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, City, State"
                disabled={!editing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Membership Type
              </label>
              <select
                name="membership_type"
                value={formData.membership_type}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Membership</option>
                <option value="Monthly">Monthly</option>
                <option value="Annual">Annual</option>
                <option value="Dojo Membership">Dojo Membership</option>
                {/* <option value="Premium">Premium</option>
                <option value="VIP">VIP</option> */}
              </select>
            </div>

            <Input
              label="Membership Start Date"
              type="date"
              name="membership_start"
              value={formData.membership_start}
              onChange={handleChange}
              disabled={!editing}
            />

            <Input
              label="Membership End Date"
              type="date"
              name="membership_end"
              value={formData.membership_end}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          {/* Additional Info */}
          {member?.created_at && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                Member since: {formatDate(member.created_at)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
