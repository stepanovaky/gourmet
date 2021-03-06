import { useState, useCallback, useEffect } from "react";
import {
  Page,
  List,
  Card,
  Autocomplete,
  Select,
  Button,
  Form,
  FormLayout,
  DataTable,
} from "@shopify/polaris";
import fetchClass from "../service/fetchClass-service";

function Products(props) {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState();
  const [warranty, setWarranty] = useState("");
  const [message, setMessage] = useState();

  const handleSelectChange = useCallback((value) => {
    console.log(value), setSelected(value), [];
  });

  const options = [{ label: "Choose Product", value: "" }];
  products?.map((item) => {
    options.push({ label: `${item.productName}`, value: `${item.productId}` });
  });

  useEffect(() => {
    loadProps();
    // toSetOptions();
  }, [products]);

  const loadProps = () => {
    if (props.results !== null) {
      setProducts(props.results);
    }
  };

  const productsWithoutWarranties = products?.map((item) => {
    if (item.warrantyDuration === 0) {
      return <List.Item key={item.productId}>{item.productName}</List.Item>;
    }
  });

  const handleWarrantyChange = useCallback((value) => setWarranty(value), []);

  const handleSubmit = () => {
    setMessage("");
    if (!selected) {
      setMessage("Product Missing");
    } else if (!warranty) {
      setMessage("Warranty Duration Missing");
    } else {
      const item = new fetchClass();
      item.updateProduct(selected, warranty);
      products.filter((item) => {
        if (item.productId == selected) {
          item.warrantyDuration = warranty;
        }
      });

      setWarranty("");
    }
  };

  return (
    <Page>
      <Card sectioned title="Products Without Warranties">
        <List type="bullet">{productsWithoutWarranties}</List>
      </Card>
      <Card sectioned>
        <Form onSubmit={handleSubmit}>
          <FormLayout>
            <Select
              label="All Products"
              options={options}
              onChange={handleSelectChange}
              value={selected}
            />
            <Autocomplete.TextField
              type="number"
              label="Warranty Duration (Years)"
              onChange={handleWarrantyChange}
              value={warranty}
            />

            <Button submit>Add Warranty</Button>
            {message}
          </FormLayout>
        </Form>
      </Card>
      <Card>
        <DataTable
          columnContentTypes={["text", "text", "text"]}
          headings={["Product ID", "Title", "Warranty Duration"]}
          rows={products.map((item) => {
            return [item.productId, item.productName, item.warrantyDuration];
          })}
        />
      </Card>
    </Page>
  );
}

export const getStaticProps = async () => {
  console.log("request sent");
  const res = await fetch(`https://gourmet-b.herokuapp.com/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {allProducts{productId productName warrantyDuration}}`,
    }),
  });
  const response = await res.json();
  return { props: { results: response.data.allProducts } };
};

export default Products;
