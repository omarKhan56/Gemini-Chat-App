export const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function generateContent(question) {
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": "AIzaSyCAJFfol7b1V2BPSUlhYFNKrP-QH-eWLqU" // replace if needed
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: question  // dynamic question
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching AI response:", err);
    return null;
  }
}

