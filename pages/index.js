import { useState } from "react";
import { Page } from "@shopify/polaris";
import { format } from "date-fns";
import ModalOwner from "../components/ModalOwner";
import FilterOwner from "../components/FilterOwner";

function Index(props) {
  const [activeOwner, setActiveOwner] = useState("");
  const [active, setActive] = useState(false);
  const [rows, setRows] = useState([]);

  const handleChange = (email) => {
    console.log(email);
    setActive(!active), [active];
    if (active === false) {
      const item = props?.results.filter((item) => item.ownerEmail === email);
      setActiveOwner(item);
      const i = item?.map((i) => {
        return [
          i.productName,
          format(new Date(i.warrantyStart), "MM/dd/yyyy"),
          format(new Date(i.warrantyExp), "MM/dd/yyyy"),
          i.origin === "shopify" ? "Shopify" : i.origin,
        ];
      });
      setRows(i);
    } else {
      setActiveOwner("");
    }
  };

  const handleFilter = (value) => {
    setFilter(value);
  };

  return (
    <Page>
      <FilterOwner handleChange={handleChange} results={props.results} />

      <ModalOwner
        rows={rows}
        owner={activeOwner}
        handleChange={handleChange}
        active={active}
      />
    </Page>
  );
}

export const getStaticProps = async () => {
  const res = await fetch(`https://gourmet-b.herokuapp.com/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {approvedWarranties{approval productId productName warrantyExp warrantyStart ownerEmail ownerName origin}}`,
    }),
  });
  const response = await res.json();
  return { props: { results: response.data.approvedWarranties } };
};

export default Index;
