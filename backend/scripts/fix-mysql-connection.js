const mysql = require('mysql2/promise');

async function fixMySQLConnection() {
  console.log('🔧 Attempting to fix MySQL connection...');
  
  try {
    // Try to connect without specifying a database first
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      // Don't specify database initially
    });
    
    console.log('✅ Connected to MySQL server successfully');
    
    // Check if our database exists
    const [databases] = await connection.execute("SHOW DATABASES LIKE 'mindwareindiadb'");
    
    if (databases.length > 0) {
      console.log('✅ Database "mindwareindiadb" exists');
      
      // Try to connect to the specific database
      await connection.end();
      
      const dbConnection = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'mindwareindiadb'
      });
      
      console.log('✅ Connected to "mindwareindiadb" database successfully');
      
      // Test a simple query
      const [rows] = await dbConnection.execute('SELECT 1 as test');
      console.log('✅ Query test successful:', rows);
      
      await dbConnection.end();
      console.log('🎉 MySQL connection is working!');
      return true;
      
    } else {
      console.log('📝 Database "mindwareindiadb" does not exist. Creating it...');
      await connection.execute("CREATE DATABASE mindwareindiadb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
      console.log('✅ Database "mindwareindiadb" created successfully');
      
      await connection.end();
      return true;
    }
    
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
    
    if (error.message.includes('ETIMEDOUT')) {
      console.log('💡 Suggestion: MySQL might not be running or firewall is blocking connection');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Suggestion: MySQL service is not running');
    } else if (error.message.includes('ER_ACCESS_DENIED_ERROR')) {
      console.log('💡 Suggestion: Check username/password');
    } else if (error.message.includes('InnoDB')) {
      console.log('💡 Suggestion: InnoDB storage engine issue - try restarting MySQL');
    }
    
    return false;
  }
}

fixMySQLConnection();

