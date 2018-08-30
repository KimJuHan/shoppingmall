var db = require('../models');
var sequelize = require('sequelize');
var Op = sequelize.Op;

exports.AllQnA = function(req, res){
    console.log("AllQnA controller")
    db.QnAs.findAll({ include : [ db.Users, db.Products]}).then(function(QnAs){
        // console.log(QnAs);
        res.render('board/Q&A', { QnAs : QnAs })
    })
}

exports.QnADetail = async function(req, res){
    console.log('QnADetail');
    const QnA = await db.QnAs.find({where : { id : req.params.id}, include : [ db.Users, db.Products]});
    if(QnA.display == "off"){
        if(req.query.password){
            res.render('board/Q&ADetail', { QnA : QnA })
        }else{
            res.redirect('/board/QnA/secretWarning?board_no=' + req.params.id);
        }
    }else{
        res.render('board/Q&ADetail', { QnA : QnA });
    }
}

exports.secretWarning = function(req, res){
    res.render('board/secretWarning');
}

exports.passwordAuthentication = async function(req, res){
    console.log('passwordAuthentication controller');
    const QnA = await db.QnAs.find({where : { id : req.query.board_no}, include : [ db.Users, db.Products]});
    const password = QnA.password;
    const inputPassword = req.body.password;
    if(password != inputPassword){
        res.send('<script>alert("비밀번호가 틀립니다");window.history.back();</script>')
    }else{
        res.redirect('/board/QnA/' + req.query.board_no + '?password=correct')
    }
}

exports.QnAWritingForm = async function(req, res){
    console.log('QnAWritingForm controller');
    var user;
    if(req.user){
        user = await db.Users.findById(req.user.id);
    }
    const products = await db.Products.findAll();
    res.render('board/Q&A_WritingForm', { products : products, user : (user) ? user : "" })
}

exports.QnAWrite = async function(req, res){
    console.log("QnAwrite Controller");
    console.log(req.body);
    const product = await db.Products.findById(req.body.category)
    var user;
    if(req.user){
        user = await db.Users.findById(req.user.id);
    }
    const QnA = await db.QnAs.create({
        title : req.body.title,
        content : req.body.content,
        password : req.body.password,
        display : req.body.display,
        category : req.body.category
    });

    if(user){
        const userAssociation = await user.setQnAs([QnA])
    }
    if(product){
        const productAssociation = await product.setQnAs([QnA])
    }
    res.redirect('/board/QnA');
}

exports.QnAsearch = async function(req, res){
    console.log('QnAsearch controller');
    const keyword = req.query.searchQnA;
    const QnAs = await db.QnAs.findAll({ where : { title : { [Op.like] : ('%' + keyword + '%') }}});
    res.render('board/Q&A', { QnAs : QnAs })
}


exports.review = function(req, res){
    db.Reviews.findAll().then(function(reviews){
        res.render('board/review', { reviews : reviews })
    })
}

exports.notice = function(req, res){
    db.Notices.findAll().then(function(notices){
        res.render('board/notice');
    })
}