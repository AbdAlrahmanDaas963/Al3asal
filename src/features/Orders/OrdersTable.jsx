import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "./ordersSlice";
import OrderDetailsModal from "./OrderDetailsModal";
import { Button, Snackbar, Alert } from "@mui/material";

const OrdersTable = ({ orders }) => {
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const handleStatusChange = async (orderId, status, rejectReason) => {
    setIsUpdating(true);
    setError(null);

    try {
      const resultAction = await dispatch(
        updateOrderStatus({ orderId, status, rejectReason })
      );

      if (updateOrderStatus.rejected.match(resultAction)) {
        const errorPayload = resultAction.payload;
        throw new Error(
          typeof errorPayload === "object"
            ? JSON.stringify(errorPayload)
            : errorPayload?.toString() || "Status update failed"
        );
      }
    } catch (err) {
      console.error("Status update error:", err);
      setError(err?.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  // Safe error message display
  const getErrorMessage = () => {
    if (!error) return "";
    if (typeof error === "string") return error;
    if (typeof error === "object") return JSON.stringify(error);
    return error.toString();
  };

  return (
    <div>
      {/* Your orders table */}
      <table>
        {/* Table headers */}
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.reciver_name}</td>
              <td>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedOrder(order)}
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          open={Boolean(selectedOrder)}
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          isUpdating={isUpdating}
        />
      )}

      {/* Error Snackbar - now with safe error handling */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {getErrorMessage()}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OrdersTable;
