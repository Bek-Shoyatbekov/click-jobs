module.exports = (sequelize, DataTypes, Sequelize) => {
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            minLength: 3,
            maxLength: 200,
            allowNull: false,
        },
        bio: {
            type: DataTypes.STRING,
            minLength: 10,
            maxLength: 500
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            minLength: 3,
            maxLength: 20,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
        },
        resume: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
            minLength: 9,
            maxLength: 50,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        accessToken: {
            type: DataTypes.STRING,
        },
        refreshToken: {
            type: DataTypes.STRING,
        },
        allowToPost: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        role: {
            type: DataTypes.ENUM('user', 'applicant', 'superadmin', 'banned'),
            defaultValue: 'user'
        }
    });
    return User;
}
