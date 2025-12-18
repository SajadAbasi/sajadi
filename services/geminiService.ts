
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeNote = async (content: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `لطفاً این متن یادداشت را به صورت بسیار کوتاه و در حداکثر دو جمله خلاصه کن: \n\n${content}`,
      config: {
        systemInstruction: "تو یک دستیار هوشمند هستی که یادداشت‌ها را برای کاربران خلاصه می‌کنی. فقط متن خلاصه را برگردان.",
      }
    });
    return response.text || "خلاصه‌ای یافت نشد.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "خطا در برقراری ارتباط با هوش مصنوعی.";
  }
};
