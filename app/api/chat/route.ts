import { model, modelID } from "@/ai/providers";
import { BITool, RAGTool } from "@/ai/tools";
import { streamText, UIMessage } from "ai";
import { get } from "http";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    selectedModel,
  }: { messages: UIMessage[]; selectedModel: modelID } = await req.json();

  const result = streamText({
    model: model.languageModel(selectedModel),
    system: `Bạn là trợ lý ảo Viettel Assistant,chuyên cung cấp thông tin và hỗ trợ người dùng,
      Nếu bạn cần sử dụng BITool thì hãy sử dụng RAGTool trước để lấy thông tin các bảng.
      Sau đó tạo SQL query. 
      Bạn cần lọc lại các trường cần thiết để tạo SQL query. 
      Bạn cần đưa ra các bước suy luận.
      Sau khi dùng BITool, bạn sẽ nói: Đây là kết quả của câu hỏi của bạn.`,
    messages,
    tools: {
      getDataRAG: RAGTool,
      getDataBI: BITool,
    },
  });

  return result.toDataStreamResponse({
    sendReasoning: true,
  });
}
