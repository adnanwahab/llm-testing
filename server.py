from __future__ import unicode_literals

import os

from flask import Flask, render_template, jsonify, redirect, url_for, request, send_from_directory
#https://www.digitalocean.com/community/tutorials/how-to-use-an-sqlite-database-in-a-flask-application
import openai
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
import yt_dlp


from flask_cors import CORS



# Use CORS with default options (Allow all origins)




class MyLogger(object):
    def debug(self, msg):
        pass

    def warning(self, msg):
        pass

    def error(self, msg):
        print(msg)


def my_hook(d):
    if d['status'] == 'finished':
        print('Done downloading, now converting ...')

output_location = './media/youtube/'
output_template = output_location + '%(title)s.%(ext)s'
download_archive_file = output_template + 'downloaded.txt'
ydl_opts = {
    'download_archive': download_archive_file,
    'outtmpl': output_template,
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
    'logger': MyLogger(),
    'progress_hooks': [my_hook],
        'verbose': True,

}
import torch





import sqlite3
# import audioowl

from sentence_transformers import SentenceTransformer
openai.api_key = os.environ.get('OPENAI_API_KEY')
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
openai.api_key = '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'

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

app = Flask(__name__)
CORS(app)
@app.route('/api/v1')
def viteProxy():
    path = '/home/awahab/llm-testing/static/'
    #directory = "static/lyrics.json"
    filename = "lyrics.json"
    print('hello world')
    return send_from_directory(path, filename, as_attachment=True)


@app.route('/lyrics.json')
def lyrics():
    path = '/home/awahab/llm-testing/static/'
    #directory = "static/lyrics.json"
    filename = "lyrics.json"
    print('hello world')
    return send_from_directory(path, filename, as_attachment=True)


from faster_whisper import WhisperModel

model_size = "large-v2"

# Run on GPU with FP16
model = WhisperModel(model_size, device="cuda", compute_type="float16")

# or run on GPU with INT8
# model = WhisperModel(model_size, device="cuda", compute_type="int8_float16")
# or run on CPU with INT8
# model = WhisperModel(model_size, device="cpu", compute_type="int8")
# import whisper

# model = whisper.load_model("medium.en")


def transcribe2(fp):
    result = model.transcribe(fp)
    print(result)
    return (result["text"])
def transcribe(fp):
    print(fp)
    segments, info = model.transcribe(fp, beam_size=5,
                             #vad_filter=True,
                             #word_timestamps=True,
    #vad_parameters=dict(min_silence_duration_ms=500)
    )
    #print(list(segments))
    data = []
    for segment in segments:
            #print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.word))
            data.append([segment.start, segment.end, segment.text])
    print(data)
    return data
    #return list(segments)
    #lrcer.run(fp, target_lang='en') 
    #print("Detected language '%s' with probability %f" % (info.language, info.language_probability))
    #return 

import os

current_directory = os.getcwd()

@app.route('/play-song', methods=['POST', 'GET'])
def yt():
    print(request.json, ' playing a song')
    fp = request.json['href']
    #fp = 'https://www.youtube.com/watch?v=ZNX0uTBp7_U'
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        print('wtfaasdfasdfa',ydl.download([fp]))

    # load audio and pad/trim it to fit 30 seconds
    import os

    current_directory = os.getcwd()
    print(current_directory)
    segments = transcribe(current_directory+'/media/youtube/' + request.json['title'] + '.mp3')
    data = {}
    data['lyrics'] = segments
    data['title'] = request.json['title']
    # print the recognized text
    #print(result.text, data)

    # data = audioowl.analyze_file(path='hello.mp3', sr=22050)

    # print(data)
    return jsonify(data)







@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/admin', methods=['GET'])
def asdfasdf():
    conn = get_db_connection()
    posts = conn.execute('SELECT * FROM posts').fetchall()
    conn.close()
    post_data = [(p[0], p[1], p[2], p[3]) for p in posts]
    print(post_data)
    return render_template("admin.html", posts=post_data)


def upsert(content, date):
    # if the content exists exactly then just increment the vote 
    # do a query for the record existing 
    # if it does, increment vote
    # if it doesnt, add to DB 
    # datetime.date.strftime('%Y-%m-%d')
    conn = get_db_connection()
    cur = conn.cursor()
    print(date)
    ballot_options = conn.execute('SELECT * FROM ballot_options WHERE content = ?', (content,)).fetchall()
    if len(ballot_options) == 0:
            cur.execute("INSERT INTO ballot_options (content, voteCount, created) VALUES (?, ?, ?)", (content, 0, date))
    else: 
        cur.execute('''UPDATE ballot_options 
               SET voteCount = voteCount + 1 
               WHERE content = ?''', (content,))
    conn.commit()
    conn.close()
    return True
import datetime


@app.route("/karaoke")
def karaoke(date="2023-08-01"):
    return render_template("karaoke.html")
    


#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
# @app.route("/")
# @app.route("/<date>")
# def hello(date="2023-08-01"):
#     # higher temperature leads to more variation, randomness and creativity
#     # temperature between 0.7 and 0.9 is most commonly used if you want to experiment and create many variations quickly

#     conn = get_db_connection()
#     #today = datetime.date.today()
#     print(date, 'index Route')
#     posts = conn.execute('SELECT * FROM ballot_options WHERE created  = ?', (date,)).fetchall()
#     post = conn.execute('SELECT * FROM ballot_options').fetchall()

#     #print([dict(p) for p in posts], 'I AM A POST')
#     #print([dict(p) for p in post], 'I AM A POST')
#     return render_template("hello.html")

#     if len(posts) == 0:
#         llm = OpenAI(temperature=0.9)
#         prompt = PromptTemplate(
#             input_variables=["date"],  # list of variables
#             template="please list 3 items to vote on for a nation of 7 billion people today's date {date}.",  # prompt
#         )   
#         question = prompt.format(date=date)
#         content = llm(question).split("\n")
#         content = [item for item in content if item != ""]
#         for text in content: 
#             print('adding ballot options', text)
#             cur = conn.cursor()
#             cur.execute("INSERT INTO ballot_options (content, voteCount, created) VALUES (?, ?, ?)", (text, 0, date))
#         conn.commit()
#         conn.close()
#         return render_template("hello.html", date=date, answer=content)
#     else:
#         return render_template("hello.html", date=date, answer=[(p[2], p[3]) for p in posts])
    

#add to admin endpoint -> summarize the votes and come up with an action of what to do  [] 
#add automagic translation [] 
#add a bunch of mock data to sql  []
#add a calendar []

#find similarity between the write in ballot and all other ballots and then group them into the previous one
# this will allow 7 billion eople to write in anything and it will say "i want barack obama to play chess against donald trump"

def incrementVote(vote, date):
    conn = get_db_connection()
    cur = conn.cursor()
    print(date, vote)
    cur.execute('UPDATE ballot_options SET voteCount = voteCount + 1  WHERE created = ? and content = ?', (date, vote))
    conn.commit()
    conn.close()

@app.route('/vote', methods=['POST'])
def asdfasdfasdfasdf():
    data = request.json
    print(data)
    # conn = get_db_connection()
    # cur = conn.cursor()
    # cur.execute("INSERT INTO ballot_options (content, voteCount) VALUES (?, ?)", (data['writeInBallot'], 0))
    # conn.commit()
    # conn.close()
    ballot = data['writeInBallot']
    date = data['date']
    vote = data['vote']

    if len(ballot) > 1: upsert(ballot, date)
    else:  incrementVote(vote,date)
    #update vote of selected Ballot 

    # Use the jsonify function to create a JSON response
    return jsonify(data)



import random
import string

def generate_random_string(length):
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string

# Example usage to generate a random string of length 10
random_string = generate_random_string(10)
print(random_string)

@app.route('/mock_data')
def asdasdffasdf():
    for i in range(100):
        title = generate_random_string(123)
        content = generate_random_string(123)
        conn = get_db_connection()
        conn.execute('INSERT INTO posts (title, content) VALUES (?, ?)', (title, content))
        conn.commit()
        conn.close()
        print(title,content)
    return redirect(url_for('hello'))


if __name__ == "__main__":
    print('hello')
    app.run(debug=True)


#generate votes for the day 


# switch to - upvotes 
##upvotes table 

#table for votes
#day, choice(0,1,2) 

#table for write-in-ballot
#day, content, space for semantic similarity to other write-in-ballots in that category 


#table for upvote
#write-in-ballot has a upvote, time

# admin panel - check what the piechart says 
# add a list of ballots grouped by classification



#open questions
# if write in ballot, no choice for a,b,c ? 
#pay people 10 dollars for voting from government
#300 million people - 3 billion dollars a day 
#money is in e-money that can only be used on food or subway tickets 


#use LLM to mock data 
# make it so each day has like 10 choices


#main thing is - use LLM for advanced summarization so - 1million write in ballots can be clustered into 3-4 categories  