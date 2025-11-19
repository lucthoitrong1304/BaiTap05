const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./user");

const ChatHistory = sequelize.define(
  "ChatHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "chat_histories",
    timestamps: true,
  }
);

User.hasMany(ChatHistory, { foreignKey: 'userId', as: 'chatHistories' });
ChatHistory.belongsTo(User, { foreignKey: 'userId' });

module.exports = ChatHistory;