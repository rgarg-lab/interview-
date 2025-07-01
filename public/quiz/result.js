function submitQuiz() {
let correct=0;
let wrong=0;
for(let i=0;i<10;i++){
    if (answerMatch[i].toUpperCase() === useranswer[i].toUpperCase()) correct++;
    else wrong++;
}
  console.log("Correct Answers:", correct);
    console.log("Wrong Answers:", wrong);
    
        document.getElementById("q10").style.display="none";
        document.getElementById("chartPage").style.display = "block";
      const ctx = document.getElementById('resultChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Correct', 'Wrong'],
          datasets: [{
            data: [correct, wrong],
            backgroundColor: ['green', 'red']
          }]
        },
        options: {
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Correct vs Wrong'
            }
          }
        }
      });
    }


  function showAnalysis() {
  document.getElementById("chartPage").style.display = "none";
  const page3 = document.getElementById("page3");
  page3.style.display = "block";

  // Apply background only during analysis
  page3.classList.add("analysis-mode");

  for (let i = 0; i < 10; i++) {
    const options = ['A', 'B', 'C', 'D'];

    for (let j = 0; j < 4; j++) {
      const optionId = `q${i + 1}o${j + 1}`;
      const optLetter = options[j];
      const btn = document.getElementById(optionId);
      if (!btn) continue;

      btn.disabled = true;
      btn.style.backgroundColor = "";

      if (optLetter === useranswer[i] && useranswer[i] !== answerMatch[i]) {
        btn.style.backgroundColor = "red";
      }

      if (optLetter === answerMatch[i]) {
        btn.style.backgroundColor = "green";
      }
    }

    const qDiv = document.getElementById(`q${i + 1}`);
    qDiv.style.display = "block";
    const nav = qDiv.querySelector(".next-fixed");
    if (nav) nav.style.display = "none";
  }
}
