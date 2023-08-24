import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Input, TextField } from "@mui/material";
function AddOrderTable({
  reff,
  rows,
  invoiceSubtotal,
  invoiceDiscount,
  invoiceTotal,
  handledeleteRow,
  Discount2,
  setDiscount2,
  DiscountPrice2,
  setDiscountPrice2,
  setMessage,
  updateQuantity,
  getProduct,
  updateProductPrice,
  handleProduct,
}) {
  const ccyFormat = (num) => {
    return `${num.toFixed(2)}`;
  };

  useEffect(() => {
    // console.log(invoiceTotal);
    if (Discount2 <= 100) {
      let discout = Discount2 / 100;
      let price = invoiceTotal * discout;
      setDiscountPrice2(invoiceTotal - price);
    } else {
      setDiscountPrice2(0);
    }
  }, [Discount2]);

  const handleQtyChange = (e, index, key) => {
    console.log(key);
    const newQty = parseInt(e.target.value);
    if (newQty >= 1) {
      // updateQuantity(index, newQty); // Call updateQuantity function
      // let pro = getProduct(key);
      // handleProduct(pro);
      updateQuantity(index, newQty);
      updateProductPrice(index, newQty);
    }
  };

  return (
    <>
      <Box display={"flex"} flexDirection={"column"}>
        <TableContainer
          // ref={reff}
          component={Paper}
          sx={{ width: "97%", mx: "auto", marginTop: "20px" }}
        >
          <Table sx={{ minWidth: 700 }} aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Desc</TableCell>
                <TableCell align="right">Qty.</TableCell>
                <TableCell align="right">Unit</TableCell>
                <TableCell align="right">discount</TableCell>
                <TableCell align="right">Sum</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={row.code}>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.desc}</TableCell>
                  {/* <TableCell align="right">{row.qty}</TableCell> */}
                  <TableCell align="right">
                    {/* <TextField
                      type="number"
                      value={row.qty}
                      onChange={(e) => handleQtyChange(e, i, row.code)} // Pass the index to handleQtyChange
                      inputProps={{ min: 1 }}
                      // fullWidth
                    /> */}
                    {
                      row.qty
                    }
                  </TableCell>
                  <TableCell align="right">{row.unit}</TableCell>
                  <TableCell align="right">{`${row.discount}%`}</TableCell>
                  <TableCell align="right">{ccyFormat(row.price)}</TableCell>
                  <TableCell align="right">
                    <Box display={'flex'} gap={'1rem'} justifyContent={'right'}>
                    <Button
                    color='secondary'
                    size='medium'
                      variant='outlined' 
                      onClick={() => handleProduct(row.product)}
                    >
                      Add Qty
                    </Button>
                    <Button
                      size='medium'
                      variant="contained" 
                      onClick={() => handledeleteRow(i)}
                      color='error'
                      
                      
                    >
                      Delete
                    </Button>
                   
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                {/* <TableCell rowSpan={3} /> */}
                <TableCell colSpan={2}>Subtotal</TableCell>
                <TableCell align="right">
                  {ccyFormat(invoiceSubtotal)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Discount</TableCell>

                <TableCell align="right">{`${invoiceDiscount}%`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {/* DiscountPrice */}
        {/* <Box
          // width={"80%"}
          // mx={"auto"}

          marginY={"1.5rem"}
          marginLeft={"1rem"}
          display={"flex"}
          // flexDirection={"column"}
          justifyContent={"space-between"}
          // alignItems={"center"}
          // alignContent={"center"}
          gap={"1rem"}
        >
          <Box>
            <Box gap={"2rem"} display={"flex"}>
              <Button size="sm" variant="outlined">
                Discount
              </Button>
              <TextField
                onChange={(e) => setDiscount2(e.target.value)}
                id="outlined-basic"
                label="discount %"
                variant="outlined"
                type="number"
              />
            </Box>
            <Box my="1rem" gap={"2rem"} display={"flex"}>
              <Button variant="outlined">Discount Price</Button>
              <TextField
                disabled
                value={DiscountPrice2}
                // id="outlined-basic"
                // label="price after discount "
                variant="outlined"

                // type="number"
              />
            </Box>
          </Box>
          <TextField
            id="outlined-multiline-static"
            label="Message"
            style={{
              marginRight: "2rem",
              width: "30%",
            }}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            fullWidth
            rows={5}
            defaultValue=""
          />
        </Box> */}
      </Box>
    </>
  );
}

export default React.memo(AddOrderTable);
