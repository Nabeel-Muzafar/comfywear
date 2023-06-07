import React, { useState, useEffect } from "react";
import Table from "../../components/Table/MaterialTable";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Backdrop,
} from "@mui/material";
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
  const [againFetch, setagainFetch] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    setloading(true);
    if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
      router.push("/");
    } else {
      setloading(false);
    }
  }, []);
  useEffect(() => {
    const fetchdata = async () => {
      const responce = await axios.get("/api/getProducts");

      // setdata(responce.data.payload);
      dispatch(setProduct(responce.data.payload));
    };
    fetchdata();
  }, [againFetch]);

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
      accessorKey: "size",
      header: "Size",
      size: 120,
    },
    {
      accessorKey: "actualRate",
      header: "Buy Price",
      // size: 300,
    },
    {
      accessorKey: "rate",
      header: "Sale Price",
      // size: 300,
    },
    {
      accessorKey: "status",
      header: "status",
    },
    {
      accessorKey: "discount",
      header: "Discount",
      size: 100,
    },
    {
      accessorKey: "show",
      header: "action",
      Cell: ({ row }) => (
        <>
          <Box display={"flex"} gap={"1rem"}>
            <Button
              variant="contained"
              onClick={() => handleAction(row.original)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => handleDelete(row.original._id)}
            >
              delete
            </Button>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
              onClick={handleClose}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </Box>
        </>
      ),
    },
  ];

  const handleAction = (id) => {
    dispatch(setProduct(id));
    router.push("/dashboard/editProduct");
  };

  const handleDelete = async (id) => {
    // dispatch(setProduct(id));
    // console.log(id);

    handleOpen();
    const responce = await axios.post("/api/deleteProduct", { key: id });
    // router.push("/dashboard/editProduct");
    // console.log(responce);
    if (responce.data.success) {
      setagainFetch(!againFetch);
      handleClose();
    } else {
      handleClose();
    }
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
