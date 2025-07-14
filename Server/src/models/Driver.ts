import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import Ride from './Ride';

class Driver extends Model {}

Driver.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'first_name',
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'last_name',
    },
    profileImageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'profile_image_url',
    },
    carImageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'car_image_url', 
    },
    carSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        },
        field: 'car_seats',
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0,
            max: 5,
        },
    },
}, {
    sequelize,
    modelName: 'Driver',
    tableName: 'drivers',
    timestamps: false,
});

export default Driver;
