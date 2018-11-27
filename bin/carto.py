from os import path
import requests
import settings

def delete_table(name):
    url = 'http://' + settings.CARTO_USER + '.carto.com/api/v2/sql/'
    querystring = {'q':'DELETE FROM ' + name, 'api_key': settings.CARTO_API}
    response = requests.get(url, params=querystring)

    print response.text

def copy_table(name, cols, filename):
    url = 'http://' + settings.CARTO_USER + '.carto.com/api/v2/sql/copyfrom'
    querystring = {
        'q':'COPY ' + name + ' (' + ','.join(cols) + ') FROM stdin WITH (FORMAT csv, HEADER true)',
        'api_key': settings.CARTO_API
    }
    headers = {
        'Content-Encoding': 'gzip',
        'Content-Type': 'application/octet-stream'
    }
    csv = open(path.join(path.dirname(__file__), '../data/output/', filename), mode='rb').read()
    response = requests.post(url, headers=headers, params=querystring, data=csv)

    print response.text
