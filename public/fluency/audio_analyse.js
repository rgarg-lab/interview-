let  evaluations=[];
let fluency_score=0;
async function showSummary() {
  const response =await fetch('/fluency/generate-feedback',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body :JSON.stringify({audio_answers,audio_questions})
  });
  const data=await response.json();
   evaluations = data.evaluations; 
  console.log("🎯 Full Gemini Feedback Response:", data.evaluations);
  document.getElementById("audio_question3").style.display = "none";
  showFinalResults();
}
async function showFinalResults() {
  // Hide question section
  document.getElementById("audio_question3").style.display = "none";

  // Make sure all result pages exist before trying to show
  const page1 = document.getElementById("result_page_1");
  const page2 = document.getElementById("result_page_2");
  const page3 = document.getElementById("result_page_3");

  if (!page1 || !page2 || !page3) {
    console.error("❌ One or more result page elements are missing in the DOM.");
    return;
  }

  // Set content for each result page
  for (let i = 0; i < 3; i++) {
    document.getElementById(`q${i+1}_text`).innerText = audio_questions[i];
    document.getElementById(`a${i+1}_text`).innerText = audio_answers[i];
    
   
    const pauses = audio_fluency[i]?.map(p => `${p.before} → ${p.after} (${p.gap}ms)`).join(", ") || "None";
    document.getElementById(`f${i+1}_pauses`).innerText = pauses;

    // const audioURL = URL.createObjectURL(audioBlobs[i]);
    // document.getElementById(`audio${i+1}_result`).src = audioURL;

    document.getElementById(`f${i+1}_feedback`).innerText = evaluations[i].feedback;
    document.getElementById(`s${i+1}_score`).innerText = evaluations[i].score;
    // Parse only the first part before '/' as an integer
const scoreStr = evaluations[i].score.toString().split('/')[0];  // "01/10" → "01"
const score = parseInt(scoreStr);  // → 1
fluency_score += isNaN(score) ? 0 : score;
 console.log(fluency_score);
  }
 // --- New code to save fluency score ---
  if (currentUser) { // Ensure a user is logged in
    console.log("Saving fluency score for user:", currentUser.uid);
    // We'll reuse 'topic1' for simplicity, assuming it's relevant to the fluency topic.
    // If your fluency section covers a different topic, you might want to introduce
    // a new variable like `fluencyTopic` instead of `topic1`.
    const fluencyTopic = topic1; // Or a specific variable for fluency topic

    const fluencyScoreRef = db.ref(`userProfiles/${currentUser.uid}/scores/fluentscore/${fluencyTopic}`);
    try {
      const snapshot = await fluencyScoreRef.once('value');
      const prevFluencyScore = snapshot.exists() ? snapshot.val().score : 0;

      if (fluency_score > prevFluencyScore) {
        await fluencyScoreRef.set({ score: fluency_score });
        console.log("New high fluency score saved!");
      } else {
        console.log("Current fluency score not higher than previous high fluency score.");
      }
    } catch (error) {
      console.error("Error saving fluency score to Firebase:", error);
      // Optionally alert user or handle error gracefully
      alert("Could not save your fluency score. Please check your login status or connection.");
    }
  } else {
    console.log("No user logged in, skipping fluency score save.");
  }
 
  // Show only the first result page initially
  page1.style.display = "block";
  page2.style.display = "none";
  page3.style.display = "none";
}

function goToPage(pageNum) {
  for (let i = 1; i <= 3; i++) {
    const page = document.getElementById(`result_page_${i}`);
    if (page) page.style.display = (i === pageNum) ? "block" : "none";
  }
}



