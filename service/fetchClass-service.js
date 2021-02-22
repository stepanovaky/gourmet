import { graphQL } from "./backend";

class fetchClass {
  constructor() {}

  async updateProduct(id, warranty) {
    console.log(id, warranty);
    const res = await fetch(graphQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation {addWarrantyToProduct(productId: "${id}", warrantyDuration: ${parseInt(
          warranty
        )} ){
                productId
                productName
                warrantyDuration
            } }`,
      }),
    });
    const response = await res.json();
    console.log(response);
  }
}

export default fetchClass;
