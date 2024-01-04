import { Height, HomeRepairServiceOutlined } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export const DynamivInvoice = () => {
  const [isActive, setisActive] = useState(false);
  const [isActive2, setisActive2] = useState(false);
  const [isActive3, setisActive3] = useState(false);
  const [isActive4, setisActive4] = useState(false);
  const [isActive5, setisActive5] = useState(false);
  const [isActive6, setisActive6] = useState(false);
  const [isActive7, setisActive7] = useState(false);
  const [isActive8, setisActive8] = useState(false);
  const [tableData, setTableData] = useState([
    { name: "", description: "", unitCost: 0, quantity: 0, price: 0 },
  ]);
  const [amountPaid, setamountPaid] = useState(0.0);
  const [subtotal, setSubtotal] = useState(0);
  const [balnaceDuo, setbalnaceDuo] = useState(0);

  function changeIsactive() {
    setisActive(!isActive);
  }
  function changeIsactive2() {
    setisActive2(!isActive2);
  }
  function changeIsactive3() {
    setisActive3(!isActive3);
  }
  function changeIsactive4() {
    setisActive4(!isActive4);
  }
  function changeIsactive5() {
    setisActive5(!isActive5);
  }
  function changeIsactive6() {
    setisActive6(!isActive6);
  }

  function changeIsactive7() {
    setisActive7(!isActive7);
  }

  function changeIsactive8() {
    setisActive8(!isActive8);
  }
  const addRow = () => {
    setTableData([
      ...tableData,
      { name: "", description: "", unitCost: 0, quantity: 0, price: 0 },
    ]);
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const deleteRow = (index) => {
    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
  };

  useEffect(() => {
    // Calculate subtotal
    let subtotal = 0;
    tableData.forEach((row) => {
      if (row.price !== "") {
        subtotal += parseFloat(row.price);
      }
    });
    setSubtotal(subtotal);
  }, [tableData]);

  // const handleAmountDue = (e) => {
  //   let amount;
  //   if (!isNaN(e.target.value)) {
  //     setamountPaid(e.target.value);
  //   } else {
  //     setamountPaid(0);
  //   }
  // };

  useEffect(() => {
    console.log(amountPaid, balnaceDuo);
    if (amountPaid) {
      setbalnaceDuo(subtotal - amountPaid);
    }
  }, [amountPaid]);

  const handleChange = (event, index) => {
    // console.log(event, index);
    const { name, value } = event.target;

    const updatedData = [...tableData];
    updatedData[index][name] = value;

    const quantity = parseFloat(updatedData[index].quantity);
    const unitCost = parseFloat(updatedData[index].unitCost);

    const price =
      isNaN(quantity) || isNaN(unitCost)
        ? ""
        : (quantity * unitCost).toFixed(2);
    updatedData[index].price = price;

    // console.log(price);

    // setTableData(updatedData);
    setTableData(updatedData);
  };

  const currentDate = new Date();
  const options = { month: "long", day: "numeric", year: "numeric" };
  let formattedDate = currentDate.toLocaleDateString("en-US", options);

  const handleShareOnWhatsApp = () => {
    html2canvas(componentRef.current).then((canvas) => {
      // Convert the canvas to a data URI string
      const imgData = canvas.toDataURL("image/jpeg");

      // Create a shareable link for WhatsApp
      const shareUrl = `whatsapp://send?text=Please find the invoice attached.&image=${encodeURIComponent(
        imgData
      )}`;

      // Open the share link
      window.open(shareUrl);
    });
  };

  return (
    <>
      <div
        style={{
          // border: "1px solid black",
          width: "50%",
          //   height: "90vh",
          marginInline: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "1rem 0px",
            gap: "1rem",
          }}
        >
          <Button variant="contained" onClick={handlePrint}>
            Print Invoice
          </Button>
          {/* <Button variant="contained" onClick={handleGeneratePDF}>
            Generate PDF
          </Button> */}
          {/* <Button variant="contained" onClick={handleShareOnWhatsApp}>
            Share on WhatsApp
          </Button> */}
        </div>
        <div
          ref={componentRef}
          style={{
            overflow: "auto",
            width: "100%",
            marginInline: "auto",
            marginTop: "1rem",

            padding: "1rem 0.5rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#153A5B",
              textAlign: "center",
              fontWeight: "bold",
              color: "white",
              padding: "0.4rem 0px",
              fontSize: "1.5rem",
            }}
          >
            Invoice
          </div>
          <div
            style={{
              //   border: "1px solid red",
              display: "flex",
              justifyContent: "space-between",

              //   width: "95%",
              //   marginInline: "auto",
            }}
          >
            <div
              style={{
                // border: "1px solid red",
                marginTop: "2rem",
              }}
            >
              <textarea
                onMouseEnter={changeIsactive}
                onMouseLeave={changeIsactive}
                name="companuInfo"
                style={{
                  width: "240px",
                  height: "150px",
                  resize: "none",
                  overflow: "hidden",
                  backgroundColor: isActive ? "#F6FFDE" : "",
                  border: "none",
                  outline: "none",
                  fontWeight: "bolder",
                  fontSize: "1.1rem",
                }}
                value={`
ComfyWear 
House 240 Block A Public Health Society
LDA Avenue 1 Lahore
0321 8836095
                `}
              ></textarea>
            </div>
            <div>
              <img
                src="/logo.png"
                alt="Logo"
                style={{
                  width: "230px",
                }}
              />
            </div>
          </div>
          <div
            style={{
              //   border: "1px solid red",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
            >
              <textarea
                placeholder="Customer Name"
                onMouseEnter={changeIsactive2}
                onMouseLeave={changeIsactive2}
                name="companuInfo"
                style={{
                  width: "240px",
                  height: "150px",
                  resize: "none",
                  overflow: "hidden",
                  backgroundColor: isActive2 ? "#F6FFDE" : "",
                  border: "none",
                  outline: "none",
                  fontWeight: "bolder",
                }}
              ></textarea>
            </div>
            <div
              style={{
                // border: "1px solid black",
                display: "flex",
                flexDirection: "column",
                width: "300px",
              }}
            >
              <div
                style={{
                  border: "1px solid black",
                  //   border: "1px solid purple",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#EEEEEE",
                    padding: "1px 10px",
                    width: "35%",
                    borderRight: "1px solid black",
                  }}
                >
                  Invoice #
                </div>
                <div
                  style={{
                    // border: "1px solid red",
                    width: "65%",
                    textAlign: "right",
                  }}
                >
                  1234567890
                </div>
              </div>
              <div
                style={{
                  borderLeft: "1px solid black",
                  borderRight: "1px solid black",
                  //   border: "1px solid purple",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#EEEEEE",
                    padding: "1px 10px",
                    width: "35%",
                    borderRight: "1px solid black",
                  }}
                >
                  Date
                </div>
                <div
                  style={{
                    // border: "1px solid red",
                    width: "65%",
                    textAlign: "right",
                  }}
                >
                  {formattedDate}
                </div>
              </div>
              <div
                style={{
                  border: "1px solid black",
                  //   border: "1px solid purple",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#EEEEEE",
                    padding: "1px 2px",
                    width: "35%",
                    borderRight: "1px solid black",
                  }}
                >
                  Amount Due
                </div>
                <div
                  style={{
                    // border: "1px solid red",
                    width: "65%",
                    textAlign: "right",
                  }}
                >
                  {balnaceDuo}
                </div>
              </div>
            </div>
          </div>
          {/* table */}
          <div
            style={{
              border: "1px solid gray",
            }}
          >
            <table
              style={{
                width: "100%",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#EEEEEE",
                  }}
                >
                  <th>item</th>
                  <th>Description</th>
                  <th>Unit Cost</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody
                style={
                  {
                    // width: "100%",
                    //   border: "1px solid purple",
                  }
                }
              >
                {tableData.map((row, index) => (
                  <tr
                    key={index}
                    style={{
                      //   width: "100%",
                      borderBottom: "1px solid red",
                      //   backgroundColor: "pink",
                    }}
                  >
                    <td>
                      {/* <input
                        type="text"
                        style={{
                          border: "none",
                          backgroundColor: "gray",
                          height: "40px",
                        }}
                        name="name"
                        value={row.name}
                        onChange={(e) => handleChange(e, index)}
                      /> */}
                      <textarea
                        placeholder="Item"
                        onMouseEnter={changeIsactive3}
                        onMouseLeave={changeIsactive3}
                        name="companuInfo"
                        style={{
                          width: "200px",
                          height: "50px",
                          resize: "none",
                          overflow: "hidden",
                          backgroundColor: isActive3 ? "#F6FFDE" : "",
                          border: "none",
                          outline: "none",
                          fontWeight: "bolder",
                        }}
                      ></textarea>
                    </td>
                    <td>
                      {/* <input
                        type="text"
                        name="description"
                        value={row.description}
                        onChange={(e) => handleChange(e, index)}
                      /> */}
                      <textarea
                        placeholder="Description"
                        onMouseEnter={changeIsactive4}
                        onMouseLeave={changeIsactive4}
                        name="description"
                        style={{
                          width: "280px",
                          height: "50px",
                          resize: "none",
                          overflow: "hidden",
                          backgroundColor: isActive4 ? "#F6FFDE" : "",
                          border: "none",
                          outline: "none",
                          fontWeight: "bolder",
                        }}
                      ></textarea>
                    </td>
                    <td>
                      {/* <input
                        type="text"
                        name="unitCost"
                        value={row.unitCost}
                        onChange={(e) => handleChange(e, index)}
                      /> */}
                      {/* <textarea
                        onMouseEnter={changeIsactive}
                        onMouseLeave={changeIsactive}
                        name="companuInfo"
                        style={{
                          width: "80px",
                          height: "50px",
                          resize: "none",
                          overflow: "hidden",
                          backgroundColor: isActive ? "#F6FFDE" : "",
                          border: "none",
                          outline: "none",
                          fontWeight: "bolder",
                        }}
                      ></textarea> */}
                      <textarea
                        onMouseEnter={changeIsactive5}
                        onMouseLeave={changeIsactive5}
                        onChange={(e) => handleChange(e, index)}
                        name="unitCost"
                        placeholder="unit cost"
                        style={{
                          width: "80px",
                          height: "50px",
                          resize: "none",
                          overflow: "hidden",
                          backgroundColor: isActive5 ? "#F6FFDE" : "",
                          border: "none",
                          outline: "none",
                          fontWeight: "bolder",
                        }}
                      ></textarea>
                    </td>
                    <td>
                      {/* <input
                        type="text"
                        name="quantity"
                        value={row.quantity}
                        onChange={(e) => handleChange(e, index)}
                      /> */}
                      <textarea
                        onMouseEnter={changeIsactive6}
                        onMouseLeave={changeIsactive6}
                        placeholder="quantity"
                        name="quantity"
                        onChange={(e) => handleChange(e, index)}
                        // value={row.quantity}
                        style={{
                          width: "80px",
                          height: "50px",
                          resize: "none",
                          overflow: "hidden",
                          backgroundColor: isActive6 ? "#F6FFDE" : "",
                          border: "none",
                          outline: "none",
                          fontWeight: "bolder",
                        }}
                      ></textarea>
                    </td>
                    <td>
                      {/* <input
                        type="text"
                        name="price"
                        value={row.price}
                        onChange={(e) => handleChange(e, index)}
                      /> */}
                      <div
                        // onMouseEnter={changeIsactive}
                        // onMouseLeave={changeIsactive}
                        name="price"
                        // placeholder={row.price}
                        value={row.quantity}
                        style={{
                          width: "80px",
                          height: "50px",
                          resize: "none",
                          overflow: "hidden",
                          //   backgroundColor: isActive ? "#F6FFDE" : "",
                          // backgroundColor: "pink",
                          border: "none",
                          outline: "none",
                          fontWeight: "bolder",
                        }}
                      >
                        {row.price}
                      </div>
                    </td>
                    <td
                      style={{
                        position: "absolute",
                      }}
                    >
                      <IconButton
                        onClick={() => deleteRow(index)}
                        aria-label="delete"
                      >
                        <ClearIcon />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <Button onClick={addRow} variant="none" endIcon={<AddIcon />}>
                Add Item
              </Button>
            </div>
            <div
              style={{
                display: "flex",
              }}
            >
              <div
                style={{
                  width: "65%",
                  //   border: "1px solid red",
                }}
              >
                <div
                  style={{
                    // width: "65%",
                    height: "40px",
                    border: "1px solid #EEEEEE",
                  }}
                ></div>
                <div
                  style={{
                    // width: "65%",
                    height: "40px",
                    border: "1px solid #EEEEEE",
                  }}
                ></div>
                <div
                  style={{
                    // width: "65%",
                    height: "40px",
                    border: "1px solid #EEEEEE",
                  }}
                ></div>
                <div
                  style={{
                    // width: "65%",
                    height: "40px",
                    border: "1px solid #EEEEEE",
                  }}
                ></div>
              </div>

              {/* Result Amount */}
              <div
                style={{
                  width: "35%",
                  //   border: "1px solid red",
                }}
              >
                <div
                  style={{
                    // width: "65%",
                    height: "40px",
                    border: "1px solid gray",
                    display: "flex",
                    justifyContent: "center",
                    gap: "1rem",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "40%",
                      //   border: "1px solid purple",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    Subtotal
                  </div>
                  <div>{subtotal.toFixed(2)}</div>
                </div>
                <div
                  style={{
                    // width: "65%",
                    height: "40px",
                    border: "1px solid gray",
                    display: "flex",
                    justifyContent: "center",
                    gap: "1rem",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "40%",
                      //   border: "1px solid purple",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    Total
                  </div>
                  <div>{subtotal.toFixed(2)}</div>
                </div>
                <div
                  style={{
                    // width: "65%",
                    height: "40px",
                    border: "1px solid gray",
                    display: "flex",
                    justifyContent: "center",
                    gap: "1rem",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "60%",
                      //   border: "1px solid purple",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    Amount Paid
                  </div>
                  <textarea
                    onMouseEnter={changeIsactive7}
                    onMouseLeave={changeIsactive7}
                    placeholder="amount paid"
                    name="amonutPaid"
                    onChange={(e) =>
                      setamountPaid(
                        isNaN(e.target.value) ? 0 : parseFloat(e.target.value)
                      )
                    }
                    value={amountPaid}
                    style={{
                      width: "80px",
                      height: "20px",
                      resize: "none",
                      overflow: "hidden",
                      backgroundColor: isActive7 ? "#F6FFDE" : "",
                      border: "none",
                      outline: "none",
                      fontWeight: "bolder",
                    }}
                  ></textarea>
                </div>
                <div
                  style={{
                    // width: "65%",
                    height: "40px",
                    border: "1px solid gray",
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#EEEEEE",
                    gap: "1rem",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "40%",
                      //   border: "1px solid purple",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    Balance Due
                  </div>
                  <div>{balnaceDuo}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
