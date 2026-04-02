import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EmployeeLayout from "./EmployeeLayout";
import AssignedFreelancers from "./AssignedFreelancers";

const AssignedFreelancersPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!companyId) {
    return (
      <EmployeeLayout>
        <div style={{ padding: "24px", textAlign: "center" }}>
          <p>Company ID not found</p>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <AssignedFreelancers companyId={companyId} isMobileScreen={isMobileScreen} />
    </EmployeeLayout>
  );
};

export default AssignedFreelancersPage;
