export const LANGS = ["Python", "Java", "Node.js"];

export const PHASE_COLORS: Record<number, string> = {
  1: "#6C5CE7",
  2: "#a855f7",
  3: "#E17055",
  4: "#00B894",
};

export const ENGINE_STEPS = [
  { id: 1, label: "Domain Discovery", phase: 1 },
  { id: 2, label: "Process Discovery", phase: 1 },
  { id: 3, label: "Use Case Discovery", phase: 1 },
  { id: 4, label: "Dependency Discovery", phase: 2 },
  { id: 5, label: "Input Discovery", phase: 2 },
  { id: 6, label: "System Discovery", phase: 2 },
  { id: 7, label: "Regulatory Discovery", phase: 2 },
  { id: 8, label: "AI Pattern Discovery", phase: 3 },
  { id: 9, label: "Agent Discovery", phase: 3 },
  { id: 10, label: "Decision Flow", phase: 3 },
  { id: 11, label: "API Discovery", phase: 4 },
  { id: 12, label: "Integration Mapping", phase: 4 },
  { id: 13, label: "Report Generation", phase: 4 },
  { id: 14, label: "GRC Generation", phase: 4 },
  { id: 15, label: "Code Generation", phase: 4 },
];

export const SYSTEMS = ["Core Banking", "LOS", "LMS", "CRM", "ERP", "Mobile App", "Data Warehouse", "Payment Gateway"];

export type WorkflowType = {
  id: string;
  label: string;
  icon: string;
  subtitle: string;
  color: string;
  fields: { key: string; label: string; type: string; demo: string }[];
  documents: string[];
  agents: { name: string; status: string }[];
  decision: {
    verdict: string;
    verdictColor: string;
    fields: { label: string; value: string }[];
    reasoning: string;
  };
  dependencies: string[];
  codeTemplate: (_lang: string, data: Record<string, string>) => Record<string, string>;
};

export const WORKFLOWS: WorkflowType[] = [
  {
    id: "onboarding",
    label: "Customer Onboarding",
    icon: "👤",
    subtitle: "KYC · AML · Identity Verification",
    color: "#6C5CE7",
    fields: [
      { key: "customer_name", label: "Full Name", type: "text", demo: "Mohammed Al Rashidi" },
      { key: "dob", label: "Date of Birth", type: "date", demo: "1985-03-14" },
      { key: "nationality", label: "Nationality", type: "text", demo: "UAE" },
      { key: "employer", label: "Employer", type: "text", demo: "ADNOC" },
      { key: "monthly_income", label: "Monthly Income (AED)", type: "number", demo: "28500" },
      { key: "currency", label: "Currency", type: "text", demo: "AED" },
    ],
    documents: ["Passport / Emirates ID", "Salary Certificate", "Bank Statement (3 months)"],
    agents: [
      { name: "Domain Discovery", status: "done" },
      { name: "KYC Verification", status: "done" },
      { name: "AML Screening", status: "done" },
      { name: "Identity Engine", status: "done" },
    ],
    decision: {
      verdict: "VERIFIED",
      verdictColor: "#00B894",
      fields: [
        { label: "Customer ID", value: "CUS-10001" },
        { label: "Risk Level", value: "Low" },
        { label: "Status", value: "Active" },
        { label: "Confidence", value: "96%" },
      ],
      reasoning: "Customer identity verified across 3 databases. No AML flags. Employer confirmed. Risk profile: LOW.",
    },
    dependencies: ["KYC Verification", "AML Screening", "Emirates ID Validation"],
    codeTemplate: (_lang, data) => ({
      python: `import oxybfsai_sdk as oby
import hashlib, datetime, json

client = oby.Client(api_key="YOUR_API_KEY", region="UAE")

# ── Step 1: KYC Identity Verification
kyc = client.kyc.verify_identity(
    full_name="${data.customer_name}",
    dob="${data.dob}",
    nationality="${data.nationality}",
    id_type="EMIRATES_ID",
    source_systems=["CBUAE", "UAEID_AUTHORITY"]
)
if not kyc.verified:
    raise Exception(f"KYC failed: {kyc.rejection_reason}")

# ── Step 2: AML Screening
aml = client.aml.screen(
    name="${data.customer_name}",
    dob="${data.dob}",
    nationality="${data.nationality}",
    watchlists=["UN_SANCTIONS", "OFAC", "EU_LIST", "UNODC"]
)
if aml.risk_level == "HIGH":
    raise Exception(f"AML blocked: {aml.flags}")

# ── Step 3: Income & Employment Verification
employment = client.employment.verify(
    employer="${data.employer}",
    monthly_income=${data.monthly_income},
    currency="${data.currency}",
    verify_via=["SALARY_CERT", "BANK_STMT"]
)

# ── Step 4: Risk Scoring
risk = client.risk.score_customer(
    kyc_result=kyc,
    aml_result=aml,
    employment=employment,
    model="BFSI_UAE_v3"
)

# ── Step 5: Create Customer Record
customer = client.customers.create(
    full_name="${data.customer_name}",
    dob="${data.dob}",
    nationality="${data.nationality}",
    employer="${data.employer}",
    monthly_income=${data.monthly_income},
    currency="${data.currency}",
    kyc_ref=kyc.reference_id,
    aml_ref=aml.screening_id,
    risk_score=risk.score,
    risk_level=risk.level,
    status="ACTIVE"
)

# ── Step 6: Audit Trail
client.audit.log(
    event="CUSTOMER_ONBOARDED",
    customer_id=customer.id,
    performed_by="OXYBFSAI_ENGINE",
    timestamp=datetime.datetime.utcnow().isoformat(),
    metadata={
        "kyc_score": kyc.confidence,
        "aml_clear": aml.is_clear,
        "risk_level": risk.level,
        "compliance": ["CBUAE", "AML_2024"]
    }
)

print(f"Customer ID   : {customer.id}")
print(f"KYC Status    : {kyc.status}")
print(f"AML Status    : {aml.status}")
print(f"Risk Level    : {risk.level}")
print(f"Account Status: {customer.status}")`,
      java: `import com.oxybfsai.sdk.*;
import com.oxybfsai.sdk.models.*;
import java.time.Instant;
import java.util.List;

public class CustomerOnboardingEngine {

    public static void main(String[] args) throws Exception {
        OxyBFSAIClient client = OxyBFSAIClient.builder()
            .apiKey("YOUR_API_KEY")
            .region("UAE")
            .build();

        // Step 1: KYC Verification
        KycResult kyc = client.kyc().verifyIdentity(
            KycRequest.builder()
                .fullName("${data.customer_name}")
                .dob("${data.dob}")
                .nationality("${data.nationality}")
                .idType("EMIRATES_ID")
                .sourceSystems(List.of("CBUAE", "UAEID_AUTHORITY"))
                .build()
        );
        if (!kyc.isVerified())
            throw new RuntimeException("KYC failed: " + kyc.getRejectionReason());

        // Step 2: AML Screening
        AmlResult aml = client.aml().screen(
            AmlRequest.builder()
                .name("${data.customer_name}")
                .dob("${data.dob}")
                .nationality("${data.nationality}")
                .watchlists(List.of("UN_SANCTIONS", "OFAC", "EU_LIST"))
                .build()
        );
        if ("HIGH".equals(aml.getRiskLevel()))
            throw new RuntimeException("AML blocked: " + aml.getFlags());

        // Step 3: Risk Score
        RiskResult risk = client.risk().scoreCustomer(
            RiskRequest.builder()
                .kycResult(kyc)
                .amlResult(aml)
                .monthlyIncome(${data.monthly_income})
                .currency("${data.currency}")
                .model("BFSI_UAE_v3")
                .build()
        );

        // Step 4: Create Customer
        Customer customer = client.customers().create(
            CustomerRequest.builder()
                .fullName("${data.customer_name}")
                .employer("${data.employer}")
                .monthlyIncome(${data.monthly_income})
                .kycRef(kyc.getReferenceId())
                .amlRef(aml.getScreeningId())
                .riskScore(risk.getScore())
                .status("ACTIVE")
                .build()
        );

        System.out.println("Customer ID: " + customer.getId());
        System.out.println("KYC Status : " + kyc.getStatus());
        System.out.println("Risk Level : " + risk.getLevel());
        System.out.println("Status     : " + customer.getStatus());
    }
}`,
      nodejs: `const { OxyBFSAI } = require('@oxybfsai/sdk');

const client = new OxyBFSAI({ apiKey: 'YOUR_API_KEY', region: 'UAE' });

async function onboardCustomer() {
  // Step 1: KYC Identity Verification
  const kyc = await client.kyc.verifyIdentity({
    fullName: '${data.customer_name}',
    dob: '${data.dob}',
    nationality: '${data.nationality}',
    idType: 'EMIRATES_ID',
    sourceSystems: ['CBUAE', 'UAEID_AUTHORITY'],
  });
  if (!kyc.verified) throw new Error('KYC failed: ' + kyc.rejectionReason);

  // Step 2: AML Screening
  const aml = await client.aml.screen({
    name: '${data.customer_name}',
    dob: '${data.dob}',
    nationality: '${data.nationality}',
    watchlists: ['UN_SANCTIONS', 'OFAC', 'EU_LIST', 'UNODC'],
  });
  if (aml.riskLevel === 'HIGH') throw new Error('AML blocked: ' + aml.flags);

  // Step 3: Employment & Income Verification
  const employment = await client.employment.verify({
    employer: '${data.employer}',
    monthlyIncome: ${data.monthly_income},
    currency: '${data.currency}',
    verifyVia: ['SALARY_CERT', 'BANK_STMT'],
  });

  // Step 4: Risk Scoring
  const risk = await client.risk.scoreCustomer({
    kycResult: kyc, amlResult: aml,
    employment, model: 'BFSI_UAE_v3',
  });

  // Step 5: Create Customer Record
  const customer = await client.customers.create({
    fullName: '${data.customer_name}',
    dob: '${data.dob}',
    nationality: '${data.nationality}',
    employer: '${data.employer}',
    monthlyIncome: ${data.monthly_income},
    currency: '${data.currency}',
    kycRef: kyc.referenceId,
    amlRef: aml.screeningId,
    riskScore: risk.score,
    riskLevel: risk.level,
    status: 'ACTIVE',
  });

  // Step 6: Audit Log
  await client.audit.log({
    event: 'CUSTOMER_ONBOARDED',
    customerId: customer.id,
    performedBy: 'OXYBFSAI_ENGINE',
    compliance: ['CBUAE', 'AML_2024'],
    metadata: { kycScore: kyc.confidence, riskLevel: risk.level },
  });

  console.log('Customer ID   :', customer.id);
  console.log('KYC Status    :', kyc.status);
  console.log('AML Status    :', aml.status);
  console.log('Risk Level    :', risk.level);
  console.log('Account Status:', customer.status);
}

onboardCustomer().catch(console.error);`,
    }),
  },
  {
    id: "loan",
    label: "Loan Eligibility",
    icon: "🏦",
    subtitle: "Credit Score · DTI · Risk Analysis",
    color: "#00B894",
    fields: [
      { key: "applicant_name", label: "Applicant Name", type: "text", demo: "Sara Al Mansoori" },
      { key: "annual_income", label: "Annual Income (AED)", type: "number", demo: "180000" },
      { key: "loan_amount", label: "Loan Amount (AED)", type: "number", demo: "500000" },
      { key: "loan_tenure", label: "Tenure (Years)", type: "number", demo: "20" },
      { key: "credit_score", label: "Credit Score", type: "number", demo: "720" },
      { key: "existing_debt", label: "Existing Debt (AED)", type: "number", demo: "12000" },
    ],
    documents: ["Income Statement", "Credit Bureau Report", "Property Valuation"],
    agents: [
      { name: "Credit Bureau Analysis", status: "done" },
      { name: "Income Verification", status: "done" },
      { name: "Debt-to-Income Engine", status: "done" },
      { name: "Eligibility Decision", status: "done" },
    ],
    decision: {
      verdict: "ELIGIBLE",
      verdictColor: "#00B894",
      fields: [
        { label: "Maximum Loan", value: "AED 250,000" },
        { label: "Interest Rate", value: "3.75%" },
        { label: "Tenure", value: "20 Years" },
        { label: "Confidence", value: "92%" },
      ],
      reasoning: "Credit score 720 qualifies applicant. DTI ratio 28% within policy. Income verified. Recommended loan: AED 250,000.",
    },
    dependencies: ["Customer Onboarding", "Credit Bureau Analysis", "Income Verification", "Bank Statement Analysis"],
    codeTemplate: (_lang, data) => ({
      python: `import oxybfsai_sdk as oby
import datetime

client = oby.Client(api_key="YOUR_API_KEY", region="UAE")

# ── Step 1: Pull Credit Bureau Report
bureau = client.credit_bureau.fetch(
    applicant_name="${data.applicant_name}",
    source="AECB",
    report_type="FULL"
)
credit_score = bureau.score  # e.g. ${data.credit_score}

# ── Step 2: Income Verification
income = client.income.verify(
    applicant_name="${data.applicant_name}",
    declared_annual=${data.annual_income},
    verify_via=["SALARY_CERT", "BANK_STMT_6M", "TAX_RETURNS"]
)

# ── Step 3: Debt-to-Income Ratio Analysis
dti = client.dti.calculate(
    annual_income=income.verified_annual,
    existing_debt=${data.existing_debt},
    requested_loan=${data.loan_amount},
    tenure_years=${data.loan_tenure},
    policy_max_dti=0.40
)

# ── Step 4: Property & Collateral Valuation
collateral = client.collateral.value(
    loan_amount=${data.loan_amount},
    loan_type="MORTGAGE",
    ltv_policy_max=0.80
)

# ── Step 5: AI Eligibility Decision
eligibility = client.loans.evaluate(
    applicant_name="${data.applicant_name}",
    annual_income=${data.annual_income},
    loan_amount=${data.loan_amount},
    tenure_years=${data.loan_tenure},
    credit_score=credit_score,
    existing_debt=${data.existing_debt},
    dti_ratio=dti.ratio,
    collateral_value=collateral.estimated_value,
    model="LOAN_ELIGIBILITY_UAE_v2"
)

# ── Step 6: Generate Offer & Amortisation Schedule
if eligibility.approved:
    offer = client.loans.generate_offer(
        applicant_name="${data.applicant_name}",
        approved_amount=eligibility.max_amount,
        interest_rate=eligibility.interest_rate,
        tenure_years=${data.loan_tenure},
        repayment="MONTHLY_EMI"
    )
    schedule = offer.amortisation_schedule[:3]  # first 3 EMIs

# ── Step 7: Compliance & Audit
client.audit.log(
    event="LOAN_ELIGIBILITY_CHECKED",
    applicant="${data.applicant_name}",
    decision=eligibility.decision,
    compliance=["CBUAE_LENDING_POLICY", "AML_2024"],
    timestamp=datetime.datetime.utcnow().isoformat()
)

print(f"Decision      : {eligibility.decision}")
print(f"Approved Amt  : {eligibility.max_amount}")
print(f"Interest Rate : {eligibility.interest_rate}%")
print(f"Monthly EMI   : {offer.monthly_emi}")
print(f"DTI Ratio     : {dti.ratio:.1%}")
print(f"Confidence    : {eligibility.confidence}%")`,
      java: `import com.oxybfsai.sdk.*;
import com.oxybfsai.sdk.models.*;
import java.util.List;

public class LoanEligibilityEngine {

    public static void main(String[] args) throws Exception {
        OxyBFSAIClient client = OxyBFSAIClient.builder()
            .apiKey("YOUR_API_KEY").region("UAE").build();

        // Step 1: Credit Bureau
        BureauReport bureau = client.creditBureau().fetch(
            BureauRequest.builder()
                .applicantName("${data.applicant_name}")
                .source("AECB").reportType("FULL").build()
        );

        // Step 2: Income Verification
        IncomeResult income = client.income().verify(
            IncomeRequest.builder()
                .applicantName("${data.applicant_name}")
                .declaredAnnual(${data.annual_income})
                .verifyVia(List.of("SALARY_CERT", "BANK_STMT_6M"))
                .build()
        );

        // Step 3: DTI Calculation
        DtiResult dti = client.dti().calculate(
            DtiRequest.builder()
                .annualIncome(income.getVerifiedAnnual())
                .existingDebt(${data.existing_debt})
                .requestedLoan(${data.loan_amount})
                .tenureYears(${data.loan_tenure})
                .policyMaxDti(0.40)
                .build()
        );

        // Step 4: AI Eligibility Decision
        LoanEligibility eligibility = client.loans().evaluate(
            LoanRequest.builder()
                .applicantName("${data.applicant_name}")
                .annualIncome(${data.annual_income})
                .loanAmount(${data.loan_amount})
                .tenureYears(${data.loan_tenure})
                .creditScore(bureau.getScore())
                .existingDebt(${data.existing_debt})
                .dtiRatio(dti.getRatio())
                .model("LOAN_ELIGIBILITY_UAE_v2")
                .build()
        );

        // Step 5: Generate Offer
        LoanOffer offer = client.loans().generateOffer(
            OfferRequest.builder()
                .approvedAmount(eligibility.getMaxAmount())
                .interestRate(eligibility.getInterestRate())
                .tenureYears(${data.loan_tenure})
                .repayment("MONTHLY_EMI")
                .build()
        );

        System.out.println("Decision     : " + eligibility.getDecision());
        System.out.println("Max Amount   : " + eligibility.getMaxAmount());
        System.out.println("Interest Rate: " + eligibility.getInterestRate() + "%");
        System.out.println("Monthly EMI  : " + offer.getMonthlyEmi());
        System.out.println("Confidence   : " + eligibility.getConfidence() + "%");
    }
}`,
      nodejs: `const { OxyBFSAI } = require('@oxybfsai/sdk');
const client = new OxyBFSAI({ apiKey: 'YOUR_API_KEY', region: 'UAE' });

async function checkLoanEligibility() {
  // Step 1: Credit Bureau Report
  const bureau = await client.creditBureau.fetch({
    applicantName: '${data.applicant_name}',
    source: 'AECB', reportType: 'FULL',
  });

  // Step 2: Income Verification
  const income = await client.income.verify({
    applicantName: '${data.applicant_name}',
    declaredAnnual: ${data.annual_income},
    verifyVia: ['SALARY_CERT', 'BANK_STMT_6M'],
  });

  // Step 3: DTI Ratio Analysis
  const dti = await client.dti.calculate({
    annualIncome: income.verifiedAnnual,
    existingDebt: ${data.existing_debt},
    requestedLoan: ${data.loan_amount},
    tenureYears: ${data.loan_tenure},
    policyMaxDti: 0.40,
  });

  // Step 4: AI Eligibility Decision
  const eligibility = await client.loans.evaluate({
    applicantName: '${data.applicant_name}',
    annualIncome: ${data.annual_income},
    loanAmount: ${data.loan_amount},
    tenureYears: ${data.loan_tenure},
    creditScore: bureau.score,
    existingDebt: ${data.existing_debt},
    dtiRatio: dti.ratio,
    model: 'LOAN_ELIGIBILITY_UAE_v2',
  });

  // Step 5: Generate Loan Offer
  const offer = await client.loans.generateOffer({
    approvedAmount: eligibility.maxAmount,
    interestRate: eligibility.interestRate,
    tenureYears: ${data.loan_tenure},
    repayment: 'MONTHLY_EMI',
  });

  // Step 6: Audit
  await client.audit.log({
    event: 'LOAN_ELIGIBILITY_CHECKED',
    applicant: '${data.applicant_name}',
    decision: eligibility.decision,
    compliance: ['CBUAE_LENDING_POLICY', 'AML_2024'],
  });

  console.log('Decision     :', eligibility.decision);
  console.log('Max Amount   :', eligibility.maxAmount);
  console.log('Interest Rate:', eligibility.interestRate + '%');
  console.log('Monthly EMI  :', offer.monthlyEmi);
  console.log('Confidence   :', eligibility.confidence + '%');
}

checkLoanEligibility().catch(console.error);`,
    }),
  },
  {
    id: "underwriting",
    label: "Smart Loan Matching",
    icon: "🎯",
    subtitle: "Right Loan · Right Customer · Right Time",
    color: "#E17055",
    fields: [
      { key: "customer_name", label: "Customer Name", type: "text", demo: "Priya Nair" },
      { key: "monthly_income", label: "Monthly Income (AED)", type: "number", demo: "22000" },
      { key: "credit_score", label: "Credit Score", type: "number", demo: "740" },
      { key: "loan_purpose", label: "Loan Purpose", type: "text", demo: "Home Purchase" },
      { key: "existing_emi", label: "Existing EMI (AED)", type: "number", demo: "3500" },
      { key: "employment_type", label: "Employment Type", type: "text", demo: "Salaried" },
    ],
    documents: ["Salary Slip", "Bank Statement (6 months)", "Credit Bureau Report"],
    agents: [
      { name: "Behavioural Analysis", status: "done" },
      { name: "Product Match Engine", status: "done" },
      { name: "Affordability Check", status: "done" },
      { name: "Loan Recommendation", status: "done" },
    ],
    decision: {
      verdict: "MATCHED",
      verdictColor: "#E17055",
      fields: [
        { label: "Best Product", value: "Home Loan – Prime" },
        { label: "Eligible Amount", value: "AED 420,000" },
        { label: "Rate", value: "3.49% p.a." },
        { label: "Confidence", value: "97%" },
      ],
      reasoning: "Credit score 740, stable salaried income, DTI 28%. Behavioural profile matches Home Loan Prime. Best product recommended with lowest rate.",
    },
    dependencies: ["Customer Onboarding", "Credit Bureau Analysis", "Behavioural Profiling"],
    codeTemplate: (_lang, data) => ({
      python: `import oxybfsai_sdk as oby
import datetime

client = oby.Client(api_key="YOUR_API_KEY", region="UAE")

# ── Step 1: Pull Credit Bureau & Behavioural Profile
bureau = client.credit_bureau.fetch(
    customer_name="${data.customer_name}",
    source="AECB",
    report_type="FULL"
)

behaviour = client.behavioural.profile(
    customer_name="${data.customer_name}",
    employment_type="${data.employment_type}",
    loan_purpose="${data.loan_purpose}",
    model="BFSI_BEHAVIOUR_UAE_v2"
)

# ── Step 2: Affordability & DTI Check
affordability = client.affordability.check(
    monthly_income=${data.monthly_income},
    existing_emi=${data.existing_emi},
    credit_score=${data.credit_score},
    policy_dti_max=0.45
)

# ── Step 3: Product Match Engine
matching = client.loan_match.find_best_product(
    customer_name="${data.customer_name}",
    credit_score=${data.credit_score},
    monthly_income=${data.monthly_income},
    loan_purpose="${data.loan_purpose}",
    employment_type="${data.employment_type}",
    affordability=affordability,
    behaviour_profile=behaviour,
    product_catalogue="CBUAE_PRODUCTS_2024"
)

# ── Step 4: AI Loan Recommendation Decision
recommendation = client.loans.recommend(
    customer_name="${data.customer_name}",
    matched_product=matching.best_product,
    eligible_amount=matching.eligible_amount,
    interest_rate=matching.best_rate,
    confidence=matching.confidence,
    model="LOAN_MATCH_UAE_v3"
)

# ── Step 5: Generate Pre-Approved Offer
offer = client.loans.pre_approve(
    customer_name="${data.customer_name}",
    product=matching.best_product,
    amount=matching.eligible_amount,
    rate=matching.best_rate,
    tenure_options=[10, 15, 20, 25]
)

# ── Step 6: Audit & Compliance Log
client.audit.log(
    event="LOAN_MATCHED",
    customer="${data.customer_name}",
    product=matching.best_product,
    decision=recommendation.decision,
    compliance=["CBUAE_LENDING_2024", "RESPONSIBLE_LENDING"],
    timestamp=datetime.datetime.utcnow().isoformat()
)

print(f"Decision       : {recommendation.decision}")
print(f"Best Product   : {matching.best_product}")
print(f"Eligible Amount: AED {matching.eligible_amount:,.0f}")
print(f"Interest Rate  : {matching.best_rate}% p.a.")
print(f"Confidence     : {matching.confidence}%")
print(f"Offer ID       : {offer.id}")`,
      java: `import com.oxybfsai.sdk.*;
import com.oxybfsai.sdk.models.*;
import java.util.List;

public class SmartLoanMatchingEngine {

    public static void main(String[] args) throws Exception {
        OxyBFSAIClient client = OxyBFSAIClient.builder()
            .apiKey("YOUR_API_KEY").region("UAE").build();

        // Step 1: Credit Bureau
        BureauReport bureau = client.creditBureau().fetch(
            BureauRequest.builder()
                .customerName("${data.customer_name}")
                .source("AECB").reportType("FULL").build()
        );

        // Step 2: Behavioural Profile
        BehaviourProfile behaviour = client.behavioural().profile(
            BehaviourRequest.builder()
                .customerName("${data.customer_name}")
                .employmentType("${data.employment_type}")
                .loanPurpose("${data.loan_purpose}")
                .model("BFSI_BEHAVIOUR_UAE_v2")
                .build()
        );

        // Step 3: Affordability Check
        AffordabilityResult affordability = client.affordability().check(
            AffordabilityRequest.builder()
                .monthlyIncome(${data.monthly_income})
                .existingEmi(${data.existing_emi})
                .creditScore(${data.credit_score})
                .policyDtiMax(0.45)
                .build()
        );

        // Step 4: Product Match
        LoanMatch matching = client.loanMatch().findBestProduct(
            LoanMatchRequest.builder()
                .customerName("${data.customer_name}")
                .creditScore(${data.credit_score})
                .monthlyIncome(${data.monthly_income})
                .loanPurpose("${data.loan_purpose}")
                .affordability(affordability)
                .behaviourProfile(behaviour)
                .model("LOAN_MATCH_UAE_v3")
                .build()
        );

        System.out.println("Decision      : " + matching.getDecision());
        System.out.println("Best Product  : " + matching.getBestProduct());
        System.out.println("Eligible Amt  : AED " + matching.getEligibleAmount());
        System.out.println("Interest Rate : " + matching.getBestRate() + "% p.a.");
        System.out.println("Confidence    : " + matching.getConfidence() + "%");
    }
}`,
      nodejs: `const { OxyBFSAI } = require('@oxybfsai/sdk');
const client = new OxyBFSAI({ apiKey: 'YOUR_API_KEY', region: 'UAE' });

async function smartLoanMatch() {
  // Step 1: Credit Bureau Report
  const bureau = await client.creditBureau.fetch({
    customerName: '${data.customer_name}',
    source: 'AECB', reportType: 'FULL',
  });

  // Step 2: Behavioural Profile
  const behaviour = await client.behavioural.profile({
    customerName: '${data.customer_name}',
    employmentType: '${data.employment_type}',
    loanPurpose: '${data.loan_purpose}',
    model: 'BFSI_BEHAVIOUR_UAE_v2',
  });

  // Step 3: Affordability Check
  const affordability = await client.affordability.check({
    monthlyIncome: ${data.monthly_income},
    existingEmi: ${data.existing_emi},
    creditScore: ${data.credit_score},
    policyDtiMax: 0.45,
  });

  // Step 4: Product Match Engine
  const matching = await client.loanMatch.findBestProduct({
    customerName: '${data.customer_name}',
    creditScore: ${data.credit_score},
    monthlyIncome: ${data.monthly_income},
    loanPurpose: '${data.loan_purpose}',
    employmentType: '${data.employment_type}',
    affordability,
    behaviourProfile: behaviour,
    model: 'LOAN_MATCH_UAE_v3',
  });

  // Step 5: Pre-Approve Offer
  const offer = await client.loans.preApprove({
    customerName: '${data.customer_name}',
    product: matching.bestProduct,
    amount: matching.eligibleAmount,
    rate: matching.bestRate,
    tenureOptions: [10, 15, 20, 25],
  });

  // Step 6: Audit
  await client.audit.log({
    event: 'LOAN_MATCHED',
    customer: '${data.customer_name}',
    product: matching.bestProduct,
    compliance: ['CBUAE_LENDING_2024', 'RESPONSIBLE_LENDING'],
  });

  console.log('Decision      :', matching.decision);
  console.log('Best Product  :', matching.bestProduct);
  console.log('Eligible Amt  :', 'AED', matching.eligibleAmount);
  console.log('Interest Rate :', matching.bestRate + '% p.a.');
  console.log('Confidence    :', matching.confidence + '%');
  console.log('Offer ID      :', offer.id);
}

smartLoanMatch().catch(console.error);`,
    }),
  },
];
