import { Lesson, Rank } from "./types";

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 1,
    title: "NHIỆM VỤ 1: PHÁ BĂNG",
    description: "Kỹ thuật mở lời chào hỏi tại khu vực đóng gói.",
    isLocked: false,
    theory: "NGUYÊN TẮC 3 GIÂY: Khi chạm mắt, hãy gật đầu chào ngay. Đừng nhìn chằm chằm. Hãy dùng câu hỏi mở liên quan đến công việc chung để bắt đầu. Giọng nói phải rõ ràng, dứt khoát nhưng không gắt gỏng.",
    scenarioPrompt: "Tình huống: Tại khu vực đóng gói hàng Shopee, bạn và mục tiêu đang đứng cạnh nhau chờ xe nâng hàng tới. Không khí im lặng. Tạo tình huống ngẫu nhiên khác nhau về sự cố nhỏ hoặc quan sát chung.",
  },
  {
    id: 2,
    title: "NHIỆM VỤ 2: TẠO ẤN TƯỢNG",
    description: "Thể hiện sự ga-lăng đúng mực quân nhân.",
    isLocked: true,
    theory: "HÀNH ĐỘNG HƠN LỜI NÓI: Đừng khoe khoang. Hãy giúp đỡ những việc nhỏ nhặt (bê thùng hàng nặng, lấy giùm băng keo) một cách dứt khoát, không chờ đợi lời cảm ơn. Quân tử làm việc nghĩa không màng trả ơn.",
    scenarioPrompt: "Tình huống: Mục tiêu đang gặp khó khăn với công việc tay chân (bê đồ, với đồ, kẹt xe đẩy). Tạo các biến thể khác nhau về khó khăn vật lý trong kho.",
  },
  {
    id: 3,
    title: "NHIỆM VỤ 3: XIN LIÊN LẠC",
    description: "Chiến thuật rút lui và giữ kết nối.",
    isLocked: true,
    theory: "LÝ DO CHÍNH ĐÁNG: Đừng xin số vô cớ. Hãy tạo ra một lý do liên quan đến công việc hoặc sở thích chung đã bàn trước đó. Giữ thái độ 'được thì tốt, không được vẫn vui'. Tuyệt đối không nài nỉ như lính mới sợ súng.",
    scenarioPrompt: "Tình huống: Kết thúc ca làm việc hoặc giờ nghỉ giải lao. Tạo các lý do khác nhau để cần liên lạc (gửi lịch trực, share quán ăn ngon, hỏi về quy trình mới).",
  },
  {
    id: 4,
    title: "THI TỐT NGHIỆP",
    description: "Bài kiểm tra tổng hợp toàn diện kỹ năng để ra trường.",
    isLocked: true,
    theory: "TỔNG HỢP KỸ NĂNG: Phối hợp quan sát, tiếp cận, hỗ trợ và kết nối. Đây là bước cuối cùng để trở thành Đại Úy Tình Trường. Chiến sĩ phải trả lời đúng ít nhất 4/5 câu hỏi.",
    scenarioPrompt: "EXAM_MODE",
  },
];

export const PLACEMENT_TEST_QUESTIONS = [
  {
    question: "Đồng chí thấy một đồng nghiệp nữ làm rơi hàng hóa. Hành động?",
    options: [
      { text: "Đứng nhìn và cười.", score: 0 },
      { text: "Lặng lẽ lại gần nhặt giúp, gật đầu rồi đi tiếp.", score: 10 },
      { text: "Hỏi to: 'Em có sao không?' nhưng không làm gì.", score: 2 },
    ],
  },
  {
    question: "Trong giờ nghỉ trưa, đồng chí muốn ngồi cùng bàn với mục tiêu. Đồng chí nói:",
    options: [
      { text: "Em ăn cơm một mình không buồn à?", score: 0 },
      { text: "Chỗ này còn trống không đồng chí? Tôi ngồi nhé.", score: 10 },
      { text: "Lặng lẽ ngồi xuống không nói gì.", score: 5 },
    ],
  },
  {
    question: "Khi bị từ chối nói chuyện, đồng chí sẽ:",
    options: [
      { text: "Tức giận, bỏ đi.", score: 0 },
      { text: "Vẫn cười, chào 'Hẹn gặp sau' và rút lui bảo toàn lực lượng.", score: 10 },
      { text: "Cố gắng nài nỉ thêm lần nữa.", score: 2 },
    ],
  },
];

export const RANK_THRESHOLDS = {
  [Rank.RECRUIT]: 0,
  [Rank.PRIVATE]: 15,
  [Rank.CORPORAL]: 100,
  [Rank.SERGEANT]: 200,
  [Rank.CAPTAIN]: 500,
};