export default function ProductCard({ item, onAction }) {
  return (
    <div className="flex gap-3 p-3 border rounded-xl bg-white shadow-sm">
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-24 h-24 object-contain border rounded-lg"
        />
      )}

      <div className="flex-1">
        <h4 className="text-sm font-semibold line-clamp-2">
          {item.name}
        </h4>

        <div className="flex gap-2 items-center mt-1">
          <span className="text-green-600 font-bold">
            ₹{item.price}
          </span>
          {item.mrp && (
            <span className="text-xs line-through text-gray-400">
              ₹{item.mrp}
            </span>
          )}
        </div>

        {item.desc && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {item.desc}
          </p>
        )}

        <div className="flex gap-2 mt-2">
          <button
            onClick={() =>
              onAction(`ADD_TO_CART:\nProduct: ${item.name}\nQuantity: 1`)
            }
            className="px-3 py-1 text-xs bg-green-600 text-white rounded"
          >
            Add
          </button>

          <button
            onClick={() =>
              onAction(`INCREASE_QTY:\nProduct: ${item.name}`)
            }
            className="px-2 py-1 text-xs bg-gray-200 rounded"
          >
            +
          </button>

          <button
            onClick={() =>
              onAction(`DECREASE_QTY:\nProduct: ${item.name}`)
            }
            className="px-2 py-1 text-xs bg-gray-200 rounded"
          >
            −
          </button>

          <button
            onClick={() =>
              onAction(`REMOVE_FROM_CART:\nProduct: ${item.name}`)
            }
            className="px-2 py-1 text-xs bg-red-500 text-white rounded"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
