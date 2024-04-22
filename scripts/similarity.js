require("dotenv").config();

async function query(data) {
  const API_TOKEN = process.env.TOKEN;
  const response = await fetch(
    "https://api-inference.huggingface.co/models/sentence-transformers/all-mpnet-base-v2",
    {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

query({
  inputs: {
    source_sentence:
      "The mischievous cat playfully swatted at the dangling string, its green eyes sparkling with delight.",
    sentences: [
      "The aroma of freshly baked bread wafted from the kitchen, enticing everyone to gather around the table.",
    ],
  },
}).then((response) => {
  console.log(JSON.stringify(response));
});
