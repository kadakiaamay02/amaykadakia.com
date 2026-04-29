from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from escpos.printer import Usb

# backend/app.py additions
import os
from dotenv import load_dotenv

load_dotenv()  # loads from backend/.env

PASSWORD = os.environ.get('PASSWORD')
p = Usb(0x1d81, 0x5721)


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
    c.execute('''CREATE TABLE IF NOT EXISTS notes
             (id INTEGER PRIMARY KEY AUTOINCREMENT,
              content TEXT NOT NULL,
              due_date TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
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

@app.route('/notes', methods=['GET'])
def get_notes():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM notes ORDER BY created_at DESC')
    notes = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(notes)

@app.route('/notes', methods=['POST'])
def add_note():
    data = request.get_json()
    content = data.get('content')
    due_date = data.get('due_date')

    # Save to DB
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('INSERT INTO notes (content, due_date) VALUES (?, ?)', (content, due_date))
    conn.commit()
    new_id = c.lastrowid
    conn.close()

    # Print the note
    try:
        p = Usb(0x1d81, 0x5721)
        p.set(align='center', bold=True, height=2, width=2)
        p.text("NOTE\n")
        p.set(align='left', bold=False, height=1, width=1)
        p.text("-" * 32 + "\n")
        p.text(f"{content}\n")
        if due_date:
            p.text("-" * 32 + "\n")
            p.text(f"Due: {due_date}\n")
        p.text("-" * 32 + "\n")
        p.cut()
    except Exception as e:
        print(f"Printer error: {e}")

    return jsonify({'id': new_id, 'message': 'Note added!'}), 201

@app.route('/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('DELETE FROM notes WHERE id = ?', (note_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Note deleted!'}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if data.get('password') == PASSWORD:
        return jsonify({'success': True}), 200
    return jsonify({'success': False, 'message': 'Incorrect password.'}), 401

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