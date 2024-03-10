const express = require('express')
const fs = require('fs')
const app = express()

app.set('view engine', 'ejs')

app.use('/statics', express.static(__dirname + '/views/statics', {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css')
      } else if(filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'text/js')
      }
    }
  }))


app.get('/', (req, res) => {
    res.render('index', {header: "Home"})
});

app.get('/products', (req, res) => { 
  fs.readFile('productlist.json', { root: __dirname }, (err, data) => {
    if (err) {
      res.status(500).send('Dosya okuma hatası: ' + err.message);
      return;
    }
    try {
      const productdata = JSON.parse(data);
      const productsArray = Object.values(productdata); // JSON nesnelerini bir diziye dönüştür

      res.render('products', { productdata: productsArray, header: "Products"});
    } catch (parseError) {
      res.status(500).send('JSON parse error: ' + parseError.message);
    }
  });
});

app.use((req, res, next) => {
  res.status(404).render('404', {url: req.originalUrl, header: "404" });
});

app.listen(3000, () =>{
    console.log(`App is listening in port 3000!`)
});