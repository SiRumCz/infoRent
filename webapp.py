"""Flask webserver for hosting the InfoRent visualization"""

from flask import Flask, send_file


app = Flask(__name__)


@app.route('/')

@app.route('/launch.html')
def launch():
    return send_file('launch.html')
@app.route('/index.html')
def hello():
    return send_file('index.html')

@app.route('/js/victoria.js')
def js_Function():
    return send_file('./js/victoria.js')

@app.route('/data/VicData.json')
def VicData_Function():
    return send_file('./data/VicData.json')

@app.route('/data/project_sample_data.csv')
def Sample_Function():
    return send_file('./data/project_sample_data.csv')

@app.route('/data/average_neighbourhood_prices.csv')
def Price_Function():
    return send_file('./data/average_neighbourhood_prices.csv')

@app.route('/data/project_sample_average_neighbourhood_prices.csv')
def Price_Function_2():
    return send_file('./data/project_sample_average_neighbourhood_prices.csv')

@app.route('/html/toggle_button')
def toggle_buttons_html():
    return send_file('./html/toggle_button.html')

@app.route('/css/toggle_button')
def toggle_buttons_css():
    return send_file('./css/toggle_button.css')

@app.route('/js/toggle_button')
def toggle_buttons_js():
    return send_file('./js/toggle_button.js')

@app.route('/js/coming-soon.min.js')
def coming_soon_min_js():
    return send_file('./js/coming-soon.min.js')

@app.route('/css/coming-soon.min.css')
def coming_soon_min_css():
    return send_file('./css/coming-soon.min.css')

@app.route('/vendor/bootstrap/css/bootstrap.min.css')
def vendor_bootstrap_css():
    return send_file('./vendor/bootstrap/css/bootstrap.min.css')

@app.route('/vendor/font-awesome/css/font-awesome.min.css')
def vendor_awesome_font_css():
    return send_file('./vendor/font-awesome/css/font-awesome.min.css')

@app.route('/vendor/jquery/jquery.min.js')
def vendor_jquery_min():
    return send_file('./vendor/jquery/jquery.min.js')

@app.route('/vendor/bootstrap/js/bootstrap.bundle.min.js')
def vendor_bootstrap_bundle():
    return send_file('./vendor/bootstrap/js/bootstrap.bundle.min.js')

@app.route('/vendor/vide/jquery.vide.min.js')
def vendor_vide_min():
    return send_file('./vendor/vide/jquery.vide.min.js')

@app.route('/vendor/font-awesome/fonts/fontawesome-webfont.woff2')
def vendor_font_awesome():
    return send_file('./vendor/font-awesome/fonts/fontawesome-webfont.woff2')

@app.route('/vendor/font-awesome/fonts/fontawesome-webfont.woff')
def vendor_font_awesome_webfont():
    return send_file('./vendor/font-awesome/fonts/fontawesome-webfont.woff')

@app.route('/img/bg-mobile-fallback.jpg')
def img_bg_mobile_fallback():
    return send_file('./img/bg-mobile-fallback.jpg')

@app.route('/mp4/bg.mp4')
def mp4_bg_mp4():
    return send_file('./mp4/bg.mp4')

@app.route('/bootstrap-4.0.0-dist/css/bootstrap.min.css')
def bootstrap_4_dist():
    return send_file('./bootstrap-4.0.0-dist/css/bootstrap.min.css')

@app.route('/js/classie.js')
def classie_js():
    return send_file('./js/classie.js')

@app.route('/depth.html')
def depth_html():
    return send_file('./depth.html')
    
@app.route('/js/markclusterer.js')
def markclusterer_js():
    return send_file('./js/markclusterer.js')    
@app.route('/img/m1.png')
def m1():
    return send_file('./img/m1.png')
@app.route('/img/m2.png')
def m2():
    return send_file('./img/m2.png')
@app.route('/img/m3.png')
def m3():
    return send_file('./img/m3.png')
@app.route('/img/m4.png')
def m4():
    return send_file('./img/m4.png')
@app.route('/img/m5.png')
def m5():
    return send_file('./img/m5.png')

@app.route('/depth_2.html')
def depth_2():
    return send_file('depth_2.html')

@app.route('/js/victoria2.js')
def victoria_2():
    return send_file('js/victoria2.js')

# test random pictures
@app.route('/img/rental_img/rental1/0.jpg')
def rental10():
    return send_file('./img/rental_img/rental1/0.jpg')
@app.route('/img/rental_img/rental1/1.jpg')
def rental11():
    return send_file('./img/rental_img/rental1/1.jpg')
@app.route('/img/rental_img/rental1/2.jpg')
def rental12():
    return send_file('./img/rental_img/rental1/2.jpg')
@app.route('/img/rental_img/rental1/3.jpg')
def rental13():
    return send_file('./img/rental_img/rental1/3.jpg')
@app.route('/img/rental_img/rental1/4.jpg')
def rental14():
    return send_file('./img/rental_img/rental1/4.jpg')
@app.route('/img/rental_img/rental2/0.jpg')
def rental20():
    return send_file('./img/rental_img/rental2/0.jpg')
@app.route('/img/rental_img/rental2/1.jpg')
def rental21():
    return send_file('./img/rental_img/rental2/1.jpg')
@app.route('/img/rental_img/rental2/2.jpg')
def rental22():
    return send_file('./img/rental_img/rental2/2.jpg')
@app.route('/img/rental_img/rental2/3.jpg')
def rental23():
    return send_file('./img/rental_img/rental2/3.jpg')
@app.route('/img/rental_img/rental2/4.jpg')
def rental24():
    return send_file('./img/rental_img/rental2/4.jpg')
@app.route('/img/rental_img/rental2/5.jpg')
def rental25():
    return send_file('./img/rental_img/rental2/5.jpg')
@app.route('/img/rental_img/rental3/0.jpg')
def rental30():
    return send_file('./img/rental_img/rental3/0.jpg')
@app.route('/img/rental_img/rental3/1.jpg')
def rental31():
    return send_file('./img/rental_img/rental3/1.jpg')
@app.route('/img/rental_img/rental3/2.jpg')
def rental32():
    return send_file('./img/rental_img/rental3/2.jpg')
@app.route('/img/rental_img/rental3/3.jpg')
def rental33():
    return send_file('./img/rental_img/rental3/3.jpg')
@app.route('/img/rental_img/rental3/4.jpg')
def rental34():
    return send_file('./img/rental_img/rental3/4.jpg')
@app.route('/img/rental_img/rental4/0.jpg')
def rental40():
    return send_file('./img/rental_img/rental4/0.jpg')
@app.route('/img/rental_img/rental4/1.jpg')
def rental41():
    return send_file('./img/rental_img/rental4/1.jpg')
@app.route('/img/rental_img/rental4/2.jpg')
def rental42():
    return send_file('./img/rental_img/rental4/2.jpg')
@app.route('/img/rental_img/rental4/3.jpg')
def rental43():
    return send_file('./img/rental_img/rental4/3.jpg')
@app.route('/img/rental_img/rental4/4.jpg')
def rental44():
    return send_file('./img/rental_img/rental4/4.jpg')
@app.route('/img/rental_img/rental5/0.jpg')
def rental50():
    return send_file('./img/rental_img/rental5/0.jpg')
@app.route('/img/rental_img/rental5/1.jpg')
def rental51():
    return send_file('./img/rental_img/rental5/1.jpg')
@app.route('/img/rental_img/rental5/2.jpg')
def rental52():
    return send_file('./img/rental_img/rental5/2.jpg')
@app.route('/img/rental_img/rental5/3.jpg')
def rental53():
    return send_file('./img/rental_img/rental5/3.jpg')
@app.route('/img/rental_img/rental5/4.jpg')
def rental54():
    return send_file('./img/rental_img/rental5/4.jpg')
@app.route('/favicon.ico')
def favicon():
    return send_file('favicon.ico')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
