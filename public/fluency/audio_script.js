let audio_questions = [];

async function audio_page() {
  const audio_topic_select = document.getElementById("audio_topic").value;

  document.getElementById("audio_page1").style.display = "none";
  document.getElementById("audio_question1").style.display = "block";
  document.getElementById("audio_topic").style.display = "none";

  const response = await fetch('/fluency/generate-questionaudio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ audio_topic: audio_topic_select })
  });

  const data = await response.json();

  if (!data.questions || data.questions.length === 0) {
    alert("No questions received from Gemini");
    return;
  }

  audio_questions = data.questions;
  console.log("🎯 Questions received from Gemini:", audio_questions);
  document.getElementById("audio_q1").innerText=audio_questions[0];
document.getElementById("audio_q2").innerText=audio_questions[1];
document.getElementById("audio_q3").innerText=audio_questions[2];
}
function updateButtons(index, state) {
  const startBtn = document.getElementById(`startBtn${index + 1}`);
  const stopBtn = document.getElementById(`stopBtn${index + 1}`);
  const nextBtn = document.getElementById(`nextBtn${index + 1}`);

  if (!startBtn || !stopBtn || !nextBtn) return;

  if (state === "initial") {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    nextBtn.disabled = true;
  } else if (state === "recording") {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    nextBtn.disabled = true;
  } else if (state === "done") {
    startBtn.disabled = true;
    stopBtn.disabled = true;
    nextBtn.disabled = false;
  }
}

