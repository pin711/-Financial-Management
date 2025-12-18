
import { GoogleGenAI } from "@google/genai";

export const getFinancialAdvice = async (summary: string) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "尚未設定 API KEY，無法提供 AI 建議。請在 GitHub Secrets 中配置 API_KEY。";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `你是一位資深的理財顧問。以下是使用者的財務摘要：\n${summary}\n請根據這些數據提供 3-5 點具體的理財建議或警示。請使用繁體中文。`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "AI 無法生成回應，請稍後再試。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "調用 AI 服務時發生錯誤。";
  }
};
