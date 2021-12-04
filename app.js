const express = require('express');
const SignupData = require('./src/model/SignupData');
const AntiqueData = require('./src/model/AntiqueData');
const CartData = require('./src/model/CartData');
const WishData = require('./src/model/WishData');
const CheckoutData = require('./src/model/CheckoutData');
const cors = require('cors');
const jwt = require('jsonwebtoken');
var app = new express();
app.use(cors());
app.use(express.json({limit: '50mb'}));
username="admin@ictak.in";
passwords="Abcde123@";
function verifyToken(req,res,next){
    if(!req.headers.authorization){
       return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token=='null'){
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token,'secretKey')
    
    if(!payload){
        return res.status(401).send('Unauthorized request')
    }
    req.userId= payload.subject
    next()
    }
    //login
app.post('/login',function(req,res){
    email=req.body.email;
    password=req.body.password;
    if(username==email && passwords==password){
        let payload={subject:email+password};
        let token=jwt.sign(payload,'secretKey');
        let role="adm"
        res.status(200).send({token,role});
    }
    else{
    SignupData.findOne({email:email}, function (err, user) {
        if(!user){
            res.status(401).send('Email does not exist. Please register first') 
        }
        else{
            user.comparePassword(password, (error, match) =>  {
            if(!match) {
              res.status(401).send('Email and Password dont match') 
            }
        else {  
                 let role="admin"
                 let payload={subject:email+password};
                 let token=jwt.sign(payload,'secretKey');
                res.status(200).send({token,role});
        }
    });
}
    });
}
})
//sign up data store
app.post('/signupnew',function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log(req.body);
         var signup=
        {
            fname:req.body.signup.fname,
            mobnumber:req.body.signup.mobnumber,
           email:req.body.signup.email,
           password:req.body.signup.password
        }
        email=req.body.signup.email;
        SignupData.findOne({email:email}, function (err, user) {
            if (user) {
                res.status(401).send('Email already exists')   
            }
            else{
               newsignup = new SignupData(signup);
              newsignup.save();
              console.log(req.body);
              res.status(200).send();
            }
        }); 
  });
  app.get('/antique',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    AntiqueData.find()
    .then(function(antique){
        res.send(antique);
    });
});
app.get('/cart/:id',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    const cartemail = req.params.id;
    CartData.find({"cartemail":cartemail})
    .then(function(carts){
        res.send(carts);
    });
});
//get wish data
app.get('/wish/:id',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    const wishemail = req.params.id;
    WishData.find({"email":wishemail})
    .then(function(wishes){
        res.send(wishes);
    });
});
//to get quantity
app.get('/cartnumb/:id',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    const cartemails = req.params.id;
    CartData.find({"cartemail":cartemails})
    .then(function(carts){
        let counter=0;
        for(let i=0;i<carts.length;i++){
            let iqty= parseInt(carts[i].qty);
            counter = counter + iqty
        }
        res.send({counter});
    });
});
//to get total price
app.get('/cartvalue/:id',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    const cartemails = req.params.id;
    CartData.find({"cartemail":cartemails})
    .then(function(carts){
        let totalpay=0;
        for(let i=0;i<carts.length;i++){
            let iqty= parseInt(carts[i].price);
            totalpay = totalpay + iqty
        }
        res.send({totalpay});
    });
});
app.get('/eachantique/:id',  (req, res) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    const id = req.params.id;
    console.log(id);
     AntiqueData.findOne({"_id":id})
      .then((eachantique)=>{
          res.send(eachantique);
      });
  })

  //to add in cart
  //sign up data store
app.post('/addCartdata',function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    prodID=req.body.cart.prodID
    console.log(prodID)
    CartData.findOne({"prodID":prodID}, function (err, user) {
        if(user) {
            CartData.findOne({"prodID":prodID})
            .then((data)=>{
                idqty=data.qty
                iprice=data.price
                let id1= parseInt(idqty);
                let idp1= parseInt(iprice);
                let idp3=parseInt(req.body.cart.price);
                id2=id1+1
                 idp2=idp1+idp3
            CartData.findOneAndUpdate({prodID:prodID},
            {$set:{ "qty": id2,
            "price":idp2
            }})
            .then()
    })
    } 
else if(!user){
    var cart=
    {
        name:req.body.cart.name,
        type:req.body.cart.type,
       price:req.body.cart.price,
      image:req.body.cart.image,
      prodID:req.body.cart.prodID,
       email:req.body.cart.email,
       qty:"1"
    }
    newcart = new CartData(cart);
    newcart.save();
    res.status(200).send();  
}       
    })                  
  });
  app.get('/cartitemnumber/:id',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    const email = req.params.id;
    CartData.countDocuments({email:email})
    .then(function(pending){
        res.status(200).send({pending});
    });
})
//from wish to cart
 //to add in cart
  //sign up data store
  app.post('/wishtocart',function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    prodID=req.body.wish.prodID
    WishData.deleteOne({prodID:prodID})
    .then()
    CartData.findOne({prodID:prodID}, function (err, user) {
        if(user) {
            CartData.findOne()
            .then((data)=>{
                idqty=data.qty
                iprice=data.price
                let id1= parseInt(idqty);
                let idp1= parseInt(iprice);
                let idp3=parseInt(req.body.wish.price);
                id2=id1+1
                 idp2=idp1+idp3
            CartData.findOneAndUpdate(
            {$set:{ "qty": id2,
            "price":idp2
            }})
            .then()
    })
    } 
else{
    var cart=
    {
        name:req.body.wish.name,
        type:req.body.wish.type,
       price:req.body.wish.price,
      image:req.body.wish.image,
      prodID:req.body.wish.prodID,
       email:req.body.wish.email,
       qty:"1"
    }
    newcart = new CartData(cart);
    newcart.save();
    res.status(200).send();  
}       
    })       
             
  });
  app.get('/cartitemnumber/:id',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    const email = req.params.id;
    CartData.countDocuments({email:email})
    .then(function(pending){
        res.status(200).send({pending});
    });
})
  //to add in wish
  //sign up data store
  app.post('/addWishdata',function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    prodID=req.body.wish.prodID
    WishData.findOne({prodID:prodID}, function (err, user) {
        if(user) {
            WishData.findOne()
            .then((data)=>{
                idqty=data.qty
                iprice=data.price
                let id1= parseInt(idqty);
                let idp1= parseInt(iprice);
                let idp3=parseInt(req.body.wish.price);
                id2=id1+1
                 idp2=idp1+idp3
            WishData.findOneAndUpdate(
            {$set:{ "qty": id2,
            "price":idp2
            }})
            .then()
    })
    } 
else{
    var wish=
    {
        name:req.body.wish.name,
        type:req.body.wish.type,
       price:req.body.wish.price,
      image:req.body.wish.image,
      prodID:req.body.wish.prodID,
       email:req.body.wish.email,
       qty:"1"
    }
    newwish = new WishData(wish);
    newwish.save();
    res.status(200).send();  
}       
    })    
  });
  app.get('/wishitemnumber/:id',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    const emailswish = req.params.id;
    WishData.find({"email":emailswish})
    .then(function(wish){
        let counters=0;
        for(let i=0;i<wish.length;i++){
            let iqty= parseInt(wish[i].qty);
            counters = counters + iqty
        }
        res.send({counters});
    });
})
//delete complete employee data assigned to course
app.post('/removecart',verifyToken,(req,res)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    idscart = req.body.wish.prodID;
    console.log(idscart)
        CartData.findOne({'prodID':idscart})
        .then(function(cartdt){
            if(cartdt.qty==1){
                CartData.deleteOne({'prodID':idscart})
                .then()
            }
            else{
                let idqty=cartdt.qty
               let  iprice=cartdt.price
                let id1= parseInt(idqty);
                let idp1= parseInt(iprice);
                let valuep = idp1/id1;
                let idp3=parseInt(valuep);
                console.log(idp3)
                id2=id1-1
                 idp2=idp1-idp3
                CartData.findOneAndUpdate({'prodID':idscart},
                    {$set:{ "qty": id2,
                    "price":idp2
                    }})
                    .then()
            }
            res.send();
        })
  })
  //to add feedback
app.post('/makepayment',function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log(req.body);
    var checkout=
        {
            address:req.body.checkout.address,
           email:req.body.checkout.email,
            payment:req.body.checkout.payment,
            status:req.body.checkout.status
        }
              checkout = new CheckoutData(checkout);
              checkout.save();
let emailsc=req.body.checkout.email
              CartData.deleteMany({'email':emailsc})
              .then()
              res.status(200).send();

  });
  // add new course
app.post('/additem',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    var newitem={
        name:req.body.antq.name,
        type:req.body.antq.type,
        description:req.body.antq.description,
        price:req.body.antq.price,
       image:req.body.antq.image,
       prodID:req.body.antq.prodID
    }
    var newitem = new AntiqueData(newitem);
    newitem.save();
});
  app.listen(5200);