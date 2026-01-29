/* ---------- DETECT ORDER HISTORY ---------- */
export const isOrderHistory = (text) =>
  /order history/i.test(text) ||
  /recent orders/i.test(text);


/* ---------- PRODUCT PARSER ---------- */
export const parseItemsFromMarkdown = (text) => {
  const regex =
    /\d+\.\s\*\*(.*?)\*\*([\s\S]*?)(?=\n\d+\.|\n🛒|\nLet me know|$)/g;

  const items = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const block = match[2];

    items.push({
      name: match[1]?.trim(),
      price: block.match(/Price:\s₹([\d.]+)/)?.[1],
      mrp: block.match(/MRP:\s₹([\d.]+)/)?.[1],
      qty: block.match(/Quantity:\s(\d+)/)?.[1],
      image: block.match(/\!\[Image\]\((.*?)\)/)?.[1],
      desc: block.match(/Description:\s(.*)/)?.[1]
    });
  }

  return items.length ? items : null;
};

/* ---------- ORDER PARSER ---------- */
export const parseOrdersFromMarkdown = (text) => {
  const regex =
    /\d+\.\s\*\*Order ID:\*\*\s(.*?)\n([\s\S]*?)(?=\n\d+\.|\nIf you need|$)/g;

  const orders = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const block = match[2];

    orders.push({
      orderId: match[1].trim(),
      date: block.match(/\*\*Date:\*\*\s(.*)/)?.[1],
      status: block.match(/\*\*Status:\*\*\s(.*)/)?.[1],
      total:
        block.match(/\*\*(Total Amount|Amount):\*\*\s₹([\d.]+)/)?.[2],
      payment: block.match(/\*\*Payment Method:\*\*\s(.*)/)?.[1]
    });
  }

  return orders.length ? orders : null;
};

