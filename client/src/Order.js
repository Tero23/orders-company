import React from "react";
import OrderDueDate from "./OrderDueDate";
import axios from "axios";
import "./Order.css";

const Order = (props) => {
  const deleteClickHandler = async (e) => {
    e.preventDefault();
    const deletedItem = await axios.delete(
      `http://localhost:8000/api/v1/orders/${props.id}`,
      {
        withCredentials: true,
      }
    );
    props.onDeleteOrderData(deletedItem);
  };

  return (
    <>
      <div className="order">
        <OrderDueDate dueDate={props.dueDate} />
        <div className="order__description">
          <h2>Designer: {props.designer}</h2>
          <div className="order__price">Order ID: {props.id}</div>
          <div className="order__price">Sale Price: ${props.salePrice}</div>
          <div className="order__price">Material: {props.material}</div>
          <div className="order__price">Client: {props.clientName}</div>
          <div className="new-order__actions">
            <button onClick={deleteClickHandler}>Delete</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
