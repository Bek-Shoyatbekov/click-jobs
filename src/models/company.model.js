module.exports = (sequelize, DataTypes, Sequelize) => {
    const Company = sequelize.define('company', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            minLength: 3,
            maxLength: 200,
            allowNull: false,
        },
        inn: {
            type: DataTypes.INTEGER,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        isVerifiend: {
            type: DataTypes.BOOLEAN,
            defaultValue: false

        },
    });

    return Company;
}
