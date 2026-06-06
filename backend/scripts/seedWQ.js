const mongoose = require('mongoose');
const WaterBody = require('../models/WaterBody');
const WaterQuality = require('../models/WaterQuality');
const { getStatusFromHealthScore, calculateHealthScore } = require('../utils/healthScore');

function randomBetween(min, max, decimals = 2) {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}
function generateYrWiseData(waterBodies){
  const qualityData = [];
    waterBodies.forEach((waterBody) => {
       for(let year = 2020; year<=2026; year++){
        const quality = {
           // Realistic environmental ranges
           do: randomBetween(3, 12),                 // mg/L
           ph: randomBetween(6.5, 8.8),              // pH
           bod: randomBetween(1, 15),                // mg/L
           nitrate: randomBetween(0.5, 40),          // mg/L
           fecalColiform: Math.floor(randomBetween(50, 5000, 0)),
           totalColiform: Math.floor(randomBetween(100, 10000, 0)),
           temperature: randomBetween(15, 38),       // °C
           turbidity: randomBetween(1, 100),         // NTU
           conductivity: randomBetween(100, 2000),   // µS/cm
        }
        const healthScore = calculateHealthScore(quality);
        const status = getStatusFromHealthScore(healthScore);

         qualityData.push({
           waterBodyId: waterBody._id,
           name: waterBody.name,
           year: year,

          ...quality,
           healthScore,
           status,
           labName: 'JalRakshak Environmental Lab',
           date: new Date(`${year}-06-15`)
          })
        }
      })
  
  return qualityData;
}

async function generateWaterQualityData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jalrakshak');
    console.log('MongoDB Connected');
    const waterBodies = await WaterBody.find();
    // Clear existing data
     await WaterQuality.deleteMany();
     console.log('Cleared existing data');


    const qualityData = generateYrWiseData(waterBodies);
    await WaterQuality.insertMany(qualityData);

    console.log(
      `${qualityData.length} water quality records inserted successfully`
    );

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

generateWaterQualityData();