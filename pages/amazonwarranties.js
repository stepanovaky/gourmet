import { useState, useEffect } from "react";
import { Card, DataTable, Page } from "@shopify/polaris";
import { Button, ButtonGroup } from "@shopify/polaris";
import { format } from "date-fns";

//table logic - if approval === pending, include in this table

function AmazonWarranties() {
  const [tableRows, setTableRows] = useState([]);

  const fetchData = async () => {
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
    return { results: response.data.allWarranties };
  };

  const filterOutApproved = (items) => {
    if (items) {
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
                onClick={() =>
                  handleRemove(
                    item.ownerEmail,
                    item.productId,
                    item.productName
                  )
                }
              >
                Remove
              </Button>
              <Button
                primary
                onClick={() =>
                  handleApprove(
                    item.ownerEmail,
                    item.productId,
                    item.productName
                  )
                }
              >
                Approve
              </Button>
            </ButtonGroup>,
          ]);
        }
      });
      setTableRows(filteredItems);
    }
  };

  useEffect(() => {
    async function fetchDataWrap() {
      let data = await fetchData();
      filterOutApproved(data.results);
    }
    fetchDataWrap();
  }, []);

  const handleApprove = async (email, id, name) => {
    //send code to approve this warraNTY
    const res = await fetch(`https://gourmet-b.herokuapp.com/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation {addWarrantyApproval (productId: "${id}", ownerEmail: "${email}"){ productId }}`,
      }),
    });
    const response = await res.json();
    if (response.data) {
      let data = await fetchData();
      filterOutApproved(data.results);
    }
  };

  const handleRemove = async (email, id, name) => {
    //send code to delete this warranty
    const res = await fetch(`https://gourmet-b.herokuapp.com/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation {warrantyDenied (productId: "${id}", ownerEmail: "${email}"){ productId }}`,
      }),
    });
    const response = await res.json();
    if (response.data) {
      let data = await fetchData();
      filterOutApproved(data.results);
      //staqlab-tunnel 8081
    }
  };

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
          rows={tableRows}
        />
      </Card>
    </Page>
  );
}

export default AmazonWarranties;
