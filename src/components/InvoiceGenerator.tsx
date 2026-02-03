import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const formatIndianRupee = (amount: number | string): string => {
  const num = typeof amount === "number" ? amount : parseFloat(amount) || 0;
  const fixed = num.toFixed(2);
  const [integer, decimal] = fixed.split(".");
  let formattedInteger = integer.replace("-", "");
  const isNegative = num < 0;
  if (formattedInteger.length > 3) {
    const firstPart = formattedInteger.slice(0, formattedInteger.length - 3);
    const lastThree = formattedInteger.slice(-3);
    const groupedFirst = firstPart.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    formattedInteger = groupedFirst + "," + lastThree;
  }
  const sign = isNegative ? "-" : "";
  return `${sign}₹${formattedInteger}.${decimal}`;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const InvoiceGenerator: React.FC = () => {
  const [billingName, setBillingName] = useState<string>("Srinivas Sreepada");
  const [billingAddress, setBillingAddress] = useState<string>(
    "Srinivas Sreepada Apt: Stanley A-202, SMR Vinay Iconia Apts Masjid Banda Road Kondapur Hyderabad - 84",
  );
  const [billingState, setBillingState] = useState<string>("Telangana");
  const [billingCode, setBillingCode] = useState<string>("500084 TS");
  const [orderNumber, setOrderNumber] = useState<string>("cbab");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("INV-2a98105c");
  const [orderDate, setOrderDate] = useState<string>("2026-01-20");
  const [invoiceDate, setInvoiceDate] = useState<string>("2026-01-20");
  const [itemName, setItemName] = useState<string>(
    "22KT - 4 Grams Lakshmi Gold Coin (GRT)",
  );
  const [weight, setWeight] = useState<string>("4grams");
  const [quantity, setQuantity] = useState<number>(1);
  const [itemPrice, setItemPrice] = useState<number>(53976.7);
  const [sgstPercent, setSgstPercent] = useState<number>(1.5);
  const [cgstPercent, setCgstPercent] = useState<number>(1.5);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [charges, setCharges] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const subtotal = quantity * itemPrice;
  const sgstAmount = Number(((subtotal * sgstPercent) / 100).toFixed(2));
  const cgstAmount = Number(((subtotal * cgstPercent) / 100).toFixed(2));
  const totalGst = sgstAmount + cgstAmount;
  const itemTotalInclGst = subtotal + totalGst;
  const grandTotal = Number(
    (subtotal + totalGst + deliveryFee + charges - discount).toFixed(2),
  );

  const invoiceRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!invoiceRef.current || isGenerating) return;
    setIsGenerating(true);
    try {
      const input = invoiceRef.current;
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasRatio = canvas.height / canvas.width;
      const pageRatio = pdfHeight / pdfWidth;
      let drawWidth = pdfWidth;
      let drawHeight = pdfWidth * canvasRatio;
      let x = 0;
      let y = (pdfHeight - drawHeight) / 2;
      if (canvasRatio > pageRatio) {
        drawHeight = pdfHeight;
        drawWidth = pdfHeight / canvasRatio;
        x = (pdfWidth - drawWidth) / 2;
        y = 0;
      }
      pdf.addImage(imgData, "PNG", x, y, drawWidth, drawHeight);
      pdf.save(`Invoice_${invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="invoice-generator">
      <style>{`
        .invoice-generator {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, Helvetica, sans-serif;
        }
        .invoice-generator h1, .invoice-generator h2 {
          margin-bottom: 24px;
          color: #333;
        }
        .main-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        .section-group {
          margin-bottom: 40px;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
        }
        .section-group h3 {
          margin-bottom: 16px;
          color: #222;
          border-bottom: 2px solid #007bff;
          padding-bottom: 8px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }
        .form-grid label {
          display: block;
          margin-bottom: 6px;
          font-weight: bold;
          color: #444;
        }
        .form-grid input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 16px;
          box-sizing: border-box;
        }
        .form-grid input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
        .download-btn {
          padding: 14px 28px;
          font-size: 18px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          margin-bottom: 24px;
          transition: background 0.3s;
        }
        .download-btn:hover {
          background: #0056b3;
        }
        .download-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
        .invoice-preview {
          background: #fff;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        @media (min-width: 1024px) {
          .main-layout {
            grid-template-columns: 1fr 1fr;
          }
          .preview-section {
            position: sticky;
            top: 20px;
            align-self: start;
          }
          .section-group {
            margin-bottom: 0;
          }
        }
        @media (max-width: 600px) {
          .invoice-generator {
            padding: 12px;
          }
          .section-group {
            padding: 16px;
          }
          .invoice-preview {
            padding: 24px;
          }
        }
      `}</style>
      <h1 style={{ textAlign: "center", marginBottom: "40px", color: "#222" }}>
        Invoice Generator
      </h1>
      <div className="main-layout">
        <div>
          <h2>Edit Invoice Details</h2>
          <div className="section-group">
            <h3>Billing Details</h3>
            <div className="form-grid">
              <div>
                <label>Billing Name</label>
                <input
                  type="text"
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                />
              </div>
              <div>
                <label>Billing Address Line</label>
                <input
                  type="text"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                />
              </div>
              <div>
                <label>State/UT</label>
                <input
                  type="text"
                  value={billingState}
                  onChange={(e) => setBillingState(e.target.value)}
                />
              </div>
              <div>
                <label>Pin Code</label>
                <input
                  type="text"
                  value={billingCode}
                  onChange={(e) => setBillingCode(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="section-group">
            <h3>Order Details</h3>
            <div className="form-grid">
              <div>
                <label>Order Number</label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
              </div>
              <div>
                <label>Invoice Number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
              <div>
                <label>Order Date</label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                />
              </div>
              <div>
                <label>Invoice Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="section-group">
            <h3>Item Details</h3>
            <div className="form-grid">
              <div>
                <label>Item Name</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>
              <div>
                <label>Weight</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div>
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <label>Item Price (excl. GST)</label>
                <input
                  type="number"
                  step="0.01"
                  value={itemPrice}
                  onChange={(e) =>
                    setItemPrice(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <label>SGST (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={sgstPercent}
                  onChange={(e) =>
                    setSgstPercent(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <label>CGST (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={cgstPercent}
                  onChange={(e) =>
                    setCgstPercent(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </div>
          </div>
          <div className="section-group">
            <h3>Additional Charges</h3>
            <div className="form-grid">
              <div>
                <label>Delivery Fee (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={deliveryFee}
                  onChange={(e) =>
                    setDeliveryFee(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <label>Charges (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={charges}
                  onChange={(e) => setCharges(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label>Discount (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="preview-section">
          <h2>Invoice Preview</h2>
          <button
            className="download-btn"
            onClick={generatePDF}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating PDF..." : "Download as PDF"}
          </button>
          <div ref={invoiceRef} className="invoice-preview">
            <style>{`
              .inv-center { text-align: center; }
              .inv-right { text-align: right; }
              .inv-bold { font-weight: bold; }
              .inv-invoice-title { font-size: 18px; font-weight: bold; }
              table { width: 100%; border-collapse: collapse; margin-top: 8px; }
              th, td { border: 1px solid #000; padding: 6px; vertical-align: top; }
              th { background: #f2f2f2; font-weight: bold; text-align: center; }
              .inv-section { margin-top: 12px; }
            `}</style>
            <div className="inv-center">
              <div className="inv-invoice-title">OXYIDEAS PARTNERS LLP</div>
              <div className="inv-bold">
                TAX INVOICE / BILL OF SUPPLY / CASH MEMO
              </div>
              <div>
                <i>(Original for Recipient)</i>
              </div>
            </div>
            <table className="inv-section">
              <tbody>
                <tr>
                  <td className="inv-bold" width="20%">
                    Sold By
                  </td>
                  <td width="80%">OXYIDEAS PARTNERS LLP</td>
                </tr>
                <tr>
                  <td className="inv-bold">GSTIN</td>
                  <td>36AAHFO2441C1ZN</td>
                </tr>
                <tr>
                  <td className="inv-bold">Registered Office</td>
                  <td>
                    Ground Floor, Block C, CC-03, Indu Fortune Fields – THE
                    ANNEXE,
                    <br />
                    KPHB 13th Phase Road, Rangareddy, Hyderabad,
                    <br />
                    Medchal Malkajgiri, Telangana – 500085
                    <br />
                    Email: support@askoxy.ai | Phone: +91 9392921295
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="inv-section">
              <tbody>
                <tr>
                  <td className="inv-bold" width="20%">
                    Billing Address
                  </td>
                  <td width="80%">
                    {billingName}
                    <br />
                    {billingAddress}
                    <br />
                    State/UT: {billingState} | Code: {billingCode}
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="inv-section">
              <tbody>
                <tr>
                  <td className="inv-bold">Order Number</td>
                  <td>{orderNumber}</td>
                  <td className="inv-bold">Invoice Number</td>
                  <td>{invoiceNumber}</td>
                </tr>
                <tr>
                  <td className="inv-bold">Order Date</td>
                  <td>{formatDate(orderDate)}</td>
                  <td className="inv-bold">Invoice Date</td>
                  <td>{formatDate(invoiceDate)}</td>
                </tr>
              </tbody>
            </table>
            <table className="inv-section">
              <thead>
                <tr>
                  <th>Sl.No</th>
                  <th>Item Name</th>
                  <th>Weight</th>
                  <th>Quantity</th>
                  <th>Item Price</th>
                  <th>SGST%</th>
                  <th>CGST%</th>
                  <th>
                    Total Amount
                    <br />
                    (incl. GST)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="inv-center">1</td>
                  <td>{itemName}</td>
                  <td className="inv-center">{weight}</td>
                  <td className="inv-center">{quantity}</td>
                  <td className="inv-right">{formatIndianRupee(itemPrice)}</td>
                  <td className="inv-center">{sgstPercent}%</td>
                  <td className="inv-center">{cgstPercent}%</td>
                  <td className="inv-right">
                    {formatIndianRupee(itemTotalInclGst)}
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="inv-section">
              <tbody>
                <tr>
                  <td className="inv-bold" width="70%">
                    Total GST Amount
                  </td>
                  <td className="inv-right">{formatIndianRupee(totalGst)}</td>
                </tr>
                <tr>
                  <td className="inv-bold">Charges</td>
                  <td className="inv-right">{formatIndianRupee(charges)}</td>
                </tr>
                <tr>
                  <td className="inv-bold">Delivery Fee</td>
                  <td className="inv-right">
                    {formatIndianRupee(deliveryFee)}
                  </td>
                </tr>
                <tr>
                  <td className="inv-bold">Discount</td>
                  <td className="inv-right">
                    {discount > 0
                      ? `- ${formatIndianRupee(discount)}`
                      : "₹0.00"}
                  </td>
                </tr>
                <tr>
                  <td className="inv-bold">Grand Total</td>
                  <td className="inv-right inv-bold">
                    {formatIndianRupee(grandTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="inv-section">
              <div className="inv-bold">Declaration:</div>
              <div>
                We declare that this invoice shows the actual price of the
                goods/services described and that all particulars are true and
                correct.
              </div>
              <div>Whether tax is payable under reverse charge: No</div>
            </div>
            <div className="inv-section inv-right">
              <div className="inv-bold">Authorized Signatory</div>
              <div>(For OXYIDEAS PARTNERS LLP)</div>
            </div>
            <div
              className="inv-section inv-center"
              style={{ fontSize: "11px", marginTop: "30px" }}
            >
              <div className="inv-bold">Registered Office Address:</div>
              <div>
                Ground Floor, Block C, CC-03, Indu Fortune Fields – THE ANNEXE,
                <br />
                KPHB 13th Phase Road, Rangareddy, Hyderabad,
                <br />
                Medchal Malkajgiri, Telangana – 500085
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
