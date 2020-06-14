require('dotenv').config();
const express = require('express');
var exphbs = require('express-handlebars');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/donation', function (req, res) {
  res.render('donation');
});

app.get('/thanks', async (req, res) => {
  res.render('thanks');
});

app.post('/form', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const amount = req.body.amount;

  if (amount && email && name) {
    // Data is valid!
    try {
      // Create a PI:
      const stripe = require('stripe')(process.env.STRIPE_KEY);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // In cents
        currency: 'usd',
        receipt_email: email,
      });
      res.send({ success: true });
      // res.render('card', {
      //   name: name,
      //   amount: amount,
      //   intentSecret: paymentIntent.client_secret,
      // });
    } catch (err) {
      console.log('Error! ', err.message);
    }
  } else {
    res.send({ success: false });
    // res.render('error', { title: 'Donate', errors: 'something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
