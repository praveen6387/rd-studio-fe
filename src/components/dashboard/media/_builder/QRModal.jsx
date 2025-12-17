import React, { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Download, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import Tag from "@/components/ui/tag";

const QRModal = ({ isOpen, onClose, mediaData }) => {
  if (!mediaData) return null;
  console.log(mediaData);

  const baseUrl =
    typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : "http://127.0.0.1:3000";
  const mediaUrl = `${baseUrl}/media-view/${mediaData.media_unique_id}?is_open=true`;
  const centerText = "RD"; // Change this text as needed
  const qrSize = 256;
  const bottomTitle = mediaData?.media_title || "Your Title";
  const bottomCode = mediaData?.code || mediaData?.media_unique_id || "";
  const bottomBy = mediaData?.studio_name ? `By: ${mediaData.studio_name}` : "By: RD-Studio";

  // Build an inline SVG image (white rounded box + text) and embed it via imageSettings with excavate
  const centerImage = useMemo(() => {
    const width = Math.min(qrSize * 0.34, 50);
    const height = Math.min(qrSize * 0.16, 40);
    const radius = Math.round(height * 0.24);
    const fontSize = Math.min(height * 0.55, 18);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(width)}" height="${Math.round(
      height
    )}"><rect x="0" y="0" width="${Math.round(width)}" height="${Math.round(
      height
    )}" rx="${radius}" fill="#ffffff"/><text x="${Math.round(width / 2)}" y="${Math.round(
      height / 2 + height * 0.06
    )}" text-anchor="middle" dominant-baseline="middle" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="700" fill="#000000">${centerText}</text></svg>`;
    return {
      src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      width: Math.round(width),
      height: Math.round(height),
    };
  }, [centerText, qrSize]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(mediaUrl);
    toast.success("URL copied to clipboard!", {
      duration: 3000,
      position: "bottom-right",
    });
  };

  const handleOpenUrl = () => {
    window.open(mediaUrl, "_blank", "noopener,noreferrer");
    toast.success("Opening media in new tab...", {
      duration: 2000,
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
      // Hi-DPI scale for sharper export
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      const scale = Math.max(2, Math.min(4, Math.round(dpr * 2))); // between 2x and 4x

      // Header text (fixed like reference)
      const headerTitle = "Preserve Your Memories";
      const headerSubtitle = "Scan QR Code & View 24x7 anywhere anytime";

      // Typography
      const fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif";
      const titleSize = 22;
      const subtitleSize = 13;
      const btmTitleSize = 18;
      const codeSize = 14;
      const bySize = 14;

      // Spacing
      const padding = 24;
      const lineGapSm = 6;
      const blockGap = 16;

      // QR intrinsic size from the rendered SVG image
      const qrW = img.naturalWidth || img.width;
      const qrH = img.naturalHeight || img.height;

      // Measure widths to determine canvas width
      ctx.font = `700 ${titleSize}px ${fontFamily}`;
      const wTitle = ctx.measureText(headerTitle).width;
      ctx.font = `400 ${subtitleSize}px ${fontFamily}`;
      const wSub = ctx.measureText(headerSubtitle).width;
      ctx.font = `700 ${btmTitleSize}px ${fontFamily}`;
      const wBtmTitle = ctx.measureText(bottomTitle).width;
      ctx.font = `500 ${codeSize}px ${fontFamily}`;
      const wCode = bottomCode ? ctx.measureText(bottomCode).width : 0;
      ctx.font = `700 ${bySize}px ${fontFamily}`;
      const wBy = bottomBy ? ctx.measureText(bottomBy).width : 0;

      const contentMaxWidth = Math.max(qrW, wTitle, wSub, wBtmTitle, wCode, wBy);
      const canvasWidth = Math.ceil(contentMaxWidth) + padding * 2;

      // Determine total height
      const headerHeight = titleSize + lineGapSm + subtitleSize;
      const footerHeight =
        btmTitleSize + (bottomCode ? lineGapSm + codeSize : 0) + (bottomBy ? lineGapSm + bySize : 0);
      const canvasHeight = padding + headerHeight + blockGap + qrH + blockGap + footerHeight + padding;

      // Set scaled canvas size for crisp output
      canvas.width = Math.ceil(canvasWidth * scale);
      canvas.height = Math.ceil(canvasHeight * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0); // scale drawing space
      ctx.imageSmoothingEnabled = false;

      // Use virtual dimensions (unscaled units) for all drawing
      const vWidth = canvasWidth;
      const vHeight = canvasHeight;

      // Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, vWidth, vHeight);

      // Draw header
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const cx = vWidth / 2;
      let y = padding;
      ctx.font = `700 ${titleSize}px ${fontFamily}`;
      ctx.fillStyle = "#111827"; // gray-900
      ctx.fillText(headerTitle, cx, y);
      y += titleSize + lineGapSm;
      ctx.font = `400 ${subtitleSize}px ${fontFamily}`;
      ctx.fillStyle = "#6b7280"; // gray-500
      ctx.fillText(headerSubtitle, cx, y);
      y += subtitleSize + blockGap;

      // Draw QR
      const qrX = (vWidth - qrW) / 2;
      // Draw the vector SVG at intrinsic size; scaling handled by transform
      ctx.drawImage(img, qrX, y, qrW, qrH);
      y += qrH + blockGap;

      // Draw footer
      ctx.font = `700 ${btmTitleSize}px ${fontFamily}`;
      ctx.fillStyle = "#111827";
      ctx.fillText(bottomTitle, cx, y);
      y += btmTitleSize;
      if (bottomCode) {
        y += lineGapSm;
        ctx.font = `500 ${codeSize}px ${fontFamily}`;
        ctx.fillStyle = "#374151"; // gray-700
        ctx.fillText(bottomCode, cx, y);
        y += codeSize;
      }
      if (bottomBy) {
        y += lineGapSm;
        ctx.font = `700 ${bySize}px ${fontFamily}`;
        ctx.fillStyle = "#6b7280"; // gray-500
        ctx.fillText(bottomBy, cx, y);
        y += bySize;
      }

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
          <DialogTitle className="text-gray-900 flex items-center gap-x-4">
            <span>Media QR Code</span>{" "}
            <Tag
              text={mediaData.media_type_name}
              className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200"
              textClassName="text-xs font-medium text-gray-700"
            />
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Scan this QR code to view the media or share the URL
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Display */}
          <div className="flex flex-col justify-center items-center p-6 bg-gray-50 rounded-lg">
            <QRCodeSVG
              id="qr-code-svg"
              value={mediaUrl}
              size={qrSize}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
              imageSettings={{
                src: centerImage.src,
                width: centerImage.width,
                height: centerImage.height,
                excavate: true,
              }}
            />
            <div className="text-center space-y-1">
              <div className="text-xl font-semibold text-gray-900">{bottomTitle}</div>
              {bottomCode ? <div className="text-sm text-gray-700">{bottomCode}</div> : null}
              {bottomBy ? <div className="text-sm font-bold text-gray-900">{bottomBy}</div> : null}
            </div>
          </div>

          {/* Bottom details under QR */}

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
              <Button variant="outline" size="sm" onClick={handleCopyUrl} title="Copy URL">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleOpenUrl} title="Open in new tab">
                <ExternalLink className="h-4 w-4" />
              </Button>
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
