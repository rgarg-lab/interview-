const questionMatch=new Array(10);
const optionMatch=new Array(10);
const answerMatch=new Array(10);
const useranswer=new Array(10);
async function quiz()
{
    document.getElementById("page1").style.display="none";
    document.getElementById("page2").style.display="block";
   
}
async function dosomething()
{
     const topic = document.getElementById("text").value;
    const response = await fetch('/quiz/generate-question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ topic }) 
    });
    const data=await response.json();
    console.log("Gemini Response:", JSON.stringify(data, null, 2)); 
    const fullText =
    data.questions ||
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "";
    if (!fullText) {
        alert("No questions received from API");
        return;
    } 
    const cleanedText = fullText.replace(/`/g, "").replace(/<\/?[^>]+(>|$)/g, "");
    const questionRegex = /\d+\.\s+(.*?)\nA\.\s+(.*?)\nB\.\s+(.*?)\nC\.\s+(.*?)\nD\.\s+(.*?)\nAnswer:\s+([A-D])/g;
    const matches = [...cleanedText.matchAll(questionRegex)];

    for (let i = 0; i < matches.length && i < 10; i++) {
      const [_, question, A, B, C, D, answer] = matches[i];
      questionMatch[i] = question;
      optionMatch[i] = { A, B, C, D };
      answerMatch[i] = answer;
    }
    console.log("Answer Key:", answerMatch);
console.log("User Answers:", useranswer);
    document.getElementById("page2").style.display="none";
    document.getElementById("q1").style.display="block";
    document.querySelector(".questions").style.display = "flex";
    document.getElementById("ques1").innerHTML=questionMatch[0];
    document.getElementById("q1o1").innerHTML=optionMatch[0].A;
    document.getElementById("q1o2").innerHTML=optionMatch[0].B;
    document.getElementById("q1o3").innerHTML=optionMatch[0].C;
    document.getElementById("q1o4").innerHTML=optionMatch[0].D;
}

