const { sequelize } = require('../config/database');

const checkPerformance = async () => {
  try {
    await sequelize.authenticate();
    console.log('📊 Database connection established for performance check.');

    // Check active connections
    const [connections] = await sequelize.query('SHOW PROCESSLIST');
    console.log(`\n🔗 Active database connections: ${connections.length}`);
    
    // Check slow queries
    const [slowQueries] = await sequelize.query(`
      SELECT 
        TIME, 
        COMMAND, 
        INFO as sql_text 
      FROM information_schema.processlist 
      WHERE COMMAND != 'Sleep' 
      AND TIME > 1
      ORDER BY TIME DESC
    `);
    
    if (slowQueries.length > 0) {
      console.log('\n⚠️  Slow queries detected:');
      slowQueries.forEach((query, index) => {
        console.log(`${index + 1}. Time: ${query.TIME}s, Command: ${query.COMMAND}`);
        console.log(`   Query: ${query.sql_text ? query.sql_text.substring(0, 100) : 'N/A'}...`);
      });
    } else {
      console.log('\n✅ No slow queries detected');
    }

    // Check table sizes
    const [tableSizes] = await sequelize.query(`
      SELECT 
        table_name,
        ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)',
        table_rows
      FROM information_schema.tables 
      WHERE table_schema = 'mindwareindiadb'
      ORDER BY (data_length + index_length) DESC
      LIMIT 10
    `);
    
    console.log('\n📊 Largest tables:');
    tableSizes.forEach(table => {
      console.log(`   ${table.table_name}: ${table['Size (MB)']} MB (${table.table_rows} rows)`);
    });

    // Check for missing indexes
    const [missingIndexes] = await sequelize.query(`
      SELECT 
        t.table_name,
        t.column_name,
        t.data_type
      FROM information_schema.columns t
      LEFT JOIN information_schema.statistics s 
        ON t.table_name = s.table_name 
        AND t.column_name = s.column_name
        AND t.table_schema = s.table_schema
      WHERE t.table_schema = 'mindwareindiadb'
        AND s.column_name IS NULL
        AND t.column_name IN ('id', 'user_id', 'course_id', 'category_id', 'status', 'created_at')
      ORDER BY t.table_name, t.column_name
    `);
    
    if (missingIndexes.length > 0) {
      console.log('\n⚠️  Potentially missing indexes:');
      missingIndexes.forEach(index => {
        console.log(`   ${index.table_name}.${index.column_name} (${index.data_type})`);
      });
    } else {
      console.log('\n✅ No obvious missing indexes detected');
    }

  } catch (error) {
    console.error('❌ Error checking performance:', error.message);
  } finally {
    await sequelize.close();
  }
};

checkPerformance();
