import React from "react";

type ContentBlock = {
  kind: "paragraph" | "subheading" | "bullet";
  text: string;
};

type LegalSection = {
  number: string;
  title: string;
  id: string;
  blocks: ContentBlock[];
};

const sections: LegalSection[] = [
  {
    "number": "1",
    "title": "Introduction",
    "id": "introduction",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "Welcome to AskOxy.ai (\"we,\" \"our,\" or \"us\"). These Terms and Conditions (\"Terms\") govern your use of our website and services. By accessing or using our platform, you agree to be bound by these Terms."
      },
      {
        "kind": "paragraph",
        "text": "Company Information:"
      },
      {
        "kind": "bullet",
        "text": "Business Name: AskOxy.ai"
      },
      {
        "kind": "bullet",
        "text": "Legal Entity: OXYKART TECHNOLOGIES PVT LTD"
      },
      {
        "kind": "bullet",
        "text": "Address: CC-02, Ground Floor, Indu Fortune Fields, KPHB Colony, Hyderabad, Telangana - 500085"
      }
    ]
  },
  {
    "number": "2",
    "title": "Services Offered",
    "id": "services-offered",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "AskOxy.ai provides the following services and products:"
      },
      {
        "kind": "subheading",
        "text": "2.1 Physical Products"
      },
      {
        "kind": "bullet",
        "text": "Rice Sales: Retail and wholesale rice distribution"
      },
      {
        "kind": "bullet",
        "text": "Gold Sales: Retail gold selling with proper certification"
      },
      {
        "kind": "bullet",
        "text": "Additional Products: We may add various consumer products to our platform"
      },
      {
        "kind": "subheading",
        "text": "2.2 Digital Services"
      },
      {
        "kind": "bullet",
        "text": "Free AI Generation Tools: Complimentary artificial intelligence-powered services"
      },
      {
        "kind": "bullet",
        "text": "SAPL — Study Abroad Consultation: Educational consulting and study abroad guidance services"
      },
      {
        "kind": "bullet",
        "text": "Cryptocurrency Services: BMVCoin transactions on our proprietary Oxy Chain blockchain"
      },
      {
        "kind": "bullet",
        "text": "IP2PL — Peer-to-Peer Lending: Peer-to-peer lending services"
      },
      {
        "kind": "bullet",
        "text": "JPL — Jobs: Job search and employment services"
      },
      {
        "kind": "bullet",
        "text": "FPL — Fractional Ownership: Fractional ownership services"
      },
      {
        "kind": "bullet",
        "text": "GPL — Gold: Gold-related services"
      },
      {
        "kind": "bullet",
        "text": "AIPL — Bharat AI Store: AI-powered product and services marketplace"
      },
      {
        "kind": "subheading",
        "text": "2.3 Service Coverage"
      },
      {
        "kind": "paragraph",
        "text": "Our delivery and service area is limited to a 20-kilometer radius from CC-02, Ground Floor, Indu Fortune Fields, KPHB Colony, Hyderabad, Telangana - 500085, where applicable to physical delivery services."
      },
      {
        "kind": "subheading",
        "text": "2.4 Service-Specific Information"
      },
      {
        "kind": "bullet",
        "text": "The personal data required for a particular service or feature may vary according to the service requested."
      },
      {
        "kind": "bullet",
        "text": "The personal data required may also depend on the information necessary to provide or enable that service."
      },
      {
        "kind": "bullet",
        "text": "Where a service requires personal data, the applicable information will be requested in the relevant service flow."
      },
      {
        "kind": "bullet",
        "text": "The applicable service flow will be accompanied or preceded by the applicable Privacy Policy or privacy notice."
      },
      {
        "kind": "bullet",
        "text": "The applicable Privacy Policy or privacy notice will identify the relevant personal data, purpose of processing, service or feature enabled by the processing, applicable user rights, and applicable grievance mechanism."
      },
      {
        "kind": "bullet",
        "text": "Personal data will not be requested through a service flow for purposes unrelated to the specified service or purpose unless the additional purpose is separately communicated and, where required, separate consent is obtained."
      }
    ]
  },
  {
    "number": "3",
    "title": "User Eligibility and Children's Data",
    "id": "user-eligibility-and-children-s-data",
    "blocks": [
      {
        "kind": "bullet",
        "text": "You must be at least 18 years old to use our services."
      },
      {
        "kind": "bullet",
        "text": "You must provide accurate and complete information during registration."
      },
      {
        "kind": "bullet",
        "text": "You are responsible for maintaining the confidentiality of your account credentials."
      },
      {
        "kind": "bullet",
        "text": "One person may not maintain multiple accounts."
      },
      {
        "kind": "bullet",
        "text": "Our services are intended for adults, and we do not knowingly offer registration or knowingly process personal data of a child in violation of applicable law."
      },
      {
        "kind": "bullet",
        "text": "Where a service is legally made available to a child, we will use an appropriate and legally compliant mechanism to obtain verifiable parental or lawful guardian consent before processing the child's personal data, where such consent is required."
      },
      {
        "kind": "bullet",
        "text": "We will not knowingly undertake processing of children's personal data for prohibited tracking, behavioural monitoring, or targeted advertising purposes."
      },
      {
        "kind": "bullet",
        "text": "If we become aware that a child has registered or that children's personal data has been collected without the required authorization, we may suspend the account and take reasonable steps to verify parental or lawful guardian authorization or delete the data, subject to applicable legal, regulatory, security, fraud-prevention, and record-retention requirements."
      }
    ]
  },
  {
    "number": "4",
    "title": "Product Sales Terms",
    "id": "product-sales-terms",
    "blocks": [
      {
        "kind": "subheading",
        "text": "4.1 Rice Sales"
      },
      {
        "kind": "bullet",
        "text": "All rice products are subject to applicable quality standards and food safety regulations."
      },
      {
        "kind": "bullet",
        "text": "Prices are subject to market fluctuations and may change without prior notice."
      },
      {
        "kind": "bullet",
        "text": "Bulk orders may qualify for wholesale pricing."
      },
      {
        "kind": "subheading",
        "text": "4.2 Gold Sales"
      },
      {
        "kind": "bullet",
        "text": "All gold products come with proper certification and purity verification, where applicable."
      },
      {
        "kind": "bullet",
        "text": "Gold prices fluctuate based on market rates and are updated regularly."
      },
      {
        "kind": "bullet",
        "text": "We comply with applicable gold trading requirements."
      },
      {
        "kind": "bullet",
        "text": "Proper identification and documentation may be required for applicable gold purchases."
      },
      {
        "kind": "subheading",
        "text": "4.3 General Product Terms"
      },
      {
        "kind": "bullet",
        "text": "Product availability is subject to stock levels."
      },
      {
        "kind": "bullet",
        "text": "We reserve the right to limit quantities purchased."
      },
      {
        "kind": "bullet",
        "text": "Sales are subject to the applicable return, refund, cancellation, and product-specific policies communicated for the relevant transaction."
      }
    ]
  },
  {
    "number": "5",
    "title": "Digital Services",
    "id": "digital-services",
    "blocks": [
      {
        "kind": "subheading",
        "text": "5.1 Free AI Generation Services"
      },
      {
        "kind": "bullet",
        "text": "Services are provided \"as-is\" without warranties to the extent permitted by applicable law."
      },
      {
        "kind": "bullet",
        "text": "We reserve the right to modify, suspend, or discontinue services."
      },
      {
        "kind": "bullet",
        "text": "Usage may be subject to fair-use policies and limitations."
      },
      {
        "kind": "subheading",
        "text": "5.2 SAPL — Study Abroad Consultation"
      },
      {
        "kind": "bullet",
        "text": "Consultation services are advisory in nature."
      },
      {
        "kind": "bullet",
        "text": "We do not guarantee admission to any educational institution."
      },
      {
        "kind": "bullet",
        "text": "Third-party application fees and institutional charges are separate."
      },
      {
        "kind": "subheading",
        "text": "5.3 Cryptocurrency and Blockchain Services"
      },
      {
        "kind": "bullet",
        "text": "BMVCoin operates on our proprietary Oxy Chain blockchain."
      },
      {
        "kind": "bullet",
        "text": "Cryptocurrency transactions are subject to market, technology, regulatory, and other risks."
      },
      {
        "kind": "bullet",
        "text": "Users must comply with applicable laws and regulations."
      },
      {
        "kind": "bullet",
        "text": "We are not responsible for market volatility or investment losses, except to the extent liability cannot lawfully be excluded."
      },
      {
        "kind": "bullet",
        "text": "Certain transaction records may be recorded on a blockchain and may be publicly visible or otherwise persistently available depending on the blockchain design."
      },
      {
        "kind": "bullet",
        "text": "Because blockchain records may be immutable or difficult to alter or erase, a request for erasure or correction may not be technically capable of removing or changing information already recorded on-chain. Where this applies, we will handle requests in accordance with applicable law and may address the request through measures available outside the immutable blockchain record."
      },
      {
        "kind": "subheading",
        "text": "5.4 IP2PL — Peer-to-Peer Lending"
      },
      {
        "kind": "bullet",
        "text": "Peer-to-peer lending services are subject to applicable service terms and conditions."
      },
      {
        "kind": "bullet",
        "text": "Users are required to provide accurate information where required for the service."
      },
      {
        "kind": "bullet",
        "text": "Lending activities are subject to applicable laws and regulations."
      },
      {
        "kind": "subheading",
        "text": "5.5 JPL — Jobs"
      },
      {
        "kind": "bullet",
        "text": "Job-related services are provided based on opportunities and information available on the platform."
      },
      {
        "kind": "bullet",
        "text": "Users are responsible for providing accurate information when using job-related services."
      },
      {
        "kind": "bullet",
        "text": "Employment decisions and outcomes are determined by the relevant employer or organization."
      },
      {
        "kind": "subheading",
        "text": "5.6 FPL — Fractional Ownership"
      },
      {
        "kind": "bullet",
        "text": "Fractional ownership services are subject to applicable service terms and conditions."
      },
      {
        "kind": "bullet",
        "text": "Users are required to provide accurate information where required for the service."
      },
      {
        "kind": "bullet",
        "text": "Fractional ownership activities are subject to applicable laws and regulations."
      },
      {
        "kind": "subheading",
        "text": "5.7 GPL — Gold"
      },
      {
        "kind": "bullet",
        "text": "Gold-related services are subject to applicable product and service terms."
      },
      {
        "kind": "bullet",
        "text": "Gold prices may fluctuate based on prevailing market rates."
      },
      {
        "kind": "bullet",
        "text": "Proper identification and documentation may be required for applicable gold transactions."
      },
      {
        "kind": "subheading",
        "text": "5.8 AIPL — Bharat AI Store"
      },
      {
        "kind": "bullet",
        "text": "Bharat AI Store provides access to AI-powered products and services."
      },
      {
        "kind": "bullet",
        "text": "Product and service availability may vary."
      },
      {
        "kind": "bullet",
        "text": "Users are responsible for providing accurate information where required for the requested service."
      }
    ]
  },
  {
    "number": "6",
    "title": "Payment Terms",
    "id": "payment-terms",
    "blocks": [
      {
        "kind": "bullet",
        "text": "We accept various payment methods as displayed at checkout."
      },
      {
        "kind": "bullet",
        "text": "All prices are in Indian Rupees (INR) unless otherwise specified."
      },
      {
        "kind": "bullet",
        "text": "Payment must be received before product delivery or service provision, unless otherwise communicated."
      },
      {
        "kind": "bullet",
        "text": "Additional charges may apply for certain payment methods."
      }
    ]
  },
  {
    "number": "7",
    "title": "Delivery and Service Area",
    "id": "delivery-and-service-area",
    "blocks": [
      {
        "kind": "bullet",
        "text": "Delivery is limited to areas within 20 KM of CC-02, Ground Floor, Indu Fortune Fields, KPHB Colony, Hyderabad, Telangana - 500085, where applicable."
      },
      {
        "kind": "bullet",
        "text": "Delivery times are estimates and may vary based on location and product availability."
      },
      {
        "kind": "bullet",
        "text": "Delivery charges may apply based on distance and order value."
      },
      {
        "kind": "bullet",
        "text": "Risk of loss transfers to the buyer upon delivery, subject to applicable law."
      }
    ]
  },
  {
    "number": "8",
    "title": "Returns and Refunds",
    "id": "returns-and-refunds",
    "blocks": [
      {
        "kind": "subheading",
        "text": "8.1 Physical Products"
      },
      {
        "kind": "bullet",
        "text": "Rice: Returns accepted within 24 hours if unopened and in original packaging, subject to the applicable return policy."
      },
      {
        "kind": "bullet",
        "text": "Gold: Returns are subject to verification, applicable transaction terms, and market value at the time of return."
      },
      {
        "kind": "bullet",
        "text": "Defective products will be replaced or refunded in accordance with the applicable return/refund policy and applicable law."
      },
      {
        "kind": "subheading",
        "text": "8.2 Digital Services"
      },
      {
        "kind": "bullet",
        "text": "AI Generation services are non-refundable unless otherwise required by applicable law or expressly stated in the applicable service terms."
      },
      {
        "kind": "bullet",
        "text": "Study abroad consultation fees are non-refundable after service commencement, subject to applicable law and communicated service terms."
      },
      {
        "kind": "bullet",
        "text": "Cryptocurrency transactions are generally irreversible."
      },
      {
        "kind": "bullet",
        "text": "Other digital services, including IP2PL, JPL, FPL, GPL, and AIPL, are subject to the applicable service-specific terms, transaction conditions, and refund or cancellation policies communicated for the relevant service."
      }
    ]
  },
  {
    "number": "9",
    "title": "User Responsibilities",
    "id": "user-responsibilities",
    "blocks": [
      {
        "kind": "bullet",
        "text": "Provide accurate delivery and registration information."
      },
      {
        "kind": "bullet",
        "text": "Be available to receive deliveries during specified times, where applicable."
      },
      {
        "kind": "bullet",
        "text": "Comply with all applicable laws and regulations."
      },
      {
        "kind": "bullet",
        "text": "Use digital services responsibly and ethically."
      },
      {
        "kind": "bullet",
        "text": "Maintain the security of account credentials."
      }
    ]
  },
  {
    "number": "10",
    "title": "Prohibited Uses",
    "id": "prohibited-uses",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "You may not use our platform to:"
      },
      {
        "kind": "bullet",
        "text": "Engage in fraudulent or illegal activities."
      },
      {
        "kind": "bullet",
        "text": "Resell our products without authorization."
      },
      {
        "kind": "bullet",
        "text": "Manipulate cryptocurrency markets or misuse digital assets."
      },
      {
        "kind": "bullet",
        "text": "Provide false information during consultation or service flows."
      },
      {
        "kind": "bullet",
        "text": "Violate any applicable laws or regulations."
      }
    ]
  },
  {
    "number": "11",
    "title": "Intellectual Property",
    "id": "intellectual-property",
    "blocks": [
      {
        "kind": "bullet",
        "text": "All content on AskOxy.ai is our intellectual property or used with permission."
      },
      {
        "kind": "bullet",
        "text": "Users may not reproduce, distribute, or create derivative works without permission, except where permitted by applicable law."
      },
      {
        "kind": "bullet",
        "text": "AI-generated content usage rights are granted for personal or commercial use as applicable to the relevant service and subject to third-party rights and applicable law."
      }
    ]
  },
  {
    "number": "12",
    "title": "Privacy and Data Protection",
    "id": "privacy-and-data-protection",
    "blocks": [
      {
        "kind": "bullet",
        "text": "We collect and process personal data in accordance with applicable privacy and data-protection laws, including the Digital Personal Data Protection Act, 2023 and applicable rules, to the extent applicable."
      },
      {
        "kind": "bullet",
        "text": "The personal data collected and processed may vary depending on the service or feature used by you and the information necessary to provide or enable that service."
      },
      {
        "kind": "bullet",
        "text": "The purposes of processing may include providing and enabling the requested service, as well as other purposes communicated through the applicable Privacy Policy or privacy notice."
      },
      {
        "kind": "bullet",
        "text": "Our Privacy Policy and applicable privacy notices describe the personal data that may be processed, the purposes of processing, the service or feature enabled by the processing, applicable user rights, and grievance mechanisms."
      },
      {
        "kind": "bullet",
        "text": "Where processing is based on consent, consent will be requested separately for the specified purpose where required."
      },
      {
        "kind": "bullet",
        "text": "Acceptance of these Terms does not, by itself, constitute consent to separate or additional processing purposes."
      },
      {
        "kind": "bullet",
        "text": "Where consent is required for optional purposes, such as promotional communications, it will be requested separately and will relate only to the specified purpose."
      },
      {
        "kind": "bullet",
        "text": "AskOxy.ai or its associated businesses may communicate information about other products, services, features, offers, or solutions where permitted by applicable law and subject to the applicable consent or other lawful basis. Any optional promotional communication will be handled through the applicable privacy notice and consent mechanism where required."
      },
      {
        "kind": "bullet",
        "text": "For blockchain-based services, certain transaction or technical records may be immutable or publicly visible. Requests concerning access, correction, or erasure will be handled in accordance with applicable law, taking into account technical limitations of immutable blockchain records."
      }
    ]
  },
  {
    "number": "13",
    "title": "Limitation of Liability",
    "id": "limitation-of-liability",
    "blocks": [
      {
        "kind": "bullet",
        "text": "Our liability is limited to the extent permitted by applicable law and, where legally permissible, to the value of products or services purchased."
      },
      {
        "kind": "bullet",
        "text": "We are not liable for indirect, consequential, or punitive damages to the extent such exclusion is permitted by applicable law."
      },
      {
        "kind": "bullet",
        "text": "Cryptocurrency activities carry inherent risks and we disclaim liability for losses to the extent permitted by applicable law."
      },
      {
        "kind": "bullet",
        "text": "Force majeure events may affect service delivery without liability to the extent permitted by applicable law."
      }
    ]
  },
  {
    "number": "14",
    "title": "Disclaimers",
    "id": "disclaimers",
    "blocks": [
      {
        "kind": "bullet",
        "text": "Products and services are provided \"as-is\" to the extent permitted by applicable law."
      },
      {
        "kind": "bullet",
        "text": "We make no warranties regarding AI service accuracy or suitability for a particular purpose unless expressly stated."
      },
      {
        "kind": "bullet",
        "text": "Study abroad consultation does not guarantee admission outcomes."
      },
      {
        "kind": "bullet",
        "text": "Job-related services do not guarantee employment, selection, or hiring outcomes."
      },
      {
        "kind": "bullet",
        "text": "Peer-to-peer lending services are subject to applicable lending terms, conditions, and risks."
      },
      {
        "kind": "bullet",
        "text": "Fractional ownership services are subject to applicable terms, conditions, and risks."
      },
      {
        "kind": "bullet",
        "text": "Gold-related services are subject to prevailing market prices and applicable transaction conditions."
      },
      {
        "kind": "bullet",
        "text": "Bharat AI Store products and services may vary in availability and functionality."
      },
      {
        "kind": "bullet",
        "text": "Cryptocurrency values are volatile and activities involving digital assets carry risk."
      }
    ]
  },
  {
    "number": "15",
    "title": "Modifications to Terms",
    "id": "modifications-to-terms",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "We reserve the right to modify these Terms at any time. Changes will be posted on our website with the updated effective date. Where a change requires a new notice, consent, or other user action under applicable law, we will provide the applicable notice and obtain the required user action separately."
      }
    ]
  },
  {
    "number": "16",
    "title": "Governing Law and Jurisdiction",
    "id": "governing-law-and-jurisdiction",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "These Terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of the courts in Hyderabad, Telangana, India, subject to applicable law."
      }
    ]
  },
  {
    "number": "17",
    "title": "Severability",
    "id": "severability",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect."
      }
    ]
  },
  {
    "number": "18",
    "title": "Contact Information",
    "id": "contact-information",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "For questions about these Terms and Conditions, please contact us:"
      },
      {
        "kind": "bullet",
        "text": "OXYKART TECHNOLOGIES PVT LTD (Operating as AskOxy.ai)"
      },
      {
        "kind": "bullet",
        "text": "CC-02, Ground Floor, Indu Fortune Fields, KPHB Colony, Hyderabad, Telangana - 500085, India"
      },
      {
        "kind": "bullet",
        "text": "Email: support@askoxy.ai"
      },
      {
        "kind": "bullet",
        "text": "Phone: +91 91541 50728"
      },
      {
        "kind": "bullet",
        "text": "Website: https://www.askoxy.ai/"
      }
    ]
  },
  {
    "number": "19",
    "title": "Compliance",
    "id": "compliance",
    "blocks": [
      {
        "kind": "paragraph",
        "text": "We comply with, and where applicable operate in accordance with:"
      },
      {
        "kind": "bullet",
        "text": "Indian Consumer Protection Act, 2019"
      },
      {
        "kind": "bullet",
        "text": "Food Safety and Standards Act, 2006, as applicable to rice sales"
      },
      {
        "kind": "bullet",
        "text": "Foreign Exchange Management Act (FEMA) requirements, where applicable"
      },
      {
        "kind": "bullet",
        "text": "Information Technology Act, 2000"
      },
      {
        "kind": "bullet",
        "text": "Applicable Information Technology Rules"
      },
      {
        "kind": "bullet",
        "text": "Digital Personal Data Protection Act, 2023, to the extent applicable"
      },
      {
        "kind": "bullet",
        "text": "Applicable rules and regulations made under the Digital Personal Data Protection Act, 2023"
      },
      {
        "kind": "bullet",
        "text": "Other applicable laws, rules, and regulatory requirements relevant to the services offered"
      }
    ]
  },
  {
    "number": "20",
    "title": "Acceptance of Terms",
    "id": "acceptance-of-terms",
    "blocks": [
      {
        "kind": "bullet",
        "text": "By using AskOxy.ai services, you acknowledge that you have read and understood these Terms and Conditions."
      },
      {
        "kind": "bullet",
        "text": "You agree to be bound by these Terms and Conditions."
      },
      {
        "kind": "bullet",
        "text": "Acceptance of these Terms does not, by itself, constitute consent to every separate purpose for which personal data may be processed."
      },
      {
        "kind": "bullet",
        "text": "Where applicable law requires consent, the relevant consent will be requested separately and for the specified purpose."
      }
    ]
  }
];

const linkifyValue = (label: string, value: string): React.ReactNode => {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.startsWith("email")) {
    return (
      <a
        href={`mailto:${value}`}
        className="font-medium text-blue-700 underline decoration-blue-200 underline-offset-2 hover:text-blue-800"
      >
        {value}
      </a>
    );
  }

  if (normalizedLabel.startsWith("phone")) {
    const phone = value.replace(/[^\d+]/g, "");
    return (
      <a
        href={`tel:${phone}`}
        className="font-medium text-blue-700 underline decoration-blue-200 underline-offset-2 hover:text-blue-800"
      >
        {value}
      </a>
    );
  }

  if (normalizedLabel.startsWith("website")) {
    const href = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all font-medium text-blue-700 underline decoration-blue-200 underline-offset-2 hover:text-blue-800"
      >
        {value}
      </a>
    );
  }

  return value;
};

const renderText = (text: string): React.ReactNode => {
  const colonIndex = text.indexOf(":");

  if (colonIndex > 0 && colonIndex <= 55) {
    const label = text.slice(0, colonIndex).trim();
    const value = text.slice(colonIndex + 1).trim();

    if (label && value) {
      return (
        <>
          <strong className="font-semibold text-slate-900">{label}:</strong>{" "}
          {linkifyValue(label, value)}
        </>
      );
    }
  }

  return text;
};

const renderBlocks = (blocks: ContentBlock[]) => {
  const output: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = () => {
    if (!bullets.length) return;

    const items = bullets;
    bullets = [];

    output.push(
      <ul
        key={`bullets-${output.length}`}
        className="my-4 space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5"
      >
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex min-w-0 items-start gap-3 text-sm leading-6 text-slate-700 sm:text-[15px] sm:leading-7"
          >
            <span
              aria-hidden="true"
              className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
            />
            <span className="min-w-0 break-words [overflow-wrap:anywhere]">
              {renderText(item)}
            </span>
          </li>
        ))}
      </ul>,
    );
  };

  blocks.forEach((block, index) => {
    if (block.kind === "bullet") {
      bullets.push(block.text);
      return;
    }

    flushBullets();

    if (block.kind === "subheading") {
      output.push(
        <h3
          key={`${block.text}-${index}`}
          className="mb-2 mt-6 text-base font-semibold leading-snug text-slate-900 sm:text-lg"
        >
          {block.text}
        </h3>,
      );
      return;
    }

    output.push(
      <p
        key={`${block.text}-${index}`}
        className="my-3 break-words text-sm leading-6 text-slate-700 [overflow-wrap:anywhere] sm:text-[15px] sm:leading-7"
      >
        {renderText(block.text)}
      </p>,
    );
  });

  flushBullets();
  return output;
};

const TermsAndConditions: React.FC = () => {
  return (
    <div id="top" className="min-h-screen bg-white text-slate-900">
      <header>
        <div className="mx-auto w-full max-w-5xl px-4 pb-6 pt-8 text-center sm:px-6 sm:pb-8 sm:pt-10 lg:px-8 lg:pb-10 lg:pt-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 sm:text-sm">
            AskOxy.ai · OXYKART TECHNOLOGIES PVT LTD
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[42px]">
            Terms and Conditions
          </h1>

          <p className="mt-3 text-xs font-medium text-slate-500 sm:text-sm">
            Last Updated: September 25, 2026
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16">
        <article className="space-y-5 sm:space-y-6">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg bg-blue-700 px-2 text-sm font-bold text-white">
                    {section.number}
                  </span>
                  <h2 className="min-w-0 text-lg font-bold leading-snug text-slate-950 sm:text-xl lg:text-2xl">
                    {section.title}
                  </h2>
                </div>
              </div>

              <div className="min-w-0 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
                {renderBlocks(section.blocks)}

                <div className="mt-6 border-t border-slate-100 pt-4 text-right">
                  <a
                    href="#top"
                    className="text-xs font-semibold text-blue-700 hover:text-blue-800"
                  >
                    Back to top ↑
                  </a>
                </div>
              </div>
            </section>
          ))}
        </article>
      </main>
    </div>
  );
};

export default TermsAndConditions;
