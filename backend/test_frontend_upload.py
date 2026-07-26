import requests

url = "http://localhost:8000/api/uploads/"
data = {"user_id": "00000000-0000-0000-0000-000000000000"}
files = {"file": ("test_image_real.jpg", b"fake file content", "image/jpeg")}

res = requests.post(url, data=data, files=files)
print("Status Code:", res.status_code)
print("Response JSON:")
print(res.json())
