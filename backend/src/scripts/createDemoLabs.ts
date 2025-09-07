import { db } from '../config/sqlite';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const createDemoLabs = async () => {
  try {
    logger.info('🧪 Creating demo labs...');

    const labs = [
      { hfr: 'HFR-MUM-001', name: 'PathLabs Diagnostics - Andheri', email: 'andheri@pathlabs.com', phone: '022-40001001', address: 'Andheri West', city: 'Mumbai', state: 'MH', license: 'MH-LAB-2015-001', password: 'demo123' },
      { hfr: 'HFR-MUM-002', name: 'CityCare Labs - Bandra', email: 'bandra@citycarelabs.com', phone: '022-40002002', address: 'Bandra West', city: 'Mumbai', state: 'MH', license: 'MH-LAB-2016-002', password: 'demo123' },
      { hfr: 'HFR-MUM-003', name: 'HealthFirst Diagnostics - Powai', email: 'powai@healthfirst.com', phone: '022-40003003', address: 'Powai', city: 'Mumbai', state: 'MH', license: 'MH-LAB-2017-003', password: 'demo123' },
      { hfr: 'HFR-MUM-004', name: 'Metro Labs - Dadar', email: 'dadar@metrolabs.com', phone: '022-40004004', address: 'Dadar', city: 'Mumbai', state: 'MH', license: 'MH-LAB-2018-004', password: 'demo123' },
      { hfr: 'HFR-MUM-005', name: 'Prime Diagnostics - Colaba', email: 'colaba@primediagnostics.com', phone: '022-40005005', address: 'Colaba', city: 'Mumbai', state: 'MH', license: 'MH-LAB-2019-005', password: 'demo123' },
    ];

    const insert = db.prepare(`
      INSERT OR IGNORE INTO app_labs (
        id, hfr_uid, password, name, email, phone, address, city, state_code, license_number, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `);

    const update = db.prepare(`
      UPDATE app_labs
      SET password = ?, name = ?, email = ?, phone = ?, address = ?, city = ?, state_code = ?, license_number = ?, is_active = 1, updated_at = ?
      WHERE hfr_uid = ?
    `);

    for (const lab of labs) {
      const id = uuidv4();
      const hash = await bcrypt.hash(lab.password, 10);
      insert.run(
        id,
        lab.hfr,
        hash,
        lab.name,
        lab.email,
        lab.phone,
        lab.address,
        lab.city,
        lab.state,
        lab.license,
        new Date().toISOString(),
        new Date().toISOString()
      );
      update.run(
        hash,
        lab.name,
        lab.email,
        lab.phone,
        lab.address,
        lab.city,
        lab.state,
        lab.license,
        new Date().toISOString(),
        lab.hfr
      );
      logger.info(`✅ Created lab: ${lab.name} (${lab.hfr})`);
    }

    logger.info(`📊 Created ${labs.length} demo labs`);
  } catch (error) {
    logger.error('❌ Error creating demo labs:', error);
    throw error;
  }
};

export default createDemoLabs;


