
import { useCallback, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import QRScanner from "../components/QRScanner";

function QRScannerTest() {
  const navigate = useNavigate();

  const [scannedCode, setScannedCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const [searchParams] = useSearchParams();
const eventId = searchParams.get("eventId");
  const processingRef = useRef(false);
  const attemptedCodeRef = useRef("");

  const handleScan = useCallback(async (decodedText) => {
    if (
      !decodedText ||
      processingRef.current ||
      attemptedCodeRef.current === decodedText
    ) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in before scanning tickets.");
      return;
    }

    processingRef.current = true;
    attemptedCodeRef.current = decodedText;

    setScannedCode(decodedText);
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/registrations/check-in",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ticketCode: decodedText,
eventId
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Check-in failed");
      }

      setMessage(data.message || "Participant checked in successfully.");
    } catch (error) {
      setError(error.message);
    } finally {
      processingRef.current = false;
      setLoading(false);
    }
  }, []);

  const handleScanAgain = () => {
    attemptedCodeRef.current = "";
    setScannedCode("");
    setMessage("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          ← Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            QR Check-In
          </h1>

          <p className="mt-2 text-gray-600">
            Scan a participant's event ticket to verify it and record attendance.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
          <QRScanner onScan={handleScan} />

          {loading && (
            <p className="mt-5 rounded-lg bg-yellow-50 p-4 text-yellow-800">
              Checking ticket...
            </p>
          )}

          {scannedCode && (
            <div className="mt-5 rounded-lg bg-gray-50 p-4">
              <h2 className="font-semibold text-gray-900">
                Scanned Ticket Code
              </h2>

              <p className="mt-2 break-all font-mono text-sm text-gray-700">
                {scannedCode}
              </p>
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-lg bg-green-100 p-4 text-green-800">
              <p className="font-semibold">Check-in successful</p>
              <p className="mt-1">{message}</p>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg bg-red-100 p-4 text-red-800">
              <p className="font-semibold">Check-in failed</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {(message || error) && !loading && (
            <button
              onClick={handleScanAgain}
              className="mt-5 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Scan Another Ticket
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default QRScannerTest;
