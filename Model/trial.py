import requests
from bs4 import BeautifulSoup

def scrape_data_from_url(url, timeout=10):
    try:
        response = requests.get(url, timeout=(3.05, timeout))
        if response.status_code == 200:
            if 'application/pdf' in response.headers.get('Content-Type', ''):
                return "PDF File", response.content
            else:
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

# Testing the function
url = "https://pub.epsilon.slu.se/8553/1/ahmadi%20afzadi_m_120116.pdf"
title, content = scrape_data_from_url(url, timeout=3)
print("Title:", title)
print("Content:", content)
