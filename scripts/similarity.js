async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/annakotarba/sentence-similarity",
    {
      headers: {
        Authorization: "Bearer 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",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

query({
  inputs: {
    source_sentence: "That is a happy person",
    sentences: ["That is a happy dog"],
  },
}).then((response) => {
  console.log(JSON.stringify(response));
});
