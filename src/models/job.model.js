module.exports = (sequelize, DataTypes, Sequelize) => {
    const Job = sequelize.define('job', {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            minLength: 3,
            maxLength: 200,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        tags:
        {
            type: DataTypes.ARRAY(DataTypes.STRING),
            maxLength: 50
        },
        status: {
            type: DataTypes.ENUM,
            values: ['published', 'inproccess', 'canceled']
        }
    });

    return Job;
}
