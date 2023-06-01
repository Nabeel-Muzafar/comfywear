import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import useScanDetection from "use-scan-detection";
import { useSelector } from "react-redux";
// import { Box, Button, TextField } from "@mui/material";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Backdroploading from "../../components/backdrop";
import axios from "axios";
import moment from "moment/moment";
import { useReactToPrint } from "react-to-print";
import AddOrderTable from "../../components/Table/AddOrderTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const TAX_RATE = 0;

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit, discount, code, product) {
  const discountedUnitPrice = unit - (discount / 100) * unit;
  const price = priceRow(qty, discountedUnitPrice);
  return { desc, qty, unit, price, discount, code, product };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AddOrder() {
  const [rows, setrows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [apiLoading, setapiLoading] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [paymentMethod, setpaymentMethod] = React.useState("");
  const [screenData, setscreenData] = React.useState({
    ChangeAmount: 0,
    invoiceSubtotal: 0,
    invoiceDiscount: 0,
    invoiceTotal: 0,
    paidAmount: "",
  });
  const [printData, setprintData] = React.useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [snackbar, setsnackbar] = React.useState({ msg: "", status: "" });
  const name = React.useRef("");
  const contact = React.useRef("");

  const products = useSelector((state) => state.product.products);

  React.useEffect(() => {
    const invoiceSubtotal = subtotal(rows);
    const invoiceTotal =
      invoiceSubtotal - (screenData.invoiceDiscount / 100) * invoiceSubtotal;
    let changeAmount = screenData.paidAmount - invoiceTotal;
    if (changeAmount < 0) changeAmount = 0;

    setscreenData({
      ...screenData,
      ChangeAmount: changeAmount,
      invoiceSubtotal: invoiceSubtotal,
      invoiceTotal: invoiceTotal,
    });
  }, [rows]);

  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    // content: () => componentRef.current,
    content: () => {
      // Call your desired function here
      handleClose();

      // Return the content to be printed
      return componentRef.current;
    },
  });

  // React.useEffect(() => {
  //   if (snackbar.msg) openSnackBar();
  // }, [snackbar]);
  // const openSnackBar = () => {
  //   setOpen(true);
  // };

  // const closeSnackBar = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setOpen(false);
  // };

  const alreadyExistsInRow = (code) => {
    for (let i = 0; i < rows.length; i++) {
      if (code === rows[i].code) return true;
    }
    return false;
  };

  const currentDate = new Date();
  const options = { month: "long", day: "numeric", year: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  const updateCurrentRow = (product) => {
    const newState = rows.map((row) => {
      if (row.code === product.productCode) {
        return createRow(
          row.desc,
          row.qty + 1,
          row.unit,
          row.discount,
          row.code,
          product
        );
      }
      return row;
    });
    setrows(newState);
  };
  const getProduct = (barcode) => {
    for (let i = 0; i < products.length; i++) {
      if (products[i].productCode === barcode) {
        return products[i];
      }
    }
    return null;
  }; //

  if (typeof document !== "undefined") {
    useScanDetection({
      onComplete: (barcode) => {
        const product = getProduct(barcode);
        if (!product) return;
        handleAppendInTable(product);

        // if (alreadyExistsInRow(product.productCode)) updateCurrentRow(product);
        // else
        //   setrows([
        //     ...rows,
        //     createRow(
        //       product.productTitle,
        //       1,
        //       product.salePrice,
        //       product.productCode,
        //       product
        //     ),
        //   ]);
        // handleAppendInTable(product);
      },
      minLength: 2,
    });
  }

  const handleAppendInTable = (product) => {
    if (alreadyExistsInRow(product.productCode)) updateCurrentRow(product);
    else
      setrows([
        ...rows,
        createRow(
          product.productTitle,
          1,
          product.rate,
          product.discount,
          product.productCode,
          product
        ),
      ]);
  };

  const handledeleteRow = (index) => {
    const newState = rows.filter((r, i) => i !== index);

    setrows(newState);
  };

  const handlePaidAmount = (e) => {
    if (!e.target.value) {
      setscreenData({ ...screenData, ChangeAmount: 0, paidAmount: "" });
    } else {
      const paidAmount = parseInt(e.target.value);
      if (paidAmount - screenData.invoiceTotal < 0)
        setscreenData({
          ...screenData,
          ChangeAmount: 0,
          paidAmount: e.target.value,
        });
      else
        setscreenData({
          ...screenData,
          ChangeAmount: paidAmount - screenData.invoiceTotal,
          paidAmount: e.target.value,
        });
    }
  };

  const handleReset = () => {
    name.current.value = "";
    contact.current.value = "";
    setrows([]);
    setscreenData({
      ChangeAmount: 0,
      invoiceSubtotal: 0,
      invoiceDiscount: 0,
      invoiceTotal: 0,
      paidAmount: "",
    });
    setpaymentMethod("");
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  let newObj;
  console.log("new obj", printData);
  const handleOrder = async () => {
    if (rows.length <= 0) return;
    if (parseInt(screenData.paidAmount) < screenData.invoiceTotal) {
      toast.error("Kindly pay full amount");
      return;
    }

    if (paymentMethod === "") {
      toast.error("Kindly add payment method");
      return;
    }
    if (contact.current.value) {
      const numberRegex = /^\d+$/;
      if (!numberRegex.test(contact.current.value)) {
        toast.error("PhoneNumber cannot contain aplhabets");
        return;
      }
    }
    const branch = JSON.parse(localStorage.getItem("user")).branch;
    if (!branch) {
      toast.error("Error: kindly login again");
      return;
    }
    setapiLoading(true);

    const products = rows.map((p) => {
      return {
        title: p.product.productTitle,
        code: p.product.productCode,
        rate: p.product.rate,
        salePrice: p.product.salePrice,
        qty: p.qty,
        _id: p.product._id,
      };
    });
    newObj = {
      name: name.current?.value || "",
      contact: contact.current?.value || "",
      totalItems: rows.length,
      paid: parseInt(screenData.paidAmount),
      total: screenData.invoiceTotal,
      type: paymentMethod,
      date: moment().format("DD/MM/YYYY"),
      subTotal: screenData.invoiceSubtotal,
      discount: screenData.invoiceDiscount,
      products,
      branch: branch,
    };
    setprintData(newObj);

    try {
      const res = await axios.post(`/api/addorder`, {
        newObj,
      });
      console.log(res);
      if (res.data.success) {
        // setsnackbar({ msg: "Order Placed Successfully", status: "success" });
        toast.success("Order Placed Successfully");
        handleOpen();
        handleReset();
      }
    } catch (error) {
      console.log(error);
      // setsnackbar({ msg: "Error: Order Failed", status: "error" });
      toast.error("Error: Order Failed");
    }

    setapiLoading(false);
  };

  const handleAutoCompleteChange = (e, value) => {
    if (!value) return;
    setSelectedProduct(value);
    handleAppendInTable(value);
    setSelectedProduct(null);
  };

  return (
    <>
      {apiLoading && <Backdroploading />}
      {/* <Snackbar open={open} autoHideDuration={6000} onClose={closeSnackBar}>
        <Alert
          onClose={closeSnackBar}
          severity={snackbar.status}
          sx={{ width: "100%" }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
      <AddOrderTable
        rows={rows}
        invoiceSubtotal={screenData.invoiceSubtotal}
        invoiceDiscount={screenData.invoiceDiscount}
        invoiceTotal={screenData.invoiceTotal}
        handledeleteRow={handledeleteRow}
      /> */}
      <ToastContainer theme="colored" />
      <Paper
        sx={{
          marginTop: "20px",
          width: "97%",
          mx: "auto",
          padding: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={products}
          getOptionLabel={(p) => `${p.productTitle}  ${p.productCode}`}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Product" />
          )}
          onChange={handleAutoCompleteChange}
          value={selectedProduct}
          blurOnSelect
        />
      </Paper>
      <AddOrderTable
        // reff={componentRef}
        rows={rows}
        invoiceSubtotal={screenData.invoiceSubtotal}
        invoiceDiscount={screenData.invoiceDiscount}
        invoiceTotal={screenData.invoiceTotal}
        handledeleteRow={handledeleteRow}
      />
      <Paper
        sx={{
          marginTop: "20px",
          width: "97%",
          mx: "auto",
          padding: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <TextField
          placeholder="Enter Name"
          inputRef={name}
          style={{ width: "30%" }}
          variant="filled"
          label="Client Name"
          onChange={(e) => {
            name.current.value = e.target.value;
          }}
        ></TextField>
        <TextField
          placeholder="Enter Number"
          inputRef={contact}
          style={{ width: "30%" }}
          variant="filled"
          label="Client PhoneNumber"
          onChange={(e) => {
            contact.current.value = e.target.value;
          }}
        ></TextField>
        <Box style={{ width: "20%" }}>
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              // style={{ width: "70%" }}
              onChange={(e) => {
                setpaymentMethod(e.target.value);
              }}
              label="Payment Method"
              value={paymentMethod}
            >
              <MenuItem disabled value="">
                Select Method
              </MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper
        sx={{
          marginTop: "20px",
          width: "97%",
          mx: "auto",
          padding: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <TextField
          type="number"
          value={screenData.ChangeAmount}
          label="Change"
          variant="filled"
          disabled
        ></TextField>
        <TextField
          type="number"
          label="Paid Amount"
          variant="filled"
          value={screenData.paidAmount}
          onChange={handlePaidAmount}
        ></TextField>
      </Paper>
      <Box
        width={"97%"}
        mx={"auto"}
        textAlign={"right"}
        marginTop={2}
        display={"flex"}
        justifyContent={"space-between"}
      >
        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button variant="contained" size="large" onClick={handleOrder}>
          Place Order
        </Button>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box border={"1px solid black"} ref={componentRef}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              // flexDirection={"column-reverse"}
            >
              <Box flexDirection={"column"}>
                <Box fontSize={"0.8rem"}>
                  {printData.branch === "wapdatown"
                    ? "Shahrah-e-Nazria, near Wapda Town , Block G Pia Housing Scheme"
                    : "Township Branch"}
                </Box>

                {/* <Box>{printData.branch}</Box> */}
              </Box>
              <Box>
                <img
                  src="/logo.png"
                  alt="logo"
                  width={"100px"}
                  height={"50%"}
                />
              </Box>
            </Box>
            <Divider />
            <Box
              marginY={"0.5rem"}
              display={"flex"}
              // alignItems={"center"}
              flexDirection={"column"}
              justifyContent={"space-between"}
            >
              <Box>
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  name :{" "}
                </span>{" "}
                {printData.name != "" ? printData.name : "customer"}
              </Box>
              <Box marginY={"0.5rem"}>
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  contact:
                </span>{" "}
                {printData.contact != "" ? printData.contact : "Null"}
              </Box>
              <Box marginY={"0.5rem"}>
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  date:
                </span>{" "}
                {formattedDate}
              </Box>
              {/* <Divider /> */}
            </Box>

            <Box
              border={"1px solid gray"}
              display={"flex"}
              justifyContent={"center"}
              gap={"5rem"}
              paddingX={"1.5rem"}
            >
              <Box fontWeight={"bold"} width={"60%"}>
                name
              </Box>
              <Box fontWeight={"bold"} width={"20%"}>
                rate
              </Box>
              <Box marginRight={"1rem"} fontWeight={"bold"} width={"20%"}>
                qty
              </Box>
            </Box>
            <Box paddingX={"1.5rem"}>
              {printData.products &&
                printData.products.map((items) => {
                  return (
                    <Box
                      paddingX={"0.5rem"}
                      // border={"1px solid gray"}
                      borderTop={"none"}
                      display={"flex"}
                      justifyContent={"center"}
                      gap={"5rem"}
                      key={items._id}
                      paddingY={"0.5rem"}
                    >
                      <Box fontSize={"0.9rem"} width={"50%"}>
                        {items.title}
                      </Box>
                      <Box fontSize={"0.9rem"} width={"20%"}>
                        {items.rate}
                      </Box>
                      <Box
                        fontSize={"0.9rem"}
                        marginRight={"1rem"}
                        width={"20%"}
                      >
                        {items.qty}
                      </Box>
                    </Box>
                  );
                })}
            </Box>
            <Divider style={{ border: "1px solid black" }} />
            <Box
              marginY={"1rem"}
              // border={"1px solid black"}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"right"}
              justifyItems={"right"}
              // alignContent={"end"}
              alignItems={"end"}
              marginRight={"1rem"}
            >
              <Box>
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  SubTotal :{" "}
                </span>{" "}
                {printData.subTotal != 0 ? printData.subTotal : 0}
              </Box>
              <Box>
                <span
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  Total :{" "}
                </span>{" "}
                {printData.total != 0 ? printData.total : 0}
              </Box>
            </Box>
            <Divider style={{ border: "1px solid black" }} />
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={"0.5rem"}
              flexDirection={"column"}
            >
              <Box> Thanks for Shopping</Box>
              <Box>
                <span style={{ fontWeight: "bold" }}>Contact :</span>{" "}
                0321-8836095
              </Box>
            </Box>
          </Box>
          <Button
            style={{
              marginTop: "1rem",
            }}
            fullWidth
            variant="contained"
            onClick={handlePrint}
          >
            Print
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default AddOrder;
