const res = require('express/lib/response');
const connectionObject = require('./data/connectionInfo');
const pgp = require("pg-promise")(/*options*/);
var db = pgp(`postgres://${connectionObject.user}:${connectionObject.password}@${connectionObject.host}:${connectionObject.port}/`);

const express = require('express');
const cors = require('./middleware/cors');
const logger = require('./middleware/logger');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use([logger, cors]);

app.post('/insertOrder', async(req, res) => {
    const customerName = req.body.customer_name;
    if( customerName ){
        const result = await db.one(`INSERT INTO orders(customer_name, order_status) VALUES('${customerName}', '1') RETURNING id, customer_name;`);
        const { id, customer_name } = result;
        res.status(200).json({id: id, customer_name: customer_name});
    }else{
        res.status(404).json('Cannot insert elements in database.');
    }
});

app.get('/listOrders', async (req, res) => {
    const result = await db.many('SELECT * FROM orders;');
    console.log(result);
    res.status(200).json(result);
});

app.delete('/deliver/:id', async(req, res) => {
    const result = await db.one(`DELETE FROM orders WHERE id = ${req.params.id} RETURNING id`);
    if( result ){
        res.status(201).json({message: 'Deleted!'});
    }else{
        res.status(404).json({message: 'Order not found'});
    }
});

app.put('/readyOrder/:id', async(req, res) => {
    const idToInt = parseInt(req.params.id)
    const result = await db.one(`UPDATE orders SET order_status = '2' WHERE id = ${idToInt} RETURNING id`);
    if( result ){
        res.status(200).json({message: result});
    }else{
        res.status(404).json({message: 'Order not found'});
    }
});

app.listen(8081, ()=>{
    console.log('Started!');
});