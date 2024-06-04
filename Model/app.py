from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from gramformer import Gramformer
from textblob import TextBlob
import spacy
import joblib
from flask_cors import CORS
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
from concurrent.futures import ThreadPoolExecutor
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from bson import ObjectId
import threading
API_KEY = "AIzaSyCigl9R2ZmhVb9KVZrfilmHPqg-NkciqCE"
SEARCH_ENGINE_ID = "c3b8d18ab708a421b"
import time

client = MongoClient("mongodb+srv://riddhishwar:4eYSaL5U7NpFEId9@cluster0.son3w.mongodb.net/")
# Access your database
db = client.test  # Replace 'test_database' with your actual database name

# Initialize the Flask application
app = Flask(__name__)
executor = ThreadPoolExecutor(max_workers=5)
lock = threading.Lock()
CORS(app)  # Enable CORS for all routes

# Initialize SpaCy and Gramformer
nlp = spacy.load("en_core_web_sm")
# Load the default grammar correction model
gf = Gramformer(models=1, use_gpu=False)

model = joblib.load('svm_model.pkl')

def detect_paragraphs(text):
    # Split text into paragraphs based on newline characters
    paragraphs = text.split('\n')
    # Remove empty paragraphs
    paragraphs = [para.strip() for para in paragraphs if para.strip()]
    return paragraphs

def check_grammar(sentence):
    # Check grammar errors in the sentence using Gramformer
    corrected_sentences = gf.correct(sentence, max_candidates=1)
    resarray = []
    for corrected_sentence in corrected_sentences:
        resarray = gf.get_edits(sentence, corrected_sentence)
    return resarray, corrected_sentences

def check_spelling_and_tense(sentence):
    b = TextBlob(sentence)
    corrected_text = str(b.correct())
    original_words = sentence.split()
    corrected_words = corrected_text.split()
    changed_words = []
    for i, (orig_word, corr_word) in enumerate(zip(original_words, corrected_words)):
        if orig_word != corr_word:
            changed_words.append((orig_word, i))
    return changed_words, corrected_text

@app.route('/', methods=['GET'])
def home():
    return "hello"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    new_data = pd.DataFrame.from_dict(data, orient='index').T
    prediction = model.predict(new_data)
    return jsonify(prediction.tolist())

@app.route('/grammerpredict', methods=['POST'])
def grammarpredict():
    data = request.get_json(force=True)
    text = data.get('text', '')
    max_mark = int(data.get('mark', 5))  # Ensure max_mark is an integer
    paragraphs = detect_paragraphs(text)
    response_data = []
    total_errors = 0

    for paragraph in paragraphs:
        doc = nlp(paragraph)
        sentences = list(doc.sents)
        paragraph_errors = []

        for sentence in sentences:
            tense_array, grammar_corrected = check_grammar(sentence.text)
            spelling_errors, corrected_text = check_spelling_and_tense(list(grammar_corrected)[0])
            
            # Count the errors
            total_errors += len(tense_array) + len(spelling_errors)

            paragraph_errors.append({
                'incorrect_sentence': sentence.text,
                'original': corrected_text,
                'tense_array': tense_array,
                'spelling_errors': spelling_errors
            })


        response_data.append({
            'paragraph': paragraph,
            'details': paragraph_errors
        })

    # Calculate the final mark based on the number of errors
    penalty_per_error = max_mark / (total_errors + 1)  # +1 to avoid division by zero
    final_mark = max(max_mark - (penalty_per_error * total_errors), 0)
    final_mark = round(final_mark, 1)
    
    performance = "Bad"
    if final_mark > 0.75 * max_mark:
        performance = "Good"
    elif final_mark >= 0.5 * max_mark:
        performance = "Average"

    return jsonify({
        'final_mark': final_mark,
        'details': response_data,
        'performance': performance
    })
    
def scrape_data_from_url(url, timeout=10):
    try:
        response = requests.get(url, timeout=(3.05, timeout))
        if response.status_code == 200:
            if 'application/pdf' in response.headers.get('Content-Type', ''):
                print("pdf file")
                return "PDF File", response.content
            soup = BeautifulSoup(response.content, 'html.parser')
            title_tag = soup.title
            title = title_tag.string.strip() if title_tag else 'No title available'
            paragraphs = [p.text.strip() for p in soup.find_all('p')]
            return title, "\n".join(paragraphs)
        else:
            print(f"Error: Received status code {response.status_code} for URL: {url}")
    except requests.exceptions.Timeout:
        print(f"Timeout occurred for URL: {url}")
    except requests.exceptions.RequestException as e:
        print(f"Request exception occurred for URL: {url}, Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred for URL: {url}, Error: {e}")
    return None, None

def calculate_similarity(text1, text2):
    vectorizer = TfidfVectorizer().fit_transform([text1, text2])
    vectors = vectorizer.toarray()
    cosine_sim = cosine_similarity(vectors)
    return cosine_sim[0][1]

def get_similarity_level(score):
    if score < 0.2:
        return "Low"
    elif score < 0.5:
        return "Medium"
    else:
        return "High"

def search_google(query, api_key, search_engine_id):
    base_url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": api_key,
        "cx": search_engine_id,
        "q": query
    }
    response = requests.get(base_url, params=params)
    data = response.json()
    finals = {}
    paragraph_info = []

    link_counter = 0

    if "items" in data:
        for item in data["items"]:
            start_time = time.time()  # Start time for current item processing
            if link_counter >= 6:
                break
            print(link_counter)
            title = item.get("title", "No title available")
            link = item.get("link", "No link available")
            print("Title:", title)
            print("Link:", link)

            # Scrape the content from the link
            _, paragraphs = scrape_data_from_url(link)
            if _ == "PDF File":
                continue
            print("scraped...")
            if paragraphs:  # Limiting to the top 6 links
                try:
                    print("into  similarity_score")
                    similarity_score = calculate_similarity(query, paragraphs)
                    print("finished  similarity_score")
                    similarity_percentage = similarity_score * 100
                    similarity_level = get_similarity_level(similarity_score)

                    formatted_similarity_score = "{:.4f}".format(similarity_score)

                    paragraph_data = {
                        "title": title,
                        "link": link,
                        "similarity_score": formatted_similarity_score,
                        "similarity_percentage": similarity_percentage,
                        "similarity_level": similarity_level
                    }

                    paragraph_info.append(paragraph_data)

                except UnicodeEncodeError:
                    pass

            else:
                pass

            link_counter += 1
            elapsed_time = time.time() - start_time  # Time taken for processing current item
            if elapsed_time > 5:
                print("Time limit exceeded for current item. Moving to next item.")
                continue

    return paragraph_info

    
def long_running_task(data, collection):
    params = data.get('params')
    regno = data.get('regno')
    student_doc = collection.find_one({'studentRegn': regno})
    upmainKey={}
    if student_doc:
        main_key = list(params.keys())[0]
        for ans in student_doc["quizAnswer"]:
            mains = list(ans.keys())[0]
            if main_key==mains:
                print(True)
                quiz_details = ans[mains].get('quizDetails', [])
                for quiz in quiz_details:
                    if quiz.get('questionType') == 'Essay':
                        details = quiz.get('details', [])
                        for detail in details:
                            paragraph = detail.get('paragraph', '')
                            search_result = search_google(paragraph, API_KEY, SEARCH_ENGINE_ID)
                            paragraph_info_sorted = sorted(search_result, key=lambda x: float(x['similarity_score']), reverse=True)
                            top_6_links = paragraph_info_sorted[:6]
                    
                            quiz["plagarism_report"]=top_6_links
                        
        
        print(student_doc)
        with lock:
            updated_doc = {
                "$set": {
                "quizAnswer": student_doc["quizAnswer"]
                }
            }
            collection.update_one({'_id': student_doc['_id']}, updated_doc)
    else:
        print("Student not found")


@app.route('/plagiarism', methods=['POST'])
def handle_request():
    collection = db.studentquizstatuses
    data = request.get_json()
    params = data.get('params')

    if params:
        executor.submit(long_running_task, data, collection)
        response = {"message": "Plagiarism check started."}
        return jsonify(response), 200
    else:
        response = {"error": "Invalid input format"}
        return jsonify(response), 400

if __name__ == '__main__':
    app.run(debug=True)
