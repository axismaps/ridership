from os import path
import gzip
import shutil
import requests
import settings

def get_file_loc(filename):
    return path.join(path.dirname(__file__), '../data/output/', filename)

def delete_table(name):
    url = 'http://' + settings.CARTO_USER + '.carto.com/api/v2/sql/'
    querystring = {'q':'DELETE FROM ' + name, 'api_key': settings.CARTO_API}
    response = requests.get(url, params=querystring)

    print 'Delete result: ' + response.text

def gzip_file(filename):
    f = get_file_loc(filename)
    with open(f, 'rb') as f_in:
        gz = f + '.gz'
        with gzip.open(gz, 'wb') as f_out:
            shutil.copyfileobj(f_in, f_out)
            print 'Zipped ' + gz
            return gz

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
    csv = open(get_file_loc(filename), mode='rb').read()
    response = requests.post(url, headers=headers, params=querystring, data=csv)

    print 'Copy result: ' + response.text

def replace_data(name, cols, filename):
    gz = gzip_file(filename)
    delete_table(name)
    copy_table(name, cols, gz)
    print 'Upload to Carto was successful'
