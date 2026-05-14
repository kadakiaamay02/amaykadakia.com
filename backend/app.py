from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from dotenv import load_dotenv
from escpos.printer import Usb
import time
from datetime import datetime
import subprocess
import threading

# Store timers so we can cancel them if door closes
door_timers = {}

def door_open_alert(device_mac, device_name, opened_time):
    """Called after 30 mins if door is still open"""
    if device_mac in open_doors:  # still open
        subject = f"⚠️ {device_name} left open for 30 mins"
        body = f"{device_name} has been open for 30 minutes.\n\nOpened: {opened_time}\n\nPlease check the door."
        send_email(subject, body)
        print(f"Alert sent: {device_name} still open after 30 mins", flush=True)


# Map device MAC to friendly name
DEVICE_NAMES = {
    '8CEDE1B2D4F8': 'Garage Door',
    # add your other MACs here
}

# Track open doors: {device_mac: timestamp_when_opened}
open_doors = {}

load_dotenv()

PASSWORD = os.environ.get('PASSWORD')

app = Flask(__name__)
CORS(app)

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

def send_email(subject, body, to="amaykadakia@gmail.com"):
    try:
        result = subprocess.run(
            ['msmtp', '--file=/home/laezy/.msmtprc', to],
            input=f"Subject: {subject}\n\n{body}",
            capture_output=True,
            text=True
        )
        print(f"Email sent: {result.returncode}, stdout: {result.stdout}, stderr: {result.stderr}", flush=True)
    except Exception as e:
        print(f"Email error: {e}", flush=True)

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

def print_unifi_alert(content):
    p = None
    try:
        p = Usb(0x1d81, 0x5721)

        # Header
        p.set(align='center', bold=True, height=2, width=2)
        

        # Content
        p.set(align='left', bold=False, height=1, width=1)

        p.text(f"{content}\n")
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
    data = request.get_json()
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('INSERT INTO wines (name, rating, description) VALUES (?, ?, ?)',
              (data.get('name'), data.get('rating'), data.get('description')))
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
    data = request.get_json()
    content = data.get('content')
    due_date = data.get('due_date')

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
    data = request.get_json(silent=True) or {}
    print(f"UniFi webhook received: {data}", flush=True)

    alarm = data.get('alarm', {})
    triggers = alarm.get('triggers', [])

    if not triggers:
        return jsonify({'message': 'OK'}), 200

    key = triggers[0].get('key', '')
    device_mac = triggers[0].get('device', '')
    timestamp = triggers[0].get('timestamp', 0) / 1000
    device_name = DEVICE_NAMES.get(device_mac, device_mac)

    print(f"Device: {device_name} ({device_mac}), Event: {key}", flush=True)

    if key == 'sensor_door_opened':
        opened_time = datetime.fromtimestamp(timestamp).strftime('%I:%M %p')

        # Track open door
        open_doors[device_mac] = {
            'name': device_name,
            'opened_at': timestamp
        }
        print(f"{device_name} opened at {opened_time}", flush=True)

        # Cancel any existing timer for this door
        if device_mac in door_timers:
            door_timers[device_mac].cancel()

        # Start 30 min timer
        timer = threading.Timer(1 * 60, door_open_alert, args=[device_mac, device_name, opened_time])
        timer.daemon = True
        timer.start()
        door_timers[device_mac] = timer
        print(f"30 min timer started for {device_name}", flush=True)

    elif key == 'sensor_door_closed':
        # Cancel the timer since door closed
        if device_mac in door_timers:
            door_timers[device_mac].cancel()
            del door_timers[device_mac]
            print(f"Timer cancelled for {device_name} - door closed", flush=True)

        if device_mac in open_doors:
            del open_doors[device_mac]

        print(f"{device_name} closed", flush=True)

    return jsonify({'message': 'OK'}), 200

@app.route('/notes/add', methods=['POST'])
def add_note_only():
    data = request.get_json()
    content = data.get('content')
    due_date = data.get('due_date')

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
def login():
    data = request.get_json()
    if data.get('password') == PASSWORD:
        return jsonify({'success': True}), 200
    return jsonify({'success': False, 'message': 'Incorrect password.'}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)