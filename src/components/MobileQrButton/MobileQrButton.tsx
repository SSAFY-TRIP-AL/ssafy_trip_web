import { useState } from "react";
import { QrCode, X } from "lucide-react";
import QRCode from "react-qr-code";
import qrStyle from "./MobileQrButton.module.css";

export default function MobileQrButton() {
  const [isOpen, setIsOpen] = useState(false);
  const siteUrl = "https://tripbaton.vercel.app";

  return (
    <>
      <button
        type="button"
        className={qrStyle.qrButton}
        onClick={() => setIsOpen(true)}
        aria-label="모바일로 보기"
      >
        <QrCode size={18} />
        <span>모바일로 보기</span>
      </button>

      {isOpen && (
        <div className={qrStyle.overlay} onClick={() => setIsOpen(false)}>
          <div className={qrStyle.modal} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={qrStyle.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="닫기"
            >
              <X size={18} />
            </button>
            <span className={qrStyle.title}>모바일로 이어보기</span>
            <p className={qrStyle.desc}>
              휴대폰 카메라로 QR 코드를 스캔하면
              <br />
              모바일에서 Trip Baton을 이용할 수 있어요.
            </p>
            <div className={qrStyle.qrBox}>
              {siteUrl && <QRCode value={siteUrl} size={180} className={qrStyle.qrImage} />}
            </div>
            <span className={qrStyle.url}>{siteUrl}</span>
          </div>
        </div>
      )}
    </>
  );
}
