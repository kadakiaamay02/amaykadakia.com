from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import sqlite3
import os
from dotenv import load_dotenv
from escpos.printer import Usb

load_dotenv()

PASSWORD = os.environ.get('PASSWORD')

app = Flask(__name__)
ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', '*')
CORS(app, origins=ALLOWED_ORIGINS)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024  # 16 KB max request body

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per hour", "50 per minute"],
    storage_uri="memory://",
)

DATABASE = 'wine_list.db'

def init_db():
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

init_db()

def print_to_printer(content, due_date=None, created_at=None):
    p = None
    try:
        p = Usb(0x1d81, 0x5721)

        # Header
        p.set(align='center', bold=True, height=2, width=2)
        p.text("NOTE\n")
        p.text("================================\n")
        

        # Content
        p.set(align='left', bold=False, height=1, width=1)
        p.text("\n")
        p.text(f"{content}\n")
        p.text("\n")

        # Divider
        p.text("--------------------------------\n")

        # Metadata
        if due_date:
            p.set(align='left', bold=True, height=1, width=1)
            p.text("DUE DATE: ")
            p.set(align='left', bold=False, height=1, width=1)
            p.text(f"  {due_date}\n")

        if created_at:
            p.set(align='left', bold=True, height=1, width=1)
            p.text("ADDED: ")
            p.set(align='left', bold=False, height=1, width=1)
            p.text(f"  {created_at}\n")

        # Footer
        p.text("================================\n")
        p.text("\n")
        p.cut()

    except Exception as e:
        print(f"Printer error: {e}")
    finally:
        try:
            if p:
                p.close()
        except:
            pass

@app.route('/wines', methods=['GET'])
def get_wines():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM wines')
    wines = [dict(row) for row in c.fetchall()]
    conn.close()
    return jsonify(wines)

@app.route('/wines', methods=['POST'])
def add_wine():
    data = request.get_json(silent=True) or {}
    name = data.get('name', '').strip()
    rating = data.get('rating')
    description = data.get('description', '')

    if not name:
        return jsonify({'error': 'name is required'}), 400
    if len(name) > 200:
        return jsonify({'error': 'name too long'}), 400
    if rating is not None and (not isinstance(rating, int) or not (1 <= rating <= 10)):
        return jsonify({'error': 'rating must be an integer between 1 and 10'}), 400
    if description and len(description) > 1000:
        return jsonify({'error': 'description too long'}), 400

    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('INSERT INTO wines (name, rating, description) VALUES (?, ?, ?)',
              (name, rating, description))
    conn.commit()
    new_id = c.lastrowid
    conn.close()
    return jsonify({'id': new_id, 'message': 'Wine added successfully!'}), 201

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
    data = request.get_json(silent=True) or {}
    content = data.get('content', '').strip()
    due_date = data.get('due_date')

    if not content:
        return jsonify({'error': 'content is required'}), 400
    if len(content) > 2000:
        return jsonify({'error': 'content too long'}), 400
    if due_date and len(str(due_date)) > 50:
        return jsonify({'error': 'due_date invalid'}), 400

    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('INSERT INTO notes (content, due_date) VALUES (?, ?)', (content, due_date))
    conn.commit()
    new_id = c.lastrowid

    # Fetch the created_at that the DB generated
    c.execute('SELECT created_at FROM notes WHERE id = ?', (new_id,))
    created_at = c.fetchone()['created_at']
    conn.close()

    print_to_printer(content, due_date, created_at)

    return jsonify({'id': new_id, 'message': 'Note added!'}), 201

@app.route('/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('DELETE FROM notes WHERE id = ?', (note_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Note deleted!'}), 200

@app.route('/webhook/unifi', methods=['POST'])
def unifi_webhook():
    # Handle empty body or any format UniFi sends
    data = request.get_json(silent=True) or request.form.to_dict() or {}
    
    content = "🚨 UniFi Alert - Door Sensor Triggered"

    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('INSERT INTO notes (content, due_date) VALUES (?, ?)', (content, None))
    conn.commit()
    new_id = c.lastrowid
    c.execute('SELECT created_at FROM notes WHERE id = ?', (new_id,))
    created_at = c.fetchone()['created_at']
    conn.close()

    print_to_printer(content, None, created_at)

    return jsonify({'message': 'OK'}), 200

@app.route('/notes/add', methods=['POST'])
def add_note_only():
    data = request.get_json(silent=True) or {}
    content = data.get('content', '').strip()
    due_date = data.get('due_date')

    if not content:
        return jsonify({'error': 'content is required'}), 400
    if len(content) > 2000:
        return jsonify({'error': 'content too long'}), 400
    if due_date and len(str(due_date)) > 50:
        return jsonify({'error': 'due_date invalid'}), 400

    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('INSERT INTO notes (content, due_date) VALUES (?, ?)', (content, due_date))
    conn.commit()
    new_id = c.lastrowid
    conn.close()

    return jsonify({'id': new_id, 'message': 'Note added!'}), 201

@app.route('/notes/<int:note_id>/print', methods=['POST'])
def print_note(note_id):
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute('SELECT * FROM notes WHERE id = ?', (note_id,))
    note = c.fetchone()
    conn.close()

    if not note:
        return jsonify({'error': 'Note not found'}), 404

    print_to_printer(note['content'], note['due_date'], note['created_at'])

    return jsonify({'message': 'Note printed!'}), 200

@app.route('/login', methods=['POST'])
@limiter.limit("5 per minute; 20 per hour")
def login():
    data = request.get_json(silent=True) or {}
    if data.get('password') == PASSWORD:
        return jsonify({'success': True}), 200
    return jsonify({'success': False, 'message': 'Incorrect password.'}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=os.environ.get('FLASK_DEBUG', 'false').lower() == 'true')