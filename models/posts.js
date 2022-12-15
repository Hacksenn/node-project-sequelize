"use strict";
const { Model } = require("sequelize");
/**
 * @param {import("sequelize").Sequelize} sequelize - Sequelize
 * @param {import("sequelize").DataTypes} DataTypes - Sequelize Column DataTypes
 * @return {Model} - Sequelize Model
 * **/
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Users, {
      //   foreignKey: "userId",
      // });
      this.belongsTo(models.Users, { foreignKey: "userId" });
      this.hasMany(models.Likes, {
        as: "Likes",
        foreignKey: "postId",
      });
      this.hasMany(models.Comments, {
        as: "Comments",
        foreignKey: "postId",
      });
    }
  }
  Posts.init(
    {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        // 관계를 맺는다.
        references: {
          // Users 테이블의 userId랑 관계를 맺었다.
          model: "Users", // 어떤 테이블인지,
          key: "userId", // 어떤 테이블의 어떤 Column인지
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Posts",
    }
  );
  return Posts;
};
