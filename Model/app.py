from flask import Flask, request, jsonify
from flask_cors import CORS
from gramformer import Gramformer
import spacy

# Initialize the Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize SpaCy and Gramformer
nlp = spacy.load("en_core_web_sm")
gf = Gramformer(models=1, use_gpu=False)  # Load the default grammar correction model

def detect_paragraphs(text):
    # Split text into paragraphs based on newline characters
    paragraphs = text.split('\n')
    paragraphs = [para.strip() for para in paragraphs if para.strip()]  # Remove empty paragraphs
    return paragraphs

def check_grammar(sentence):
    # Check grammar errors in the sentence using Gramformer
    corrected_sentences = gf.correct(sentence, max_candidates=1)
    corrections = list(corrected_sentences)
    if corrections:
        return corrections[0]
    return sentence

def check_spelling_and_tense(sentence):
    doc = nlp(sentence)
    errors = []
    for token in doc:
        if token.tag_ in ["VBD", "VBN", "VBZ", "VBP"]:  # Tense related tags
            errors.append({
                'word': token.text,
                'start': token.idx,
                'end': token.idx + len(token.text),
                'message': 'Possible tense issue'
            })
        if token.is_oov:  # Out of vocabulary words (possible spelling mistakes)
            errors.append({
                'word': token.text,
                'start': token.idx,
                'end': token.idx + len(token.text),
                'message': 'Possible spelling mistake'
            })
    return errors

@app.route('/grammarpredict', methods=['POST'])
def grammarpredict():
    data = request.get_json(force=True)
    text = data.get('text', '')
    paragraphs = detect_paragraphs(text)
    response_data = []

    for paragraph in paragraphs:
        doc = nlp(paragraph)
        sentences = list(doc.sents)
        paragraph_errors = []

        for sentence in sentences:
            grammar_corrected = check_grammar(sentence.text)
            spelling_tense_errors = check_spelling_and_tense(sentence.text)
            paragraph_errors.append({
                'original': sentence.text,
                'corrected': grammar_corrected,
                'errors': spelling_tense_errors,
                'error_count': len(spelling_tense_errors)
            })

        response_data.append({
            'paragraph': paragraph,
            'details': paragraph_errors
        })

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True)
