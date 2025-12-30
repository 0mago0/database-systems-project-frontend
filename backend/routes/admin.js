var express = require('express');
var router = express.Router();
const db = require('../util/database');


// 管理員取得所有會員資料
router.get('/api/adminGetMembers', (req, res) => {
    const query = "SELECT \"id\", \"name\", \"email\", \"authority\", \"locked\" FROM \"User\" WHERE \"authority\" IN ('user', 'seller')";
    db.query(query, (err, results) => {
        if (err) {
            console.error('Failed to fetch members:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results.rows.map(row => ({
            Member_Id: row.id,
            Username: row.name,
            Email: row.email,
            Authority: row.authority,
            Locked: row.locked
        })));
    });
});

// 管理員切換使用者locked狀態
router.post("/api/locked", (req, res) => {
  const { memberId, lock } = req.body;
  
  // 驗證輸入參數
  if (!memberId || typeof lock !== "boolean") {
    return res.status(400).send("Invalid input: memberId and lock are required");
  }
  
  const query = "UPDATE \"User\" SET \"locked\" = $1 WHERE \"id\" = $2";
  db.query(query, [lock ? 1 : 0, memberId], (err, result) => {
    if (err) {
    console.error("Failed to update Locked status:", err);
    return res.status(500).send("Internal server error");
    }
    if (result.rowCount === 0) {
    return res.status(404).send("User not found");
    }
    res.send({
    message: lock ? "User account locked" : "User account unlocked",
    memberId,
    newStatus: lock
    });
  });
  });

module.exports = router;
