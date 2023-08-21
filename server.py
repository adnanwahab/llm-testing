from __future__ import unicode_literals

import os

from flask import Flask, render_template, jsonify, redirect, url_for, request, send_from_directory
#https://www.digitalocean.com/community/tutorials/how-to-use-an-sqlite-database-in-a-flask-application
import openai
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
import yt_dlp
from transcribe import transcribe

from flask_cors import CORS
import sqlite3

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/lyrics.json')
def lyrics():
    path = '/home/awahab/llm-testing/static/'
    filename = "lyrics.json"
    print('hello world')
    return send_from_directory(path, filename, as_attachment=True)

app = Flask(__name__)
CORS(app)
if __name__ == "__main__":
    print('hello')
    app.run(debug=True)