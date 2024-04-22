require("dotenv").config();

async function query(data) {
  const API_TOKEN = process.env.TOKEN;
  const response = await fetch(
    "https://api-inference.huggingface.co/models/Minej/bert-base-personality",
    {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

query({ inputs: "I like you. I love you" }).then((response) => {
  console.log(JSON.stringify(response));
});
