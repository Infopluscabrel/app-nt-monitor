const mongoose = require('mongoose')

mongoose.connect( "mongodb://localhost:27017/app-monitor", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
     useUnifiedTopology: true
})