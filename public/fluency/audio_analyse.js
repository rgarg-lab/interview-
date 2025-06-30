let  evaluations=[];
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
// function showFinalResults() {
//   const container = document.getElementById("audio_result");
//   container.innerHTML = `
//     <h2>📊 Interview Summary</h2>
//     <table style="width:100%; border-collapse: collapse; background:#fff; box-shadow:0 0 10px rgba(0,0,0,0.1)">
//       <tr style="background:#4f46e5; color:white">
//         <th>#</th>
//         <th>Question</th>
//         <th>Transcript</th>
//         <th>Audio</th>
//         <th>Score</th>
//         <th>Feedback</th>
//       </tr>
//       ${audio_questions.map((q, i) => {
//         const audioURL = URL.createObjectURL(audioBlobs[i]);
//         return `
//           <tr style="border:1px solid #ccc;">
//             <td>${i + 1}</td>
//             <td>${q}</td>
//             <td>${audio_answers[i]}</td>
//             <td><audio controls src="${audioURL}" style="width:100%"></audio></td>
//             <td><strong>${evaluations[i].score}</strong></td>
//             <td><em>${evaluations[i].feedback}</em></td>
//           </tr>
//         `;
//       }).join('')}
//     </table>
//   `;
// }
