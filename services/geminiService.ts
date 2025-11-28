import { GoogleGenAI, Modality } from "@google/genai";

const getAIClient = () => {
  // API Key is managed via process.env.API_KEY
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- Text Generation (Philosophy & Lessons) ---

export const generateDailyBriefing = async (userName: string) => {
  const ai = getAIClient();
  const prompt = `
    Bạn là một chỉ huy quân đội dày dạn kinh nghiệm, nghiêm khắc nhưng tình cảm.
    Hãy viết một lời khuyên ngắn (tối đa 50 từ) về sự tự tin trong tình yêu dành cho binh nhì tên là "${userName}".
    Bối cảnh: Anh ấy làm việc tại kho hàng Shopee, từng đi nghĩa vụ quân sự.
    Phong cách: Hùng hồn, quân sự, ẩn dụ về chiến trường và kho bãi.
    Bắt đầu bằng: "Chào đồng chí ${userName},".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Đồng chí, hãy giữ vững tinh thần thép!";
  } catch (error) {
    console.error("Briefing Gen Error:", error);
    return "Hệ thống liên lạc bị nhiễu. Hãy giữ vững vị trí!";
  }
};

export const generateScenario = async (lessonContext: string, theory: string, userLevel: string, attemptIndex: number) => {
  const ai = getAIClient();
  
  // Add randomness to the prompt based on attempt index to ensure fresh scenarios
  const randomSeed = `Biến thể tình huống ngẫu nhiên số ${attemptIndex + 1}-${Date.now()}. Yêu cầu: Tình tiết MỚI LẠ, KHÔNG LẶP LẠI.`;

  const prompt = `
    Tạo một tình huống huấn luyện tán gái giả lập (text-based game) dựa trên lý thuyết đã học.
    
    LÝ THUYẾT ÁP DỤNG (BẮT BUỘC): "${theory}"
    
    Bối cảnh: Kho hàng Shopee (Băng chuyền, Xe nâng, Khu đóng gói, Canteen, Bãi xe, Khu locker).
    Nhân vật chính: Nam kho vận (User, cấp bậc ${userLevel}).
    Mục tiêu: Nữ nhân viên trẻ.
    Nhiệm vụ cốt lõi: ${lessonContext}.
    Yêu cầu đặc biệt: ${randomSeed}.
    
    Hãy đảm bảo tình huống thử thách người chơi vận dụng đúng Lý thuyết áp dụng ở trên. 
    Ba lựa chọn phải rõ ràng: 1 Sai hoàn toàn, 1 Sai do nhút nhát, 1 Đúng theo lý thuyết.

    Output JSON format:
    {
      "situation": "Mô tả chi tiết bối cảnh và sự kiện xảy ra (khoảng 40-60 từ). Dùng văn phong gãy gọn, quân sự.",
      "dialogue": [
         {"speaker": "Nữ", "text": "Một câu thoại của bạn nữ (nếu có, hoặc để trống)"}
      ],
      "options": [
        {"id": "A", "text": "Lựa chọn A", "isCorrect": false, "feedback": "Giải thích tại sao sai."},
        {"id": "B", "text": "Lựa chọn B", "isCorrect": true, "feedback": "Lời khen."},
        {"id": "C", "text": "Lựa chọn C", "isCorrect": false, "feedback": "Góp ý."}
      ]
    }
    Chỉ trả về JSON thuần, không markdown.
  `;

  try {
    // Using Gemini 3 Pro for high logic capability
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Scenario Gen Error:", error);
    return null;
  }
};

export const generateGraduationExam = async () => {
  const ai = getAIClient();
  const prompt = `
    Tạo một bài thi tốt nghiệp trắc nghiệm gồm 5 câu hỏi về kỹ năng giao tiếp xã hội/tán tỉnh tại môi trường làm việc kho bãi.
    Kiến thức bao gồm: 
    1. Cách mở lời (nguyên tắc 3 giây).
    2. Cách giúp đỡ (không cần trả ơn).
    3. Cách xin liên lạc (lý do chính đáng).
    
    Mỗi câu hỏi phải có 3 phương án. 1 phương án đúng (10 điểm), 2 phương án sai (0 điểm).
    
    Output JSON format:
    {
      "questions": [
        {
          "question": "Nội dung câu hỏi tình huống",
          "options": [
            {"text": "Đáp án A", "score": 0},
            {"text": "Đáp án B (Đúng nhất)", "score": 10},
            {"text": "Đáp án C", "score": 0}
          ]
        }
      ]
    }
    Tạo 5 câu hỏi khác nhau. Chỉ trả về JSON thuần.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    return JSON.parse(response.text || "{ \"questions\": [] }");
  } catch (error) {
    console.error("Exam Gen Error:", error);
    return { questions: [] };
  }
};

// --- Image Generation (Nano Banana) ---

export const generateIllustration = async (promptText: string) => {
  const ai = getAIClient();
  // Enforce style guide in prompt, strictly matching the provided text
  // NOTE: imageSize is removed as it is not supported by gemini-2.5-flash-image
  const fullPrompt = `
    Realistic cinematic photo, warehouse environment.
    Visualizing this specific scenario: ${promptText}.
    Characters: Male worker in uniform, Female coworker.
    Lighting: Industrial indoor.
    Style: Serious, high quality.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: fullPrompt,
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          // imageSize: "1K" // REMOVED: Not supported on flash-image, causes 500 error
        }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return "https://picsum.photos/800/450"; 
  } catch (error) {
    console.error("Image Gen Error:", error);
    return "https://picsum.photos/800/450";
  }
};

// --- TTS (Gemini 2.5 Pro) ---

export const generateSpeech = async (text: string, gender: 'Nam' | 'Nữ') => {
  const ai = getAIClient();
  const voiceName = gender === 'Nam' ? 'Fenrir' : 'Kore'; 

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return `data:audio/mp3;base64,${base64Audio}`;
    }
    return null;
  } catch (error) {
    console.error("TTS Gen Error:", error);
    return null;
  }
};