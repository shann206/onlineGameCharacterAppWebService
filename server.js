const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    WaitForConnection: true,
    connectionLimit: 100,
    queueLimit: 0,
};

const app = express();
app.use(express.json());

app.listen(port, () => {
    console.log('Server running on port', port);
});

app.get('/allcharacters', async(req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.game_character');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for allcharacters' });
    }
})

app.post('/addcharacter', async(req, res) => {
    const { game_name, character_name, character_img } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO game_character (game_name, character_name, character_img) VALUES (?,?,?)', [game_name, character_name, character_img]);
        res.status(201).json({message: 'Character '+character_name+' added successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add character '+character_name})
    }
})

app.post('/updatecharacter/:id', async(req, res) => {
    const id = req.params.id;
    const { game_name, character_name, character_img } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('UPDATE game_character SET game_name = ?, character_name = ?, character_img = ? WHERE id = ?', [game_name, character_name, character_img])
        res.status(201).json({message: 'Character '+character_name+' updated successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update character '+character_name})
    }
})

app.post('/deletecharacter/:id', async(req, res) => {
    const id = req.params.id;
    const { game_name, character_name, character_img } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM game_character WHERE id = ?', [game_name, character_name, character_img])
        res.status(201).json({message: 'Character '+character_name+' deleted successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete character '+character_name})
    }
})