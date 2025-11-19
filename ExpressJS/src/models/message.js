const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const ChatHistory = require("./chatHistory");

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    chatHistoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ChatHistory,
        key: 'id',
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sender: {
      type: DataTypes.ENUM("User", "Chatbot"),
      allowNull: false,
    },
  },
  {
    tableName: "messages",
    timestamps: true,
  }
);

ChatHistory.hasMany(Message, { foreignKey: 'chatHistoryId', as: 'messages' });
Message.belongsTo(ChatHistory, { foreignKey: 'chatHistoryId' });

module.exports = Message;