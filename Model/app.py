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


# Initialize the Flask application
app = Flask(__name__)
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


if __name__ == '__main__':
    app.run(debug=True)
