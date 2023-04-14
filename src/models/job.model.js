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
        jobType: {
            type: DataTypes.ENUM,
            values: ['full-time', 'part-time', 'internship', 'contract', 'hybrid', 'volunteer', 'freelance']
        },
        tags:
        {
            type: DataTypes.ARRAY(DataTypes.STRING),
            maxLength: 50
        },
        salary: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            values: ['closed', 'open', 'applied'],
            defaultValue: 'open'
        }
    });

    return Job;
}
