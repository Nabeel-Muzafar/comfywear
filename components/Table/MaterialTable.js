import React, { useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ExportToCsv } from "export-to-csv"; //or use your library of choice here
// import { data } from "./makeData";
import { jsPDF } from "jspdf";

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
    // csvExporter.generateCsv(rows.map((row) => row.original));
    let products = rows.map((row) => row.original);

    const data2 = products.map((obj) => ({
      productTitle: obj.productTitle,
      productCode: obj.productCode,
      productImage: obj.productImage,
      category: obj.category,
      rate: obj.rate,
      size: obj.size,
    }));
    console.log(data2);

    var doc = new jsPDF();

    doc.setFontSize(22);

    for (let j = 0; j < data2.length; j++) {
      doc.text(data2[j].productTitle, 40, 10);
      doc.text(data2[j].category, 100, 10);
      doc.text(data2[j].productCode, 40, 20);
      doc.text(data2[j].size, 40, 30);
      doc.text(data2[j].rate.toString(), 40, 40);
      doc.addImage(
        data2[j].productImage.replace("http://", "https://"),
        "JPEG",
        15,
        60,
        180,
        200
      );
      doc.addPage("a4", "1");
    }

    // csvExporter.generateCsv(data2);
    doc.save("selectedProdutc.pdf");
  };

  const handleExportData = () => {
    const data2 = data.map((obj) => ({
      productTitle: obj.productTitle,
      productCode: obj.productCode,
      productImage: obj.productImage,
      category: obj.category,
      rate: obj.rate,
      size: obj.size,
    }));

    console.log(data2);
    var doc = new jsPDF();

    doc.setFontSize(22);

    for (let j = 0; j < data2.length; j++) {
      doc.text(data2[j].productTitle, 40, 10);
      doc.text(data2[j].category, 100, 10);
      doc.text(data2[j].productCode, 40, 20);
      doc.text(data2[j].size, 40, 30);
      doc.text(data2[j].rate.toString(), 40, 40);
      doc.addImage(
        data2[j].productImage.replace("http://", "https://"),
        "JPEG",
        15,
        60,
        180,
        200
      );
      doc.addPage("a4", "1");
    }

    // csvExporter.generateCsv(data2);
    doc.save("allProducts.pdf");
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
