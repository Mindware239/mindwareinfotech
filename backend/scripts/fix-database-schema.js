const { sequelize } = require('../config/database');
const { QueryInterface } = require('sequelize');

async function fixDatabaseSchema() {
  try {
    console.log('🔧 Starting database schema fixes...');
    
    // Check if course_id column exists in enrollments table
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'mindwareindiadb' 
      AND TABLE_NAME = 'enrollments' 
      AND COLUMN_NAME = 'course_id'
    `);
    
    if (results.length === 0) {
      console.log('➕ Adding course_id column to enrollments table...');
      try {
        await sequelize.query(`
          ALTER TABLE enrollments 
          ADD COLUMN course_id INT NULL
        `);
        console.log('✅ course_id column added successfully');
        
        // Add index if it doesn't exist
        try {
          await sequelize.query(`
            ALTER TABLE enrollments 
            ADD INDEX idx_enrollments_course_id (course_id)
          `);
          console.log('✅ Index added successfully');
        } catch (indexError) {
          if (indexError.message.includes('Duplicate key name')) {
            console.log('✅ Index already exists');
          } else {
            throw indexError;
          }
        }
        
        // Add foreign key if it doesn't exist
        try {
          await sequelize.query(`
            ALTER TABLE enrollments 
            ADD FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
          `);
          console.log('✅ Foreign key added successfully');
        } catch (fkError) {
          if (fkError.message.includes('Duplicate key name')) {
            console.log('✅ Foreign key already exists');
          } else {
            throw fkError;
          }
        }
      } catch (error) {
        if (error.message.includes('Duplicate column name')) {
          console.log('✅ course_id column already exists');
        } else {
          throw error;
        }
      }
    } else {
      console.log('✅ course_id column already exists');
    }
    
    // Check if user_id column exists in enrollments table
    const [userResults] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'mindwareindiadb' 
      AND TABLE_NAME = 'enrollments' 
      AND COLUMN_NAME = 'user_id'
    `);
    
    if (userResults.length === 0) {
      console.log('➕ Adding user_id column to enrollments table...');
      try {
        await sequelize.query(`
          ALTER TABLE enrollments 
          ADD COLUMN user_id INT NULL
        `);
        console.log('✅ user_id column added successfully');
        
        // Add index if it doesn't exist
        try {
          await sequelize.query(`
            ALTER TABLE enrollments 
            ADD INDEX idx_enrollments_user_id (user_id)
          `);
          console.log('✅ User index added successfully');
        } catch (indexError) {
          if (indexError.message.includes('Duplicate key name')) {
            console.log('✅ User index already exists');
          } else {
            throw indexError;
          }
        }
        
        // Add foreign key if it doesn't exist
        try {
          await sequelize.query(`
            ALTER TABLE enrollments 
            ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
          `);
          console.log('✅ User foreign key added successfully');
        } catch (fkError) {
          if (fkError.message.includes('Duplicate key name')) {
            console.log('✅ User foreign key already exists');
          } else {
            throw fkError;
          }
        }
      } catch (error) {
        if (error.message.includes('Duplicate column name')) {
          console.log('✅ user_id column already exists');
        } else {
          throw error;
        }
      }
    } else {
      console.log('✅ user_id column already exists');
    }
    
    // Check if course_id column exists in payments table
    const [paymentCourseResults] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'mindwareindiadb' 
      AND TABLE_NAME = 'payments' 
      AND COLUMN_NAME = 'course_id'
    `);
    
    if (paymentCourseResults.length === 0) {
      console.log('➕ Adding course_id column to payments table...');
      await sequelize.query(`
        ALTER TABLE payments 
        ADD COLUMN course_id INT NULL,
        ADD INDEX idx_payments_course_id (course_id),
        ADD FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
      `);
      console.log('✅ course_id column added to payments table');
    } else {
      console.log('✅ course_id column already exists in payments table');
    }
    
    // Update existing enrollments to link with courses based on courseInterest
    console.log('🔄 Updating existing enrollments with course links...');
    const [enrollments] = await sequelize.query(`
      SELECT id, course_interest 
      FROM enrollments 
      WHERE course_id IS NULL AND course_interest IS NOT NULL
    `);
    
    for (const enrollment of enrollments) {
      const [courses] = await sequelize.query(`
        SELECT id FROM courses 
        WHERE category = ? 
        LIMIT 1
      `, {
        replacements: [enrollment.course_interest]
      });
      
      if (courses.length > 0) {
        await sequelize.query(`
          UPDATE enrollments 
          SET course_id = ? 
          WHERE id = ?
        `, {
          replacements: [courses[0].id, enrollment.id]
        });
        console.log(`✅ Linked enrollment ${enrollment.id} to course ${courses[0].id}`);
      }
    }
    
    // Update existing payments to link with enrollments
    console.log('🔄 Updating existing payments with enrollment links...');
    try {
      const [payments] = await sequelize.query(`
        SELECT p.id, p.student_email, e.id as enrollment_id, e.course_id
        FROM payments p
        LEFT JOIN enrollments e ON p.student_email = e.email
        WHERE p.enrollment_id IS NULL AND p.student_email IS NOT NULL
      `);
      
      for (const payment of payments) {
        if (payment.enrollment_id) {
          await sequelize.query(`
            UPDATE payments 
            SET enrollment_id = ?, course_id = ?
            WHERE id = ?
          `, {
            replacements: [payment.enrollment_id, payment.course_id, payment.id]
          });
          console.log(`✅ Linked payment ${payment.id} to enrollment ${payment.enrollment_id}`);
        }
      }
    } catch (error) {
      console.log('⚠️ Payment linking skipped - column structure mismatch:', error.message);
    }
    
    console.log('🎉 Database schema fixes completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing database schema:', error);
    throw error;
  }
}

// Run the migration
if (require.main === module) {
  fixDatabaseSchema()
    .then(() => {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = fixDatabaseSchema;
