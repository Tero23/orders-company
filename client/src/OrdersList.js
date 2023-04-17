import React, { useEffect, useState } from "react";
import axios from "axios";
import Order from "./Order";
import { useNavigate } from "react-router-dom";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  const deletedOrderDataHandler = (order) => {
    setOrders((prev) => {
      return prev.filter((i) => i._id !== order._id);
    });
  };

  const getAllOrders = async () => {
    const response = await axios.get("http://localhost:8000/api/v1/orders", {
      withCredentials: true,
    });
    setOrders(response.data.orders);
    console.log(response.data);
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const addOrderClickHandler = () => {
    navigate("/order");
  };

  return (
    <div>
      <h1>Orders</h1>
      {orders.map((order) => (
        <Order
          onDeleteOrderData={deletedOrderDataHandler}
          id={order._id}
          key={order._id}
          designer={order.designer}
          material={order.material}
          salePrice={order.salePrice}
          dueDate={order.dueDate}
          clientName={order.clientName}
        />
      ))}
      <div>
        <button onClick={addOrderClickHandler}>Add Order</button>
      </div>
    </div>
  );
};

export default OrdersList;
