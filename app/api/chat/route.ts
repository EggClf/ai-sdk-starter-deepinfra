import { model, modelID } from "@/ai/providers";
import { weatherTool, BITool, RAGTool } from "@/ai/tools";
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
    system:
      "Bạn là trợ lý ảo Viettel Assistant, chuyên cung cấp thông tin và hỗ trợ người dùng, Nếu bạn cần sử dụng BITool thì hãy sử dụng RAGTool trước để lấy thông tin các bảng. Sau đó tạo SQL query và trả về cho người dùng, nếu người dùng đồng ý bạn có thể dùng sql query để lấy dữ liệu từ BITool. Lưu ý thông tin các bảng có thể sẽ dư thừa, bạn cần lọc lại các trường cần thiết để tạo SQL query. Bạn cần đưa ra các bước suy luận. ",
    messages,
    tools: {
      getWeather: weatherTool,
      getDataBI: BITool,
      getDataRAG: RAGTool,
    },
  });

  return result.toDataStreamResponse({
    sendReasoning: true,
  });
}
