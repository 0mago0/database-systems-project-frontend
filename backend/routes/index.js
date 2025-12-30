var express = require('express');
var router = express.Router();
const db = require('../util/database');
const jwt = require('jsonwebtoken');
const config = require('../config');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/api/product/GetAllProduct', function (req, res, next) {
  var sql = `SELECT p."id", p."name", p."stock_quantity", p."price", p."description",
           i."image" 
           FROM "Product" p
    LEFT JOIN "Image" i ON p."id" = i."product_id" AND i."type" = 0`;
  db.query(sql, function (err, result) {
    if (err) {
      console.log("查詢錯誤");
    } else {
      console.log(result);
    }
    res.send(result.rows.map(row => (
      {
        product_id: row.id,
        Product_name: row.name,
        Quantity: row.stock_quantity,
        Price: row.price,
        Descrip: row.description,
        Image_path: row.image
      }))
    );
  });
  // db.query('SELECT 12 + 34 AS result', function(err, rows, fields) {
  //   if (err) throw err;
  //   console.log('The result is: ', rows[0].result);
  // }); 
});

router.get('/api/member/CheckMemberAccount', function (req, res, next) {

  let account = encodeURIComponent(req.query.account);
  account = account.replace("%40", "@")
  const password = (req.query.password);

  var sql = `SELECT id, email, authority FROM "User" WHERE email = $1 AND password = $2 AND "locked" = 0`;

  db.query(sql, [account, password], function (err, result) {
    if (err) {
      console.log("查詢錯誤");
    } else {
      if (result.rows.length == 0) {
        return res.json({
          success: false,
          message: '帳號或密碼錯誤'
        });
      } else {
        const payload = {
          Member_Id: result.rows[0].id,
          LoggedIn: true,
          Authority: result.rows[0].authority
        }
        console.log(payload)
        const token = jwt.sign(payload, config.secretKey, { expiresIn: '600s' });
        //  res.cookie('LoggedIn', true, {maxAge:600000}); 
        return res.json({
          success: true,  // 標示操作是否成功
          message: '登入成功',
          token
        });
      }
    }
  });
});


router.get('/api/product/GetProductInfo', function (req, res, next) {
  let Product_id = req.query.id;
  const sql = `
    SELECT p."id", p."name", p."stock_quantity", p."price", p."description",
           i."image"
    FROM "Product" p
    LEFT JOIN "Image" i ON p."id" = i."product_id" AND i."type" = 0
    WHERE p."id" = $1
  `;
  db.query(sql, [Product_id], function (err, result) {
    if (err) {
      console.log("查詢錯誤");
    } else {
      console.log(result);
      res.send(result.rows.map(row => (
        {
          product_id: row.id,
          Product_name: row.name,
          Quantity: row.stock_quantity,
          Price: row.price,
          Descrip: row.description,
          Image_path: row.image
        }))
      );
    }
  });
});



router.post('/api/cart/PostProductCart', function (req, res, next) {
  console.log("成功");
  // 從請求中提取會員 ID、商品 ID 和數量
  const { product_id, member_id, quantity } = req.body.param;

  // 確保數量默認為 1，如果沒提供數量
  const productQuantity = quantity || 1;

  const checkSql = `SELECT * FROM "Cart" WHERE "user_id" = $1 AND "product_id" = $2`;

  db.query(checkSql, [member_id, product_id], function (err, result) {
    if (err) {
      console.error("查詢錯誤", err);
      return res.status(500).json({ success: false, message: '資料庫查詢錯誤' });
    }

    if (result.rows.length > 0) {
      // 如果商品已經存在，更新數量
      const updateSql = `UPDATE "Cart" SET "quantity" = "quantity" + $1 WHERE "user_id" = $2 AND "product_id" = $3`;
      db.query(updateSql, [productQuantity, member_id, product_id], function (err, updateResult) {
        if (err) {
          console.error("更新錯誤", err);
          return res.status(500).json({ success: false, message: '更新購物車錯誤' });
        }
        return res.json({ success: true, message: '購物車更新成功' });
      });
    } else {
      // 如果商品不存在於購物車中，插入新的記錄
      const insertSql = `INSERT INTO "Cart" ("user_id", "product_id", "quantity", "added_time") VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`;
      db.query(insertSql, [member_id, product_id, productQuantity], function (err, insertResult) {
        if (err) {
          console.error("插入錯誤", err);
          return res.status(500).json({ success: false, message: '加入購物車錯誤' });
        }
        return res.json({ success: true, message: '商品成功加入購物車' });
      });
    }
  });
});

router.post('/api/member/register', function (req, res) {
  // 獲取註冊表單資料
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const phone = req.body.phone;

  // 驗證所有必需字段
  if (!email || !password || !username || !phone) {
    return res.status(400).json({
      success: false,
      message: '請提供完整的註冊信息 (email, password, username, phone)'
    });
  }

  // 先檢查 email 是否已經存在
  const checkEmailSql = `SELECT email FROM "User" WHERE email = $1`;

  db.query(checkEmailSql, [email], function (err, result) {
    if (err) {
      console.log("查詢錯誤", err);
      return res.json({
        success: false,
        message: '註冊失敗，請稍後再試'
      });
    }

    // 如果 email 已存在
    if (result.rows.length > 0) {
      return res.json({
        success: false,
        message: '此帳號已被註冊'
      });
    }

    // 新增用戶資料
    const insertSql = `
      INSERT INTO "User" (
      "name", 
      "phone", 
      "password", 
      "email",
      "authority"
      ) VALUES ($1, $2, $3, $4, 'user')`;
    db.query(insertSql, [username, phone, password, email], function (err, result) {
      if (err) {
        console.log("新增錯誤", err);
        return res.json({
          success: false,
          message: '註冊失敗，請稍後再試'
        });
      }

      // 註冊成功，回傳成功訊息
      return res.json({
        success: true,
        message: '註冊成功'
      });
    });
  });
});



router.get('/api/cart/GetCartItems', function (req, res, next) {
  const memberId = req.query.member_id;
  const sql = `
      SELECT c."product_id", p."price", c."quantity", i."image", p."name"
      FROM "Cart" c
      JOIN "Product" p ON c."product_id" = p."id"
      LEFT JOIN "Image" i ON p."id" = i."product_id" AND i."type" = 0
      WHERE c."user_id" = $1
  `;
  db.query(sql, [memberId], function (err, result) {
    if (err) {
      console.error("查詢錯誤", err);
      return res.status(500).json({ success: false, message: "伺服器錯誤" });
    }
    return res.json(result.rows.map(row => (
      {
        Product_Id: row.product_id,
        price: row.price,
        Quantity: row.quantity,
        Image_path: row.image,
        Product_name: row.name
      }))
    );
  });
});

router.delete('/api/cart/RemoveCartItem', function (req, res, next) {
  const { member_id, product_id } = req.body;

  if (!member_id || !product_id) {
    return res.status(400).json({ success: false, message: '缺少必要參數' });
  }

  const sql = `DELETE FROM "Cart" WHERE "user_id" = $1 AND "product_id" = $2`;

  db.query(sql, [member_id, product_id], function (err, result) {
    if (err) {
      console.error("刪除錯誤", err);
      return res.status(500).json({ success: false, message: '移除商品失敗' });
    }

    if (result.rowCount > 0) {
      return res.json({ success: true, message: '商品已成功移除' });
    } else {
      return res.json({ success: false, message: '購物車中未找到該商品' });
    }
  });
});

router.delete('/api/cart/ClearCart', function (req, res, next) {
  const memberId = req.query.member_id;

  const sql = `DELETE FROM "Cart" WHERE "user_id" = $1`;

  db.query(sql, [memberId], function (err, result) {
    if (err) {
      console.error("刪除錯誤", err);
      return res.status(500).json({ success: false, message: '移除商品失敗' });
    }

    if (result.rowCount > 0) {
      return res.json({ success: true, message: '商品已成功移除' });
    } else {
      return res.json({ success: false, message: '購物車中未找到該商品' });
    }
  });
});

router.post('/api/order/SubmitOrder', function (req, res, next) {


  const { member_id, items, shippingAddress, paymentMethod, pickupMethod, totalAmount } = req.body;


  // 驗證請求參數
  if (!member_id || !items || !shippingAddress || !paymentMethod || !totalAmount || !pickupMethod) {
    return res.status(400).json({ success: false, message: '缺少必要參數' });
  }

  // 準備 SQL 插入語句
  const insertOrderSql = `
    INSERT INTO "Order" (user_id, address, payment, delivery_method, total_amount, order_date, status)
    VALUES ($1, $2, $3, $4, $5, NOW(),'BackOrder')
    RETURNING "id";
  `;

  // 插入訂單主記錄
  db.query(
    insertOrderSql,
    [member_id, shippingAddress, paymentMethod, pickupMethod, totalAmount],
    function (err, orderResult) {
      if (err) {
        console.error('插入訂單主記錄失敗:', err);
        return res.status(500).json({ success: false, message: '提交訂單失敗' });
      }

      const orderId = orderResult.rows[0].id; // 取得新插入訂單的 ID
      console.log(orderId)
      
      // 逐一插入訂單詳細資料
      const insertOrderDetailsSequentially = async () => {
        for (const item of items) {
          const insertOrderDetailsSql = `
            INSERT INTO "OrderProduct" (order_id, product_id, quantity, price)
            VALUES ($1, $2, $3, $4);
          `;

          try {
            await new Promise((resolve, reject) => {
              db.query(
                insertOrderDetailsSql,
                [orderId, item.Product_Id, item.Quantity, item.price],
                (err) => {
                  if (err) return reject(err);
                  resolve();
                }
              );
            });
          } catch (err) {
            console.error('插入訂單詳細資料失敗:', err);
            return res.status(500).json({ success: false, message: '提交訂單詳細資料失敗' });
          }
        }

        // 所有訂單詳細資料插入完成，更新庫存
        const updateStockSequentially = async () => {
          for (const item of items) {
            const updateStockSql = `UPDATE "Product" SET stock_quantity = stock_quantity - $1 WHERE "id" = $2;`;

            // 使用參數化查詢防止 SQL 注入
            const params = [item.Quantity, item.Product_Id];

            try {
              await new Promise((resolve, reject) => {
                db.query(updateStockSql, params, (err) => {
                  if (err) return reject(err);
                  resolve();
                });
              });
            } catch (error) {
              console.error('更新庫存失敗:', error);
              throw error;
            }
          }
        };

        // 執行逐一更新庫存的函數
        try {
          await updateStockSequentially();
          return res.json({ success: true, message: '訂單提交成功', orderId });
        } catch (err) {
          console.error('更新庫存或提交訂單失敗:', err);
          return res.json({ success: false, message: '提交訂單失敗', orderId });
        }
      };

      // 執行訂單詳細資料插入
      insertOrderDetailsSequentially();
    }
  );
});

router.get('/api/order/GetOrders', function (req, res, next) {
  let member_id = req.query.member_id;

  // 查詢訂單基本資料
  var sql = `
    SELECT O."id", O."total_amount", O."order_date", O."status"
    FROM "Order" O
    WHERE O."user_id" = $1
  `;

  db.query(sql, [member_id], function (err, result) {
    if (err) {
      console.log("查詢錯誤", err);
      res.status(500).send({ success: false, message: "查詢訂單失敗" });
      return;
    } else {
      // 組合訂單和商品資料
      const orders = [];
      result.rows.forEach(order => {
        // 查詢每個訂單的商品詳情
        var itemSql = `
          SELECT p."name", op."quantity", op."price", i."image"
          FROM "OrderProduct" op
          JOIN "Product" p ON p."id" = op."product_id"
          LEFT JOIN "Image" i ON p."id" = i."product_id" AND i."type" = 0
          WHERE op."order_id" = $1
        `;

        db.query(itemSql, [order.id], function (err, itemResult) {
          if (err) {
            console.log("查詢商品詳情錯誤", err);
          } else {
            // 組合商品資料到訂單的 items 陣列
            order.items = itemResult.rows;
            //console.log(order)

            // 將組合好的訂單推入 orders 陣列
            orders.push(order);

            // 當所有訂單資料和商品資料都查詢完成後回傳結果
            if (orders.length === result.rows.length) {
              console.log(orders)
              res.send({ success: true, data: orders.map(order => ({
                Order_Id: order.id,
                Fee: order.total_amount,
                Order_date: order.order_date,
                Status: order.status,
                items: order.items.map(item => ({
                  Product_name: item.name,
                  Quantity: item.quantity,
                  Price: item.price,
                  Image_path: item.image
                })
                )
              })) });
            }
          }
        });
      });
    }
  });
});


module.exports = router;
