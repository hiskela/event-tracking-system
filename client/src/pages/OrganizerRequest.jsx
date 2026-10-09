import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function OrganizerRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    organization: "",
    reason: "",
    phone: "",
    additionalInfo: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/organizer-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit request");
      }

      setMessage(data.message || "Organizer request submitted successfully");

      setFormData({
        organization: "",
        reason: "",
        phone: "",
        additionalInfo: "",
      });
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            ← Back
          </button>

          <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15 text-3xl">
                🎤
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                  Join our organizers
                </p>

                <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Become an Organizer
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                  Share your plans with the community. Submit your application
                  and an administrator will review your request.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-bold text-gray-900">
                Organizer Application
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Complete the required information below.
              </p>
            </div>

            {message && (
              <div
                role="status"
                className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
              >
                <p className="font-semibold">✓ Request submitted</p>
                <p className="mt-1">{message}</p>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="organization"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Organization name <span className="text-red-500">*</span>
                </label>

                <input
                  id="organization"
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="Enter your organization name"
                  required
                  maxLength={120}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <label
                  htmlFor="reason"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Why do you want to become an organizer?{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Tell us about the events you plan to organize..."
                  rows={5}
                  required
                  maxLength={2000}
                  className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Phone number <span className="text-red-500">*</span>
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  maxLength={30}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <label
                  htmlFor="additionalInfo"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Additional information{" "}
                  <span className="font-normal text-gray-400">(Optional)</span>
                </label>

                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Add relevant experience or other details..."
                  rows={4}
                  maxLength={2000}
                  className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div className="border-t border-gray-100 pt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Submitting application..." : "Submit Application →"}
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-gray-500">
                  Your application will be reviewed by an administrator.
                </p>
              </div>
            </form>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-gray-900">What happens next?</h3>

              <div className="mt-5 space-y-5">
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    1
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Submit your request
                    </p>
                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      Tell us about your organization and plans.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    2
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Admin review
                    </p>
                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      An administrator reviews your application.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    3
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Start organizing
                    </p>
                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      If approved, your account can create events.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-sm font-semibold text-blue-900">
                💡 Helpful tip
              </p>
              <p className="mt-2 text-sm leading-6 text-blue-800">
                Explain what types of events you plan to host and how they
                will benefit participants.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default OrganizerRequest;