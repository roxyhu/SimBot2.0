var express = require('express');
const spawn = require('child_process').spawn;
var app = require('express')();
const session = require('express-session');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require("mysql");
let bot_list = [];
let bot_already_use = [];
let uiduser = null;
let domain_name = 0;
let datasoundreturn = 0;
let count = 0;
var con = mysql.createConnection({
  host: "140.125.32.128",
  user: "root",
  password: "",
  database: "yunbot",
  port: 3306
});

con.connect(function (err) {
  if (err) {
    console.log('connecting error');
    return;
  }
  console.log('connecting success');
});
app.use('/', express.static(__dirname + '/www'));


// 加上 credentials 後，origin 必須設置網址，不能為 * (通用)

io.on('connection', function (socket) { // 使用者連線時觸發
  con.query("select * from data where uidstatus=0 ", function (err, rs) {
    if (err) throw err;
    // console.log(rs);
    if (rs == "") {
      console.log("BOT已滿")
    }
    else {
      socket.on('uidstatus_use', function (data) {
        uiduser = data.uidstatus_use
        con.query('update data set uidstatus = 1,leave_user=0 where uid=?', [uiduser], (err, rs) => {                        //查詢資料庫設定值
          if (err) console.log(err);
          // console.log(rs)
        });
      })
      socket.emit('uid', { 'uid': uiduser });
      console.log(uiduser)
      // uiduser = rs[0].uid
    }
  });

  setInterval(function () {
    con.query("select * from data where uidstatus=1 ", function (err, rs) {
      if (err) throw err;
      bot_already_use = [];
      // console.log(rs);
      for (i = 0; i < rs.length; i++) {
        bot_already_use[i] = rs[i].uid
      }
      socket.emit('bot_already_use', { 'bot_already_use': bot_already_use });
      // console.log(bot_already_use)
      con.query("select * from data where uidstatus=0 ", function (err, rs1) {
        if (err) throw err;
        bot_list = [];
        // console.log(rs);
        for (i = 0; i < rs1.length; i++) {
          bot_list[i] = rs1[i].uid

        }
        let user_amount = 0;
        user_amount = rs.length + rs1.length

        socket.emit('bot_list', { 'bot_list': bot_list, 'user_amount': user_amount });
        // console.log(bot_list)
      });
    });
  }, 250)




  // setTimeout(function () {
  //   con.query('update data set uidstatus = 1 where uid=?', [uiduser], (err, rs) => {                        //查詢資料庫設定值//2021/2/3，測試中暫時關閉
  //     if (err) console.log(err);
  //     console.log(rs)
  //   });
  // }, 1000)  uidstatus = 1 AND


  setInterval(function update_bot() {
    for (i = 0; i < bot_already_use.length; i++) {
      con.query('select * from data where status = 1 AND uid=?', [bot_already_use[i]], (err, rs) => {                        //查詢資料庫設定值
        if (err) console.log(err);
        // console.log(rs)
        if (rs != "") {
          io.emit(rs[0].uid, { 'data': rs[0].location, 'response': rs[0].response, 'score': rs[0].score, 'similar_words': rs[0].similar_words });
          console.log(rs[0].location)
          console.log('bot:' + rs[0].uid, 'status:' + rs[0].status)
          console.log(count += 1)
          con.query('update data set status = 0 where uid=?', [rs[0].uid], (err, rs1) => {                        //查詢資料庫設定值
            if (err) console.log(err);
            // console.log(rs1)
            console.log('status:0')
          });
        }
      });
    }

  }, 3000)

  socket.on('leave_user', function (data) {
    con.query('update data set leave_user=? where uid=?', [data.leave_user, data.uidstatus_no_use], (err, rs) => {                        //查詢資料庫設定值
      if (err) console.log(err);
      // console.log(rs)
    });
  })
  socket.on('uidstatus_no_use', function (data) {
    con.query('update data set uidstatus = 0 where uid=?', [data.uidstatus_no_use], (err, rs) => {                        //查詢資料庫設定值
      if (err) console.log(err);
      // console.log(rs)
    });
  });
  socket.on('domain', function (data) {
    domain_name = data.domain
    console.log(domain_name)
  })
  socket.emit('domain_name', { 'domain_name': domain_name });

  socket.on('user_reset', function (data) {
    con.query('update data set uidstatus=?', [data.user_reset], (err, rs) => {                        //查詢資料庫設定值
      if (err) console.log(err);
      // console.log(rs)
    });
  })

})
http.listen(3000, function () {
  console.log('listening on *:3000');
});