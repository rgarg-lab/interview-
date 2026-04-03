async function next() {
  document.getElementById("page1").style.display = "none";
  document.getElementById("q_1").style.display = "block";
  editor1.layout();

  const topic = document.getElementById("topics").value;

  const response = await fetch('/coding/coding-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic })
  });

  try {
    const { result } = await response.json();
    const cleaned = result.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    console.log("✅ Parsed Gemini Questions:", parsed);
    window.generatedQuestion = parsed;
    document.querySelector("#q_1 h3").textContent = parsed[0].question;
    document.querySelector("#q_2 h3").textContent = parsed[1].question;
    document.querySelector("#q_3 h3").textContent = parsed[2].question;

  } catch (err) {
    console.error("❌ Failed to parse Gemini response:", err);
  }
}
