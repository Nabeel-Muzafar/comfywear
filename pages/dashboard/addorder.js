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
import { Box, Button, TextField } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Backdroploading from "../../components/backdrop";
import axios from "axios";
import moment from "moment/moment";
import { useReactToPrint } from "react-to-print";
import AddOrderTable from "../../components/Table/AddOrderTable";
const TAX_RATE = 0;

function priceRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit, code, product) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price, code, product };
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
  const [screenData, setscreenData] = React.useState({
    ChangeAmount: 0,
    invoiceSubtotal: 0,
    invoiceDiscount: 0,
    invoiceTotal: 0,
    paidAmount: "",
  });
  const [snackbar, setsnackbar] = React.useState({ msg: "", status: "" });

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
    content: () => componentRef.current,
  });

  React.useEffect(() => {
    if (snackbar.msg) openSnackBar();
  }, [snackbar]);
  const openSnackBar = () => {
    setOpen(true);
  };

  const closeSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const alreadyExistsInRow = (code) => {
    for (let i = 0; i < rows.length; i++) {
      if (code === rows[i].code) return true;
    }
    return false;
  };

  const updateCurrentRow = (product) => {
    const newState = rows.map((row) => {
      if (row.code === product.productCode) {
        return createRow(row.desc, row.qty + 1, row.unit, row.code, product);
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
  };//

  if (typeof document !== "undefined") {
    useScanDetection({
      onComplete: (barcode) => {
        const product = getProduct(barcode);
        if (!product) return;

        if (alreadyExistsInRow(product.productCode)) updateCurrentRow(product);
        else
          setrows([
            ...rows,
            createRow(
              product.productTitle,
              1,
              product.salePrice,
              product.productCode,
              product
            ),
          ]);
      },
      minLength: 2,
    });
  }

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
    setrows([]);
    setscreenData({
      ChangeAmount: 0,
      invoiceSubtotal: 0,
      invoiceDiscount: 0,
      invoiceTotal: 0,
      paidAmount: "",
    });
  };
  const handleOrder = async () => {
    if (rows.length <= 0) return;
    if (screenData.paidAmount < screenData.invoiceTotal) {
      setsnackbar({ msg: "Kindly pay full amount", status: "error" });
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
    const newObj = {
      name: "hunfa",
      contact: "03004245465",
      totalItems: rows.length,
      paid: screenData.paidAmount,
      total: screenData.invoiceTotal,
      type: "cash",
      date: moment().format("DD/MM/YYYY"),
      subTotal: screenData.invoiceSubtotal,
      discount: screenData.invoiceDiscount,
      products,
      branch: JSON.parse(localStorage.getItem("user")).branch,
    };

    try {
      const res = await axios.post(`/api/addorder`, {
        newObj,
      });
      console.log(res);
      if (res.data.success) {
        setsnackbar({ msg: "Order Placed Successfully", status: "success" });
      }
    } catch (error) {
      console.log(error);
      setsnackbar({ msg: "Error: Order Failed", status: "error" });
    }

    setapiLoading(false);
  };

  return (
    <>
      {apiLoading && <Backdroploading />}
      <Snackbar open={open} autoHideDuration={6000} onClose={closeSnackBar}>
        <Alert
          onClose={closeSnackBar}
          severity={snackbar.status}
          sx={{ width: "100%" }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
      <AddOrderTable rows={rows} invoiceSubtotal={screenData.invoiceSubtotal}  invoiceDiscount={screenData.invoiceDiscount} invoiceTotal={screenData.invoiceTotal}
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
    </>
  );
}

export default AddOrder;
