import React, { useContext, useEffect, useRef, useState } from "react";
import { Context } from "./App";
import axios from "axios";

const OrderForm = (props) => {
  const nameRef = useRef();

  const [userData, setUserData] = useContext(Context);

  const [clientName, setClientName] = useState("");
  const [image, setImage] = useState(null);
  const [designer, setDesigner] = useState("");
  const [owner, setOwner] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [productType, setProductType] = useState("");
  const [ringSize, setRingSize] = useState("");
  const [material, setMaterial] = useState("");
  const [chainType, setChainType] = useState("");
  const [necklaceLength, setNecklaceLength] = useState("");
  const [braceletLength, setBraceletLength] = useState("");
  const [goldColor, setGoldColor] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [salePrice, setSalePrice] = useState("");

  const [showNecklaceLength, setShowNecklaceLength] = useState(false);
  const [showBraceletLength, setShowBraceletLength] = useState(false);
  const [showGoldColor, setShowGoldColor] = useState(false);
  const [showRingSize, setShowRingSize] = useState(false);
  const [showChainType, setShowChainType] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      const user = (
        await axios.get(`http://localhost:8000/api/v1/users`, {
          withCredentials: true,
        })
      ).data;
      setUserId(user.user._id);
      setFirstName(user.user.firstName);
      setLastName(user.user.lastName);
      setEmail(user.user.email);
    };
    getUserData();
  }, []);

  const submitHandler = async (e) => {
    const formData = new FormData();
    formData.append("owner", userId);
    formData.append("clientName", clientName);
    formData.append("designer", designer);
    formData.append("storeLocation", storeLocation);
    formData.append("dueDate", new Date(dueDate));
    formData.append("productType", productType);
    formData.append("ringSize", ringSize);
    formData.append("material", material);
    formData.append("chainType", chainType);
    formData.append("necklaceLength", necklaceLength);
    formData.append("braceletLength", braceletLength);
    formData.append("goldColor", goldColor);
    formData.append("serialNumber", serialNumber);
    formData.append("salePrice", salePrice);
    formData.append("image", image);

    await axios.post("http://localhost:8000/api/v1/orders", formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setClientName("");
    setDesigner("");
    setStoreLocation("");
    setDueDate("");
    setProductType("");
    setRingSize("");
    setMaterial("");
    setChainType("");
    setNecklaceLength("");
    setBraceletLength("");
    setGoldColor("");
    setSerialNumber("");
    setSalePrice("");
  };

  useEffect(() => {
    if (
      productType !== "Necklace" ||
      productType !== "Bracelet" ||
      productType !== "Ring" ||
      productType !== "Pendant"
    ) {
      setShowNecklaceLength(false);
      setShowBraceletLength(false);
      setShowRingSize(false);
      setShowChainType(false);
    }
    if (productType === "Ring") {
      setShowRingSize(true);
      setShowBraceletLength(false);
      setShowNecklaceLength(false);
      setShowChainType(false);
    }
    if (productType === "Bracelet") {
      setShowBraceletLength(true);
      setShowRingSize(false);
      setShowNecklaceLength(false);
      setShowChainType(false);
    }
    if (productType === "Necklace") {
      setShowNecklaceLength(true);
      setShowBraceletLength(false);
      setShowRingSize(false);
      setShowChainType(false);
    }

    if (productType === "Pendant") {
      setShowNecklaceLength(false);
      setShowBraceletLength(false);
      setShowRingSize(false);
      setShowChainType(true);
    }

    if (material.split(" ")[1] === "Gold") {
      setShowGoldColor(true);
    }
    if (material.split(" ")[1] !== "Gold") {
      setShowGoldColor(false);
    }
  }, [productType, material]);

  const fileSelected = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <>
      <h1 className="order_form">Order Form</h1>
      <br />
      <form onSubmit={submitHandler}>
        <h3>Sales & Order Information</h3>
        <p>
          ------------------------------------------------------------------
        </p>
        <p>
          Salesman: {firstName} {lastName}
        </p>
        <p>Email Address: {email}</p>

        <label htmlFor="name">Client Name:</label>
        <input
          type="text"
          id="clientName"
          ref={nameRef}
          autoComplete="off"
          onChange={(e) => setClientName(e.target.value)}
          value={clientName}
        />

        <label htmlFor="storeLocation">Store Location:</label>
        <select
          id="storeLocation"
          name="storeLocation"
          value={storeLocation}
          onChange={(e) => {
            setStoreLocation(e.target.value);
          }}
        >
          <option value="">Select</option>
          <option value="Beverly Wilshire">Beverly Wilshire</option>
          <option value="Las Vegas">Las Vegas</option>
          <option value="Miami">Miami</option>
          <option value="Charlotte">Charlotte</option>
          <option value="Private Showroom (HQ)">Private Showroom (HQ)</option>
        </select>

        <label htmlFor="designer">Designer:</label>
        <select
          id="designer"
          name="designer"
          value={designer}
          onChange={(e) => {
            setDesigner(e.target.value);
          }}
        >
          <option value="">Select</option>
          <option value="Jason">Jason</option>
          <option value="Jed">Jed</option>
          <option value="Jeremy">Jeremy</option>
          <option value="Zach">Zach</option>
        </select>

        <label htmlFor="dueDate">Due Date(*):</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => {
            setDueDate(e.target.value);
          }}
        />

        <p>
          ------------------------------------------------------------------
        </p>
        <br />
        <br />

        <h3>Product Information</h3>
        <p>
          ------------------------------------------------------------------
        </p>

        <label htmlFor="serialNumber">Serial Number:</label>
        <input
          type="number"
          id="serialNumber"
          autoComplete="off"
          onChange={(e) => setSerialNumber(e.target.value)}
          value={serialNumber}
        />

        <label htmlFor="salePrice">Sale Price(*):</label>
        <input
          type="number"
          id="salePrice"
          autoComplete="off"
          required
          onChange={(e) => setSalePrice(e.target.value)}
          value={salePrice}
        />

        <label htmlFor="productType">Product Type:</label>
        <select
          id="productType"
          name="productType"
          value={productType}
          onChange={(e) => {
            setProductType(e.target.value);
          }}
        >
          <option value="">Select</option>
          <option value="Ring">Ring</option>
          <option value="Pendant">Pendant</option>
          <option value="Necklace">Necklace</option>
          <option value="Bracelet">Bracelet</option>
          <option value="Earrings">Earrings</option>
          <option value="Chain">Chain</option>
          <option value="Other">Other</option>
        </select>

        {showChainType && (
          <div>
            <label htmlFor="chainType">Chain Type:</label>
            <input
              type="text"
              id="chainType"
              autoComplete="off"
              onChange={(e) => setChainType(e.target.value)}
              value={chainType}
            />
          </div>
        )}

        {showRingSize && (
          <div>
            <label htmlFor="ringSize">Ring Size(*):</label>
            <select
              id="ringSize"
              name="ringSize"
              value={ringSize}
              onChange={(e) => {
                setRingSize(e.target.value);
              }}
            >
              <option value="">Select</option>
              <option value="3">3</option>
              <option value="3.25">3.25</option>
              <option value="3.5">3.5</option>
              <option value="3.75">3.75</option>
              <option value="4">4</option>
              <option value="4.25">4.25</option>
              <option value="4.5">4.5</option>
              <option value="4.75">4.75</option>
              <option value="5">5</option>
              <option value="5.25">5.25</option>
              <option value="5.5">5.5</option>
              <option value="5.75">5.75</option>
              <option value="6">6</option>
              <option value="6.25">6.25</option>
              <option value="6.5">6.5</option>
              <option value="6.75">6.75</option>
              <option value="7">7</option>
              <option value="7.25">7.25</option>
              <option value="7.5">7.5</option>
              <option value="7.75">7.75</option>
              <option value="8">8</option>
              <option value="8.25">8.25</option>
              <option value="8.5">8.5</option>
              <option value="8.75">8.75</option>
              <option value="9">9</option>
            </select>
          </div>
        )}

        {showNecklaceLength && (
          <div>
            <label htmlFor="necklaceLength">Necklace Length(*):</label>
            <input
              type="number"
              id="necklaceLength"
              autoComplete="off"
              required
              onChange={(e) => setNecklaceLength(e.target.value)}
              value={necklaceLength}
            />
          </div>
        )}

        {showBraceletLength && (
          <div>
            <label htmlFor="braceletLength">Bracelet Length(*):</label>
            <input
              type="number"
              id="braceletLength"
              autoComplete="off"
              required
              onChange={(e) => setBraceletLength(e.target.value)}
              value={braceletLength}
            />
          </div>
        )}

        <p>
          ------------------------------------------------------------------
        </p>
        <br />
        <br />

        <h3>Product Images</h3>
        <p>
          ------------------------------------------------------------------
        </p>

        <label htmlFor="image">Image(*):</label>
        <input
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          required
          onChange={fileSelected}
        />

        <p>
          ------------------------------------------------------------------
        </p>
        <br />
        <br />

        <h3>Product Details</h3>
        <p>
          ------------------------------------------------------------------
        </p>

        <label htmlFor="material">Metal / Material:</label>
        <select
          id="material"
          name="material"
          value={material}
          onChange={(e) => {
            setMaterial(e.target.value);
          }}
        >
          <option value="">Select</option>
          <option value="10kt Gold">10kt Gold</option>
          <option value="14kt Gold">14kt Gold</option>
          <option value="18kt Gold">18kt Gold</option>
          <option value="22kt Gold">22kt Gold</option>
          <option value="Platinum">Platinum</option>
          <option value="Silver">Silver</option>
          <option value="Other">Other</option>
        </select>

        {showGoldColor && (
          <div>
            <label htmlFor="goldColor">Gold Color(*):</label>
            <select
              id="goldColor"
              name="goldColor"
              value={goldColor}
              onChange={(e) => {
                setGoldColor(e.target.value);
              }}
            >
              <option value="">Select</option>
              <option value="Yellow">Yellow</option>
              <option value="White">White</option>
              <option value="Rose">Rose</option>
              <option value="Black">Black</option>
              <option value="Two Tone">Two Tone</option>
              <option value="Tritone">Tritone</option>
            </select>
          </div>
        )}

        <p>
          ------------------------------------------------------------------
        </p>
        <br />

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default OrderForm;
