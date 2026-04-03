
function next1(){
  document.getElementById("q_1").style.display="none";
  document.getElementById("q_2").style.display="block";
  editor2.layout();
}
function next2(){
  document.getElementById("q_2").style.display="none";
  document.getElementById("q_3").style.display="block";
  editor3.layout();
}
function next3(){
  document.getElementById("q_3").style.display="none";
}
function prev2(){
  document.getElementById("q_2").style.display="none";
  document.getElementById("q_1").style.display="block";
  editor1.layout();
}
function prev3(){
  document.getElementById("q_3").style.display="none";
  document.getElementById("q_2").style.display="block";
  editor2.layout();
}
async function runCode(editorNumber) {
  const editor = editorNumber === 1 ? editor1 : editorNumber === 2 ? editor2 : editor3;
  const lang = document.getElementById(`lang${editorNumber}`).value;
  const outputId = `output${editorNumber}`;
  const code = editor.getValue();
  const q = window.generatedQuestion[editorNumber - 1];
  const testCases = q.input.map((input, i) => ({
    input,
    expected: q.expected[i]
  }));

  document.getElementById(outputId).textContent = "⏳ Running test cases...";

  try {
    const res = await fetch("/coding/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: lang, code, testCases })
    });

    const data = await res.json();
    console.log("🔧 Full response from /run:", data);

    const output = data.results.map((r, i) =>
      `🔹 Test Case ${i + 1}:\nInput: ${r.input}\nExpected: ${r.expected}\nActual: ${r.actual}\nStatus: ${r.passed ? "✅ Passed" : "❌ Failed"}\n${r.error ? "Error: " + r.error : ""}`
    ).join("\n--------------------\n");

    document.getElementById(outputId).textContent = output;

  } catch (err) {
    document.getElementById(outputId).textContent = `❌ Error: ${err.message}`;
  }
}
