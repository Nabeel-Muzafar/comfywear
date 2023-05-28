import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";
import { Card, CardContent, Grid, Typography } from "@material-ui/core";

function DashBoard() {
  const products = useSelector((state) => state.product.products);
  const orders = useSelector((state) => state.order.orders);
  const [loading, setloading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setloading(true);
    if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
      router.push("/");
    } else {
      setloading(false);
    }
  }, [router.pathname]);

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Grid style={{ padding: "20px" }} container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                style={{
                  backgroundColor: "#002884",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography color="white" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {products ? products.length : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                style={{
                  backgroundColor: "#002884",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography color="white" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {orders ? orders.length : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* <Grid item xs={12} sm={6} md={3}>
              <Card
                style={{
                  backgroundColor: "#002884",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography color="white" gutterBottom>
                    Total Sales
                  </Typography>
                  <Typography variant="h5" component="h2">
                    $1000
                  </Typography>
                </CardContent>
              </Card>
            </Grid> */}
          </Grid>
        </>
      )}
    </>
  );
}

export default DashBoard;
