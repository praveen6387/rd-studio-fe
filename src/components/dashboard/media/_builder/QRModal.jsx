import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import toast from "react-hot-toast";

const QRModal = ({ isOpen, onClose, mediaData }) => {
  if (!mediaData) return null;

  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://127.0.0.1:3000";
  const mediaUrl = `${baseUrl}/media-view/${mediaData.media_unique_id}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(mediaUrl);
    toast.success("URL copied to clipboard!", {
      duration: 3000,
      position: "bottom-right",
    });
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-${mediaData.media_unique_id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      toast.success("QR code downloaded!", {
        duration: 3000,
        position: "bottom-right",
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Media QR Code</DialogTitle>
          <DialogDescription className="text-gray-600">
            Scan this QR code to view the media or share the URL
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Display */}
          <div className="flex justify-center items-center p-6 bg-gray-50 rounded-lg">
            <QRCodeSVG
              id="qr-code-svg"
              value={mediaUrl}
              size={256}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          {/* URL Display */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">Media URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={mediaUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-700"
              />
              <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Media Info */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Media ID:</span>
              <span className="font-medium text-gray-900">{mediaData.media_unique_id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Media Type:</span>
              <span className="font-medium text-gray-900">{mediaData.media_type_name}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleDownloadQR}>
              <Download className="h-4 w-4 mr-2" />
              Download QR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRModal;
