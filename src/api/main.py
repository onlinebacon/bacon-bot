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

@app.route('/time/<int:unix>/bright-stars/<string:min_mag>')
def get_bright_stars(unix, min_mag):
	try:
		min_mag = float(min_mag)
		dt = datetime.fromtimestamp(unix).astimezone(timezone.utc)
		t = ts.from_datetime(dt)
		bright_df = df[df['magnitude'] <= min_mag]
		bright_stars = Star.from_dataframe(bright_df)
		csv = bright_df.to_csv().strip().split('\n')
		res = []
		ra_arr, dec_arr, dist_arr = earth.at(t).observe(bright_stars).radec(epoch='date')
		ra_arr = ra_arr.hours
		dec_arr = dec_arr.degrees
		dist_arr = dist_arr.m
		for i in range(len(csv) - 1):
			cols = csv[i + 1].split(',')
			hip = int(cols[0])
			mag = float(cols[1])
			ra = ra_arr[i]
			dec = dec_arr[i]
			dist = dist_arr[i]
			res.append({ 'hip': hip, 'ra': ra, 'dec': dec, 'dist': dist, 'mag': mag })
		return jsonify(res)
	except Exception as error:
		print(error)
		return 'Internal error', 500

app.run(port=25601, host='0.0.0.0', debug=True)
