import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';
import Driver from './Driver';

class Ride extends Model {}

Ride.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'ride_id',
    },
    originAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'origin_address',
    },
    destinationAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'destination_address',
    },
    originLatitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
        field: 'origin_latitude',
    },
    originLongitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
        field: 'origin_longitude',
    },
    destinationLatitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
        field: 'destination_latitude', 
    },
    destinationLongitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
        field: 'destination_longitude', 
    },
    rideTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'ride_time', 
    },
    farePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0, 
        },
        field: 'fare_price', 
    },
    paymentStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'payment_status',
    },
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'drivers', 
            key: 'id',
        },
        field: 'driver_id', 
    },
    userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'user_id', 
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, 
        field: 'created_at', 
    },
}, {
    sequelize,
    modelName: 'Ride',
    tableName: 'rides',
    timestamps: false,
});

export default Ride;
