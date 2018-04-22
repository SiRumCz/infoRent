from collections import OrderedDict
import csv
import json
from shapely.geometry import shape, Point

# load GeoJSON file containing sectors
with open('data/VicDataGeo.json') as f:
    vic_data = json.load(f)

# Get rental data
with open('data/100_sample_data.csv') as f:
    reader = csv.DictReader(f)
    rental_data = [row for row in reader]

neighbourhood_polygons = dict()
neighbourhood_prices = dict()
for feature in vic_data['features']:
    neighbourhood_name = feature['properties']['Name']
    neighbourhood_polygons[neighbourhood_name] = shape(feature['geometry'])
    neighbourhood_prices[neighbourhood_name] = []

# Note that longitutdes and latitudes may be reversed in different files, be careful with this
for ix, rental in enumerate(rental_data):
    try:
        rental_position = Point(float(rental['longitude']), float(rental['latitude']))
    except:
        continue  # some rentals have blank latitude and longitude
    
    for name, polygon in neighbourhood_polygons.items():
        rental_data[ix]['neighbourhood'] = ''
        if polygon.contains(rental_position):
            neighbourhood_prices[name].append(int(rental['price']))
            rental_data[ix]['neighbourhood'] = name
            break
        
with open('data/100_sample_data_neighbourhoods.csv', 'w') as f:
    writer = csv.DictWriter(f, fieldnames=rental_data[0].keys())
    print(rental_data[0].keys)
    writer.writeheader()
    writer.writerows(rental_data)

# consolidate prices into averages
neighbourhood_average_prices = dict()
for neighbourhood, prices in neighbourhood_prices.items():
    try:
        neighbourhood_average_prices[neighbourhood] = sum(prices) / len(prices)
    except ZeroDivisionError:
        neighbourhood_average_prices[neighbourhood] = 0
    print(neighbourhood_average_prices[neighbourhood])

with open('data/average_neighbourhood_prices.csv', 'w') as f:
    writer = csv.DictWriter(f, fieldnames=['neighbourhood', 'price'])
    writer.writeheader()

    for name, price in neighbourhood_average_prices.items():
        row = OrderedDict()
        row['neighbourhood'] = name
        row['price'] = price
        writer.writerow(row)