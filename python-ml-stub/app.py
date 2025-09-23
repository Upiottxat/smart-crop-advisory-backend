from flask import Flask, request, jsonify
from pydantic import BaseModel
app = Flask(__name__)

class Payload(BaseModel):
  soil: dict
  weather: dict

@app.route('/predict', methods=['POST'])
def predict():
  try:
    payload = Payload(**request.json)
  except Exception as e:
    return jsonify({'error': str(e)}), 400
  soil = payload.soil
  weather = payload.weather
  # Simple stub: mimic ML model with heuristics
  if soil.get('pH') is not None and soil.get('pH') < 5.5:
    return jsonify({
      'title': 'ML: Low pH detected - lime recommended',
      'description': f'ML-model suggests liming for pH {soil.get("pH")}',
      'severity': 'action',
      'tags': ['ml','pH']
    })
  if soil.get('moisture') is not None and soil.get('moisture') < 20:
    return jsonify({
      'title': 'ML: Low moisture - irrigation',
      'description': 'ML-model recommends irrigation.',
      'severity': 'urgent',
      'tags': ['ml','irrigation']
    })
  return jsonify({
    'title': 'ML: Conditions acceptable',
    'description': 'No action suggested by ML stub.',
    'severity': 'info',
    'tags': ['ml','ok']
  })

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000)
