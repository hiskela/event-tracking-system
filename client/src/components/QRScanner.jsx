
import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QRScanner({ onScan }) {
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250,
        },
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        onScanRef.current(decodedText);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch((error) => {
        console.error("Failed to stop QR scanner:", error);
      });
    };
  }, []);

  return (
    <div className="w-full">
      <div id="qr-reader" className="mx-auto w-full max-w-lg" />

      <p className="mt-4 text-center text-sm text-gray-500">
        Allow camera access and position the QR code inside the scanning box.
      </p>
    </div>
  );
}

export default QRScanner;