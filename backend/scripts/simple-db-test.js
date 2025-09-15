const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Testing MySQL connection with mysql2...');
  
  try {
    // Try different connection configurations
    const configs = [
      {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'mindwareindiadb'
      },
      {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'mindwareindiadb'
      },
      {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        // No database specified
      }
    ];

    for (let i = 0; i < configs.length; i++) {
      const config = configs[i];
      console.log(`\n🔄 Trying config ${i + 1}:`, {
        host: config.host,
        port: config.port,
        user: config.user,
        database: config.database || 'none'
      });

      try {
        const connection = await mysql.createConnection(config);
        console.log('✅ Connection successful!');
        
        // Test a simple query
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Query test successful:', rows);
        
        // If no database specified, try to create it
        if (!config.database) {
          console.log('📝 Creating database...');
          await connection.execute("CREATE DATABASE IF NOT EXISTS mindwareindiadb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
          console.log('✅ Database created successfully');
        }
        
        await connection.end();
        console.log('✅ Connection closed successfully');
        return true;
        
      } catch (error) {
        console.log(`❌ Config ${i + 1} failed:`, error.message);
      }
    }
    
    console.log('❌ All connection attempts failed');
    return false;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

testConnection();

