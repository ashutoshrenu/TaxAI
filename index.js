const Restify = require('restify')
const methods = require('./methods')
var mysql=require('mysql')

const app = Restify.createServer({
    name: 'TaxAI'
})

const token = 'abc12345'


connection = mysql.createPool({
                    connectionLimit : 100,
                    host: '127.0.0.1',
                      user     : 'root',
                      password : 'root',
                      database : 'chatbot',
                      multipleStatements: true})



const bot = new methods('<key>')

app.use(Restify.plugins.jsonp())
app.use(Restify.plugins.bodyParser())

app.get('/', (req, res, next) => {
    console.log(req.query)
    if(req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == token) {
        res.end(req.query['hub.challenge'])
    } else {
        next()
    }
})

app.post('/', (req, res, next) => {
    const response = req.body
    if(response.object === "page") {
        const messageObj = bot.getMessageObject(response)
        if(messageObj.problemStatement !==undefined && messageObj.subject !==undefined && messageObj.intent !==undefined){
           
           if(messageObj.problemStatement[0].confidence > 0.8 && messageObj.subject[0].confidence > 0.8 && messageObj.intent[0].confidence > 0.8){
            connection.query('SELECT dlr.answer FROM `deductor_login_&_registration` dlr where dlr.intent like "%'+messageObj.intent[0].value+'%" and dlr.question like "%'+messageObj.problemStatement[0].value+'%"', function (error, results, fields) {
            if (error) {
                  res.json({
                   error,
                    status:false,
                    
                    })
              }else{
                if(results.length>0){
                    console.log(results);
                    bot.sendText(`ChatBot: ${results[0].answer}`, messageObj.id)
                }
            }
            })
            }else{
                bot.sendText(`ChatBot: Give me more training`, messageObj.id)
            } 
        }else{
            bot.sendText(`ChatBot: Give me more training`, messageObj.id)
        }
        
        
        
        
    }
    res.send(200)
})

app.listen(3000)
