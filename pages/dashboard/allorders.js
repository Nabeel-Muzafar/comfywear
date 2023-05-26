import React, { useState, useEffect } from "react";
import Table from "../../components/Table/MaterialTable";
import axios from "axios";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setOrder } from "../../store/orderSlice";

const Allorders = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [data, setdata] = useState([]);
  useEffect(() => {
    const fetchdata = async () => {
      const responce = await axios.get("/api/getOrders");

      setdata(responce.data.payload);
    };

    fetchdata();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
      router.push("/");
    }
  }, [router.pathname]);

  const columns = [
    {
      accessorKey: "branch",
      header: "Branch",
      size: 40,
    },
    {
      accessorKey: "date",
      header: "Date",
      size: 120,
    },
    {
      accessorKey: "totalEarning",
      header: "Total Earning",
      size: 120,
    },
    {
      accessor: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <Button variant="outlined" onClick={() => handleAction(row.original)}>
          Detial
        </Button>
      ),
    },
  ];

  const handleAction = (id) => {
    dispatch(setOrder(id));
    router.push("/dashboard/orderdetail");
  };

  return (
    <>
      <Box marginTop={"2rem"}>
        <Typography fontWeight={"bold"} fontSize={"2rem"}>
          List of all Orders
        </Typography>
        <Table data={data} columns={columns} />
      </Box>
    </>
  );
};

export default Allorders;
