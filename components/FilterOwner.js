import React, { useCallback, useState, useEffect } from "react";
// import { CSVLink } from "react-csv";
import { Button, Card, DataTable, Filters } from "@shopify/polaris";
import { format } from "date-fns";

function FilterOwner(props) {
  const [queryValue, setQueryValue] = useState(null);
  const [tableRows, setTableRows] = useState([]);
  const [filter, setFilter] = useState([]);

  const filterOutPending = (items) => {
    if (items) {
      const filtered = items.map((item) => {
        if (item.approval === "approved") {
          return item;
        }
      });

      setTableRows(filtered);
      setFilter(filtered);
    }
  };

  useEffect(() => {
    filterOutPending(props?.results);
  }, [props?.results]);

  const handleFiltersQueryChange = useCallback((value) => {
    const list = [];
    for (let i = 0; i < tableRows.length; i++) {
      if (tableRows[i].ownerName.toLowerCase().includes(value.toLowerCase())) {
        list.push(tableRows[i]);
      }
    }
    setFilter(list);

    setQueryValue(value), [];
  });

  const handleQueryValueRemove = useCallback(() => {
    filterOutPending(props.results);
    setQueryValue(null), [];
  });

  const rows = filter?.map((item) => {
    if (item !== undefined) {
      return [
        <span onClick={() => props.handleChange(item?.ownerEmail)}>
          <strong>{item?.ownerName}</strong>
        </span>,
        item?.ownerEmail,
        item?.productName,
        format(new Date(parseInt(item?.warrantyExp)), "MM/dd/yyyy"),
        item?.origin === "shopify" ? "Shopify" : item?.origin,
      ];
    }
  });

  console.log(rows);

  const bubbleSort = (arr) => {
    let temp;
    for (let i = arr.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (arr[j].warrantyStart < arr[j + 1].warrantyStart) {
          temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    return arr;
  };

  tableRows ? bubbleSort(tableRows) : null;

  const csvData = [["Customer", "Email", "Product", "Expiration", "Origin"]];

  tableRows?.map((item) => {
    if (item !== undefined) {
      csvData.push([
        item.ownerName,
        item.ownerEmail,
        item.productName,
        format(new Date(parseInt(item.warrantyExp)), "MM/dd/yyyy"),
        item.origin,
      ]);
    }
  });

  return (
    <div style={{ height: "568px" }}>
      {" "}
      {/* <CSVLink data={csvData}>
        <Button>Download CSV</Button>
      </CSVLink> */}
      <Card>
        {" "}
        <Card.Section>
          <Filters
            queryValue={queryValue}
            filters={[]}
            appliedFilters={[]}
            onQueryChange={handleFiltersQueryChange}
            onQueryClear={handleQueryValueRemove}
            onClearAll={[]}
          />
        </Card.Section>
        <DataTable
          columnContentTypes={["text", "text", "text", "text", "text"]}
          headings={[
            "Customer",
            "Email",
            "Product",
            "Warranty Expiration",
            "Origin",
          ]}
          rows={rows[0] ? rows : []}
        />
      </Card>{" "}
    </div>
  );
}

export default FilterOwner;
