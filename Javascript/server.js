const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const port = 3000;

// ตั้งค่าให้ Express ใช้ body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ตั้งค่าการเชื่อมต่อกับฐานข้อมูล
const config = {
  user: 'blockchainViewOnlyUser',
  password: 'blockchainViewOnlyP@ssw0rd!2024',
  server: '172.17.63.63',
  database: 'MIG_LMS_20191206',
  port: 1433,
  options: {
    encrypt: false,
    enableArithAbort: true
    }
};
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();
app.post('/your_api_endpoint', (req, res) => {
    pool.connect(err => {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        pool.request().query('SELECT COMPANY_FULL_NAME, LICENSE_TYPE, LICENSE_SERVICE_DESCRIPTION, LICENSE_NO, EFFECTIVE_YEAR, ISSUE_LICENSE_DATE, EXPIRE_DATE, license_file_category, license_file_PATH, REMARK FROM VIEW_LICENSE_FOR_BLOCKCHAIN', (err, result) => {
            if (err) {
                console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            res.json(result.recordset);
            pool.close(err => {
                if (err) {
                    console.error('เกิดข้อผิดพลาดในการปิด connection pool:', err);
                }});
        });
    });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
