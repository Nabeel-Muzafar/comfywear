import { Document, Page, Text, View, PDFViewer } from "@react-pdf/renderer";
const PDFTable = ({ data, columns }) => {
  return (
    <Document>
      <Page>
        <View>
          <Text>Table Data</Text>
          <View>
            {data.map((row, rowIndex) => (
              <View key={rowIndex}>
                {columns.map((column, columnIndex) => (
                  <Text key={columnIndex}>{row[column.accessor]}</Text>
                ))}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
