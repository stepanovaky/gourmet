import { useState, useEffect, useCallback } from "react";
import { Card, DataTable, Page } from "@shopify/polaris";
import { Button, ButtonGroup } from "@shopify/polaris";
import { format } from "date-fns";

//table logic - if approval === pending, include in this table

function AmazonWarranties(props) {
  console.log(props, "test1");
  const [tableRows, setTableRows] = useState([]);

  const handleApprove = (exp, id) => {
    //send code to approve this warraNTY
    const res = await fetch(`https://gourmet-b.herokuapp.com/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation {addWarrantyApproval (productId: ${id}, warrantyExp: ${exp}){ productId }}`,
      }),
    });
  };

  const handleRemove = (exp, id) => {
    //send code to delete this warranty
     const res = await fetch(`https://gourmet-b.herokuapp.com/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `mutation {warrantyDenied (productId: ${id}, warrantyExp: ${exp}){ productId }}`,
    }),
  });
  };

  const filterOutApproved = (items) => {
    let filteredItems = [];
    items.map((item) => {
      if (item.approval === "pending") {
        filteredItems.push([
          item.ownerName,
          item.ownerEmail,
          item.productName,
          //   format(new Date(parseInt(item?.warrantyExp)), "MM/dd/yyyy"),
          item.amazonOrderId,
          <ButtonGroup>
            <Button
              destructive
              onClick={handleRemove(item.warrantyExp, item.productId)}
            >
              Remove
            </Button>
            <Button
              primary
              onClick={handleApprove(item.warrantyExp, item.productId)}
            >
              Approve
            </Button>
          </ButtonGroup>,
        ]);
      }
    });
    const filtered = filteredItems;
    setTableRows(filtered);
  };

  useEffect(() => {
    filterOutApproved(props.results);
  }, []);

  // let rows = tableRows?.map((item) => {
  //   if (item !== undefined) {
  //     return [
  //       item.ownerName,
  //       item.ownerEmail,
  //       item.productName,
  //       //   format(new Date(parseInt(item?.warrantyExp)), "MM/dd/yyyy"),
  //       item.amazonOrderId,
  //       <ButtonGroup>
  //         <Button
  //           destructive
  //           onClick={handleRemove(item.warrantyExp, item.productId)}
  //         >
  //           Remove
  //         </Button>
  //         <Button
  //           primary
  //           onClick={handleApprove(item.warrantyExp, item.productId)}
  //         >
  //           Approve
  //         </Button>
  //       </ButtonGroup>,
  //     ];
  //   }
  // });

  return (
    <Page title="Unapproved Amazon Warranties">
      <Card>
        <DataTable
          columnContentTypes={["text", "text", "text", "text", "text"]}
          headings={[
            "Customer",
            "Email",
            "Product",
            "Amazon Order ID",
            "Approve?",
          ]}
          rows={tableRows ? tableRows : []}
        />
      </Card>
    </Page>
  );
}

export default AmazonWarranties;

export const getStaticProps = async () => {
  console.log("request sent");
  const res = await fetch(`https://gourmet-b.herokuapp.com/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {allWarranties{approval productId productName warrantyExp warrantyStart ownerEmail ownerName origin amazonOrderId}}`,
    }),
  });
  const response = await res.json();
  return { props: { results: response.data.allWarranties } };
};
