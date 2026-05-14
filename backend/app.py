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
# Track snoozed doors: {device_mac: snooze_until_timestamp}
snoozed_doors = {}

DOOR_ALERT_MINS=1



# Map device MAC to friendly name
DEVICE_NAMES = {
    '8CEDE1B2D4F8': 'Garage Door',
    '8CEDE1B2CE32': 'Patio Door'
    # add your other MACs here
}

# Track open doors: {device_mac: timestamp_when_opened}
open_doors = {}

load_dotenv()

PASSWORD = os.environ.get('PASSWORD')

app = Flask(__name__)
CORS(app)

DATABASE = 'wine_list.db'

def door_open_alert(device_mac, device_name, opened_time):
    if device_mac in open_doors:
        if device_mac in snoozed_doors:
            if time.time() < snoozed_doors[device_mac]:
                print(f"{device_name} alert suppressed - snoozed", flush=True)
                return
            else:
                del snoozed_doors[device_mac]

        base_url = "https://amaypy.duckdns.org"
        snooze_1h = f"{base_url}/snooze/{device_mac}?mins=60"
        snooze_4h = f"{base_url}/snooze/{device_mac}?mins=240"
        unsnooze_url = f"{base_url}/unsnooze/{device_mac}"

        subject = f"⚠️ {device_name} left open for {DOOR_ALERT_MINS} mins - {datetime.now().strftime('%I:%M %p')}"

        body_html = f"""
            <!DOCTYPE html>
            <html>
            <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:30px 0;">
                <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color:#e74c3c;padding:30px;text-align:center;">
                        <h1 style="color:#ffffff;margin:0;font-size:28px;">⚠️ Door Alert</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:30px;">
                        <h2 style="color:#2c3e50;margin:0 0 10px 0;">{device_name}</h2>
                        <p style="color:#666;font-size:16px;margin:0 0 20px 0;">
                            This door has been open for <strong>{DOOR_ALERT_MINS} minutes</strong>. Please check it.
                        </p>

                        <!-- Info Box -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fa;border-radius:6px;padding:0;margin-bottom:30px;">
                            <tr>
                            <td style="padding:20px;">
                                <p style="margin:0 0 8px 0;color:#555;font-size:14px;">
                                🕐 <strong>Opened at:</strong> {opened_time}
                                </p>
                                <p style="margin:0;color:#555;font-size:14px;">
                                ⏱️ <strong>Open for:</strong> {DOOR_ALERT_MINS} minutes
                                </p>
                            </td>
                            </tr>
                        </table>

                        <!-- Action Buttons -->
                        <p style="color:#2c3e50;font-size:16px;font-weight:bold;margin:0 0 15px 0;">Actions</p>
                        
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                            <td style="padding-bottom:10px;">
                                <a href="{snooze_1h}" style="display:block;background-color:#f39c12;color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:6px;font-size:15px;text-align:center;font-weight:bold;">
                                😴 Snooze for 1 Hour
                                </a>
                            </td>
                            </tr>
                            <tr>
                            <td style="padding-bottom:10px;">
                                <a href="{snooze_4h}" style="display:block;background-color:#e67e22;color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:6px;font-size:15px;text-align:center;font-weight:bold;">
                                😴 Snooze for 4 Hours
                                </a>
                            </td>
                            </tr>
                            <tr>
                            <td>
                                <a href="{unsnooze_url}" style="display:block;background-color:#27ae60;color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:6px;font-size:15px;text-align:center;font-weight:bold;">
                                ✅ Re-enable Alerts
                                </a>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#f8f9fa;padding:20px;text-align:center;border-top:1px solid #eee;">
                        <p style="color:#aaa;font-size:12px;margin:0;">
                            Sent from your Raspberry Pi • amaykadakia.com
                        </p>
                        </td>
                    </tr>

                    </table>
                </td>
                </tr>
            </table>
            </body>
            </html>
            """
        send_email(subject, "", body_html)
        print(f"Alert sent for {device_name}", flush=True)

        # Restart timer to alert again
        timer = threading.Timer(
            DOOR_ALERT_MINS * 60,
            door_open_alert,
            args=[device_mac, device_name, opened_time]
        )
        timer.daemon = True
        timer.start()
        door_timers[device_mac] = timer

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

def send_email(subject, body_text, body_html, to="2400roundrock+Alerts@gmail.com"):
    try:
        email_content = f"""From: laezywork@gmail.com
        To: {to}
        Subject: {subject}
        MIME-Version: 1.0
        Content-Type: text/html; charset=utf-8

        {body_html}"""

        result = subprocess.run(
            ['msmtp', '--file=/home/laezy/.msmtprc', to],
            input=email_content,
            capture_output=True,
            text=True
        )
        print(f"Email sent: {result.returncode}, stderr: {result.stderr}", flush=True)
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



@app.route('/snooze/<device_mac>', methods=['GET'])
def snooze_door(device_mac):
    snooze_mins = int(request.args.get('mins', 60))
    snooze_until = time.time() + (snooze_mins * 60)
    snoozed_doors[device_mac] = snooze_until
    device_name = DEVICE_NAMES.get(device_mac, device_mac)
    print(f"{device_name} snoozed for {snooze_mins} mins", flush=True)
    return f"<h2>✅ {device_name} alerts snoozed for {snooze_mins} minutes.</h2>", 200

@app.route('/unsnooze/<device_mac>', methods=['GET'])
def unsnooze_door(device_mac):
    if device_mac in snoozed_doors:
        del snoozed_doors[device_mac]
    device_name = DEVICE_NAMES.get(device_mac, device_mac)
    print(f"{device_name} unsnoozed", flush=True)
    return f"<h2>✅ {device_name} alerts re-enabled.</h2>", 200

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
        open_doors[device_mac] = {
            'name': device_name,
            'opened_at': timestamp
        }

        # Don't start timer if snoozed
        if device_mac in snoozed_doors and time.time() < snoozed_doors[device_mac]:
            print(f"{device_name} opened but alerts are snoozed", flush=True)
            return jsonify({'message': 'OK'}), 200

        if device_mac in door_timers:
            door_timers[device_mac].cancel()

        timer = threading.Timer(
            DOOR_ALERT_MINS * 60,
            door_open_alert,
            args=[device_mac, device_name, opened_time]
        )
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