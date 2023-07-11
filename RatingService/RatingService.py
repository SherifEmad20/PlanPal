from flask import Flask, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification

import torch
import requests
import pandas as pd

app = Flask(__name__)

tokenizer = AutoTokenizer.from_pretrained('nlptown/bert-base-multilingual-uncased-sentiment')
model = AutoModelForSequenceClassification.from_pretrained('nlptown/bert-base-multilingual-uncased-sentiment')


@app.route('/getReviews/<int:venue_id>')
def get_reviews(venue_id):
    try:
        # Make a request to the Spring Boot API
        url = f"http://localhost:8080/api/v1/venue/getReviews/{venue_id}"
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception if the request was not successful

        reviews_list = response.json()
        formatted_reviews = []
        for review in reviews_list:
            review_dict = {
                'reviewId': review['reviewId'],
                'review': review['review'],
                'username': review['username'],
                'venue': review['venue']
            }
            formatted_reviews.append(review_dict)

        df = pd.DataFrame(formatted_reviews)

        def sentiment_score(review):
            tokens = tokenizer.encode(review, return_tensors='pt', padding=True, truncation=True)
            result = model(tokens)
            return int(torch.argmax(result.logits)) + 1

        df['sentiment'] = df['review'].apply(lambda x: sentiment_score(x[:512]))
        average_sentiment = round(df['sentiment'].mean(), 2)

        addRateURL = f"http://localhost:8080/api/v1/venue/rateVenue/{venue_id}/{average_sentiment}"
        requests.put(addRateURL)

        return jsonify({'Rating': average_sentiment})

    except requests.exceptions.RequestException as err:
        return jsonify({'error': f'Request failed: {err}'})

    except Exception as e:
        return jsonify({'error': f'An error occurred: {e}'})


if __name__ == '__main__':
    app.run()
