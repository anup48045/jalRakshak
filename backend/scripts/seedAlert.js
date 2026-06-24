require('dotenv').config();
const mongoose = require('mongoose');
const Alert = require('../models/Alert');
const WaterBody = require('../models/WaterBody');
const WaterQuality = require('../models/WaterQuality');
const { checkAlertThresholds, mergeThresholdAlerts } = require('../utils/healthScore');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env.local')
});

async function seedAlertData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jalrakshak');
    console.log('MongoDB Connected and uri:', process.env.MONGODB_URI);

    await Alert.deleteMany();
    console.log('Cleared existing alerts');

    const latestQualityDocs = await WaterQuality.aggregate([
      { $sort: { waterBodyId: 1, date: -1, year: -1 } },
      {
        $group: {
          _id: '$waterBodyId',
          doc: { $first: '$$ROOT' }
        }
      }
    ]);

    if (latestQualityDocs.length === 0) {
      console.log('No water quality records found. No alerts seeded.');
      process.exit(0);
    }

    const waterBodyIds = latestQualityDocs.map((item) => item._id);
    const waterBodies = await WaterBody.find({ _id: { $in: waterBodyIds } });
    const waterBodyMap = new Map(waterBodies.map((wb) => [String(wb._id), wb]));

    const alerts = [];

    for (const item of latestQualityDocs) {
      const qualityRecord = item.doc;
      const waterBody = waterBodyMap.get(String(item._id));
      if (!waterBody) continue;

      const thresholdAlerts = checkAlertThresholds(waterBody, qualityRecord);
      const mergedAlert = mergeThresholdAlerts(thresholdAlerts, qualityRecord);
      if (mergedAlert) {
        alerts.push(mergedAlert);
      }
    }

    if (alerts.length > 0) {
      await Alert.insertMany(alerts, { ordered: false });
      console.log(`Created ${alerts.length} merged alerts from latest water quality records.`);
    } else {
      console.log('No threshold violations found in latest water quality records. No alerts created.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding alerts:', error);
    process.exit(1);
  }
}

seedAlertData();