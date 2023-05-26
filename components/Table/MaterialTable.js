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

const Table = ({ data, columns }) => {
  const [showPDF, setShowPDF] = useState(false);
  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map((c) => c.header),
  };

  useEffect(() => {
    if (showPDF) {
      // Generate the PDF and save it
      const pdfContainer = document.getElementById("pdf-container");
      if (pdfContainer) {
        // Render the PDFTable component inside the container
        const tableComponent = <PDFTable data={data} columns={columns} />;
        ReactDOM.render(tableComponent, pdfContainer, () => {
          // After rendering, convert the PDF container to a blob and save it
          const pdfContent = pdfContainer.innerHTML;
          const blob = new Blob([pdfContent], { type: "application/pdf" });
          saveAs(blob, "table.pdf");
          setShowPDF(false); // Hide the PDF table component
        });
      }
    }
  }, [showPDF, data, columns]);

  const csvExporter = new ExportToCsv(csvOptions);

  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  // const handleExportData = () => {
  //   // csvExporter.generateCsv(data);
  //   const tableData = data.map((row) =>
  //     columns.map((column) => row[column.accessor])
  //   );

  //   const element = (
  //     <PDFViewer>
  //       <PDFTable data={tableData} columns={columns} />
  //     </PDFViewer>
  //   );

  //   ReactDOM.render(element, document.getElementById("pdf-container"));
  // };

  const handleExportDataAsPDF = () => {
    const tableData = data.map((row) =>
      columns.map((column) => row[column.accessor])
    );

    const element = (
      <PDFViewer>
        <PDFTable data={tableData} columns={columns} />
      </PDFViewer>
    );

    ReactDOM.render(element, document.getElementById("pdf-container"));
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
          {/* <Button
            color="primary"
            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
            onClick={handleExportData}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export All Data
          </Button> */}
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
          </Button> */}
          {/* <Button
            disabled={table.getRowModel().rows.length === 0}
            //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
            onClick={() => handleExportRows(table.getRowModel().rows)}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export Page Rows
          </Button>
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
          </Button> */}
          <Button
            color="primary"
            onClick={handleExportDataAsPDF}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export All Data as PDF
          </Button>
        </Box>
      )}
    />
  );
};

export default Table;
