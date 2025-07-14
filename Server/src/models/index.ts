import Ride from './Ride';
import Driver from './Driver';

export function setupAssociations() {
  Driver.hasMany(Ride, { foreignKey: 'driverId' });
  Ride.belongsTo(Driver, { foreignKey: 'driverId' });
}