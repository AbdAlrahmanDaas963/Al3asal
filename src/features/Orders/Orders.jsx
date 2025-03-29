import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "./ordersSlice";
import OrdersTable from "./OrdersTable";
import OrdersTable2 from "./OrdersTable2";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders({ min_price: 0, per_page: 50 })); // Request 50 orders per page
  }, [dispatch]);

  useEffect(() => {
    console.log("Full API Response:", orders); // Log full response
  }, [orders]);

  useEffect(() => {
    if (orders.length > 0) {
      console.log(
        orders.map((order) => ({
          customerName: order.customer_name,
          accountId: order.account_id,
          category: order.category,
          card: order.card,
          deliverDate: order.deliver_date,
          payment: order.payment,
          status: order.status,
        }))
      );
    }
  }, [orders]);

  return (
    <div>
      {/* <OrdersTable orders={orders} /> */}
      <OrdersTable2 orders={orders} />
    </div>
  );
};

export default Orders;
