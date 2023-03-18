from datetime import datetime, timezone
from flask import Flask, jsonify
from skyfield.api import Star, load
from skyfield.data import hipparcos
from skyfield.magnitudelib import planetary_magnitude

ephem = load('de421.bsp')
earth = ephem['earth']
ts = load.timescale()
with load.open(hipparcos.URL) as f:
	df = hipparcos.load_dataframe(f)

app = Flask("App name")

def df_star_to_mag(df_star):
	csv = df_star.to_csv()
	lines = csv.split('\n')
	line = lines[1]
	cols = line.split(',')
	mag_text = cols[1].strip()
	mag = float(mag_text)
	return mag

@app.route('/time/<int:unix>/hip/<int:hip>')
def get_star_at(unix, hip):
	try:
		dt = datetime.fromtimestamp(unix).astimezone(timezone.utc)
		t = ts.from_datetime(dt)
		df_star = df.loc[hip]
		mag = df_star_to_mag(df_star)
		star = Star.from_dataframe(df_star)
		ra, dec, dist = earth.at(t).observe(star).radec(epoch='date')
		return jsonify({ 'ra': ra.hours, 'dec': dec.degrees, 'dist': dist.m, 'mag': mag })
	except Exception as error:
		print(error)
		return 'Internal error', 500

@app.route('/time/<int:unix>/planet/<string:name>')
def get_planet_at(unix, name):
	try:
		dt = datetime.fromtimestamp(unix).astimezone(timezone.utc)
		t = ts.from_datetime(dt)
		name = name.lower()
		if (name == 'jupiter' or name == 'saturn'):
			name += ' barycenter'
		body = ephem[name]
		astrometric = earth.at(t).observe(body)
		mag = float(planetary_magnitude(astrometric))
		ra, dec, dist = astrometric.radec(epoch='date')
		return jsonify({ 'ra': ra.hours, 'dec': dec.degrees, 'dist': dist.m, 'mag': mag })
	except Exception as error:
		print(error)
		return 'Internal error', 500

@app.route('/time/<int:unix>/sun')
def get_sun_at(unix):
	try:
		dt = datetime.fromtimestamp(unix).astimezone(timezone.utc)
		t = ts.from_datetime(dt)
		sun = ephem['sun']
		ra, dec, dist = earth.at(t).observe(sun).radec(epoch='date')
		return jsonify({ 'ra': ra.hours, 'dec': dec.degrees, 'dist': dist.m })
	except Exception as error:
		print(error)
		return 'Internal error', 500

@app.route('/time/<int:unix>/moon')
def get_moon_at(unix):
	try:
		dt = datetime.fromtimestamp(unix).astimezone(timezone.utc)
		t = ts.from_datetime(dt)
		moon = ephem['moon']
		ra, dec, dist = earth.at(t).observe(moon).radec(epoch='date')
		return jsonify({ 'ra': ra.hours, 'dec': dec.degrees, 'dist': dist.m })
	except Exception as error:
		print(error)
		return 'Internal error', 500

app.run(port=25601, host='0.0.0.0')
