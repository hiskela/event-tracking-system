import { useCallback, useState } from "react";
import QRScanner from "../components/QRScanner";

function QRScannerTest() {
  const [scannedCode, setScannedCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScan = useCallback(async (decodedText) => {
    if (scannedCode === decodedText || loading) {
      return;
    }

    setScannedCode(decodedText);
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

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
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Check-in failed");
      }

      setMessage(data.message);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [scannedCode, loading]);

  return (
   
  <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="mb-6 text-4xl font-bold text-blue-600">
      QR Check-In
    </h1>
    <QRScanner onScan={handleScan} />

    {loading && (
      <p className="mt-4 text-yellow-600">
        Checking ticket...
      </p>
    )}

    {scannedCode && (
      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-bold">
          Scanned Ticket Code
        </h2>

        <p className="mt-2 text-gray-600">
          {scannedCode}
        </p>
      </div>
    )}

    {message && (
      <div className="mt-6 rounded-lg bg-green-100 p-4 text-green-700">
        {message}
      </div>
    )}

    {error && (
      <div className="mt-6 rounded-lg bg-red-100 p-4 text-red-700">
        {error}
      </div>
    )}
  </div>
);

}

export default QRScannerTest;