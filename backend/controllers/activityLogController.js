import ActivityLog from '../models/ActivityLog.js';
import User from '../models/User.js';

const getRecentActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.findAll({
            order: [['timestamp', 'DESC']], 
            limit: 10,
            attributes: { exclude: ['__v', 'updatedAt'] }, 
            include: [{
                model: User,
                as: 'userActivity',
                attributes: ['id', 'username']
            }]
        });
        res.status(200).json(logs);
    } catch (error) {
        console.error("Error fetching activity logs:", error);
        res.status(500).json({ message: 'Server error fetching activity logs' });
    }
};

export { getRecentActivityLogs };