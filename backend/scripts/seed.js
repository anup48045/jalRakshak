require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const WaterBody = require('../models/WaterBody');
const { getStatusFromHealthScore } = require('../utils/healthScore');
const path = require('path');
const xlsx = require('xlsx');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jalrakshak');
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany();
    await WaterBody.deleteMany();
    console.log('Cleared existing data');

    // Create users
    // Passwords are stored by the schema pre-save hook, so provide plain text here.
    const adminPassword = 'admin123';
    const officerPassword = 'officer123';
    const officialPassword = 'official123';

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@delhi.gov.in',
      password: adminPassword,
      role: 'admin',
      district: 'Central Delhi'
    });

    const officer1 = await User.create({
      name: 'Rajesh Kumar',
      email: 'officer@delhi.gov.in',
      password: officerPassword,
      role: 'officer',
      phone: '9876543210',
      district: 'North Delhi'
    });

    const officer2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@delhi.gov.in',
      password: officerPassword,
      role: 'officer',
      phone: '9876543211',
      district: 'South Delhi'
    });

    const official = await User.create({
      name: 'Government Official',
      email: 'official@delhi.gov.in',
      password: officialPassword,
      role: 'official',
      district: 'Central Delhi'
    });

    console.log('Created users');

    // Load water bodies from Excel file
    const excelPath = path.resolve(__dirname, '..', '..', 'visible_wbs-listed-631-water-bodies.xlsx');
    let waterBodies = [];
    try {
      const workbook = xlsx.readFile(excelPath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const raw = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: null });
      console.log('Total sheet rows:', raw.length);

      // Find the header row (some sheets have title rows or merged cells)
      const sampleHeadCandidates = raw.slice(0, Math.min(8, raw.length));
      let headerIdx = -1;
      for (let i = 0; i < sampleHeadCandidates.length; i++) {
        const row = sampleHeadCandidates[i].map(c => (c == null ? '' : String(c).toLowerCase()));
        if (row.some(cell => cell.includes('wetland') || cell.includes('wetland name') || cell.includes('geographical') || cell.includes('coordinates') || cell.includes('village') || cell.includes('district'))) {
          headerIdx = i;
          break;
        }
      }
      if (headerIdx === -1) {
        // pick the row with the most non-empty cells in the first few rows
        let maxCount = 0;
        for (let i = 0; i < sampleHeadCandidates.length; i++) {
          const count = sampleHeadCandidates[i].filter(c => c != null && String(c).trim() !== '').length;
          if (count > maxCount) {
            maxCount = count;
            headerIdx = i;
          }
        }
      }

      if (headerIdx === -1) headerIdx = 0;
      const headers = raw[headerIdx].map(h => (h == null ? null : String(h).trim()));
      console.log('Detected header row index:', headerIdx, 'headers:', headers);

      const dataRows = raw.slice(headerIdx + 1);
      const rows = dataRows.map(r => {
        const obj = {};
        for (let j = 0; j < r.length; j++) {
          const key = headers[j] || `__EMPTY_${j}`;
          obj[key] = r[j] != null ? r[j] : null;
        }
        return obj;
      });
      console.log('Parsed data rows:', rows.length);

      const findKey = (objKeys, candidates) => {
        const lower = objKeys.map(k => k.toLowerCase());
        for (const c of candidates) {
          const idx = lower.findIndex(k => k.includes(c));
          if (idx !== -1) return objKeys[idx];
        }
        return null;
      };

      const parseDMS = (deg, min, sec, dir) => {
        let d = Number(deg) + (Number(min) || 0) / 60 + (Number(sec) || 0) / 3600;
        if (dir && /[sw]/i.test(dir)) d = -d;
        return d;
      };

      const parseCoordinates = (val) => {
        if (val == null) return [null, null];
        let s = String(val).trim();

        const latMatch = s.match(/(\d{1,3})\D+(\d{1,3})\D+(\d{1,3}(?:\.\d+)?)\D*([NS])/i);
        const lonMatch = s.match(/(\d{1,3})\D+(\d{1,3})\D+(\d{1,3}(?:\.\d+)?)\D*([EW])/i);

        if (latMatch && lonMatch) {
          const lat = parseDMS(latMatch[1], latMatch[2], latMatch[3], latMatch[4]);
          const lon = parseDMS(lonMatch[1], lonMatch[2], lonMatch[3], lonMatch[4]);
          return [lat, lon];
        }
        // s = s.replace(/°/g, ' ')
        // s = s.replace(/[,\n\r]/g, ' ');

        // Try decimal numbers first
        const decimals = s.match(/-?\d+\.\d+/g);
        if (decimals && decimals.length >= 2) {
          const lat = parseFloat(decimals[0]);
          const lon = parseFloat(decimals[1]);
          return [lat, lon];
        }

        // Try integers (could be DMS without decimals)
        // const ints = s.match(/-?\d+/g);
        // DMS pattern with N/S and E/W

        // Fallback: if we have at least two ints, take first two as lat lon
        // if (ints && ints.length >= 2) {
        //   const lat = parseFloat(ints[0]);
        //   const lon = parseFloat(ints[1]);
        //   return [lat, lon];
        // }

        return [null, null];
      };

      rows.forEach((row, i) => {
        const keys = Object.keys(row);
        const nameKey = findKey(keys, ['name', 'wetland name', 'waterbody', 'wb_name']);
        const coordKey = findKey(keys, ['geographical coordinates', 'geographical coordinate', 'coordinates', 'geographical coordinates (latitude']);
        const latKey = findKey(keys, ['latitude', 'lat']);
        const lonKey = findKey(keys, ['longitude', 'lon', 'long', 'lng']);
        const districtKey = findKey(keys, ['district', 'zone', 'ward']);
        const areaKey = findKey(keys, ['area', 'area in', 'ha', 'size']);
        const categoryKey = findKey(keys, ['category', 'type']);
        const statusKey = findKey(keys, ['status', 'condition']);
        const healthKey = findKey(keys, ['healthscore', 'health_score', 'score']);
        const descKey = findKey(keys, ['description', 'notes', 'remarks', 'present condition']);

        const name = nameKey ? String(row[nameKey]).trim() : null;
        let lat = null;
        let lon = null;
        // const coordRaw = coordKey ? row[coordKey] : (latKey && lonKey ? `${row[latKey]}, ${row[lonKey]}` : null);
        if (coordKey) {
          const parsed = parseCoordinates(row[coordKey]);
          lat = parsed[0];
          lon = parsed[1];
        } else {
          lat = latKey ? parseFloat(row[latKey]) : null;
          lon = lonKey ? parseFloat(row[lonKey]) : null;
        }
        const district = districtKey ? String(row[districtKey]).trim() : null;
        let area = areaKey ? Number(row[areaKey]) : null;
        // If header mentions hectares, convert to square meters
        if (area && areaKey && areaKey.toLowerCase().includes('ha')) {
          area = area * 10000; // ha to m^2
        }
        let category = categoryKey ? String(row[categoryKey]).toLowerCase().trim() : null;
        const status = statusKey && row[statusKey] ? String(row[statusKey]).toLowerCase().trim() : null;
        const healthScore = healthKey && row[healthKey] ? Number(row[healthKey]) : null;
        const description = descKey && row[descKey] ? String(row[descKey]) : null;

        if (!name || name === 'null' || name === 'undefined' || name.trim() === '') {
          return;
        }
        if (lat == null || lon == null || Number.isNaN(lat) || Number.isNaN(lon)) {
          return;
        }
        const allowedCategories = ['lake', 'pond', 'wetland', 'reservoir', 'river'];
        if (!category || !allowedCategories.includes(category)) {
          category = 'lake';
        }

        let finalHealthScore = 65;

        const descLower = description ? description.toLowerCase() : '';
        if (
          descLower.includes('very good') ||
          descLower.includes('beautified') ||
          descLower.includes('cleaned') ||
          descLower.includes('flora') ||
          (descLower.includes('developed') && descLower.includes('wet') && !descLower.includes('dry'))
        ) {
          finalHealthScore = 80 + Math.floor(Math.random() * 16); // 80 to 95
        } else if (
          descLower.includes('dried') ||
          descLower.includes('dry') ||
          descLower.includes('no water') ||
          descLower.includes('vacant') ||
          descLower.includes('encroachment') ||
          descLower.includes('encroached')
        ) {
          finalHealthScore = 15 + Math.floor(Math.random() * 30); // 15 to 44
        } else {
          finalHealthScore = 50 + Math.floor(Math.random() * 25); // 50 to 74
        }

        if (healthScore != null && !Number.isNaN(healthScore) && healthScore > 0) {
          finalHealthScore = healthScore;
        }

        const finalStatus = getStatusFromHealthScore(finalHealthScore);

        waterBodies.push({
          name,
          location: { type: 'Point', coordinates: [parseFloat(lon), parseFloat(lat)] },
          // coordinates: coordRaw ? String(coordRaw) : (lat && lon ? `${lat}, ${lon}` : ''),
          district: district || 'Unknown',
          area: area || 0,
          category,
          status: finalStatus,
          healthScore: finalHealthScore,
          description: description || ''
        });
      });

      if (waterBodies.length === 0) {
        console.warn('No valid water bodies found in Excel, seeding sample defaults');
        waterBodies = [];
      }
    } catch (ex) {
      console.error('Failed to read Excel file at', excelPath, ex);
      waterBodies = [];
    }

    if (waterBodies.length) {
      console.log('Sample water body:');
      console.log(JSON.stringify(waterBodies[0], null, 2));
      try {
        await WaterBody.insertMany(
          waterBodies,
          { ordered: false }
        );
      } catch (err) {
        console.error('insertMany error:', err.message);
        if (err.writeErrors) {
          console.error('First 5 write errors:', err.writeErrors.slice(0, 5).map(e => e.errmsg || e.message));
        }
      }
      console.log(`Created ${waterBodies.length} water bodies from Excel`);
      const finalCount = await WaterBody.countDocuments();
      console.log('Water bodies in database now:', finalCount);
    } else {
      console.log('No water bodies created');
    }

    console.log('Seed data completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
