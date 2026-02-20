from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
# Enable CORS so your Angular app can make requests to this API
CORS(app)

DATABASE = 'wine_list.db'

def init_db():
    """Creates the database and the wines table if they don't exist."""
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS wines
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  rating INTEGER,
                  description TEXT)''')
    conn.commit()
    conn.close()

# Initialize the database when the script starts
init_db()

@app.route('/wines', methods=['GET'])
def get_wines():
    """Fetches all saved wines from the database."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # This allows us to return rows as dictionaries
    c = conn.cursor()
    c.execute('SELECT * FROM wines')
    
    # Convert rows to a list of dictionaries
    wines = [dict(row) for row in c.fetchall()]
    conn.close()
    
    return jsonify(wines)

@app.route('/wines', methods=['POST'])
def add_wine():
    """Receives a new wine from Angular and saves it to the database."""
    data = request.get_json()
    
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    
    # Insert the new wine into the table using parameterized queries for safety
    c.execute('INSERT INTO wines (name, rating, description) VALUES (?, ?, ?)',
              (data.get('name'), data.get('rating'), data.get('description')))
    
    conn.commit()
    new_id = c.lastrowid
    conn.close()
    
    return jsonify({'id': new_id, 'message': 'Wine added successfully!'}), 201

if __name__ == '__main__':
    # host='0.0.0.0' exposes the server to your local network, 
    # allowing devices across your UniFi setup to access the API.
    app.run(host='0.0.0.0', port=5000, debug=True)