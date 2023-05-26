import React, { useState, useEffect } from "react";
import Table from "../../components/Table/MaterialTable";
import axios from "axios";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { setProduct } from "../../store/productSlice";

export default function Allproduct() {
  const products = useSelector((state) => state.product.products);
  // console.log(products);
  const dispatch = useDispatch();
  const [data, setdata] = useState([]);
  const router = useRouter();
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setloading(true);
    if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
      router.push("/");
    } else {
      setloading(false);
    }
  }, []);

  const columns = [
    {
      accessorKey: "productCode",
      header: "code",
      size: 40,
    },
    {
      accessorKey: "productTitle",
      header: "Title",
      size: 120,
    },
    {
      accessorKey: "productImage",
      header: "Image",
      size: 120,
      Cell: (value) => {
        // console.log("cell", value.row.original.productImage);
        return (
          <img
            src={value.row.original.productImage}
            alt="image"
            style={{ width: "100%", height: "auto" }}
          />
        );
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      size: 120,
    },
    {
      accessorKey: "rate",
      header: "Price",
      size: 300,
    },
    {
      accessorKey: "status",
      header: "status",
    },
    {
      accessorKey: "discount",
      header: "Discount",
      size: 220,
    },
    {
      accessorKey: "show",
      header: "action",
      Cell: ({ row }) => (
        <Button variant="contained" onClick={() => handleAction(row.original)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleAction = (id) => {
    dispatch(setProduct(id));
    router.push("/dashboard/editProduct");
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box marginTop={"2rem"}>
            <Typography fontWeight={"bold"} fontSize={"2rem"}>
              List of all Products
            </Typography>

            <Table data={products} columns={columns} />
          </Box>
        </>
      )}
    </>
  );
}
