var express = require('express');
var router = express.Router();
const db = require('../util/database');


router.post("/api/updateProduct", (req, res) => {
  const Product_name = req.body.name;
  const Price = req.body.price;
  const Quantity = req.body.quantity;
  const Descrip = req.body.description;
  const Base64 = req.body.base64;
  const memberId = req.body.memberid;

  // 確保必須欄位不為空
  if (!Product_name || !Price || !Quantity || Descrip === undefined) {
    return res.status(400).json({
      success: false,
      message: "請提供完整的商品資訊",
    });
  }

  // 新增商品資訊的 SQL 語句
  const sql = `
            INSERT INTO "Product"("name","stock_quantity","price","category","description","user_id") 
            VALUES(
            $1,
            $2,
            $3,
            0,
            $4,
            $5
            ) 
            RETURNING "id"
        `
    ;
  // 執行 SQL 插入操作
  db.query(sql, [Product_name, Quantity, Price, Descrip, memberId], (err, result) => {
    if (err) {
      console.error("新增商品失敗:", err);
      return res.status(500).json({
        success: false,
        message: "新增商品資訊失敗，請稍後再試",
      });
    }

    const productId = result.rows[0].id;

    // 如果有上傳圖片，插入到 Image 表
    if (Base64) {
      const imageSql = `INSERT INTO "Image"("product_id","image","type") VALUES($1,$2,0)`;
      db.query(imageSql, [productId, Base64], (imgErr) => {
        if (imgErr) {
          console.error("上傳圖片失敗:", imgErr);
          // 圖片上傳失敗但商品已創建，返回部分成功
          return res.status(500).json({
            success: false,
            message: "商品創建成功，但圖片上傳失敗",
            productId: productId,
          });
        }

        // 商品和圖片都成功
        res.json({
          success: true,
          message: "商品和圖片上傳成功",
          productId: productId,
        });
      });
    } else {
      // 沒有圖片，只返回商品創建成功
      res.json({
        success: true,
        message: "商品創建成功（無圖片）",
        productId: productId,
      });
    }
  });
});

router.put("/api/updateProduct", (req, res) => {
  const Product_name = req.body.Product_name;
  const Price = req.body.Price;
  const Quantity = req.body.Quantity;
  const Descrip = req.body.Descrip;
  const Base64 = req.body.Image_path;
  const Product_Id = req.body.Product_Id;

  // 確保必須欄位不為空
  if (!Product_name || !Price || !Quantity || Descrip === undefined) {
    return res.status(400).json({
      success: false,
      message: "請提供完整的商品資訊",
    });
  }

  // 更新商品資訊的 SQL 語句
  const sql = `UPDATE "Product" SET "name" = $1, "price" = $2, "stock_quantity" = $3, "description" = $4 WHERE "id" = $5`;
  const values = [Product_name, Price, Quantity, Descrip, Product_Id];
  // 執行 SQL 更新操作
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("更新商品失敗:", err);
      return res.status(500).json({
        success: false,
        message: "更新商品資訊失敗，請稍後再試",
      });
    }

    // 檢查是否有更新的行數
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "未找到指定的商品，無法更新",
      });
    }

    // 更新成功
    res.json({
      success: true,
      message: "商品資訊更新成功",
    });
  }
  );
});

router.get('/api/products', function (req, res) {
  const sellerId = req.query.sellerId;
  const sql = `
    SELECT p."id", p."name", p."stock_quantity", p."price", p."description",
           i."image"
    FROM "Product" p
    LEFT JOIN "Image" i ON p."id" = i."product_id" AND i."type" = 0
    WHERE p."user_id" = $1
  `;

  db.query(sql, [sellerId], function (err, result) {
    if (err) {
      console.log("查詢錯誤:", err);
      return res.json({
        success: false,
        message: '獲取商品列表失敗'
      });
    }
    res.json({
      success: true,
      data: result.rows.map(row => (
        {
          Product_Id: row.id,
          Product_name: row.name,
          Quantity: row.stock_quantity,
          Price: row.price,
          Descrip: row.description,
          Image_path: row.image
        }))
    });
  });
});

router.get('/api/products/:id', function (req, res) {
  const productId = req.params.id;
  const sql = `
    SELECT p."id", p."name", p."stock_quantity", p."price", p."description",
           i."image"
    FROM "Product" p
    LEFT JOIN "Image" i ON p."id" = i."product_id" AND i."type" = 0
    WHERE p."id" = $1
  `;

  db.query(sql, [productId], function (err, result) {
    if (err) {
      console.log("查詢錯誤:", err);
      return res.json({
        success: false,
        message: '獲取商品詳情失敗'
      });
    }
    res.json({
      success: true,
      data: {
        Product_Id: result.rows[0].id,
        Product_name: result.rows[0].name,
        Quantity: result.rows[0].stock_quantity,
        Price: result.rows[0].price,
        Descrip: result.rows[0].description,
        Image_path: result.rows[0].image
      }
    });
  });
});

// 編輯商品


router.delete("/api/products/:id", (req, res) => {
  const productId = req.params.id;

  // 先刪除圖片
  const deleteImageSql = "DELETE FROM \"Image\" WHERE \"product_id\" = $1";
  db.query(deleteImageSql, [productId], (imgErr) => {
    if (imgErr) {
      console.log("刪除圖片錯誤:", imgErr);
    }

    // 再刪除商品
    const sql = "DELETE FROM \"Product\" WHERE \"id\" = $1";
    db.query(sql, [productId], (err, result) => {
      if (err) {
        console.error("刪除商品失敗:", err);
        return res.status(500).json({
          success: false,
          message: "刪除商品失敗，請稍後再試。",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "未找到指定的商品，無法刪除。",
        });
      }

      res.json({
        success: true,
        message: "商品已成功刪除！",
      });
    });
  });
});

// 上傳或更新商品圖片
router.post("/api/products/:productId/image", (req, res) => {
  const productId = req.params.productId;
  const { base64 } = req.body;

  if (!base64) {
    return res.status(400).json({
      success: false,
      message: "圖片資料不能為空",
    });
  }

  // 檢查圖片是否已存在
  const checkSql = "SELECT \"id\" FROM \"Image\" WHERE \"product_id\" = $1 AND \"type\" = 0";
  db.query(checkSql, [productId], (checkErr, checkResult) => {
    if (checkErr) {
      console.log("檢查圖片錯誤:", checkErr);
      return res.status(500).json({
        success: false,
        message: "檢查圖片失敗",
      });
    }

    if (checkResult.rows.length > 0) {
      // 更新現有圖片
      const updateSql = "UPDATE \"Image\" SET \"image\" = $1 WHERE \"product_id\" = $2 AND \"type\" = 0";
      db.query(updateSql, [base64, productId], (updateErr) => {
        if (updateErr) {
          console.log("更新圖片錯誤:", updateErr);
          return res.status(500).json({
            success: false,
            message: "更新圖片失敗",
          });
        }
        res.json({
          success: true,
          message: "圖片更新成功",
        });
      });
    } else {
      // 插入新圖片
      const insertSql = "INSERT INTO \"Image\"(\"product_id\",\"image\",\"type\") VALUES($1,$2,0)";
      db.query(insertSql, [productId, base64], (insertErr) => {
        if (insertErr) {
          console.log("上傳圖片錯誤:", insertErr);
          return res.status(500).json({
            success: false,
            message: "上傳圖片失敗",
          });
        }
        res.json({
          success: true,
          message: "圖片上傳成功",
        });
      });
    }
  });
});

// 刪除商品圖片
router.delete("/api/products/:productId/image", (req, res) => {
  const productId = req.params.productId;

  const sql = "DELETE FROM \"Image\" WHERE \"product_id\" = $1 AND \"type\" = 0";
  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.log("刪除圖片錯誤:", err);
      return res.status(500).json({
        success: false,
        message: "刪除圖片失敗",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "未找到該商品的圖片",
      });
    }

    res.json({
      success: true,
      message: "圖片已成功刪除",
    });
  });
});

router.get('/api/orders/GetALLOrders', function (req, res, next) {
  console.log(req.query)
  let user_id = req.query.memberid;
  var sql = `SELECT o."id", p."name", op."quantity", o."order_date", u."name" AS username, o."status"
              FROM "Order" o
              JOIN "OrderProduct" op ON op."order_id" = o."id"
              JOIN "Product" p ON p."id" = op."product_id" AND p."user_id" = $1
              JOIN "User" u ON o."user_id" = u."id"`;

  db.query(sql, [user_id], function (err, result) {
    if (err) {
      res.json({
        success: false,
        message: '獲取訂單列表失敗'
      });
    } else {
      res.json({
        success: true,
        data: result.rows.map(row => (
          {
            Order_Id: row.id,
            username: row.username,
            Product_name: row.name,
            quantity: row.quantity,
            Status: row.status,
            order_date: row.order_date
          }))
      });
    }
  });
})



module.exports = router;
