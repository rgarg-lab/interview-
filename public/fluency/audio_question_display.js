const audio_answers=[];
const audio_fluency=[];
const audioBlobs=[];
let mediaRecorder;
let audioChunks=[];
let currentIndex=0;
const audioE1s=[document.getElementById("audio1"),document.getElementById("audio2"),document.getElementById("audio3")];

let stopTimeout;
window.onload = () => {
  updateButtons(0, "initial");
};

async function startrecording(index) {
  updateButtons(index, "recording");
  currentIndex = index;
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) audioChunks.push(e.data);
  };

  mediaRecorder.onstop = async () => {
    clearTimeout(stopTimeout); // Cancel auto-stop if stopped early

    const blob = new Blob(audioChunks, { type: 'audio/wav' });
    audioBlobs[currentIndex] = blob;
    audioE1s[currentIndex].src = URL.createObjectURL(blob);

    const formData = new FormData();
    formData.append("audio", blob, "recording.wav");

    const res = await fetch("/fluency/upload-audio", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    console.log(`📤 Q${currentIndex + 1} uploaded. Transcript ID: ${result.id}`);

    const poll = setInterval(async () => {
      const check = await fetch(`/fluency/transcript/${result.id}`);
      const data = await check.json();
      console.log(`📡 Polling for Q${currentIndex + 1}:`, data.status);

      if (data.status === "completed") {
        clearInterval(poll);
        audio_answers[currentIndex] = data.text || "";
        console.log(`📝 Transcript Q${currentIndex + 1}:`, data.text);

        const words = data.words || [];
        const pauses = [];
        for (let i = 0; i < words.length - 1; i++) {
          const gap = words[i + 1].start - words[i].end;
          if (gap > 300) {
            pauses.push({
              before: words[i].text,
              after: words[i + 1].text,
              gap
            });
          }
        }
        audio_fluency[currentIndex] = pauses;
      }

      if (data.status === "error") {
        clearInterval(poll);
        console.warn(`❌ Error processing transcript Q${currentIndex + 1}`);
      }
    }, 3000);
  };

  mediaRecorder.start();
  console.log("🎙️ Recording started... Speak clearly after 0.5s");

  // Optional: show UI cue to start speaking
  setTimeout(() => {
    console.log("✅ You can start speaking now.");
  }, 500);

  // Auto-stop after 10 seconds
  stopTimeout = setTimeout(() => {
    if (mediaRecorder.state === 'recording') {
      console.log("⏱️ Auto-stopping after 10 seconds");
      stoprecording();
    }
  }, 10000); // 10 sec = 10000ms
}

function stoprecording() {
  if (mediaRecorder?.state === 'recording') {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    clearTimeout(stopTimeout);
    console.log("🛑 Recording manually stopped");
  }
  document.getElementById(`statusMsg${currentIndex + 1}`).innerText = "⏳ Processing your answer...";

setTimeout(() => {
  // Enable Next after 5 seconds
  updateButtons(currentIndex, "done");
  document.getElementById(`statusMsg${currentIndex + 1}`).innerText = ""; // Clear message
}, 5000);

}

function goToNext(nextIndex) {
  if (nextIndex === 1) {
    document.getElementById("audio_question1").style.display = "none";
    document.getElementById("audio_question2").style.display = "block";
  } else if (nextIndex === 2) {
    document.getElementById("audio_question2").style.display = "none";
    document.getElementById("audio_question3").style.display = "block";
  }
   updateButtons(nextIndex, "initial");
}

