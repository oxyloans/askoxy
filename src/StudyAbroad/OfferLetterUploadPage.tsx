import React, { useState } from "react";
import OfferLetterSection from "./components/OfferLetterSection";

const OfferLetterUploadPage: React.FC = () => {
  const [pendingId] = useState<number | null>(() => {
    const id = sessionStorage.getItem("pendingApplyUniversityId");
    return id ? Number(id) : null;
  });

  return <OfferLetterSection pendingUniversityId={pendingId} />;
};

export default OfferLetterUploadPage;
