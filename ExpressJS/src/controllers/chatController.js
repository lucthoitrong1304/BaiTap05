const {
    getChatHistoriesService,
    getChatDetailService,
} = require("../services/chatService");

/**
 * Xử lý yêu cầu lấy lịch sử chat (GET /api/chat-histories)
 */
const getChatHistories = async (req, res) => {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await getChatHistoriesService(userId, page, limit);
    return res.status(200).json(data);
};

/**
 * Xử lý yêu cầu lấy chi tiết cuộc hội thoại (GET /api/chat-histories/:chatHistoryId)
 */
const getChatDetail = async (req, res) => {
    const userId = req.user.id;
    const chatHistoryId = req.params.chatHistoryId;

    if (!chatHistoryId) {
        return res.status(400).json({ EC: 1, EM: "Thiếu ID cuộc hội thoại." });
    }

    const data = await getChatDetailService(chatHistoryId, userId);

    if (data.EC === 1) {
        return res.status(404).json(data);
    }

    return res.status(200).json(data);
};

module.exports = {
    getChatHistories,
    getChatDetail,
};