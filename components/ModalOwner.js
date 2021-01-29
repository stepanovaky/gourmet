import { useState, useCallback, useEffect } from "react";
import { Modal, Button, Subheading, DataTable } from "@shopify/polaris";

function ModalOwner(props) {
  return (
    <div style={{ height: "500px" }}>
      <Modal
        open={props.active}
        title={props.owner ? props.owner[0].ownerName : null}
        onClose={props.handleChange}
      >
        <p></p>
        <Modal.Section>
          <Subheading>
            {props.owner ? props.owner[0].ownerEmail : null}
          </Subheading>
          <DataTable
            columnContentTypes={["text", "text", "text", "text", "text"]}
            headings={[
              "Product",
              "Warranty Start",
              "Warranty Expiration",
              "Origin",
            ]}
            rows={props.rows ? props.rows : []}
          ></DataTable>
        </Modal.Section>
      </Modal>
    </div>
  );
}

export default ModalOwner;
