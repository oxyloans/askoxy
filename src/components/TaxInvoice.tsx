import React, { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./TaxInvoice.css";

interface InvoiceItem {
  description: string;
  qty: number;
  totalPrice: number;
  gst: number;
  discount: number;
  total: number;
}

const TaxInvoice: React.FC = () => {
  const qrRef = useRef<HTMLDivElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [billingAddress, setBillingAddress] = useState({
    name: "Vijaya Super Market",
    address1: "gardenia apartments, INDU FORTUNE FIELDS,",
    address2: "Kukatpally Housing Board Colony,",
    address3: "Fortune Fields, Kukatpally",
    state: "Telangana – 500072",
    phone: "+91 98483 17773",
  });

  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNo: "36800",
    invoiceDate: "06.02.2026",
    orderNo: "65-5170862",
    placeOfDelivery: "Telangana",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      description: "AI MATE & JOBSMATE (GEN Z 172 Pages NOTE BOOKS)",
      qty: 10,
      totalPrice: 590.0,
      gst: 0.0,
      discount: 236.0,
      total: 354.0,
    },
  ]);

  const [isEditing, setIsEditing] = useState(true);

  const calculateTotal = () =>
    items.reduce((sum, item) => sum + (item.total || 0), 0);

  const amountInWords = useMemo(() => {
    const numberToWords = (num: number): string => {
      const ones = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
      ];
      const tens = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
      ];
      const teens = [
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
      ];

      if (num === 0) return "Zero";
      if (num < 10) return ones[num];
      if (num < 20) return teens[num - 10];
      if (num < 100)
        return (
          tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
        );
      if (num < 1000)
        return (
          ones[Math.floor(num / 100)] +
          " Hundred" +
          (num % 100 ? " " + numberToWords(num % 100) : "")
        );
      if (num < 100000)
        return (
          numberToWords(Math.floor(num / 1000)) +
          " Thousand" +
          (num % 1000 ? " " + numberToWords(num % 1000) : "")
        );
      return num.toString();
    };

    return `${numberToWords(Math.floor(calculateTotal()))} only`;
  }, [items]);

  const generateQRCode = () => {
    if (!qrRef.current) return;

    qrRef.current.innerHTML = "";

    const upiId = "MSOXYKARTTECHNOLOGIESPRIVATELIMITED.eazypay@icici";
    const merchantName = "M S Oxykart Technologies Private Limited";
    const amount = calculateTotal().toFixed(2);
    const invoiceNo = invoiceDetails.invoiceNo;

    const upiUrl =
      "upi://pay" +
      "?pa=" +
      encodeURIComponent(upiId) +
      "&pn=" +
      encodeURIComponent(merchantName) +
      "&am=" +
      encodeURIComponent(amount) +
      "&cu=INR" +
      "&tn=" +
      encodeURIComponent("Invoice No " + invoiceNo);

    new QRCode(qrRef.current, {
      text: upiUrl,
      width: 145,
      height: 145,
      correctLevel: QRCode.CorrectLevel.M,
    });
  };

  useEffect(() => {
    generateQRCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, invoiceDetails.invoiceNo]);

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value as any };

    if (["qty", "totalPrice", "gst", "discount"].includes(field)) {
      const item = newItems[index];
      item.total =
        Number(item.totalPrice || 0) +
        Number(item.gst || 0) -
        Number(item.discount || 0);
    }

    setItems(newItems);
  };
const downloadPDF = async () => {
  if (!invoiceRef.current) return;

  setIsEditing(false);
  await new Promise((r) => setTimeout(r, 200));

  const element = invoiceRef.current;

  // ✅ Add safe padding so html2canvas doesn't crop borders
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    backgroundColor: "#ffffff",
    scrollX: 0,
    scrollY: -window.scrollY,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // ✅ Fit image inside PDF with margins
  const margin = 6; // mm
  const contentWidth = pdfWidth - margin * 2;

  const imgHeight = (canvas.height * contentWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", margin, margin, contentWidth, imgHeight);

  // ✅ Draw PDF border (guaranteed 4-side border)
  pdf.setLineWidth(0.5);
  pdf.rect(margin, margin, pdfWidth - margin * 2, pdfHeight - margin * 2);

  pdf.save(`Invoice_${invoiceDetails.invoiceNo}.pdf`);

  setIsEditing(true);
};


  return (
    <div className="invoice-page">
      {isEditing && (
        <div className="invoice-toolbar">
          <button className="btn-primary" style={{backgroundColor:"#008cba",color:"white"}} onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
      )}
<div className="invoice-border">
      <div ref={invoiceRef} className="invoice-wrap">
        <div className="invoice-header">TAX INVOICE</div>

        {/* TOP SECTION */}
        <div className="invoice-grid top">
          <div className="block">
            <div className="label">Sold By:</div>
            <div className="text">
              <b>OXYKART TECHNOLOGIES PRIVATE LIMITED</b>
              <br />
              Ground Floor, Block C, CC-03,
              <br />
              Indu Fortune Fields – THE ANNEXE,
              <br />
              KPHB 13th Phase Road,
              <br />
              Hyderabad, Telangana – 500085
            </div>

            <div className="text mt8">
              <span className="label-inline">PAN:</span> AADCO2134P <br />
              <span className="label-inline">GSTIN:</span> 36AADCO2134P1Z8
            </div>
          </div>

          <div className="block right">
            <div className="qr-box">
              <div className="qr-canvas" ref={qrRef} />
              <div className="qr-title">Scan &amp; Pay</div>
              <div className="qr-sub">Amount auto-filled</div>
              <div className="qr-sub">
                UPI ID: <b>MSOXYKARTTECHNOLOGIESPRIVATELIMITED.eazypay@icici</b>
              </div>
            </div>
          </div>
        </div>

        {/* BILLING + INVOICE DETAILS */}
        <div className="invoice-grid mid">
          <div className="block">
            <div className="label">Billing Address:</div>

            {isEditing ? (
              <div className="edit-stack">
                <input
                  className="edit"
                  value={billingAddress.name}
                  onChange={(e) =>
                    setBillingAddress({
                      ...billingAddress,
                      name: e.target.value,
                    })
                  }
                />
                <input
                  className="edit"
                  value={billingAddress.address1}
                  onChange={(e) =>
                    setBillingAddress({
                      ...billingAddress,
                      address1: e.target.value,
                    })
                  }
                />
                <input
                  className="edit"
                  value={billingAddress.address2}
                  onChange={(e) =>
                    setBillingAddress({
                      ...billingAddress,
                      address2: e.target.value,
                    })
                  }
                />
                <input
                  className="edit"
                  value={billingAddress.address3}
                  onChange={(e) =>
                    setBillingAddress({
                      ...billingAddress,
                      address3: e.target.value,
                    })
                  }
                />
                <input
                  className="edit"
                  value={billingAddress.state}
                  onChange={(e) =>
                    setBillingAddress({
                      ...billingAddress,
                      state: e.target.value,
                    })
                  }
                />
                <input
                  className="edit"
                  value={billingAddress.phone}
                  onChange={(e) =>
                    setBillingAddress({
                      ...billingAddress,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
            ) : (
              <div className="text">
                {billingAddress.name}
                <br />
                {billingAddress.address1}
                <br />
                {billingAddress.address2}
                <br />
                {billingAddress.address3}
                <br />
                {billingAddress.state}
                <br />
                Phone: {billingAddress.phone}
              </div>
            )}
          </div>

          <div className="block">
            <div className="invoice-meta">
              <div className="meta-row">
                <span className="label-inline">Invoice No:</span>{" "}
                {isEditing ? (
                  <input
                    className="edit meta"
                    value={invoiceDetails.invoiceNo}
                    onChange={(e) =>
                      setInvoiceDetails({
                        ...invoiceDetails,
                        invoiceNo: e.target.value,
                      })
                    }
                  />
                ) : (
                  <b>{invoiceDetails.invoiceNo}</b>
                )}
              </div>

              <div className="meta-row">
                <span className="label-inline">Invoice Date:</span>{" "}
                {isEditing ? (
                  <input
                    className="edit meta"
                    value={invoiceDetails.invoiceDate}
                    onChange={(e) =>
                      setInvoiceDetails({
                        ...invoiceDetails,
                        invoiceDate: e.target.value,
                      })
                    }
                  />
                ) : (
                  <b>{invoiceDetails.invoiceDate}</b>
                )}
              </div>

              <div className="meta-row">
                <span className="label-inline">Order No:</span>{" "}
                {isEditing ? (
                  <input
                    className="edit meta"
                    value={invoiceDetails.orderNo}
                    onChange={(e) =>
                      setInvoiceDetails({
                        ...invoiceDetails,
                        orderNo: e.target.value,
                      })
                    }
                  />
                ) : (
                  <b>{invoiceDetails.orderNo}</b>
                )}
              </div>

              <div className="meta-row">
                <span className="label-inline">Place of Delivery:</span>{" "}
                {isEditing ? (
                  <input
                    className="edit meta"
                    value={invoiceDetails.placeOfDelivery}
                    onChange={(e) =>
                      setInvoiceDetails({
                        ...invoiceDetails,
                        placeOfDelivery: e.target.value,
                      })
                    }
                  />
                ) : (
                  <b>{invoiceDetails.placeOfDelivery}</b>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="table-wrap">
          <table className="invoice-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Sl No</th>
                <th>Description</th>
                <th style={{ width: 70 }}>Qty</th>
                <th style={{ width: 110 }}>Total Price</th>
                <th style={{ width: 90 }}>GST (%)</th>
                <th style={{ width: 95 }}>Discount</th>
                <th style={{ width: 95 }}>Total</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="center">{index + 1}</td>

                  <td>
                    {isEditing ? (
                      <input
                        className="edit cell"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                      />
                    ) : (
                      item.description
                    )}
                  </td>

                  <td className="center">
                    {isEditing ? (
                      <input
                        className="edit cell small"
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "qty",
                            Number(e.target.value) || 0,
                          )
                        }
                      />
                    ) : (
                      item.qty
                    )}
                  </td>

                  <td className="right">
                    {isEditing ? (
                      <input
                        className="edit cell small"
                        type="number"
                        value={item.totalPrice}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "totalPrice",
                            Number(e.target.value) || 0,
                          )
                        }
                      />
                    ) : (
                      `₹${Number(item.totalPrice || 0).toFixed(2)}`
                    )}
                  </td>

                  <td className="right">
                    {isEditing ? (
                      <input
                        className="edit cell small"
                        type="number"
                        value={item.gst}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "gst",
                            Number(e.target.value) || 0,
                          )
                        }
                      />
                    ) : (
                      `₹${Number(item.gst || 0).toFixed(2)}`
                    )}
                  </td>

                  <td className="right">
                    {isEditing ? (
                      <input
                        className="edit cell small"
                        type="number"
                        value={item.discount}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "discount",
                            Number(e.target.value) || 0,
                          )
                        }
                      />
                    ) : (
                      `₹${Number(item.discount || 0).toFixed(2)}`
                    )}
                  </td>

                  <td className="right">
                    ₹{Number(item.total || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AMOUNT WORDS + NOTES */}
        <div className="footer-notes">
          <div>
            <div className="label">Amount in Words:</div>
            <div className="text">{amountInWords}</div>
            <div className="text mt8">
              Whether tax is payable under reverse charge – No
            </div>
          </div>

          <div className="signature">
            <div>
              For <b>OXYKART TECHNOLOGIES PRIVATE LIMITED</b>
            </div>
            <div className="sign">Authorized Signatory</div>
          </div>
        </div>

        <div className="registered">
          <b>Registered Office Address:</b>
          <br />
          Ground Floor, Block C, CC-03, Indu Fortune Fields – THE ANNEXE,
          <br />
          KPHB 13th Phase Road, Hyderabad, Telangana – 500085
        </div>
      </div>
    </div>
    </div>
  );
};

export default TaxInvoice;
