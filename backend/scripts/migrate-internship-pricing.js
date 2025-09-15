const { sequelize } = require('../config/database');

async function migrateInternshipPricing() {
  try {
    console.log('🔄 Starting internship pricing migration...');
    
    // Add new pricing columns to internships table
    const alterQueries = [
      // Add pricing fields
      "ALTER TABLE internships ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER duration_unit",
      "ALTER TABLE internships ADD COLUMN original_price DECIMAL(10,2) NULL AFTER price",
      "ALTER TABLE internships ADD COLUMN discount_percentage DECIMAL(5,2) NULL DEFAULT 0 AFTER original_price",
      "ALTER TABLE internships ADD COLUMN currency VARCHAR(3) DEFAULT 'INR' AFTER discount_percentage",
      "ALTER TABLE internships ADD COLUMN is_free BOOLEAN DEFAULT FALSE AFTER currency",
      "ALTER TABLE internships ADD COLUMN enrollment_fee DECIMAL(10,2) NULL DEFAULT 0 AFTER is_free",
      "ALTER TABLE internships ADD COLUMN installment_available BOOLEAN DEFAULT FALSE AFTER enrollment_fee",
      "ALTER TABLE internships ADD COLUMN installment_count INT DEFAULT 1 AFTER installment_available",
      
      // Add category relationship
      "ALTER TABLE internships ADD COLUMN category_id INT NULL AFTER is_featured",
      "ALTER TABLE internships ADD CONSTRAINT fk_internships_category FOREIGN KEY (category_id) REFERENCES course_categories(id) ON DELETE SET NULL",
      
      // Modify existing category field to be nullable
      "ALTER TABLE internships MODIFY COLUMN category VARCHAR(50) NULL"
    ];
    
    for (const query of alterQueries) {
      try {
        await sequelize.query(query);
        console.log(`✅ Executed: ${query.split(' ')[2]} ${query.split(' ')[3]}`);
      } catch (error) {
        if (error.message.includes('Duplicate column name')) {
          console.log(`⚠️  Column already exists, skipping: ${query.split(' ')[2]} ${query.split(' ')[3]}`);
        } else if (error.message.includes('Duplicate key name')) {
          console.log(`⚠️  Foreign key already exists, skipping: ${query.split(' ')[2]} ${query.split(' ')[3]}`);
        } else {
          console.log(`❌ Error with query: ${query}`);
          console.log(`   Error: ${error.message}`);
        }
      }
    }
    
    // Update existing internships with default pricing
    console.log('🔄 Updating existing internships with default pricing...');
    await sequelize.query(`
      UPDATE internships 
      SET 
        price = COALESCE(stipend_amount, 0),
        original_price = COALESCE(stipend_amount, 0),
        currency = COALESCE(stipend_currency, 'INR'),
        is_free = CASE WHEN COALESCE(stipend_amount, 0) = 0 THEN TRUE ELSE FALSE END
      WHERE price = 0
    `);
    
    console.log('✅ Internship pricing migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateInternshipPricing()
    .then(() => {
      console.log('🎉 Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = migrateInternshipPricing;
