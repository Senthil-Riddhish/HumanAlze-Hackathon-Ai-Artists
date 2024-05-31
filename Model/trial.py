from textblob import TextBlob

a = "cmputr I'm arent u have a snall index"  # incorrect spelling
print("original text: " + str(a))

b = TextBlob(a)

# Get the corrected text
corrected_text = str(b.correct())
print("corrected text: " + corrected_text)

# Split the original and corrected texts into words
original_words = a.split()
corrected_words = corrected_text.split()

# Find the words that have been changed and their indices
changed_words = []
for i, (orig_word, corr_word) in enumerate(zip(original_words, corrected_words)):
    if orig_word != corr_word:
        changed_words.append((orig_word, i))

# Print the changed words with their indices
print("Changed words with indices: " + str(changed_words))