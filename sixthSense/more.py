# import requests
# import subprocess
# import time

# subprocess.Popen(['python', 'smartcane.py'])
# time.sleep(2)

# # Send a GET request to the Flask application
# response = requests.get('http://10.37.117.194:3000/?fell=true')

# # Check if the request was successful
# if response.status_code == 200:
#     data = response.json()
#     fell_value = data.get('fell_value')
    
#     print(f'fell_value: {fell_value}')
# else:
#     print(f'Failed to retrieve data. Status code: {response.status_code}')