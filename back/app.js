const express = require('express') ;
const app = express() ;

const dataRouter = require('./routes/data')


require('./src/db/mongoose')
const medecinRouter = require('./src/routers/medecin')
const patientRouter = require('./src/routers/patient')



app.use(express.json())
app.use(medecinRouter)
app.use(patientRouter)

const cors = require('cors');
app.use(cors({
    origin: "*"
}));

app.use(express.json())

 app.use(dataRouter)




app.listen(5000,() => {
    console.log(" le serveur est bien demarre au port 5000 ")
})
 //module.exports = app
