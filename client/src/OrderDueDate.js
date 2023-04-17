import "./OrderDueDate.css";
const OrderDueDate = (props) => {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[new Date(props.dueDate).getMonth()];
  const day = new Date(props.dueDate).getDate();
  const year = new Date(props.dueDate).getFullYear();
  return (
    <div className="order-due-date">
      <div className="order-due-date__month">{month}</div>
      <div className="order-due-date__year">{year}</div>
      <div className="order-due-date__day">{day}</div>
    </div>
  );
};

export default OrderDueDate;
