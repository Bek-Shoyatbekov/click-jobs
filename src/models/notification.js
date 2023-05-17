module.exports = (sequelize, DataTypes, Sequelize) => {
    const Notification = sequelize.define('notification', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },//TODO recived and sent properties are inneed of 
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
    return Notification;
}