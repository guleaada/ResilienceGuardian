import base64, re

crops = ['maize', 'coffee', 'potato', 'barley', 'sorghum']

with open('public/index.html', 'r') as f:
    content = f.read()

for crop in crops:
    with open(f'{crop}.jpg', 'rb') as img:
        b64 = base64.b64encode(img.read()).decode()
    new_src = f'data:image/jpeg;base64,{b64}'
    content = re.sub(
        rf'(data-crop="{crop}"[^>]*>.*?<img src=")[^"]*"',
        rf'\g<1>{new_src}"',
        content, flags=re.DOTALL
    )
    print(f'Updated {crop}')

with open('public/index.html', 'w') as f:
    f.write(content)
print('Done!')
