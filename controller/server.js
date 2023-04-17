const express = require('express')
const app = express()
const jsonParser = express.json();
//const cors = require('cors');
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "https://195.161.62.172:8888/",
    user: "kerrickinc@gmail.com",
    database: "kolevatov_es",
    password: "P/8ZfHML+_T/"
});

app.use(express.static(__dirname + "/../frontend/dist"));

connection.connect(function (err) {
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

//app.use(cors());


app.get('/api/clients', function (req, res) {
    connection.query("SELECT * FROM clients",
        function (err, results) {
            if (err) {
                console.log(err);
                res.send([]);
            }
            else res.send(results);
        });
})

app.post('/api/clients', jsonParser, function(req, res) {
    const clients = [req.body.surname, req.body.name, req.body.phone];
    const sql = "INSERT INTO clients (surname, name, phone) VALUES (?, ?, ?)";

    connection.query(sql, clients, function (err, results) {
        if (err) res.send("!ERROR!" + err);
        else res.send(results)
    });

})

app.put('/api/clients', jsonParser, function (req, res) {
    const client = [req.body.surname, req.body.name, req.body.phone, req.body.findsurname, req.body.findname, req.body.findphone];
    const sql = "UPDATE clients SET surname = ?, name = ?, phone = ? WHERE surname = ? AND name = ? AND phone = ?";

    connection.query(sql, client, function (err) {
        if (err) res.send("ERROR");
        else res.send("OK");
    });
})

app.put('/api/articles', jsonParser, function (req, res) {

    const article = [req.body.name, req.body.content];
    const sql = "INSERT INTO articles (name, content) VALUES(?, ?)";

    connection.query(sql, article, function (err, results) {
        if (err) res.send("ERROR");
        else res.send(results);
    });
})

app.post('/api/article', jsonParser, function (req, res) {
    const article = [req.body.name, req.body.content, req.body.id];
    const sql = "UPDATE articles SET name = ?, content = ? WHERE id = ?;";

    console.log(req.body)

    connection.query(sql, article, function (err) {
        if (err) res.send("ERROR");
        else res.send("OK");
    });
})

app.delete('/api/clients', jsonParser, function (req, res) {
    let surname = req.query.surname;
    let name = req.query.name;
    let phone = req.query.phone;

    connection.query("DELETE FROM clients WHERE surname = '"+ surname + "' AND " + "name = '"+ name + "' AND " + "phone = "+phone,
        function (err) {
            if (err) {
                console.log(err);
                res.send("error");
            }
            else res.send("OK");
        });
})

app.delete('/api/article', function (req, res) {
    let id = req.query.id;
    connection.query("DELETE FROM articles WHERE id="+ Number(id),
        function (err) {
            if (err) {
                console.log(err);
                res.send("error");
            }
            else res.send("OK");
        });
})


app.listen(3000, () => { console.log('http://localhost:3000') })