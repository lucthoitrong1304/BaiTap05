const ChatHistory = require("../models/chatHistory");
const Message = require("../models/message");

/**
 * Lấy lịch sử chat của một người dùng cụ thể, có phân trang.
 * Đây là API phục vụ cho Lazy Loading/Infinite Scroll.
 * @param {number} userId - ID của người dùng đã xác thực.
 * @param {number} page - Số trang hiện tại.
 * @param {number} limit - Số lượng mục trên mỗi trang.
 */
const getChatHistoriesService = async (userId, page, limit) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows: chatHistories } = await ChatHistory.findAndCountAll({
      where: { userId: userId },
      limit: limit,
      offset: offset,
      order: [
        ['lastMessageAt', 'DESC']
      ],
      attributes: ['id', 'title', 'lastMessageAt', 'createdAt'],
    });

    return {
      EC: 0,
      EM: "Lấy lịch sử chat thành công",
      DT: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        chatHistories: chatHistories,
      },
    };

  } catch (error) {
    console.log("Lỗi khi lấy lịch sử chat:", error);
    return { EC: -1, EM: "Lỗi server nội bộ", DT: error };
  }
};

/**
 * Lấy chi tiết một cuộc hội thoại, bao gồm tất cả tin nhắn.
 * @param {number} chatHistoryId - ID của cuộc hội thoại.
 * @param {number} userId - ID của người dùng đã xác thực (để đảm bảo bảo mật).
 */
const getChatDetailService = async (chatHistoryId, userId) => {
  try {
    const chatHistory = await ChatHistory.findOne({
      where: {
        id: chatHistoryId,
        userId: userId // Đảm bảo người dùng chỉ xem được lịch sử của CHÍNH MÌNH
      },
      include: [{
        model: Message,
        as: 'messages',
        // Sắp xếp tin nhắn theo thời gian tạo (cũ nhất lên trước)
        order: [['createdAt', 'ASC']]
      }]
    });

    if (!chatHistory) {
      return {
        EC: 1,
        EM: "Cuộc hội thoại không tồn tại hoặc bạn không có quyền truy cập."
      };
    }

    return {
      EC: 0,
      EM: "Lấy chi tiết chat thành công",
      DT: chatHistory,
    };

  } catch (error) {
    console.log("Lỗi khi lấy chi tiết chat:", error);
    return { EC: -1, EM: "Lỗi server nội bộ", DT: error };
  }
};

module.exports = {
  getChatHistoriesService,
  getChatDetailService,
};