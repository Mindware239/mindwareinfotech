const { Sequelize } = require('sequelize');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  // First, try to connect without specifying a database
  const sequelize = new Sequelize('', 'root', '', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: console.log
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL server successfully');
    
    // Check if the database exists
    const [results] = await sequelize.query("SHOW DATABASES LIKE 'mindwareindiadb'");
    
    if (results.length === 0) {
      console.log('📝 Database "mindwareindiadb" does not exist. Creating it...');
      await sequelize.query("CREATE DATABASE mindwareindiadb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
      console.log('✅ Database "mindwareindiadb" created successfully');
    } else {
      console.log('✅ Database "mindwareindiadb" already exists');
    }
    
    // Now test connection to the specific database
    const dbSequelize = new Sequelize('mindwareindiadb', 'root', '', {
      host: 'localhost',
      port: 3306,
      dialect: 'mysql',
      logging: false
    });
    
    await dbSequelize.authenticate();
    console.log('✅ Connected to "mindwareindiadb" database successfully');
    
    await sequelize.close();
    await dbSequelize.close();
    
    console.log('🎉 Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('Full error:', error);
  }
}

testDatabaseConnection();

