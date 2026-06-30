import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EmployeeLayout from "./EmployeeLayout";
import AssignedFreelancers from "./AssignedFreelancers";
import StatusAlert from "./StatusAlert";

const AssignedFreelancersPage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const r = () => setIsMobileScreen(window.innerWidth < 768);
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  if (!companyId) {
    return (
      <EmployeeLayout>
        <div className="mx-auto w-full max-w-lg">
          <StatusAlert message="Company ID not found." variant="error" />
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="mx-auto w-full max-w-7xl">
        <AssignedFreelancers companyId={companyId} isMobileScreen={isMobileScreen} />
      </div>
    </EmployeeLayout>
  );
};

export default AssignedFreelancersPage;
