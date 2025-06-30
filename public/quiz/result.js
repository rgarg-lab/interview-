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