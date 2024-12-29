import requests

url = 'http://localhost:3000/register'
data = {
    'name': 'Olalekan Odugbile',
    'email': 'drolalekan.ayodele@yahoo.com',
    'password': 'Odugbile1993',
    'phone': '08100812517',
    'role': 'Buyer'
}

response = requests.post(url, json=data)
print(response.json())
