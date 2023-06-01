import React, { useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv"; //or use your library of choice here
// import { data } from "./makeData";

import { Document, Page, Text, View, PDFViewer } from "@react-pdf/renderer";

import dynamic from "next/dynamic";
const PDFTable = dynamic(() => import("./GeneratePdf"), {
  ssr: false, // Ensure the component is only loaded on the client-side
});

//defining columns outside of the component is fine, is stable

const selectedColumns = ["productCode", "productImage", "rate", "size"];
const Table = ({ data, columns }) => {
  const [showPDF, setShowPDF] = useState(false);
  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    // headers: columns.map((c) => c.header),
    headers: columns
      .filter((c) => selectedColumns.includes(c.header)) // Filter columns based on selected headers
      .map((c) => c.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);
  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  const handleExportData = () => {
    console.log(
      "data",
      data.productCode,
      data.productImage,
      data.productTitle,
      data.quantity,
      data.rate,
      data.size
    );
    // let data2 = [];
    // for (let i = 0; i < data.length; i++) {
    //   data[i] = {
    //     productCode: data[i].productCode,
    //     productTitle: data[i].productTitle,
    //     productImage: data[i].productImage,
    //     quantity: data[i].quantity,
    //     rate: data[i].rate,
    //     size: data[i].size,
    //   };
    // }
    const data2 = data.map((obj) => ({
      productCode: obj.productCode,
      productImage: obj.productImage,
      rate: obj.rate,
      size: obj.size,
    }));

    console.log(data2);
    csvExporter.generateCsv(data2);
  };

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableRowSelection
      positionToolbarAlertBanner="bottom"
      renderTopToolbarCustomActions={({ table }) => (
        <Box
          sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}
        >
          <Button
            color="primary"
            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
            onClick={handleExportData}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export All Data
          </Button>
          {/* <Button
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            //export all rows, including from the next page, (still respects filtering and sorting)
            onClick={() =>
              handleExportRows(table.getPrePaginationRowModel().rows)
            }
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export All Rows
          </Button>
          <Button
            disabled={table.getRowModel().rows.length === 0}
            //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
            onClick={() => handleExportRows(table.getRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export Page Rows
          </Button> */}
          <Button
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            //only export selected rows
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export Selected Rows
          </Button>
        </Box>
      )}
    />
  );
};

export default Table;
